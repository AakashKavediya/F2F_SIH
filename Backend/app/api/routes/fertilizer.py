from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
from app.services.model_loader import get_model
from app.config.logging_config import logger

router = APIRouter()

class FertilizerInput(BaseModel):
    Soil_pH: float = Field(..., ge=0, le=14, description="Soil pH level (0-14)")
    Soil_Moisture: float = Field(..., ge=0, description="Soil moisture percentage")
    Organic_Carbon: float = Field(..., ge=0, description="Organic carbon percentage")
    Electrical_Conductivity: float = Field(..., ge=0, description="Electrical conductivity (dS/m)")
    Nitrogen_Level: float = Field(..., ge=0, description="Nitrogen level in soil (kg/ha)")
    Phosphorus_Level: float = Field(..., ge=0, description="Phosphorus level in soil (kg/ha)")
    Potassium_Level: float = Field(..., ge=0, description="Potassium level in soil (kg/ha)")
    Temperature: float = Field(..., description="Temperature in Celsius")
    Humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    Rainfall: float = Field(..., ge=0, description="Rainfall in millimeters")
    Crop_Growth_Stage: str = Field(..., description="Growth stage of crop")
    Fertilizer_Used_Last_Season: float = Field(..., ge=0, description="Fertilizer used last season (kg/ha)")
    Yield_Last_Season: float = Field(..., ge=0, description="Yield from last season (tons/ha)")
    Soil_Type: str = Field(..., description="Type of soil (e.g., Sandy, Clay, Loamy)")
    Crop_Type: str = Field(..., description="Type of crop (e.g., Wheat, Rice, Cotton)")
    Season: str = Field(..., description="Current season (e.g., Summer, Winter, Monsoon)")
    Irrigation_Type: str = Field(..., description="Type of irrigation (e.g., Drip, Sprinkler, Flood)")
    Previous_Crop: str = Field(..., description="Previous crop grown")
    Region: str = Field(..., description="Region/Zone")

