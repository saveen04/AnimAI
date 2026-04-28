"""
FastAPI service that loads the trained CNN and exposes /predict for image input.
Expects JSON body: { "image": "<base64_encoded_image>" }
Returns: { "class": "<label>", "confidence": <0-1>, "label": "<label>", "species": "<label>" }
"""
import os
import base64
import io
import numpy as np
from PIL import Image
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

from predict import load_model_and_classes, preprocess_image

app = FastAPI(title="Animal Species Detector API")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "animal_model.h5")

model = None
class_names = []


class PredictRequest(BaseModel):
    image: str  # base64


@app.on_event("startup")
def load_model():
    global model, class_names
    # Enhanced loading handles fallback to ImageNet base model automatically
    model, class_names = load_model_and_classes()


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict")
def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Train and save animal_model.h5 first.")
    try:
        raw = base64.b64decode(req.image)
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        x = preprocess_image(np.array(img))
        pred = model.predict(x, verbose=0)[0]
        idx = int(np.argmax(pred))
        label = class_names[idx] if idx < len(class_names) else "unknown"
        confidence = float(pred[idx])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "class": label,
        "label": label,
        "species": label,
        "confidence": confidence,
        "score": confidence,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
