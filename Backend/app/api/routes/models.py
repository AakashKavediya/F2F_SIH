from fastapi import APIRouter, HTTPException
from app.services.model_loader import (
    get_all_models, 
    is_model_loaded, 
    get_model,
    get_model_status,
    reload_model
)
from app.config.logging_config import logger

router = APIRouter()

@router.get("/models")
async def list_models():
    """List all loaded models"""
    models = get_all_models()
    model_status = {}
    for key in models.keys():
        model_status[key] = {
            "loaded": models[key] is not None,
            "type": str(type(models[key])) if models[key] is not None else "None"
        }
    return {
        "success": True,
        "models": model_status,
        "total": len(models)
    }

@router.get("/models/{model_name}/status")
async def model_status(model_name: str):
    """Check status of a specific model"""
    status = get_model_status(model_name)
    return {
        "success": True,
        **status
    }

@router.get("/models/health")
async def models_health():
    """Health check for all models"""
    models = get_all_models()
    loaded_count = sum(1 for m in models.values() if m is not None)
    total_count = len(models)
    
    return {
        "success": True,
        "loaded_models": loaded_count,
        "total_models": total_count,
        "status": "healthy" if loaded_count == total_count else "partial",
        "details": {
            key: "loaded" if value is not None else "not loaded" 
            for key, value in models.items()
        }
    }

@router.post("/models/{model_name}/reload")
async def reload_model_endpoint(model_name: str):
    """Reload a specific model"""
    if model_name not in ["disease_unet"]:
        raise HTTPException(status_code=400, detail=f"Model '{model_name}' cannot be reloaded")
    
    success = reload_model(model_name)
    if success:
        return {
            "success": True,
            "message": f"Model '{model_name}' reloaded successfully"
        }
    else:
        raise HTTPException(status_code=500, detail=f"Failed to reload model '{model_name}'")