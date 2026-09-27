from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from PIL import Image
import io
import os
from app.services.model_loader import get_model
from app.services.image_service import download_image_from_url
from app.services.disease_service import process_disease_detection

# CREATE THE ROUTER - THIS IS CRITICAL
router = APIRouter()

class DiseaseDetectionInput(BaseModel):
    image_url: str = Field(..., description="URL of the image to analyze")
    filename: str = Field("disease_scan", description="Base filename for uploaded images")

@router.post("/disease-detection")
async def predict_disease_detection(payload: DiseaseDetectionInput):
    """Detect plant diseases from an image URL."""
    unet = get_model("disease_unet")
    image = download_image_from_url(str(payload.image_url))
    
    result = await process_disease_detection(image, unet, payload.filename)
    
    response = {
        "success": True,
        "disease_detected": result["disease_detected"],
        "affected_area_percentage": result["affected_area_percentage"],
        "original_image_size": result["original_image_size"],
        "image_urls": {
            "original": result["image_data"]["images"]["original"]["url"] if result["image_data"] and "original" in result["image_data"]["images"] else None,
            "mask": result["image_data"]["images"]["mask"]["url"] if result["image_data"] and "mask" in result["image_data"]["images"] else None,
            "overlay": result["image_data"]["images"]["overlay"]["url"] if result["image_data"] and "overlay" in result["image_data"]["images"] else None,
        } if result["image_data"] else None
    }
    
    if result["disease_detected"] and result["disease_info"] and result["recommendations"]:
        disease_info = result["disease_info"]
        rec = result["recommendations"]
        response.update({
            "disease_info": {
                "name": disease_info["name"],
                "scientific_name": disease_info["scientific_name"],
                "type": disease_info["type"],
                "severity": rec["severity"],
                "health_status": rec["health_status"],
                "urgency": rec["urgency"],
                "symptoms": rec["symptoms"],
                "recommendation": rec["recommendation"],
                "treatment": rec["treatment"],
                "prevention": rec["prevention"]
            },
            "message": f"{disease_info['name']} detected with {rec['severity']} severity."
        })
    else:
        response.update({
            "message": "No significant disease detected. Crop appears healthy.",
            "suggestions": [
                "Continue regular monitoring",
                "Maintain proper irrigation",
                "Ensure adequate nutrition",
                "Practice preventive measures"
            ]
        })
    
    return JSONResponse(content=response)

@router.post("/disease-detection-upload")
async def predict_disease_detection_upload(file: UploadFile = File(...)):
    """Legacy endpoint that accepts file upload."""
    if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
        raise HTTPException(status_code=400, detail="Upload a JPEG or PNG image.")
    
    image_bytes = await file.read()
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file.")
    
    filename = os.path.splitext(file.filename)[0] if file.filename else "disease_scan"
    
    unet = get_model("disease_unet")
    result = await process_disease_detection(image, unet, filename)
    
    response = {
        "success": True,
        "disease_detected": result["disease_detected"],
        "affected_area_percentage": result["affected_area_percentage"],
        "original_image_size": result["original_image_size"],
        "image_urls": {
            "original": result["image_data"]["images"]["original"]["url"] if result["image_data"] and "original" in result["image_data"]["images"] else None,
            "mask": result["image_data"]["images"]["mask"]["url"] if result["image_data"] and "mask" in result["image_data"]["images"] else None,
            "overlay": result["image_data"]["images"]["overlay"]["url"] if result["image_data"] and "overlay" in result["image_data"]["images"] else None,
        } if result["image_data"] else None
    }
    
    if result["disease_detected"] and result["disease_info"] and result["recommendations"]:
        disease_info = result["disease_info"]
        rec = result["recommendations"]
        response.update({
            "disease_info": {
                "name": disease_info["name"],
                "scientific_name": disease_info["scientific_name"],
                "type": disease_info["type"],
                "severity": rec["severity"],
                "health_status": rec["health_status"],
                "urgency": rec["urgency"],
                "symptoms": rec["symptoms"],
                "recommendation": rec["recommendation"],
                "treatment": rec["treatment"],
                "prevention": rec["prevention"]
            },
            "message": f"{disease_info['name']} detected with {rec['severity']} severity."
        })
    else:
        response.update({
            "message": "No significant disease detected. Crop appears healthy.",
            "suggestions": [
                "Continue regular monitoring",
                "Maintain proper irrigation",
                "Ensure adequate nutrition",
                "Practice preventive measures"
            ]
        })
    
    return JSONResponse(content=response)