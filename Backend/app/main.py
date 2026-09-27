# """
# FastAPI backend serving 5 agricultural ML/DL models:
# 1. /predict/disease-detection   - PyTorch U-Net leaf segmentation (accepts image URL)
# 2. /predict/irrigation          - XGBoost irrigation-need classifier
# 3. /predict/fertilizer          - XGBoost fertilizer-type classifier
# 4. /predict/crop-yield          - XGBoost crop yield regressor
# 5. /predict/crop-recommendation - XGBoost crop recommendation classifier

# Place this file at app/main.py — it expects the existing artifacts under
# app/models/<model_name>/... (paths below are relative to this file).
# """

# import io
# import os
# import uuid
# import joblib
# import requests
# import numpy as np
# import pandas as pd
# import torch
# import torch.nn as nn
# import torch.nn.functional as F
# import cv2
# from datetime import datetime
# from fastapi import FastAPI, File, HTTPException, Request, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from pydantic import BaseModel, Field, HttpUrl
# from PIL import Image
# import cloudinary
# import cloudinary.uploader
# import cloudinary.api
# import logging

# # --------------------------------------------------------------------------
# # Logging Configuration
# # --------------------------------------------------------------------------
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # --------------------------------------------------------------------------
# # Cloudinary Configuration
# # --------------------------------------------------------------------------
# cloudinary.config(
#     cloud_name="djtmbtl2f",
#     api_key="176823852135426",
#     api_secret="_nPMF7xi3AgNP0XV-oFv1X1Ra2Y",
#     secure=True
# )

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODELS_DIR = os.path.join(BASE_DIR, "models")

# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# IMG_SIZE = 256  # resize used for U-Net inference


# # --------------------------------------------------------------------------
# # U-Net architecture
# # --------------------------------------------------------------------------
# class DoubleConv(nn.Module):
#     def __init__(self, in_channels, out_channels, mid_channels=None):
#         super().__init__()
#         if not mid_channels:
#             mid_channels = out_channels
#         self.double_conv = nn.Sequential(
#             nn.Conv2d(in_channels, mid_channels, kernel_size=3, padding=1),
#             nn.BatchNorm2d(mid_channels),
#             nn.ReLU(inplace=True),
#             nn.Conv2d(mid_channels, out_channels, kernel_size=3, padding=1),
#             nn.BatchNorm2d(out_channels),
#             nn.ReLU(inplace=True),
#         )

#     def forward(self, x):
#         return self.double_conv(x)


# class Down(nn.Module):
#     def __init__(self, in_channels, out_channels):
#         super().__init__()
#         self.maxpool_conv = nn.Sequential(
#             nn.MaxPool2d(2), DoubleConv(in_channels, out_channels)
#         )

#     def forward(self, x):
#         return self.maxpool_conv(x)


# class Up(nn.Module):
#     def __init__(self, in_channels, out_channels, bilinear=True):
#         super().__init__()
#         if bilinear:
#             self.up = nn.Upsample(scale_factor=2, mode="bilinear", align_corners=True)
#         else:
#             self.up = nn.ConvTranspose2d(in_channels, in_channels // 2, kernel_size=2, stride=2)
#         self.conv = DoubleConv(in_channels, out_channels)

#     def forward(self, x1, x2):
#         x1 = self.up(x1)
#         diffY = x2.size()[2] - x1.size()[2]
#         diffX = x2.size()[3] - x1.size()[3]
#         x1 = F.pad(x1, [diffX // 2, diffX - diffX // 2, diffY // 2, diffY - diffY // 2])
#         x = torch.cat([x2, x1], dim=1)
#         return self.conv(x)


# class OutConv(nn.Module):
#     def __init__(self, in_channels, out_channels):
#         super().__init__()
#         self.conv = nn.Conv2d(in_channels, out_channels, kernel_size=1)

#     def forward(self, x):
#         return self.conv(x)


# class UNet(nn.Module):
#     def __init__(self, n_channels=3, n_classes=1, bilinear=True):
#         super().__init__()
#         self.n_channels = n_channels
#         self.n_classes = n_classes
#         self.bilinear = bilinear

#         self.inc = DoubleConv(n_channels, 64)
#         self.down1 = Down(64, 128)
#         self.down2 = Down(128, 256)
#         self.down3 = Down(256, 512)
#         factor = 2 if bilinear else 1
#         self.down4 = Down(512, 1024 // factor)
#         self.up1 = Up(1024, 512 // factor, bilinear)
#         self.up2 = Up(512, 256 // factor, bilinear)
#         self.up3 = Up(256, 128 // factor, bilinear)
#         self.up4 = Up(128, 64, bilinear)
#         self.outc = OutConv(64, n_classes)

#     def forward(self, x):
#         x1 = self.inc(x)
#         x2 = self.down1(x1)
#         x3 = self.down2(x2)
#         x4 = self.down3(x3)
#         x5 = self.down4(x4)
#         x = self.up1(x5, x4)
#         x = self.up2(x, x3)
#         x = self.up3(x, x2)
#         x = self.up4(x, x1)
#         return self.outc(x)


