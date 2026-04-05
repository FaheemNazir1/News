import sys
try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
except ImportError as e:
    print(f"Missing dependency: {e}", file=sys.stderr)
    sys.exit(1)

model_dir = "./model"
print(f"Loading model from {model_dir}...")
try:
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    model.eval()
    print("Model loaded successfully!")
    
    test_text = "The quick brown fox jumps over the lazy dog"
    print(f"Testing with text: '{test_text}'")
    
    inputs = tokenizer(test_text, padding=True, truncation=True, max_length=512, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    print(f"Model output shape: {outputs.logits.shape}")
    print(f"Probabilities (Fake / Real): {probabilities[0].tolist()}")
except Exception as e:
    print(f"Error checking model: {e}", file=sys.stderr)
    sys.exit(1)
