import os
import joblib
import torch
from fastapi import HTTPException
from app.models.unet import UNet
from app.config.settings import MODELS_DIR, DEVICE
from app.config.logging_config import logger
import traceback

_models = {}

def load_models():
    """Load all ML/DL models"""
    try:
        logger.info("=" * 50)
        logger.info("Starting to load all ML/DL models...")
        logger.info(f"Models directory: {MODELS_DIR}")
        logger.info("=" * 50)
        
        # Check if models directory exists
        if not os.path.exists(MODELS_DIR):
            logger.error(f"Models directory not found: {MODELS_DIR}")
            return _models
        
        # 1. Crop Recommendation Model
        crop_rec_path = os.path.join(MODELS_DIR, "Crop_recommendation")
        if os.path.exists(crop_rec_path):
            try:
                logger.info("📊 Loading Crop Recommendation models...")
                _models["crop_rec_model"] = joblib.load(
                    os.path.join(crop_rec_path, "xgboost_crop_model.pkl")
                )
                _models["crop_rec_label_encoder"] = joblib.load(
                    os.path.join(crop_rec_path, "label_encoder.pkl")
                )
                logger.info("✅ Loaded crop recommendation models")
            except Exception as e:
                logger.error(f"❌ Failed to load crop recommendation models: {str(e)}")
        else:
            logger.warning(f"⚠️ Crop_recommendation directory not found")
        
        # 2. Crop Yield Model
        crop_yield_path = os.path.join(MODELS_DIR, "crop_yield")
        if os.path.exists(crop_yield_path):
            try:
                logger.info("📈 Loading Crop Yield models...")
                _models["yield_model"] = joblib.load(
                    os.path.join(crop_yield_path, "xgboost_yield_model.pkl")
                )
                _models["yield_label_encoders"] = joblib.load(
                    os.path.join(crop_yield_path, "label_encoders.pkl")
                )
                logger.info("✅ Loaded crop yield models")
            except Exception as e:
                logger.error(f"❌ Failed to load crop yield models: {str(e)}")
        else:
            logger.warning(f"⚠️ crop_yield directory not found")
        
        # 3. Irrigation Prediction Model
        irrigation_path = os.path.join(MODELS_DIR, "irrigation_prediction")
        if os.path.exists(irrigation_path):
            try:
                logger.info("💧 Loading Irrigation Prediction models...")
                _models["irrigation_model"] = joblib.load(
                    os.path.join(irrigation_path, "xgboost_irrigation_model.pkl")
                )
                _models["irrigation_label_encoders"] = joblib.load(
                    os.path.join(irrigation_path, "label_encoders.pkl")
                )
                _models["irrigation_target_encoder"] = joblib.load(
                    os.path.join(irrigation_path, "target_encoder.pkl")
                )
                logger.info("✅ Loaded irrigation models")
            except Exception as e:
                logger.error(f"❌ Failed to load irrigation models: {str(e)}")
        else:
            logger.warning(f"⚠️ irrigation_prediction directory not found")
        
        # 4. Fertilizer Recommendation Model
        fert_dir = os.path.join(MODELS_DIR, "fertilizer_recommendation")
        if os.path.exists(fert_dir):
            try:
                logger.info("🧪 Loading Fertilizer Recommendation models...")
                _models["fert_model"] = joblib.load(os.path.join(fert_dir, "fertilizer_model.pkl"))
                _models["fert_scaler"] = joblib.load(os.path.join(fert_dir, "scaler.pkl"))
                _models["fert_onehot"] = joblib.load(os.path.join(fert_dir, "onehot_encoder.pkl"))
                _models["fert_label_encoder"] = joblib.load(os.path.join(fert_dir, "fertilizer_label_encoder.pkl"))
                _models["fert_feature_columns"] = joblib.load(os.path.join(fert_dir, "feature_columns.pkl"))
                _models["fert_stage_mapping"] = joblib.load(os.path.join(fert_dir, "stage_mapping.pkl"))
                logger.info("✅ Loaded fertilizer models")
            except Exception as e:
                logger.error(f"❌ Failed to load fertilizer models: {str(e)}")
        else:
            logger.warning(f"⚠️ fertilizer_recommendation directory not found")
        
        # 5. Disease Detection (U-Net) - Use best_model_tuned.pth
        disease_path = os.path.join(MODELS_DIR, "disease_detection")
        if os.path.exists(disease_path):
            try:
                logger.info("🩺 Loading Disease Detection model...")
                
                # Try to load best_model_tuned.pth first
                model_files = [
                    os.path.join(disease_path, "best_model_tuned.pth"),
                    os.path.join(disease_path, "best_model.pth")
                ]
                
                model_file = None
                for file_path in model_files:
                    if os.path.exists(file_path):
                        model_file = file_path
                        logger.info(f"Found model file: {model_file}")
                        break
                
                if model_file:
                    logger.info(f"Loading model from: {model_file}")
                    
                    # Create UNet instance
                    unet = UNet(n_channels=3, n_classes=1, bilinear=True)
                    
                    # Load the checkpoint
                    checkpoint = torch.load(model_file, map_location=DEVICE)
                    
                    # Handle different checkpoint formats
                    if isinstance(checkpoint, dict):
                        if "model_state_dict" in checkpoint:
                            state_dict = checkpoint["model_state_dict"]
                            logger.info("Using model_state_dict from checkpoint")
                        else:
                            state_dict = checkpoint
                            logger.info("Using checkpoint dict directly as state_dict")
                    else:
                        state_dict = checkpoint
                        logger.info("Using checkpoint as state_dict")
                    
                    # Load the state dict
                    unet.load_state_dict(state_dict)
                    unet.to(DEVICE)
                    unet.eval()
                    
                    # Test the model
                    test_input = torch.randn(1, 3, 256, 256).to(DEVICE)
                    with torch.no_grad():
                        test_output = unet(test_input)
                        test_probs = torch.sigmoid(test_output)
                    
                    # Log model info
                    total_params = sum(p.numel() for p in unet.parameters())
                    logger.info(f"Model parameters: {total_params:,}")
                    logger.info(f"Test output range: {test_probs.min().item():.4f} - {test_probs.max().item():.4f}")
                    
                    _models["disease_unet"] = unet
                    logger.info(f"✅ Loaded disease detection model from {model_file}")
                    
                else:
                    logger.error(f"❌ No model file found in {disease_path}")
                    _models["disease_unet"] = None
                    
            except Exception as e:
                logger.error(f"❌ Failed to load disease detection model: {str(e)}")
                logger.error(traceback.format_exc())
                _models["disease_unet"] = None
        else:
            logger.error(f"❌ Disease detection directory not found: {disease_path}")
            _models["disease_unet"] = None
        
        # Log summary
        logger.info("=" * 50)
        logger.info("📋 Model Loading Summary:")
        logger.info("=" * 50)
        for key in _models.keys():
            status = "✅" if _models[key] is not None else "❌"
            logger.info(f"  {status} {key}")
        logger.info("=" * 50)
        logger.info(f"Total models loaded: {len(_models)}")
        
        return _models
        
    except Exception as e:
        logger.error(f"❌ Failed to load models: {str(e)}")
        logger.error(traceback.format_exc())
        return _models

