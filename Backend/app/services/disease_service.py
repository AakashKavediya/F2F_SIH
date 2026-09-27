import numpy as np
import torch
from PIL import Image
import cv2
import traceback
from app.models.unet import UNet
from app.models.disease_knowledge import DISEASE_KNOWLEDGE, generate_disease_recommendations
from app.services.image_service import create_and_upload_segmentation_images
from app.config.settings import DEVICE, IMG_SIZE
from app.config.logging_config import logger

def get_disease_type(affected_pct, mask=None):
    """
    Determine disease type based on affected area and mask pattern.
    In production, this would use a CNN classifier.
    """
    if affected_pct > 5:
        return "early_blight"
    return None

async def process_disease_detection(image, unet, filename="disease_scan"):
    """Process disease detection on an image"""
    orig_size = image.size
    
    if unet is None:
        logger.error("UNet model is None")
        return {
            "disease_detected": False,
            "affected_area_percentage": 0,
            "original_image_size": list(orig_size),
            "disease_info": None,
            "recommendations": None,
            "image_data": None,
            "error": "Model not available"
        }
    
    # Check if model is trained (not random)
    try:
        first_param = next(unet.parameters())
        param_mean = first_param.mean().item()
        logger.info(f"Model first layer mean: {param_mean:.6f}")
        
        # If mean is close to 0, it might be untrained
        if abs(param_mean) < 0.01:
            logger.warning("⚠️ Model appears to be untrained (random weights)")
    except:
        pass
    
    # Run inference with the real model
    try:
        # Preprocess image
        resized = image.resize((IMG_SIZE, IMG_SIZE))
        arr = np.array(resized, dtype=np.float32) / 255.0
        tensor = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0).to(DEVICE)
        
        # Run inference
        with torch.no_grad():
            logits = unet(tensor)
            probs = torch.sigmoid(logits)
            
            # Log probability stats
            logger.info(f"Probs - min: {probs.min().item():.4f}, max: {probs.max().item():.4f}, mean: {probs.mean().item():.4f}")
            
            # Use threshold 0.1 (10%)
            mask = (probs > 0.1).float().squeeze().cpu().numpy()
        
        # Calculate affected area
        affected_pixels = int(mask.sum())
        total_pixels = mask.size
        affected_pct = round(100 * affected_pixels / total_pixels, 2)
        
        # Disease detected if affected area > 5%
        disease_detected = affected_pct > 5.0
        
        logger.info(f"Affected area: {affected_pct}% - Disease detected: {disease_detected}")
        
    except Exception as e:
        logger.error(f"Error during inference: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "disease_detected": False,
            "affected_area_percentage": 0,
            "original_image_size": list(orig_size),
            "disease_info": None,
            "recommendations": None,
            "image_data": None,
            "error": f"Inference failed: {str(e)}"
        }
    
    # Upload images to Cloudinary
    disease_info = None
    recommendations = None
    image_data = None
    
    try:
        image_data = create_and_upload_segmentation_images(mask, image, filename)
        logger.info(f"Cloudinary upload result: {image_data is not None}")
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {str(e)}")
        image_data = None
    
    # Get disease information if detected
    if disease_detected:
        disease_type = get_disease_type(affected_pct, mask)
        if disease_type and disease_type in DISEASE_KNOWLEDGE:
            disease_info = DISEASE_KNOWLEDGE[disease_type]
            recommendations = generate_disease_recommendations(affected_pct, disease_info)
    
    return {
        "disease_detected": disease_detected,
        "affected_area_percentage": affected_pct,
        "original_image_size": list(orig_size),
        "disease_info": disease_info,
        "recommendations": recommendations,
        "image_data": image_data
    }