# # --------------------------------------------------------------------------
# # Disease Knowledge Base
# # --------------------------------------------------------------------------
# DISEASE_KNOWLEDGE = {
#     "early_blight": {
#         "name": "Early Blight",
#         "scientific_name": "Alternaria solani",
#         "type": "Fungal Disease",
#         "severity_levels": {
#             "low": {
#                 "max_pct": 15, 
#                 "recommendation": "Early stage detected. Remove affected leaves and monitor closely. Apply preventive fungicide if weather conditions favor spread."
#             },
#             "moderate": {
#                 "max_pct": 40, 
#                 "recommendation": "Moderate infection detected. Apply fungicide (Chlorothalonil or Copper-based) immediately. Remove and destroy infected plant parts. Improve air circulation."
#             },
#             "high": {
#                 "max_pct": 70, 
#                 "recommendation": "Severe infection. Apply fungicide (Chlorothalonil or Copper-based) at recommended dosage. Remove severely infected plants. Consider crop rotation next season."
#             },
#             "critical": {
#                 "max_pct": 100, 
#                 "recommendation": "Critical infection. Immediate action required. Apply fungicide, remove infected plants, and consult agricultural expert. Consider early harvest if crop is mature."
#             }
#         },
#         "symptoms": [
#             "Dark brown to black spots with concentric rings on leaves",
#             "Yellowing of leaves around the spots",
#             "Leaves becoming dry and brittle",
#             "Lesions on stems and fruits in severe cases"
#         ],
#         "treatment": [
#             "Remove and destroy infected leaves immediately",
#             "Apply Chlorothalonil (1.5-2.0 ml/L) or Copper-based fungicide (2.0-3.0 ml/L)",
#             "Improve air circulation by proper spacing",
#             "Water at base of plants to avoid wetting leaves",
#             "Apply mulch to prevent soil splashing"
#         ],
#         "prevention": [
#             "Plant resistant varieties",
#             "Rotate crops annually (3-4 year cycle)",
#             "Maintain proper plant spacing",
#             "Water early in the day",
#             "Use drip irrigation instead of overhead watering"
#         ]
#     },
#     "powdery_mildew": {
#         "name": "Powdery Mildew",
#         "scientific_name": "Erysiphe cichoracearum",
#         "type": "Fungal Disease",
#         "severity_levels": {
#             "low": {
#                 "max_pct": 15, 
#                 "recommendation": "Initial powdery mildew detected. Remove affected leaves. Apply sulfur-based fungicide or neem oil as preventive measure."
#             },
#             "moderate": {
#                 "max_pct": 40, 
#                 "recommendation": "Moderate powdery mildew infection. Apply sulfur-based fungicide or neem oil (2.0-3.0 ml/L). Ensure good air circulation. Avoid overhead watering."
#             },
#             "high": {
#                 "max_pct": 70, 
#                 "recommendation": "Severe powdery mildew. Apply fungicide immediately. Consider using systemic fungicides. Remove severely affected plants."
#             },
#             "critical": {
#                 "max_pct": 100, 
#                 "recommendation": "Critical infection. Immediate fungicide application required. Consult agricultural expert. Consider early harvest."
#             }
#         },
#         "symptoms": [
#             "White powdery spots on leaves, stems, and flowers",
#             "Leaves may curl and distort",
#             "Yellowing and premature leaf drop",
#             "Stunted plant growth"
#         ],
#         "treatment": [
#             "Remove infected plant parts",
#             "Apply sulfur-based fungicide or neem oil (2.0-3.0 ml/L)",
#             "Improve air circulation",
#             "Avoid overhead watering",
#             "Apply potassium bicarbonate solution"
#         ],
#         "prevention": [
#             "Plant resistant varieties",
#             "Space plants for good air flow",
#             "Water early morning",
#             "Apply preventive sprays during humid conditions",
#             "Remove plant debris regularly"
#         ]
#     },
#     "leaf_curl": {
#         "name": "Leaf Curl Virus",
#         "scientific_name": "Begomovirus",
#         "type": "Viral Disease",
#         "severity_levels": {
#             "low": {
#                 "max_pct": 15, 
#                 "recommendation": "Early leaf curl symptoms detected. Remove infected plants immediately. Control vector insects (whiteflies) using insecticidal soap."
#             },
#             "moderate": {
#                 "max_pct": 40, 
#                 "recommendation": "Moderate leaf curl virus spread. Remove infected plants. Apply neem oil to control whiteflies. Maintain plant health with proper nutrition."
#             },
#             "high": {
#                 "max_pct": 70, 
#                 "recommendation": "Severe virus infection. Remove all infected plants. Implement strict vector control. Consider resistant varieties next season."
#             },
#             "critical": {
#                 "max_pct": 100, 
#                 "recommendation": "Critical virus spread. Immediate action needed. Remove all plants in affected area. Soil solarization recommended. Consult agricultural expert."
#             }
#         },
#         "symptoms": [
#             "Leaves curling upward",
#             "Yellowing and mottling of leaves",
#             "Stunted growth",
#             "Reduced fruit production"
#         ],
#         "treatment": [
#             "Remove infected plants immediately",
#             "Control vector insects (whiteflies, aphids) with insecticidal soap",
#             "Apply neem oil (2.0-3.0 ml/L)",
#             "Maintain plant health with balanced nutrition",
#             "Use reflective mulches to repel insects"
#         ],
#         "prevention": [
#             "Use disease-free seeds",
#             "Control insect vectors with regular monitoring",
#             "Use reflective mulches",
#             "Plant resistant varieties",
#             "Maintain healthy soil with organic matter"
#         ]
#     },
#     "bacterial_wilt": {
#         "name": "Bacterial Wilt",
#         "scientific_name": "Ralstonia solanacearum",
#         "type": "Bacterial Disease",
#         "severity_levels": {
#             "low": {
#                 "max_pct": 15, 
#                 "recommendation": "Early bacterial wilt symptoms detected. Remove infected plants. Solarize soil. Improve drainage."
#             },
#             "moderate": {
#                 "max_pct": 40, 
#                 "recommendation": "Moderate bacterial wilt spread. Remove infected plants. Apply copper-based bactericides. Implement crop rotation."
#             },
#             "high": {
#                 "max_pct": 70, 
#                 "recommendation": "Severe bacterial wilt infection. Remove all infected plants. Solarize soil thoroughly. Apply copper-based bactericides (2.0-3.0 ml/L)."
#             },
#             "critical": {
#                 "max_pct": 100, 
#                 "recommendation": "Critical infection. Immediate action required. Remove all plants. Soil solarization and fumigation needed. Consult agricultural expert."
#             }
#         },
#         "symptoms": [
#             "Sudden wilting of leaves",
#             "Yellowing of leaves",
#             "Bacterial ooze from cut stems",
#             "Vascular discoloration"
#         ],
#         "treatment": [
#             "Remove and destroy infected plants",
#             "Solarize soil (cover with clear plastic for 4-6 weeks)",
#             "Apply copper-based bactericides (2.0-3.0 ml/L)",
#             "Improve drainage",
#             "Rotate crops (4-5 year cycle)"
#         ],
#         "prevention": [
#             "Plant resistant varieties",
#             "Use certified disease-free seeds",
#             "Crop rotation (4-5 years)",
#             "Improve soil drainage",
#             "Avoid overhead irrigation"
#         ]
#     },
#     "rust": {
#         "name": "Rust Disease",
#         "scientific_name": "Puccinia spp.",
#         "type": "Fungal Disease",
#         "severity_levels": {
#             "low": {
#                 "max_pct": 15, 
#                 "recommendation": "Initial rust infection detected. Remove affected leaves. Apply fungicide (Mancozeb or Sulfur) preventively."
#             },
#             "moderate": {
#                 "max_pct": 40, 
#                 "recommendation": "Moderate rust infection. Apply fungicide (Mancozeb 2.0-2.5 gm/L or Sulfur). Improve air circulation. Avoid wet foliage."
#             },
#             "high": {
#                 "max_pct": 70, 
#                 "recommendation": "Severe rust infection. Apply fungicide immediately. Remove severely affected leaves. Consider resistant varieties next season."
#             },
#             "critical": {
#                 "max_pct": 100, 
#                 "recommendation": "Critical infection. Immediate fungicide application required. Consult agricultural expert. Consider early harvest."
#             }
#         },
#         "symptoms": [
#             "Orange, yellow, or brown rust-colored pustules on leaves",
#             "Premature leaf drop",
#             "Stunted growth",
#             "Reduced yield"
#         ],
#         "treatment": [
#             "Remove infected leaves",
#             "Apply fungicide (Mancozeb 2.0-2.5 gm/L or Sulfur)",
#             "Improve air circulation",
#             "Water at base of plants",
#             "Avoid wet foliage"
#         ],
#         "prevention": [
#             "Plant resistant varieties",
#             "Space plants properly",
#             "Water early morning",
#             "Apply preventive fungicides",
#             "Remove plant debris"
#         ]
#     },
#     "downy_mildew": {
#         "name": "Downy Mildew",
#         "scientific_name": "Peronospora spp.",
#         "type": "Fungal Disease",
#         "severity_levels": {
#             "low": {
#                 "max_pct": 15, 
#                 "recommendation": "Early downy mildew detected. Remove affected leaves. Apply copper-based fungicide preventively."
#             },
#             "moderate": {
#                 "max_pct": 40, 
#                 "recommendation": "Moderate downy mildew infection. Apply fungicide (Copper-based or Mancozeb). Improve air circulation. Reduce humidity."
#             },
#             "high": {
#                 "max_pct": 70, 
#                 "recommendation": "Severe downy mildew. Apply fungicide immediately. Remove severely affected plants. Consider resistant varieties next season."
#             },
#             "critical": {
#                 "max_pct": 100, 
#                 "recommendation": "Critical infection. Immediate fungicide application required. Consult agricultural expert. Consider early harvest."
#             }
#         },
#         "symptoms": [
#             "Yellow spots on upper leaf surface",
#             "White/purple fuzzy growth on underside of leaves",
#             "Leaves turning brown and dying",
#             "Stunted plant growth"
#         ],
#         "treatment": [
#             "Remove infected leaves",
#             "Apply Copper-based fungicide (2.0-3.0 ml/L) or Mancozeb (2.0-2.5 gm/L)",
#             "Improve air circulation",
#             "Reduce humidity",
#             "Avoid overhead watering"
#         ],
#         "prevention": [
#             "Plant resistant varieties",
#             "Space plants for air flow",
#             "Water early morning",
#             "Apply preventive sprays",
#             "Remove plant debris"
#         ]
#     }
# }