def get_model(key):
    """Get a loaded model by key"""
    model = _models.get(key)
    if model is None:
        logger.error(f"Model '{key}' not found or is None")
        logger.info(f"Available models: {list(_models.keys())}")
        raise HTTPException(status_code=503, detail=f"Model '{key}' not loaded yet.")
    return model

def get_all_models():
    """Get all loaded models"""
    return _models

def is_model_loaded(key):
    """Check if a specific model is loaded"""
    return key in _models and _models[key] is not None

def get_model_status(key):
    """Get detailed status of a specific model"""
    if key in _models:
        return {
            "loaded": _models[key] is not None,
            "type": str(type(_models[key])) if _models[key] is not None else "None",
            "key": key
        }
    return {
        "loaded": False,
        "type": "Not Found",
        "key": key,
        "error": "Model not registered"
    }

def reload_model(key):
    """Reload a specific model by key"""
    if key == "disease_unet":
        # Reload disease detection model
        disease_path = os.path.join(MODELS_DIR, "disease_detection")
        if os.path.exists(disease_path):
            try:
                model_files = [
                    os.path.join(disease_path, "best_model_tuned.pth"),
                    os.path.join(disease_path, "best_model.pth")
                ]
                
                model_file = None
                for file_path in model_files:
                    if os.path.exists(file_path):
                        model_file = file_path
                        break
                
                if model_file:
                    unet = UNet(n_channels=3, n_classes=1, bilinear=True)
                    checkpoint = torch.load(model_file, map_location=DEVICE)
                    
                    if isinstance(checkpoint, dict):
                        if "model_state_dict" in checkpoint:
                            state_dict = checkpoint["model_state_dict"]
                        else:
                            state_dict = checkpoint
                    else:
                        state_dict = checkpoint
                    
                    unet.load_state_dict(state_dict)
                    unet.to(DEVICE)
                    unet.eval()
                    _models["disease_unet"] = unet
                    return True
            except Exception as e:
                logger.error(f"Failed to reload disease model: {str(e)}")
                return False
        return False
    return False