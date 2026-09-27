from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
from app.services.model_loader import get_model
from app.utils.validators import safe_transform

router = APIRouter()

class CropYieldInput(BaseModel):
    Crop: str
    Season: str
    State: str
    Crop_Year: int
    Area: float = Field(..., gt=0)
    Production: float = Field(..., ge=0)
    Annual_Rainfall: float = Field(..., ge=0)
    Fertilizer: float = Field(..., ge=0)
    Pesticide: float = Field(..., ge=0)

@router.post("/crop-yield")
def predict_crop_yield(payload: CropYieldInput):
    model = get_model("yield_model")
    encoders = get_model("yield_label_encoders")

    data = payload.model_dump()
    data["Crop"] = safe_transform(encoders["Crop"], data["Crop"], "Crop")
    data["Season"] = safe_transform(encoders["Season"], data["Season"], "Season")
    data["State"] = safe_transform(encoders["State"], data["State"], "State")

    X = pd.DataFrame([data])[
        ["Crop", "Season", "State", "Crop_Year", "Area", "Production",
         "Annual_Rainfall", "Fertilizer", "Pesticide"]
    ]
    pred_yield = float(model.predict(X)[0])

    return {"predicted_yield": round(pred_yield, 4)}