# # --------------------------------------------------------------------------
# # App setup
# # --------------------------------------------------------------------------
# app = FastAPI(title="Agri ML/DL Inference API", version="1.0.0")

# # Configure CORS. Set environment variable `ALLOWED_ORIGINS` to a comma-separated
# # list of origins (or `*` to allow all). Example: "https://example.com,https://app.example.com"
# _origins_env = os.getenv("ALLOWED_ORIGINS", "*")
# if _origins_env.strip() == "*":
#     _allow_origins = ["*"]
# else:
#     _allow_origins = [o.strip() for o in _origins_env.split(",") if o.strip()]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=_allow_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"],
#     max_age=600,
# )

# _models = {}


# # --------------------------------------------------------------------------
# # Custom exception handler for Unicode errors
# # --------------------------------------------------------------------------
# @app.exception_handler(UnicodeDecodeError)
# async def unicode_decode_error_handler(request: Request, exc: UnicodeDecodeError):
#     """Handle Unicode decode errors gracefully"""
#     logger.error(f"Unicode decode error: {exc}")
#     return JSONResponse(
#         status_code=400,
#         content={"detail": "Invalid request data. Please ensure the request body is properly encoded."}
#     )


# @app.exception_handler(Exception)
# async def general_exception_handler(request: Request, exc: Exception):
#     """Handle general exceptions gracefully"""
#     logger.error(f"Unhandled exception: {type(exc).__name__}: {str(exc)[:200]}")
#     return JSONResponse(
#         status_code=500,
#         content={"detail": "An internal server error occurred."}
#     )


