import os
import re
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification, 
    Trainer, 
    TrainingArguments
)
import torch
from datasets import Dataset, load_dataset
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def main():
    print("Loading dataset...")
    
    # We will look for Fake.csv and True.csv locally first
    fake_path = "data/Fake.csv"
    true_path = "data/True.csv"
    
    if os.path.exists(fake_path) and os.path.exists(true_path):
        print("Local ISOT dataset found. Loading...")
        fake_df = pd.read_csv(fake_path)
        true_df = pd.read_csv(true_path)
        
        # Add labels
        fake_df['label'] = 0
        true_df['label'] = 1
        
        # Combine title and text
        for df in [fake_df, true_df]:
            df['text'] = df['title'] + " " + df['text']
            
        # Balance dataset
        min_len = min(len(fake_df), len(true_df))
        fake_df = fake_df.sample(min_len, random_state=42)
        true_df = true_df.sample(min_len, random_state=42)
        
        df = pd.concat([fake_df, true_df]).sample(frac=1, random_state=42).reset_index(drop=True)
    else:
        print("Local CSVs not found. Downloading balanced ISOT dataset from huggingface...")
        # Fallback to the ISOT dataset hosted on HF
        dataset = load_dataset("GonzaloA/fake_news")
        df = pd.DataFrame(dataset['train'])
        
        df['text'] = df['title'] + " " + df['text']
        
        # Balance dataset manually if needed, though usually GonzaloA is decently balanced
        # HF label: 0=fake, 1=real
        fake_df = df[df['label'] == 0]
        true_df = df[df['label'] == 1]
        min_len = min(len(fake_df), len(true_df))
        # Keep minimal size to train faster in this script, or use all
        fake_df = fake_df.sample(min_len, random_state=42)
        true_df = true_df.sample(min_len, random_state=42)
        df = pd.concat([fake_df, true_df]).sample(frac=1, random_state=42).reset_index(drop=True)

    print(f"Total samples after balancing: {len(df)}")
    
    print("Preprocessing text...")
    df['text'] = df['text'].apply(clean_text)
    
    print("Splitting dataset 80/20...")
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        df['text'].tolist(), 
        df['label'].tolist(), 
        test_size=0.2, 
        random_state=42, 
        stratify=df['label'].tolist()
    )
    
    print("Initializing DistilBERT tokenizer...")
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=512)
    val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=512)
    
    class FakeNewsDataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels

        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item['labels'] = torch.tensor(self.labels[idx])
            return item

        def __len__(self):
            return len(self.labels)

    train_dataset = FakeNewsDataset(train_encodings, train_labels)
    val_dataset = FakeNewsDataset(val_encodings, val_labels)
    
    print("Initializing Model...")
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
    
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=2,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=100,
        eval_strategy="epoch",  # using eval_strategy to prevent deprecation warning
        save_strategy="epoch"
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics
    )
    
    print("Starting Training...")
    trainer.train()
    
    print("Saving model and tokenizer to ./model")
    model.save_pretrained("./model")
    tokenizer.save_pretrained("./model")
    
    print("Training complete! Model saved to ./model directory.")

if __name__ == "__main__":
    main()
