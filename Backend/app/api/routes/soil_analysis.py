from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
from app.services.model_loader import get_model
from app.config.logging_config import logger

router = APIRouter()

class SoilAnalysisInput(BaseModel):
    Soil_pH: float = Field(..., ge=0, le=14)
    Soil_Moisture: float = Field(..., ge=0)
    Organic_Carbon: float = Field(..., ge=0)
    Nitrogen: float = Field(..., ge=0)
    Phosphorus: float = Field(..., ge=0)
    Potassium: float = Field(..., ge=0)
    Temperature: float = Field(...)
    Humidity: float = Field(..., ge=0, le=100)

@router.post("/soil-analysis")
async def predict_soil_analysis(payload: SoilAnalysisInput):
    """Predict soil health and recommendations"""
    try:
        # This is a placeholder - replace with your actual model
        # For now, return analysis based on input values
        
        data = payload.model_dump()
        
        # Calculate soil health score
        score = 0
        if 6.0 <= data["Soil_pH"] <= 7.5:
            score += 20
        elif 5.5 <= data["Soil_pH"] <= 8.0:
            score += 10
        
        if data["Soil_Moisture"] >= 40:
            score += 20
        elif data["Soil_Moisture"] >= 25:
            score += 10
        
        if data["Organic_Carbon"] >= 1.0:
            score += 20
        elif data["Organic_Carbon"] >= 0.5:
            score += 10
        
        if data["Nitrogen"] >= 40:
            score += 20
        elif data["Nitrogen"] >= 20:
            score += 10
        
        if data["Phosphorus"] >= 30:
            score += 20
        elif data["Phosphorus"] >= 15:
            score += 10
        
        if data["Potassium"] >= 60:
            score += 20
        elif data["Potassium"] >= 30:
            score += 10
        
        # Determine status
        if score >= 100:
            status = "Excellent"
            color = "#D8F0D1"
        elif score >= 70:
            status = "Good"
            color = "#F4EDC8"
        elif score >= 40:
            status = "Fair"
            color = "#FFD3D3"
        else:
            status = "Poor"
            color = "#FF6B6B"
        
        # Generate recommendations
        recommendations = []
        if data["Soil_pH"] < 6.0:
            recommendations.append("Add lime to increase soil pH")
        elif data["Soil_pH"] > 7.5:
            recommendations.append("Add sulfur or organic matter to decrease soil pH")
        
        if data["Organic_Carbon"] < 1.0:
            recommendations.append("Add organic compost or manure to increase organic carbon")
        
        if data["Nitrogen"] < 30:
            recommendations.append("Apply nitrogen-rich fertilizer (Urea, DAP)")
        
        if data["Phosphorus"] < 20:
            recommendations.append("Apply phosphorus-rich fertilizer (Single Super Phosphate)")
        
        if data["Potassium"] < 50:
            recommendations.append("Apply potassium-rich fertilizer (Muriate of Potash)")
        
        if data["Soil_Moisture"] < 30:
            recommendations.append("Increase irrigation to improve soil moisture")
        
        return {
            "success": True,
            "soil_health_score": score,
            "status": status,
            "color": color,
            "recommendations": recommendations,
            "analysis": {
                "pH": data["Soil_pH"],
                "moisture": data["Soil_Moisture"],
                "organic_carbon": data["Organic_Carbon"],
                "nitrogen": data["Nitrogen"],
                "phosphorus": data["Phosphorus"],
                "potassium": data["Potassium"]
            }
        }
        
    except Exception as e:
        logger.error(f"Error in soil analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))