# @app.on_event("startup")
# def load_models():
#     # --- Crop recommendation ---
#     _models["crop_rec_model"] = joblib.load(
#         os.path.join(MODELS_DIR, "Crop_recommendation", "xgboost_crop_model.pkl")
#     )
#     _models["crop_rec_label_encoder"] = joblib.load(
#         os.path.join(MODELS_DIR, "Crop_recommendation", "label_encoder.pkl")
#     )

#     # --- Crop yield ---
#     _models["yield_model"] = joblib.load(
#         os.path.join(MODELS_DIR, "crop_yield", "xgboost_yield_model.pkl")
#     )
#     _models["yield_label_encoders"] = joblib.load(
#         os.path.join(MODELS_DIR, "crop_yield", "label_encoders.pkl")
#     )

#     # --- Irrigation prediction ---
#     _models["irrigation_model"] = joblib.load(
#         os.path.join(MODELS_DIR, "irrigation_prediction", "xgboost_irrigation_model.pkl")
#     )
#     _models["irrigation_label_encoders"] = joblib.load(
#         os.path.join(MODELS_DIR, "irrigation_prediction", "label_encoders.pkl")
#     )
#     _models["irrigation_target_encoder"] = joblib.load(
#         os.path.join(MODELS_DIR, "irrigation_prediction", "target_encoder.pkl")
#     )

#     # --- Fertilizer recommendation ---
#     fert_dir = os.path.join(MODELS_DIR, "fertilizer_recommendation")
#     _models["fert_model"] = joblib.load(os.path.join(fert_dir, "fertilizer_model.pkl"))
#     _models["fert_scaler"] = joblib.load(os.path.join(fert_dir, "scaler.pkl"))
#     _models["fert_onehot"] = joblib.load(os.path.join(fert_dir, "onehot_encoder.pkl"))
#     _models["fert_label_encoder"] = joblib.load(os.path.join(fert_dir, "fertilizer_label_encoder.pkl"))
#     _models["fert_feature_columns"] = joblib.load(os.path.join(fert_dir, "feature_columns.pkl"))
#     _models["fert_stage_mapping"] = joblib.load(os.path.join(fert_dir, "stage_mapping.pkl"))

#     # --- Disease detection (U-Net segmentation) ---
#     unet = UNet(n_channels=3, n_classes=1, bilinear=True)
#     checkpoint = torch.load(
#         os.path.join(MODELS_DIR, "disease_detection", "best_model_tuned.pth"),
#         map_location=DEVICE,
#     )
#     state_dict = checkpoint["model_state_dict"] if "model_state_dict" in checkpoint else checkpoint
#     unet.load_state_dict(state_dict)
#     unet.to(DEVICE)
#     unet.eval()
#     _models["disease_unet"] = unet


# def get_model(key):
#     model = _models.get(key)
#     if model is None:
#         raise HTTPException(status_code=503, detail="Model not loaded yet. Try again shortly.")
#     return model


# def safe_transform(encoder, value: str, field_name: str):
#     """LabelEncoder.transform but raises a clean 400 for unseen categories."""
#     try:
#         return int(encoder.transform([value])[0])
#     except ValueError:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Invalid value '{value}' for '{field_name}'. "
#             f"Allowed values: {list(encoder.classes_)}",
#         )


# def get_severity_level(affected_pct):
#     """Determine severity level based on affected area percentage"""
#     if affected_pct <= 15:
#         return "low"
#     elif affected_pct <= 40:
#         return "moderate"
#     elif affected_pct <= 70:
#         return "high"
#     else:
#         return "critical"


# def get_disease_type(affected_pct, mask=None):
#     """
#     Determine disease type based on affected area and mask pattern.
#     In production, this would use a CNN classifier.
#     """
#     if affected_pct > 5:
#         # Simple heuristic - replace with actual disease classifier
#         return "early_blight"
#     return None


# def generate_disease_recommendations(affected_pct, disease_info):
#     """Generate recommendations based on affected area and disease knowledge"""
#     severity = get_severity_level(affected_pct)
#     severity_info = disease_info["severity_levels"][severity]
    
#     if affected_pct <= 15:
#         health_status = "Good - Early detection"
#         urgency = "Monitor and preventive care"
#     elif affected_pct <= 40:
#         health_status = "Moderate - Needs attention"
#         urgency = "Action required in 1-3 days"
#     elif affected_pct <= 70:
#         health_status = "Poor - Immediate action needed"
#         urgency = "Action required within 24 hours"
#     else:
#         health_status = "Critical - Emergency"
#         urgency = "Immediate action required"
    
#     return {
#         "severity": severity,
#         "health_status": health_status,
#         "urgency": urgency,
#         "recommendation": severity_info["recommendation"],
#         "treatment": disease_info["treatment"][:3],
#         "prevention": disease_info["prevention"][:3],
#         "symptoms": disease_info["symptoms"][:3]
#     }


# def download_image_from_url(url):
#     """Download image from URL and return PIL Image"""
#     try:
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
#         }
#         response = requests.get(url, headers=headers, timeout=30)
#         response.raise_for_status()
        
#         # Check if response is actually an image
#         content_type = response.headers.get('content-type', '')
#         if 'image' not in content_type:
#             # Try to detect from content
#             try:
#                 image = Image.open(io.BytesIO(response.content))
#                 return image.convert("RGB")
#             except Exception:
#                 raise HTTPException(
#                     status_code=400, 
#                     detail="URL does not point to a valid image. Please provide a direct image URL."
#                 )
        
#         image = Image.open(io.BytesIO(response.content))
#         return image.convert("RGB")
#     except requests.exceptions.RequestException as e:
#         raise HTTPException(
#             status_code=400, 
#             detail=f"Failed to download image from URL. Please check that the URL is accessible."
#         )
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=400, 
#             detail="Invalid image URL or unsupported format. Please provide a valid image URL."
#         )


