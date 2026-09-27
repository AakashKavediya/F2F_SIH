# test_model_tuned.py
import torch
import numpy as np
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.models.unet import UNet
from app.config.settings import DEVICE, IMG_SIZE

def test_tuned_model():
    print("Testing tuned model...")
    
    model_path = "app/models/disease_detection/best_model_tuned.pth"
    
    if not os.path.exists(model_path):
        print(f"❌ Model file not found: {model_path}")
        return
    
    print(f"✅ Model file found: {model_path}")
    
    # Create model
    model = UNet(n_channels=3, n_classes=1, bilinear=True)
    
    # Load weights
    try:
        checkpoint = torch.load(model_path, map_location=DEVICE)
        print(f"Checkpoint type: {type(checkpoint)}")
        
        if isinstance(checkpoint, dict):
            if "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
                print("✅ Found model_state_dict in checkpoint")
            else:
                state_dict = checkpoint
                print("✅ Using checkpoint directly as state_dict")
        else:
            state_dict = checkpoint
            print("✅ Using checkpoint as state_dict")
        
        model.load_state_dict(state_dict)
        model.to(DEVICE)
        model.eval()
        print("✅ Model loaded successfully")
        
        # Test with random input
        test_input = torch.randn(1, 3, IMG_SIZE, IMG_SIZE).to(DEVICE)
        with torch.no_grad():
            output = model(test_input)
            probs = torch.sigmoid(output)
            
        print(f"Output shape: {output.shape}")
        print(f"Probs stats - min: {probs.min().item():.4f}, max: {probs.max().item():.4f}, mean: {probs.mean().item():.4f}")
        
        # Check with different thresholds
        thresholds = [0.1, 0.2, 0.3, 0.4, 0.5]
        for thresh in thresholds:
            mask = (probs > thresh).float().squeeze().cpu().numpy()
            affected_pct = (mask.sum() / mask.size) * 100
            print(f"Threshold {thresh}: affected {affected_pct:.2f}%")
        
        # Check model parameters
        total_params = sum(p.numel() for p in model.parameters())
        print(f"Total parameters: {total_params:,}")
        
        # Check if model weights are trained
        first_param = next(model.parameters())
        param_mean = first_param.mean().item()
        param_std = first_param.std().item()
        print(f"First layer - mean: {param_mean:.6f}, std: {param_std:.6f}")
        
        if abs(param_mean) < 0.01:
            print("⚠️ WARNING: Model weights appear random/untrained!")
        else:
            print("✅ Model appears to be trained (non-zero weights)")
        
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_tuned_model()