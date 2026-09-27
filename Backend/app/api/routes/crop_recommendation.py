from fastapi import APIRouter
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
from app.services.model_loader import get_model

router = APIRouter()

class CropRecommendationInput(BaseModel):
    N: float = Field(..., ge=0, description="Nitrogen content in soil")
    P: float = Field(..., ge=0, description="Phosphorus content in soil")
    K: float = Field(..., ge=0, description="Potassium content in soil")
    temperature: float
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0)

@router.post("/crop-recommendation")
def predict_crop_recommendation(payload: CropRecommendationInput):
    model = get_model("crop_rec_model")
    label_encoder = get_model("crop_rec_label_encoder")

    X = pd.DataFrame([payload.model_dump()])[
        ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    ]
    pred_idx = model.predict(X)[0]
    crop = label_encoder.inverse_transform([pred_idx])[0]

    probs = model.predict_proba(X)[0]
    confidence = float(np.max(probs))

    return {"recommended_crop": crop, "confidence": round(confidence, 4)}