# def upload_to_cloudinary(image, public_id, folder="AgroBot"):
#     """Upload image to Cloudinary and return URL"""
#     try:
#         img_byte_arr = io.BytesIO()
#         image.save(img_byte_arr, format='PNG')
#         img_byte_arr.seek(0)
        
#         response = cloudinary.uploader.upload(
#             img_byte_arr,
#             public_id=public_id,
#             folder=folder,
#             resource_type="image",
#             format="png"
#         )
        
#         return {
#             "url": response.get("secure_url"),
#             "public_id": response.get("public_id"),
#             "width": response.get("width"),
#             "height": response.get("height"),
#             "format": response.get("format"),
#             "bytes": response.get("bytes"),
#             "created_at": response.get("created_at")
#         }
#     except Exception as e:
#         logger.error(f"Cloudinary upload error: {str(e)[:200]}")
#         return None


# def create_and_upload_segmentation_images(mask_array, original_image, filename_prefix):
#     """Create and upload segmentation images to Cloudinary"""
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     unique_id = str(uuid.uuid4())[:8]
#     base_name = f"{filename_prefix}_{timestamp}_{unique_id}"
    
#     # Ensure mask is binary (0/1)
#     mask = (mask_array > 0.5).astype(np.uint8)
    
#     # Resize mask to original image size
#     mask_resized = cv2.resize(mask, original_image.size, interpolation=cv2.INTER_NEAREST)
#     mask_resized = (mask_resized > 0.5).astype(np.uint8)
    
#     # Convert original image to numpy array
#     orig_np = np.array(original_image)
    
#     image_urls = {}
    
#     # 1. Upload original image
#     orig_result = upload_to_cloudinary(original_image, f"original_{base_name}")
#     if orig_result:
#         image_urls["original"] = orig_result
    
#     # 2. Create and upload segmented mask image
#     mask_image = mask_resized * 255
#     mask_image = np.stack([mask_image] * 3, axis=2)
#     mask_pil = Image.fromarray(mask_image.astype(np.uint8))
    
#     mask_result = upload_to_cloudinary(mask_pil, f"mask_{base_name}")
#     if mask_result:
#         image_urls["mask"] = mask_result
    
#     # 3. Create and upload overlay image
#     overlay = np.zeros_like(orig_np, dtype=np.uint8)
#     overlay[:, :, 0] = 255
#     overlay[:, :, 1] = 0
#     overlay[:, :, 2] = 0
    
#     overlay_alpha = 0.7
#     orig_np_copy = orig_np.copy()
#     mask_3d = np.stack([mask_resized] * 3, axis=2)
    
#     blended = np.where(
#         mask_3d > 0,
#         (1 - overlay_alpha) * orig_np_copy + overlay_alpha * overlay,
#         orig_np_copy
#     ).astype(np.uint8)
    
#     overlay_pil = Image.fromarray(blended)
#     overlay_result = upload_to_cloudinary(overlay_pil, f"overlay_{base_name}")
#     if overlay_result:
#         image_urls["overlay"] = overlay_result
    
#     return {
#         "base_filename": base_name,
#         "images": image_urls
#     }


# # ==========================================================================
# # 1. CROP RECOMMENDATION
# # ==========================================================================
# class CropRecommendationInput(BaseModel):
#     N: float = Field(..., ge=0, description="Nitrogen content in soil")
#     P: float = Field(..., ge=0, description="Phosphorus content in soil")
#     K: float = Field(..., ge=0, description="Potassium content in soil")
#     temperature: float
#     humidity: float = Field(..., ge=0, le=100)
#     ph: float = Field(..., ge=0, le=14)
#     rainfall: float = Field(..., ge=0)


# @app.post("/predict/crop-recommendation")
# def predict_crop_recommendation(payload: CropRecommendationInput):
#     model = get_model("crop_rec_model")
#     label_encoder = get_model("crop_rec_label_encoder")

#     X = pd.DataFrame([payload.model_dump()])[
#         ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
#     ]
#     pred_idx = model.predict(X)[0]
#     crop = label_encoder.inverse_transform([pred_idx])[0]

#     probs = model.predict_proba(X)[0]
#     confidence = float(np.max(probs))

#     return {"recommended_crop": crop, "confidence": round(confidence, 4)}


# # ==========================================================================
# # 2. CROP YIELD PREDICTION
# # ==========================================================================
# class CropYieldInput(BaseModel):
#     Crop: str
#     Season: str
#     State: str
#     Crop_Year: int
#     Area: float = Field(..., gt=0)
#     Production: float = Field(..., ge=0)
#     Annual_Rainfall: float = Field(..., ge=0)
#     Fertilizer: float = Field(..., ge=0)
#     Pesticide: float = Field(..., ge=0)


# @app.post("/predict/crop-yield")
# def predict_crop_yield(payload: CropYieldInput):
#     model = get_model("yield_model")
#     encoders = get_model("yield_label_encoders")

#     data = payload.model_dump()
#     data["Crop"] = safe_transform(encoders["Crop"], data["Crop"], "Crop")
#     data["Season"] = safe_transform(encoders["Season"], data["Season"], "Season")
#     data["State"] = safe_transform(encoders["State"], data["State"], "State")

#     X = pd.DataFrame([data])[
#         ["Crop", "Season", "State", "Crop_Year", "Area", "Production",
#          "Annual_Rainfall", "Fertilizer", "Pesticide"]
#     ]
#     pred_yield = float(model.predict(X)[0])

#     return {"predicted_yield": round(pred_yield, 4)}


