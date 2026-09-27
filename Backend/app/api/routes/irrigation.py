from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
import pandas as pd
import numpy as np
from app.services.model_loader import get_model
from app.config.logging_config import logger

router = APIRouter()

class IrrigationInput(BaseModel):
    Soil_Type: str = Field(..., description="Type of soil")
    Crop_Type: str = Field(..., description="Type of crop")
    Crop_Growth_Stage: str = Field(..., description="Growth stage of crop")
    Season: str = Field(..., description="Current season")
    Irrigation_Type: str = Field(..., description="Type of irrigation")
    Water_Source: str = Field(..., description="Source of water")
    Mulching_Used: str = Field(..., description="Whether mulching is used (Yes/No)")
    Region: str = Field(..., description="Region/Zone")
    Soil_pH: float = Field(..., ge=0, le=14)
    Soil_Moisture: float = Field(..., ge=0)
    Organic_Carbon: float = Field(..., ge=0)
    Electrical_Conductivity: float = Field(..., ge=0)
    Temperature_C: float = Field(...)
    Humidity: float = Field(..., ge=0, le=100)
    Rainfall_mm: float = Field(..., ge=0)
    Sunlight_Hours: float = Field(..., ge=0, le=24)
    Wind_Speed_kmh: float = Field(..., ge=0)
    Field_Area_hectare: float = Field(..., gt=0)
    Previous_Irrigation_mm: float = Field(..., ge=0)
    
    # Validators for categorical fields based on model training data
    @field_validator('Season')
    def validate_season(cls, v):
        allowed = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter', 'Monsoon']
        if v not in allowed:
            raise ValueError(f"Season must be one of: {allowed}")
        return v
    
    @field_validator('Mulching_Used')
    def validate_mulching(cls, v):
        if v not in ['Yes', 'No']:
            raise ValueError("Mulching_Used must be 'Yes' or 'No'")
        return v
    
    @field_validator('Water_Source')
    def validate_water_source(cls, v):
        allowed = ['Groundwater', 'Rainwater', 'Reservoir', 'River', 'Canal', 'Well', 'Pond', 'Lake']
        if v not in allowed:
            raise ValueError(f"Water_Source must be one of: {allowed}")
        return v
    
    @field_validator('Soil_Type')
    def validate_soil_type(cls, v):
        allowed = ['Sandy', 'Clay', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Sandy Loam', 'Clay Loam']
        if v not in allowed:
            raise ValueError(f"Soil_Type must be one of: {allowed}")
        return v
    
    @field_validator('Crop_Type')
    def validate_crop_type(cls, v):
        allowed = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Groundnut', 'Tomato', 'Onion', 
                   'Potato', 'Maize', 'Soybean', 'Sunflower', 'Barley', 'Oats', 'Millet']
        if v not in allowed:
            raise ValueError(f"Crop_Type must be one of: {allowed}")
        return v
    
    @field_validator('Crop_Growth_Stage')
    def validate_growth_stage(cls, v):
        allowed = ['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 
                   'Seedling', 'Tillering', 'Booting', 'Heading', 'Ripening']
        if v not in allowed:
            raise ValueError(f"Crop_Growth_Stage must be one of: {allowed}")
        return v
    
    @field_validator('Irrigation_Type')
    def validate_irrigation_type(cls, v):
        allowed = ['Drip', 'Sprinkler', 'Flood', 'Furrow', 'Basin', 'Border', 'Furrow']
        if v not in allowed:
            raise ValueError(f"Irrigation_Type must be one of: {allowed}")
        return v
    
    @field_validator('Region')
    def validate_region(cls, v):
        allowed = ['North', 'South', 'East', 'West', 'Central', 'North East', 'North West', 
                   'South East', 'South West', 'Coastal', 'Plateau', 'Plains']
        if v not in allowed:
            raise ValueError(f"Region must be one of: {allowed}")
        return v

