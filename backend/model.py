import numpy as np
import os

MODEL_PATH = "violence_model_lstm.h5"

model = None

def load_model_safely():
    global model
    try:
        from tensorflow.keras.models import load_model
        if os.path.exists(MODEL_PATH):
            model = load_model(MODEL_PATH)
            print("✅ Model loaded successfully")
        else:
            print("⚠️ Model file not found")
    except Exception as e:
        print("❌ Model load failed:", e)
        model = None

load_model_safely()


def predict_dummy():
    # fallback if model not loaded
    return {"prediction": "no_model", "confidence": 0.0}


def predict(input_data):
    if model is None:
        return predict_dummy()
    
    try:
        # example prediction (adjust according to your input)
        input_data = np.array(input_data)
        input_data = np.expand_dims(input_data, axis=0)

        pred = model.predict(input_data)
        return {
            "prediction": float(pred[0][0]),
            "confidence": float(np.max(pred))
        }
    except Exception as e:
        return {"error": str(e)}