# # ==========================================================================
# # 3. IRRIGATION RECOMMENDATION
# # ==========================================================================
# class IrrigationInput(BaseModel):
#     Soil_Type: str
#     Crop_Type: str
#     Crop_Growth_Stage: str
#     Season: str
#     Irrigation_Type: str
#     Water_Source: str
#     Mulching_Used: str
#     Region: str
#     Soil_pH: float = Field(..., ge=0, le=14)
#     Soil_Moisture: float = Field(..., ge=0)
#     Organic_Carbon: float = Field(..., ge=0)
#     Electrical_Conductivity: float = Field(..., ge=0)
#     Temperature_C: float
#     Humidity: float = Field(..., ge=0, le=100)
#     Rainfall_mm: float = Field(..., ge=0)
#     Sunlight_Hours: float = Field(..., ge=0, le=24)
#     Wind_Speed_kmh: float = Field(..., ge=0)
#     Field_Area_hectare: float = Field(..., gt=0)
#     Previous_Irrigation_mm: float = Field(..., ge=0)


# @app.post("/predict/irrigation")
# def predict_irrigation(payload: IrrigationInput):
#     model = get_model("irrigation_model")
#     encoders = get_model("irrigation_label_encoders")
#     target_encoder = get_model("irrigation_target_encoder")

#     data = payload.model_dump()
#     for col in ["Soil_Type", "Crop_Type", "Crop_Growth_Stage", "Season",
#                 "Irrigation_Type", "Water_Source", "Mulching_Used", "Region"]:
#         data[col] = safe_transform(encoders[col], data[col], col)

#     feature_order = [
#         "Soil_Type", "Crop_Type", "Crop_Growth_Stage", "Season", "Irrigation_Type",
#         "Water_Source", "Mulching_Used", "Region", "Soil_pH", "Soil_Moisture",
#         "Organic_Carbon", "Electrical_Conductivity", "Temperature_C", "Humidity",
#         "Rainfall_mm", "Sunlight_Hours", "Wind_Speed_kmh", "Field_Area_hectare",
#         "Previous_Irrigation_mm",
#     ]
#     X = pd.DataFrame([data])[feature_order]

#     pred_idx = model.predict(X)[0]
#     irrigation_need = target_encoder.inverse_transform([pred_idx])[0]
#     probs = model.predict_proba(X)[0]
#     confidence = float(np.max(probs))

#     return {"irrigation_need": irrigation_need, "confidence": round(confidence, 4)}


# # ==========================================================================
# # 4. FERTILIZER RECOMMENDATION
# # ==========================================================================
# class FertilizerInput(BaseModel):
#     Soil_pH: float = Field(..., ge=0, le=14)
#     Soil_Moisture: float = Field(..., ge=0)
#     Organic_Carbon: float = Field(..., ge=0)
#     Electrical_Conductivity: float = Field(..., ge=0)
#     Nitrogen_Level: float = Field(..., ge=0)
#     Phosphorus_Level: float = Field(..., ge=0)
#     Potassium_Level: float = Field(..., ge=0)
#     Temperature: float
#     Humidity: float = Field(..., ge=0, le=100)
#     Rainfall: float = Field(..., ge=0)
#     Crop_Growth_Stage: str
#     Fertilizer_Used_Last_Season: float = Field(..., ge=0)
#     Yield_Last_Season: float = Field(..., ge=0)
#     Soil_Type: str
#     Crop_Type: str
#     Season: str
#     Irrigation_Type: str
#     Previous_Crop: str
#     Region: str


# @app.post("/predict/fertilizer")
# def predict_fertilizer(payload: FertilizerInput):
#     model = get_model("fert_model")
#     scaler = get_model("fert_scaler")
#     onehot = get_model("fert_onehot")
#     label_encoder = get_model("fert_label_encoder")
#     feature_columns = get_model("fert_feature_columns")
#     stage_mapping = get_model("fert_stage_mapping")

#     data = payload.model_dump()

#     if data["Crop_Growth_Stage"] not in stage_mapping:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Invalid Crop_Growth_Stage. Allowed: {list(stage_mapping.keys())}",
#         )
#     data["Crop_Growth_Stage"] = stage_mapping[data["Crop_Growth_Stage"]]

#     N, P, K = data["Nitrogen_Level"], data["Phosphorus_Level"], data["Potassium_Level"]
#     eps = 1e-6
#     data["NP_ratio"] = N / (P + eps)
#     data["NK_ratio"] = N / (K + eps)
#     data["PK_ratio"] = P / (K + eps)
#     data["NPK_total"] = N + P + K
#     data["N_share"] = N / (data["NPK_total"] + eps)
#     data["P_share"] = P / (data["NPK_total"] + eps)
#     data["K_share"] = K / (data["NPK_total"] + eps)

#     cat_cols = ["Soil_Type", "Crop_Type", "Season", "Irrigation_Type", "Previous_Crop", "Region"]
#     for col in cat_cols:
#         allowed = list(onehot.categories_[cat_cols.index(col)])
#         if data[col] not in allowed:
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"Invalid value '{data[col]}' for '{col}'. Allowed values: {allowed}",
#             )

#     cat_df = pd.DataFrame([{c: data[c] for c in cat_cols}])
#     onehot_array = onehot.transform(cat_df)
#     onehot_cols = onehot.get_feature_names_out(cat_cols)
#     onehot_df = pd.DataFrame(onehot_array, columns=onehot_cols)

#     numeric_cols = [
#         "Soil_pH", "Soil_Moisture", "Organic_Carbon", "Electrical_Conductivity",
#         "Nitrogen_Level", "Phosphorus_Level", "Potassium_Level", "Temperature",
#         "Humidity", "Rainfall", "Fertilizer_Used_Last_Season", "Yield_Last_Season",
#         "NP_ratio", "NK_ratio", "PK_ratio", "NPK_total", "N_share", "P_share", "K_share",
#         "Crop_Growth_Stage",
#     ]
#     numeric_df = pd.DataFrame([{c: data[c] for c in numeric_cols}])
#     scaled_array = scaler.transform(numeric_df)
#     scaled_df = pd.DataFrame(scaled_array, columns=numeric_cols)