@router.post("/irrigation")
async def predict_irrigation(payload: IrrigationInput):
    """Predict irrigation need based on soil, crop, and environmental factors"""
    try:
        # Get models
        model = get_model("irrigation_model")
        encoders = get_model("irrigation_label_encoders")
        target_encoder = get_model("irrigation_target_encoder")
        
        if not model or not encoders or not target_encoder:
            raise HTTPException(status_code=503, detail="Irrigation model not loaded")
        
        # Convert input to dict
        data = payload.model_dump()
        
        # Mapping for season names to match model training
        season_mapping = {
            'Summer': 'Kharif',
            'Winter': 'Rabi',
            'Monsoon': 'Kharif'
        }
        
        # Map season if needed
        if data["Season"] in season_mapping:
            data["Season"] = season_mapping[data["Season"]]
        
        # Map water source if needed
        water_source_mapping = {
            'Well': 'Groundwater',
            'Pond': 'Rainwater',
            'Lake': 'Reservoir'
        }
        if data["Water_Source"] in water_source_mapping:
            data["Water_Source"] = water_source_mapping[data["Water_Source"]]
        
        # Encode categorical variables
        categorical_cols = [
            "Soil_Type", "Crop_Type", "Crop_Growth_Stage", "Season",
            "Irrigation_Type", "Water_Source", "Mulching_Used", "Region"
        ]
        
        for col in categorical_cols:
            try:
                if col in encoders:
                    data[col] = encoders[col].transform([data[col]])[0]
                else:
                    logger.warning(f"Encoder for {col} not found")
            except ValueError as e:
                if col in encoders:
                    allowed_values = list(encoders[col].classes_)
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value '{data[col]}' for '{col}'. Allowed values: {allowed_values}"
                    )
                else:
                    # Skip if encoder not available
                    continue
        
        # Feature order for the model
        feature_order = [
            "Soil_Type", "Crop_Type", "Crop_Growth_Stage", "Season", "Irrigation_Type",
            "Water_Source", "Mulching_Used", "Region", "Soil_pH", "Soil_Moisture",
            "Organic_Carbon", "Electrical_Conductivity", "Temperature_C", "Humidity",
            "Rainfall_mm", "Sunlight_Hours", "Wind_Speed_kmh", "Field_Area_hectare",
            "Previous_Irrigation_mm"
        ]
        
        # Create DataFrame
        X = pd.DataFrame([data])[feature_order]
        
        # Make prediction
        pred_idx = model.predict(X)[0]
        irrigation_need = target_encoder.inverse_transform([pred_idx])[0]
        
        # Get confidence scores
        probs = model.predict_proba(X)[0]
        confidence = float(np.max(probs))
        
        # Additional insights
        irrigation_amount = None
        if irrigation_need == "Yes":
            # Calculate recommended irrigation amount based on soil moisture and crop type
            base_amount = 20  # mm
            soil_factor = 1.0
            if data.get("Soil_Type") == "Sandy":
                soil_factor = 1.3
            elif data.get("Soil_Type") == "Clay":
                soil_factor = 0.7
            
            moisture_factor = 1.0
            if data["Soil_Moisture"] < 30:
                moisture_factor = 1.5
            elif data["Soil_Moisture"] > 70:
                moisture_factor = 0.5
            
            irrigation_amount = round(base_amount * soil_factor * moisture_factor, 1)
        
        # Determine urgency
        urgency = "Normal"
        if irrigation_need == "Yes":
            if data["Soil_Moisture"] < 25:
                urgency = "High - Immediate irrigation required"
            elif data["Soil_Moisture"] < 40:
                urgency = "Medium - Irrigate within 1-2 days"
            else:
                urgency = "Low - Schedule irrigation soon"
        
        return {
            "success": True,
            "irrigation_need": irrigation_need,
            "confidence": round(confidence, 4),
            "recommended_irrigation_amount": irrigation_amount,
            "urgency": urgency,
            "soil_moisture": data["Soil_Moisture"],
            "temperature": data["Temperature_C"],
            "rainfall": data["Rainfall_mm"],
            "suggestions": _get_irrigation_suggestions(irrigation_need, data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in irrigation prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def _get_irrigation_suggestions(irrigation_need, data):
    """Generate irrigation suggestions based on predictions"""
    suggestions = []
    
    if irrigation_need == "Yes":
        suggestions.append(f"💧 Irrigate the field with approximately {data.get('recommended_irrigation_amount', 20)}mm of water")
        
        if data.get("Soil_Moisture", 0) < 30:
            suggestions.append("⚠️ Soil moisture is critically low. Increase irrigation amount by 20%")
        
        if data.get("Rainfall_mm", 0) > 5:
            suggestions.append("☔ Rainfall expected. Consider adjusting irrigation schedule")
        
        if data.get("Temperature_C", 0) > 35:
            suggestions.append("🌡️ High temperature detected. Water during early morning or late evening to reduce evaporation")
        
        if data.get("Wind_Speed_kmh", 0) > 20:
            suggestions.append("💨 High wind speed. Consider using drip irrigation to minimize water loss")
    
    else:
        suggestions.append("🌱 Soil moisture is adequate. No immediate irrigation required")
        
        if data.get("Rainfall_mm", 0) > 10:
            suggestions.append("☔ Recent rainfall detected. Continue monitoring soil moisture")
        
        if data.get("Humidity", 0) > 70:
            suggestions.append("💨 High humidity. Reduce irrigation to prevent waterlogging")
    
    suggestions.append(f"📊 Current soil moisture: {data.get('Soil_Moisture', 0)}%")
    suggestions.append(f"🌡️ Temperature: {data.get('Temperature_C', 0)}°C")
    
    return suggestions