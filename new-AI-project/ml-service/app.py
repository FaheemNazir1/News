import os
import re
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = FastAPI(title="DistilBERT Fake News Detector")

# Attempt to load model at startup
MODEL_DIR = "./model"
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model.eval()
except Exception as e:
    print(f"Warning: Model not found at {MODEL_DIR}. Please run train.py first.")
    tokenizer = None
    model = None

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    label: str
    confidence: float
    probability_score: float

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Train the model first.")
        
    cleaned_input = clean_text(request.text)
    
    inputs = tokenizer(cleaned_input, padding=True, truncation=True, max_length=512, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
        
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    # 0 = fake, 1 = real
    prob_real = probabilities[0][1].item()
    prob_fake = probabilities[0][0].item()
    
    # Custom mapping logic requested by user
    # >0.7 Real, 0.4-0.7 Suspicious, <0.4 Fake
    if prob_real > 0.7:
        label = "Real"
        confidence = prob_real
    elif prob_real >= 0.4:
        label = "Suspicious"
        confidence = prob_real
    else:
        label = "Fake"
        # If it's classified as fake, confidence is how sure we are it's fake
        confidence = prob_fake
        
    return PredictionResponse(
        label=label,
        confidence=round(confidence, 4),
        probability_score=round(prob_real, 4)
    )

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}