#     combined = pd.concat([scaled_df, onehot_df], axis=1)
#     combined = combined.reindex(columns=feature_columns, fill_value=0)

#     pred_idx = model.predict(combined)[0]
#     fertilizer = label_encoder.inverse_transform([pred_idx])[0]
#     probs = model.predict_proba(combined)[0]
#     confidence = float(np.max(probs))

#     return {"recommended_fertilizer": fertilizer, "confidence": round(confidence, 4)}


# # ==========================================================================
# # 5. DISEASE DETECTION (accepts image URL, returns Cloudinary URLs)
# # ==========================================================================
# class DiseaseDetectionInput(BaseModel):
#     image_url: str = Field(..., description="URL of the image to analyze")
#     filename: str = Field("disease_scan", description="Base filename for uploaded images")


# @app.post("/predict/disease-detection")
# async def predict_disease_detection(payload: DiseaseDetectionInput):
#     """
#     Detect plant diseases from an image URL.
#     Downloads the image, runs U-Net segmentation, and uploads results to Cloudinary.
#     """
#     unet = get_model("disease_unet")
    
#     # 1. Download image from URL
#     try:
#         image = download_image_from_url(str(payload.image_url))
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Image download failed: {type(e).__name__}")
#         raise HTTPException(status_code=400, detail="Failed to download image from the provided URL.")
    
#     orig_size = image.size  # (W, H)
#     resized = image.resize((IMG_SIZE, IMG_SIZE))
#     arr = np.array(resized, dtype=np.float32) / 255.0
#     tensor = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0).to(DEVICE)
    
#     # 2. Run inference
#     with torch.no_grad():
#         logits = unet(tensor)
#         probs = torch.sigmoid(logits)
#         mask = (probs > 0.2).float().squeeze().cpu().numpy()
    
#     affected_pixels = int(mask.sum())
#     total_pixels = mask.size
#     affected_pct = round(100 * affected_pixels / total_pixels, 2)
    
#     # 3. Determine disease
#     disease_detected = affected_pct > 5.0
#     disease_info = None
#     recommendations = None
#     image_data = None
    
#     # 4. Upload images to Cloudinary
#     filename_prefix = payload.filename
#     try:
#         image_data = create_and_upload_segmentation_images(mask, image, filename_prefix)
#     except Exception as e:
#         logger.error(f"Cloudinary upload failed: {str(e)[:200]}")
#         image_data = None
    
#     # 5. Generate disease recommendations
#     if disease_detected:
#         disease_type = get_disease_type(affected_pct, mask)
#         if disease_type and disease_type in DISEASE_KNOWLEDGE:
#             disease_info = DISEASE_KNOWLEDGE[disease_type]
#             recommendations = generate_disease_recommendations(affected_pct, disease_info)
    
#     # 6. Build response
#     response = {
#         "success": True,
#         "disease_detected": disease_detected,
#         "affected_area_percentage": affected_pct,
#         "original_image_size": list(orig_size),
#         "image_urls": {
#             "original": image_data["images"]["original"]["url"] if image_data and "original" in image_data["images"] else None,
#             "mask": image_data["images"]["mask"]["url"] if image_data and "mask" in image_data["images"] else None,
#             "overlay": image_data["images"]["overlay"]["url"] if image_data and "overlay" in image_data["images"] else None,
#         } if image_data else None
#     }
    
#     if disease_detected and disease_info and recommendations:
#         response["disease_info"] = {
#             "name": disease_info["name"],
#             "scientific_name": disease_info["scientific_name"],
#             "type": disease_info["type"],
#             "severity": recommendations["severity"],
#             "health_status": recommendations["health_status"],
#             "urgency": recommendations["urgency"],
#             "symptoms": recommendations["symptoms"],
#             "recommendation": recommendations["recommendation"],
#             "treatment": recommendations["treatment"],
#             "prevention": recommendations["prevention"]
#         }
#         response["message"] = f"{disease_info['name']} detected with {recommendations['severity']} severity."
#     else:
#         response["message"] = "No significant disease detected. Crop appears healthy."
#         response["suggestions"] = [
#             "Continue regular monitoring",
#             "Maintain proper irrigation",
#             "Ensure adequate nutrition",
#             "Practice preventive measures"
#         ]
    
#     return JSONResponse(content=response)


# # ==========================================================================
# # 6. DISEASE DETECTION (file upload - for backward compatibility)
# # ==========================================================================
# @app.post("/predict/disease-detection-upload")
# async def predict_disease_detection_upload(file: UploadFile = File(...)):
#     """
#     Legacy endpoint that accepts file upload.
#     """
#     if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
#         raise HTTPException(status_code=400, detail="Upload a JPEG or PNG image.")
    
#     image_bytes = await file.read()
#     try:
#         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#     except Exception:
#         raise HTTPException(status_code=400, detail="Could not read image file.")
    
#     filename = os.path.splitext(file.filename)[0] if file.filename else "disease_scan"
    
#     # Direct processing
#     unet = get_model("disease_unet")
#     orig_size = image.size
#     resized = image.resize((IMG_SIZE, IMG_SIZE))
#     arr = np.array(resized, dtype=np.float32) / 255.0
#     tensor = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0).to(DEVICE)
    
#     with torch.no_grad():
#         logits = unet(tensor)
#         probs = torch.sigmoid(logits)
#         mask = (probs > 0.2).float().squeeze().cpu().numpy()
    
#     affected_pixels = int(mask.sum())
#     total_pixels = mask.size
#     affected_pct = round(100 * affected_pixels / total_pixels, 2)
    
