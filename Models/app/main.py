from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from PIL import Image
import torchvision.transforms as transforms
import torch
import numpy as np
import cv2
import uuid
from pathlib import Path

from app.model import build_model

app = FastAPI(title="Plant Disease Segmentation API")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BASE_DIR = Path(__file__).resolve().parent
CHECKPOINT_PATH = BASE_DIR / "best_model_tuned.pth"
PREDICTIONS_DIR = BASE_DIR / "predictions"

# -----------------------------
# Load model
# -----------------------------
model = build_model()

checkpoint = torch.load(
    CHECKPOINT_PATH,
    map_location=DEVICE
)

model.load_state_dict(checkpoint["model_state_dict"])
model.to(DEVICE)
model.eval()

print("✅ Model Loaded Successfully")

# -----------------------------
# Transform
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

PREDICTIONS_DIR.mkdir(exist_ok=True)

# -----------------------------
# Root
# -----------------------------
@app.get("/")
def home():

    return {
        "message":"Plant Disease Segmentation API Running"
    }

# -----------------------------
# Prediction Endpoint
# -----------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    image = Image.open(file.file).convert("RGB")

    original = np.array(image)

    x = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():

        pred = model(x)

        pred = torch.sigmoid(pred)

        pred = (pred > 0.5).float()

    mask = pred.squeeze().cpu().numpy()

    mask = (mask*255).astype(np.uint8)

    mask = cv2.resize(
        mask,
        (original.shape[1], original.shape[0])
    )

    overlay = original.copy()

    overlay[mask>0] = [255,0,0]

    output = cv2.addWeighted(
        original,
        0.7,
        overlay,
        0.3,
        0
    )

    filename = f"{uuid.uuid4().hex}.png"

    save_path = PREDICTIONS_DIR / filename

    cv2.imwrite(
        str(save_path),
        cv2.cvtColor(output,cv2.COLOR_RGB2BGR)
    )

    return {
        "success":True,
        "prediction":filename,
        "download":f"/result/{filename}"
    }

# -----------------------------
# Download prediction
# -----------------------------
@app.get("/result/{filename}")
def result(filename:str):

    return FileResponse(
        str(PREDICTIONS_DIR / filename)
    )