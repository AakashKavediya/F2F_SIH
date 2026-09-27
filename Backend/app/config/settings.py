import os
from pathlib import Path
from dotenv import load_dotenv
import torch

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

# Device configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Image settings
IMG_SIZE = 256

# Cloudinary configuration - FIXED
CLOUDINARY_CONFIG = {
    "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME", "djtmbtl2f"),
    "api_key": os.getenv("CLOUDINARY_API_KEY", "176823852135426"),
    "api_secret": os.getenv("CLOUDINARY_API_SECRET", "_nPMF7xi3AgNP0XV-oFv1X1Ra2Y"),
    "secure": True
}

# MongoDB Configuration
MONGODB_CONFIG = {
    "username": os.getenv("MONGODB_USERNAME", "agrobot"),
    "password": os.getenv("MONGODB_PASSWORD", "agrobot"),
    "url": os.getenv("MONGODB_URL", "mongodb+srv://agrobot:agrobot@cluster0.oagxeko.mongodb.net/"),
    "database": os.getenv("MONGODB_DATABASE", "agrobot_db"),
    "collections": {
        "tasks": "tasks",
        "bot_status": "bot_status",
        "task_history": "task_history"
    }
}

# MQTT Configuration
MQTT_CONFIG = {
    "broker": os.getenv("MQTT_BROKER", "broker.hivemq.com"),
    "port": int(os.getenv("MQTT_PORT", 1883)),
    "username": os.getenv("MQTT_USERNAME", "Aakash_Kavediya"),
    "password": os.getenv("MQTT_PASSWORD", "Aakash@2006"),
    "client_id": os.getenv("MQTT_CLIENT_ID", "agrobot_backend"),
    "keepalive": 60,
    "topics": {
        "commands": "agrobot/commands",
        "status": "agrobot/status",
        "response": "agrobot/response",
        "task_update": "agrobot/task/update"
    }
}

# Task Configuration
TASK_CONFIG = {
    "task_duration": 120,  # 2 minutes in seconds
    "task_timeout": 130,   # 2 minutes 10 seconds
    "check_interval": 2,   # Check status every 2 seconds
}

# CORS Settings
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# API Settings
API_VERSION = "1.0.0"
API_TITLE = "AgroBot Control API"
API_DESCRIPTION = "Real-time AgroBot management system with MQTT and MongoDB"