@router.post("/fertilizer")
async def predict_fertilizer(payload: FertilizerInput):
    """Predict recommended fertilizer based on soil and crop conditions"""
    try:
        # Get models
        model = get_model("fert_model")
        scaler = get_model("fert_scaler")
        onehot = get_model("fert_onehot")
        label_encoder = get_model("fert_label_encoder")
        feature_columns = get_model("fert_feature_columns")
        stage_mapping = get_model("fert_stage_mapping")
        
        if not model or not scaler or not onehot or not label_encoder or not feature_columns:
            raise HTTPException(status_code=503, detail="Fertilizer model not loaded")
        
        # Convert input to dict
        data = payload.model_dump()
        
        # Map crop growth stage
        if data["Crop_Growth_Stage"] not in stage_mapping:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid Crop_Growth_Stage. Allowed: {list(stage_mapping.keys())}"
            )
        data["Crop_Growth_Stage"] = stage_mapping[data["Crop_Growth_Stage"]]
        
        # Calculate derived features
        N, P, K = data["Nitrogen_Level"], data["Phosphorus_Level"], data["Potassium_Level"]
        eps = 1e-6
        
        data["NP_ratio"] = N / (P + eps)
        data["NK_ratio"] = N / (K + eps)
        data["PK_ratio"] = P / (K + eps)
        data["NPK_total"] = N + P + K
        data["N_share"] = N / (data["NPK_total"] + eps)
        data["P_share"] = P / (data["NPK_total"] + eps)
        data["K_share"] = K / (data["NPK_total"] + eps)
        
        # Encode categorical variables
        cat_cols = ["Soil_Type", "Crop_Type", "Season", "Irrigation_Type", "Previous_Crop", "Region"]
        
        # Check if onehot encoder has categories
        if not hasattr(onehot, 'categories_'):
            raise HTTPException(status_code=500, detail="OneHotEncoder not properly initialized")
        
        for col in cat_cols:
            allowed_values = list(onehot.categories_[cat_cols.index(col)])
            if data[col] not in allowed_values:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{data[col]}' for '{col}'. Allowed values: {allowed_values}"
                )
        
        # Transform categorical variables
        cat_df = pd.DataFrame([{c: data[c] for c in cat_cols}])
        onehot_array = onehot.transform(cat_df)
        onehot_cols = onehot.get_feature_names_out(cat_cols)
        onehot_df = pd.DataFrame(onehot_array, columns=onehot_cols)
        
        # Prepare numeric features
        numeric_cols = [
            "Soil_pH", "Soil_Moisture", "Organic_Carbon", "Electrical_Conductivity",
            "Nitrogen_Level", "Phosphorus_Level", "Potassium_Level", "Temperature",
            "Humidity", "Rainfall", "Fertilizer_Used_Last_Season", "Yield_Last_Season",
            "NP_ratio", "NK_ratio", "PK_ratio", "NPK_total", "N_share", "P_share", "K_share",
            "Crop_Growth_Stage"
        ]
        
        numeric_df = pd.DataFrame([{c: data[c] for c in numeric_cols}])
        scaled_array = scaler.transform(numeric_df)
        scaled_df = pd.DataFrame(scaled_array, columns=numeric_cols)
        
        # Combine features
        combined = pd.concat([scaled_df, onehot_df], axis=1)
        combined = combined.reindex(columns=feature_columns, fill_value=0)
        
        # Make prediction
        pred_idx = model.predict(combined)[0]
        fertilizer = label_encoder.inverse_transform([pred_idx])[0]
        
        # Get confidence and probabilities
        probs = model.predict_proba(combined)[0]
        confidence = float(np.max(probs))
        
        # Get all fertilizer recommendations with scores
        all_fertilizers = label_encoder.inverse_transform(range(len(probs)))
        fertilizer_scores = sorted(
            [(fertilizer, float(probs[i])) for i, fertilizer in enumerate(all_fertilizers)],
            key=lambda x: x[1],
            reverse=True
        )[:5]  # Top 5 recommendations
        
        # Generate nutrient recommendations
        nutrient_recommendations = _get_nutrient_recommendations(data, fertilizer)
        
        return {
            "success": True,
            "recommended_fertilizer": fertilizer,
            "confidence": round(confidence, 4),
            "top_recommendations": [
                {"fertilizer": f, "score": round(s, 4)} 
                for f, s in fertilizer_scores
            ],
            "soil_analysis": {
                "ph": data["Soil_pH"],
                "moisture": data["Soil_Moisture"],
                "organic_carbon": data["Organic_Carbon"],
                "nitrogen": data["Nitrogen_Level"],
                "phosphorus": data["Phosphorus_Level"],
                "potassium": data["Potassium_Level"],
                "npk_total": round(data["NPK_total"], 2)
            },
            "nutrient_recommendations": nutrient_recommendations,
            "application_guidelines": _get_application_guidelines(fertilizer, data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in fertilizer prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def _get_nutrient_recommendations(data, fertilizer):
    """Generate detailed nutrient recommendations"""
    recommendations = []
    
    N, P, K = data["Nitrogen_Level"], data["Phosphorus_Level"], data["Potassium_Level"]
    
    # Nitrogen recommendations
    if N < 30:
        recommendations.append({
            "nutrient": "Nitrogen (N)",
            "status": "Deficient",
            "recommendation": "Apply nitrogen-rich fertilizer (e.g., Urea, DAP)",
            "amount": f"{round((30 - N) * 1.5, 2)} kg/ha"
        })
    elif N < 60:
        recommendations.append({
            "nutrient": "Nitrogen (N)",
            "status": "Moderate",
            "recommendation": "Maintain nitrogen levels with balanced fertilizer",
            "amount": f"{round((60 - N) * 0.8, 2)} kg/ha"
        })
    else:
        recommendations.append({
            "nutrient": "Nitrogen (N)",
            "status": "Adequate",
            "recommendation": "Nitrogen levels are adequate, maintain with organic matter",
            "amount": "0 kg/ha"
        })
    
    # Phosphorus recommendations
    if P < 20:
        recommendations.append({
            "nutrient": "Phosphorus (P)",
            "status": "Deficient",
            "recommendation": "Apply phosphorus-rich fertilizer (e.g., Single Super Phosphate)",
            "amount": f"{round((20 - P) * 2, 2)} kg/ha"
        })
    elif P < 40:
        recommendations.append({
            "nutrient": "Phosphorus (P)",
            "status": "Moderate",
            "recommendation": "Maintain phosphorus levels with regular application",
            "amount": f"{round((40 - P) * 1, 2)} kg/ha"
        })
    else:
        recommendations.append({
            "nutrient": "Phosphorus (P)",
            "status": "Adequate",
            "recommendation": "Phosphorus levels are sufficient",
            "amount": "0 kg/ha"
        })
    
    # Potassium recommendations
    if K < 50:
        recommendations.append({
            "nutrient": "Potassium (K)",
            "status": "Deficient",
            "recommendation": "Apply potassium-rich fertilizer (e.g., Muriate of Potash)",
            "amount": f"{round((50 - K) * 1.2, 2)} kg/ha"
        })
    elif K < 80:
        recommendations.append({
            "nutrient": "Potassium (K)",
            "status": "Moderate",
            "recommendation": "Maintain potassium levels with balanced fertilizer",
            "amount": f"{round((80 - K) * 0.6, 2)} kg/ha"
        })
    else:
        recommendations.append({
            "nutrient": "Potassium (K)",
            "status": "Adequate",
            "recommendation": "Potassium levels are adequate",
            "amount": "0 kg/ha"
        })
    
    return recommendations

def _get_application_guidelines(fertilizer, data):
    """Generate fertilizer application guidelines"""
    guidelines = []
    
    # Based on crop growth stage
    stage = data.get("Crop_Growth_Stage", "")
    if stage in ["germination", "vegetative"]:
        guidelines.append(f"🌱 Apply {fertilizer} during early growth stage (germination to vegetative)")
        guidelines.append("💧 Water the field after fertilizer application for better absorption")
    elif stage in ["flowering", "fruiting"]:
        guidelines.append(f"🌸 Apply {fertilizer} during flowering/fruiting stage for better yield")
        guidelines.append("📅 Split the application into 2-3 doses for optimal results")
    else:
        guidelines.append(f"🌾 Apply {fertilizer} based on the recommended dosage for your crop")
    
    # Based on soil conditions
    if data["Soil_Moisture"] < 40:
        guidelines.append("💧 Ensure adequate soil moisture before fertilizer application")
    
    if data["Soil_pH"] < 5.5:
        guidelines.append("🧪 Soil pH is low. Consider liming before fertilizer application")
    elif data["Soil_pH"] > 8.0:
        guidelines.append("🧪 Soil pH is high. Consider using acidifying fertilizers")
    
    # General guidelines
    guidelines.append("📊 Apply fertilizer in the evening or early morning to reduce evaporation")
    guidelines.append("🔄 Rotate fertilizer types to maintain soil health")
    
    # Timing recommendation
    if data["Rainfall"] > 10:
        guidelines.append("☔ Heavy rainfall expected. Delay fertilizer application to prevent leaching")
    elif data["Temperature"] > 35:
        guidelines.append("🌡️ High temperature. Apply fertilizer with irrigation to prevent burn")
    
    return guidelines