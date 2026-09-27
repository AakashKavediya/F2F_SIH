# test_all_models.py
import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def print_result(model_name, response):
    """Pretty print test results"""
    print(f"\n{'='*60}")
    print(f"📊 Testing: {model_name}")
    print(f"{'='*60}")
    
    if response.status_code == 200:
        print(f"✅ Status: {response.status_code} - Success")
        data = response.json()
        print(f"📝 Response:\n{json.dumps(data, indent=2)}")
    else:
        print(f"❌ Status: {response.status_code} - Failed")
        try:
            print(f"📝 Error: {response.json()}")
        except:
            print(f"📝 Error: {response.text}")
    print(f"{'='*60}\n")

def test_crop_recommendation():
    """Test Crop Recommendation Model"""
    print("\n🌾 Testing Crop Recommendation Model...")
    
    payload = {
        "N": 50,
        "P": 40,
        "K": 35,
        "temperature": 28.5,
        "humidity": 65,
        "ph": 6.8,
        "rainfall": 120.5
    }
    
    response = requests.post(
        f"{BASE_URL}/predict/crop-recommendation",
        json=payload
    )
    print_result("Crop Recommendation", response)
    return response

def test_crop_yield():
    """Test Crop Yield Prediction Model"""
    print("\n📈 Testing Crop Yield Prediction Model...")
    
    payload = {
        "Crop": "Rice",
        "Season": "Kharif",
        "State": "Gujarat",
        "Crop_Year": 2026,
        "Area": 2.5,
        "Production": 5.0,
        "Annual_Rainfall": 800,
        "Fertilizer": 120,
        "Pesticide": 40
    }
    
    response = requests.post(
        f"{BASE_URL}/predict/crop-yield",
        json=payload
    )
    print_result("Crop Yield", response)
    return response

def test_irrigation():
    """Test Irrigation Prediction Model"""
    print("\n💧 Testing Irrigation Prediction Model...")
    
    payload = {
        "Soil_Type": "Loamy",
        "Crop_Type": "Wheat",
        "Crop_Growth_Stage": "Flowering",
        "Season": "Rabi",
        "Irrigation_Type": "Drip",
        "Water_Source": "Groundwater",
        "Mulching_Used": "No",
        "Region": "North",
        "Soil_pH": 6.5,
        "Soil_Moisture": 45,
        "Organic_Carbon": 1.2,
        "Electrical_Conductivity": 0.8,
        "Temperature_C": 28,
        "Humidity": 60,
        "Rainfall_mm": 2.5,
        "Sunlight_Hours": 8,
        "Wind_Speed_kmh": 12,
        "Field_Area_hectare": 2.5,
        "Previous_Irrigation_mm": 10
    }
    
    response = requests.post(
        f"{BASE_URL}/predict/irrigation",
        json=payload
    )
    print_result("Irrigation", response)
    return response

def test_fertilizer():
    """Test Fertilizer Recommendation Model"""
    print("\n🧪 Testing Fertilizer Recommendation Model...")
    
    payload = {
        "Soil_pH": 6.5,
        "Soil_Moisture": 45,
        "Organic_Carbon": 1.2,
        "Electrical_Conductivity": 0.8,
        "Nitrogen_Level": 25,
        "Phosphorus_Level": 15,
        "Potassium_Level": 40,
        "Temperature": 28,
        "Humidity": 60,
        "Rainfall": 2.5,
        "Crop_Growth_Stage": "Flowering",
        "Fertilizer_Used_Last_Season": 50,
        "Yield_Last_Season": 4.5,
        "Soil_Type": "Loamy",
        "Crop_Type": "Wheat",
        "Season": "Rabi",
        "Irrigation_Type": "Drip",
        "Previous_Crop": "Rice",
        "Region": "North"
    }
    
    response = requests.post(
        f"{BASE_URL}/predict/fertilizer",
        json=payload
    )
    print_result("Fertilizer", response)
    return response

def test_disease_detection():
    """Test Disease Detection Model"""
    print("\n🩺 Testing Disease Detection Model...")
    
    # Using a sample image URL from Cloudinary
    payload = {
        "image_url": "https://res.cloudinary.com/djtmbtl2f/image/upload/v1784440710/AgroBot/pddt6gjdcabmnidayurb.jpg",
        "filename": "test_disease_scan"
    }
    
    response = requests.post(
        f"{BASE_URL}/predict/disease-detection",
        json=payload
    )
    print_result("Disease Detection", response)
    return response

def test_health_check():
    """Test Health Check Endpoint"""
    print("\n🏥 Testing Health Check Endpoint...")
    
    response = requests.get(f"{BASE_URL}/health")
    print_result("Health Check", response)
    return response

def test_models_status():
    """Test Models Status Endpoint"""
    print("\n📊 Testing Models Status Endpoint...")
    
    response = requests.get(f"{BASE_URL}/api/models")
    print_result("Models Status", response)
    return response

def run_all_tests():
    """Run all model tests"""
    print("\n" + "="*60)
    print("🚀 STARTING MODEL TESTS")
    print("="*60)
    
    # Check if backend is running
    try:
        health = requests.get(f"{BASE_URL}/health", timeout=2)
        if health.status_code != 200:
            print("❌ Backend is not responding. Please make sure the server is running.")
            print("   Run: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload")
            return
    except:
        print("❌ Cannot connect to backend. Please make sure the server is running.")
        print("   Run: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload")
        return
    
    print("✅ Backend is running!\n")
    
    # Test all models
    results = {}
    
    # 1. Health Check
    results["health"] = test_health_check()
    
    # 2. Models Status
    results["models_status"] = test_models_status()
    
    # 3. Crop Recommendation
    results["crop_recommendation"] = test_crop_recommendation()
    
    # 4. Crop Yield
    results["crop_yield"] = test_crop_yield()
    
    # 5. Irrigation
    results["irrigation"] = test_irrigation()
    
    # 6. Fertilizer
    results["fertilizer"] = test_fertilizer()
    
    # 7. Disease Detection
    results["disease_detection"] = test_disease_detection()
    
    # Print Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    success_count = 0
    for name, response in results.items():
        status = "✅" if response and response.status_code == 200 else "❌"
        print(f"{status} {name}: {response.status_code if response else 'Failed'}")
        if response and response.status_code == 200:
            success_count += 1
    
    print(f"\n✅ {success_count}/{len(results)} tests passed")
    print("="*60)

def test_specific_model(model_name):
    """Test a specific model"""
    model_tests = {
        "crop": test_crop_recommendation,
        "yield": test_crop_yield,
        "irrigation": test_irrigation,
        "fertilizer": test_fertilizer,
        "disease": test_disease_detection,
        "health": test_health_check,
        "models": test_models_status
    }
    
    if model_name in model_tests:
        model_tests[model_name]()
    else:
        print(f"❌ Unknown model: {model_name}")
        print(f"Available models: {list(model_tests.keys())}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_specific_model(sys.argv[1])
    else:
        run_all_tests()