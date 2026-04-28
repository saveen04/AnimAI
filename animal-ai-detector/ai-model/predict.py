"""
Single-image prediction using the trained CNN or base MobileNetV2 for broad inference.
"""
import os
import sys
import numpy as np
from PIL import Image
import tensorflow as tf

MODEL_PATH = os.path.join(os.path.dirname(__file__), "animal_model.h5")
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), "class_names.txt")
IMG_SIZE = (224, 224)

# Common animal classes in ImageNet (for fallback/expansion)
EXTENDED_CLASSES = [
    "cat", "dog", "bird", "lion", "elephant", "tiger", "bear", "rabbit", 
    "monkey", "horse", "zebra", "giraffe", "panda", "fox", "wolf", "deer"
]

def load_model_and_classes():
    # Attempt to load custom model
    if os.path.isfile(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            if os.path.isfile(CLASS_NAMES_PATH):
                with open(CLASS_NAMES_PATH) as f:
                    class_names = [line.strip() for line in f if line.strip()]
            else:
                # If custom model exists but no class_names.txt, use a safe default
                class_names = ["animal_type_" + str(i) for i in range(model.output_shape[-1])]
            return model, class_names
        except:
            pass

    # Fallback/Default: Use MobileNetV2 pre-trained on ImageNet
    # This provides 1000 classes including many animals
    print("Using base MobileNetV2 for broad inference...")
    model = tf.keras.applications.MobileNetV2(weights="imagenet")
    # Note: For base model, we use decode_predictions
    return model, None

def preprocess_image(image_path_or_array):
    if isinstance(image_path_or_array, (np.ndarray, list)):
        img = np.array(image_path_or_array)
        if img.ndim == 2:
            img = np.stack([img] * 3, axis=-1)
        pil = Image.fromarray(img.astype(np.uint8))
    else:
        pil = Image.open(image_path_or_array).convert("RGB")
    pil = pil.resize(IMG_SIZE)
    arr = np.array(pil)
    # MobileNetV2 specific preprocessing
    return tf.keras.applications.mobilenet_v2.preprocess_input(np.expand_dims(arr, axis=0))

def predict(image_path_or_array, model=None, class_names=None):
    if model is None:
        model, class_names = load_model_and_classes()
    
    x = preprocess_image(image_path_or_array)
    pred = model.predict(x, verbose=0)
    
    if class_names is None:
        # Base ImageNet model
        decoded = tf.keras.applications.mobilenet_v2.decode_predictions(pred, top=1)[0][0]
        # decoded is (id, label, prob)
        return decoded[1].replace('_', ' '), float(decoded[2])
    else:
        # Custom trained model
        pred_single = pred[0]
        idx = int(np.argmax(pred_single))
        label = class_names[idx] if idx < len(class_names) else "unknown"
        return label, float(pred_single[idx])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        sys.exit(1)
    label, conf = predict(sys.argv[1])
    print(f"Class: {label}, Confidence: {conf:.4f}")