#     disease_detected = affected_pct > 5.0
#     disease_info = None
#     recommendations = None
#     image_data = None
    
#     try:
#         image_data = create_and_upload_segmentation_images(mask, image, filename)
#     except Exception as e:
#         logger.error(f"Cloudinary upload failed: {str(e)[:200]}")
#         image_data = None
    
#     if disease_detected:
#         disease_type = get_disease_type(affected_pct, mask)
#         if disease_type and disease_type in DISEASE_KNOWLEDGE:
#             disease_info = DISEASE_KNOWLEDGE[disease_type]
#             recommendations = generate_disease_recommendations(affected_pct, disease_info)
    
#     response = {
#         "success": True,
#         "disease_detected": disease_detected,
#         "affected_area_percentage": affected_pct,
#         "original_image_size": list(orig_size),
#         "image_urls": {
#             "original": image_data["images"]["original"]["url"] if image_data and "original" in image_data["images"] else None,
#             "mask": image_data["images"]["mask"]["url"] if image_data and "mask" in image_data["images"] else None,
#             "overlay": image_data["images"]["overlay"]["url"] if image_data and "overlay" in image_data["images"] else None,
#         } if image_data else None
#     }
    
#     if disease_detected and disease_info and recommendations:
#         response["disease_info"] = {
#             "name": disease_info["name"],
#             "scientific_name": disease_info["scientific_name"],
#             "type": disease_info["type"],
#             "severity": recommendations["severity"],
#             "health_status": recommendations["health_status"],
#             "urgency": recommendations["urgency"],
#             "symptoms": recommendations["symptoms"],
#             "recommendation": recommendations["recommendation"],
#             "treatment": recommendations["treatment"],
#             "prevention": recommendations["prevention"]
#         }
#         response["message"] = f"{disease_info['name']} detected with {recommendations['severity']} severity."
#     else:
#         response["message"] = "No significant disease detected. Crop appears healthy."
#         response["suggestions"] = [
#             "Continue regular monitoring",
#             "Maintain proper irrigation",
#             "Ensure adequate nutrition",
#             "Practice preventive measures"
#         ]
    
#     return JSONResponse(content=response)


# @app.get("/health")
# def health():
#     return {"status": "ok", "models_loaded": list(_models.keys())}




from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import ALLOWED_ORIGINS, API_TITLE, API_VERSION, API_DESCRIPTION
from app.api.middleware import setup_middleware
from app.services.bot_service import bot_service
from app.services.model_loader import load_models
from app.config.logging_config import logger

# Import routes
from app.api.routes import agrobot, tasks, map as map_routes, models as model_routes

# Import ML routes
from app.api.routes import (
    crop_recommendation, 
    crop_yield, 
    irrigation, 
    fertilizer, 
    disease,
    soil_analysis  # Add new model
)

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION
)

# Setup CORS and exception handlers
setup_middleware(app)

# Include AgroBot routers
app.include_router(agrobot.router, prefix="/api/agrobot", tags=["AgroBot Control"])
app.include_router(tasks.router, prefix="/api", tags=["Real-time Updates"])
app.include_router(map_routes.router, prefix="/api/map", tags=["Map Data"])
app.include_router(model_routes.router, prefix="/api", tags=["Models"])

# Include ML routers
app.include_router(crop_recommendation.router, prefix="/predict", tags=["Crop Recommendation"])
app.include_router(crop_yield.router, prefix="/predict", tags=["Crop Yield"])
app.include_router(irrigation.router, prefix="/predict", tags=["Irrigation"])
app.include_router(fertilizer.router, prefix="/predict", tags=["Fertilizer"])
app.include_router(disease.router, prefix="/predict", tags=["Disease Detection"])
app.include_router(soil_analysis.router, prefix="/predict", tags=["Soil Analysis"])  # Add new route

@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("🚀 AgroBot Backend Starting...")
    logger.info("=" * 50)
    
    # Load ML models
    logger.info("📦 Loading ML models...")
    load_models()
    logger.info("✅ ML models loaded.")
    
    # Initialize default data if needed
    from app.services.mongodb_service import mongodb_service
    
    # Create default plots if none exist
    plots = mongodb_service.get_plots()
    if not plots:
        default_plots = [
            {"title": "Plot A", "latitude": 22.3039, "longitude": 70.8022, "area": 2.5, "crop": "Wheat"},
            {"title": "Plot B", "latitude": 22.3025, "longitude": 70.8005, "area": 3.0, "crop": "Rice"},
            {"title": "Plot C", "latitude": 22.3045, "longitude": 70.8035, "area": 1.8, "crop": "Cotton"},
        ]
        for plot in default_plots:
            mongodb_service.create_plot(plot)
        logger.info("Created default plots")
    
    # Create default tasks if none exist
    tasks = mongodb_service.get_tasks(10)
    if not tasks:
        default_tasks = [
            {"title": "Washing of field DC5", "time": "6:00pm", "status": "pending", "priority": "high"},
            {"title": "Planting of the plant in field", "time": "8:00pm", "status": "pending", "priority": "medium"},
            {"title": "Washing of field BC2", "time": "9:00am", "status": "pending", "priority": "medium"},
            {"title": "Soil scan", "time": "10:00am", "status": "pending", "priority": "low"},
            {"title": "Irrigation", "time": "4:00pm", "status": "pending", "priority": "high"},
        ]
        for task in default_tasks:
            mongodb_service.create_task(task)
        logger.info("Created default tasks")
    
    logger.info("=" * 50)
    logger.info("✅ AgroBot Backend Ready!")
    logger.info("=" * 50)

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 AgroBot Backend Shutting Down...")
    bot_service.shutdown()

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "version": API_VERSION,
        "timestamp": __import__('datetime').datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)