import os

MODEL_PATH = "violence_model_lstm.h5"

model = None

def load_model_safely():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            print("Model file found, but TensorFlow disabled for deployment.")
            # Future: load model here when TensorFlow supported
            model = "loaded"
        else:
            print("Model file not found, running in dummy mode.")
            model = None
    except Exception as e:
        print("Error loading model:", e)
        model = None


def predict_video(video_path):
    # dummy prediction for now
    if model is None:
        return {
            "prediction": "Model not available",
            "confidence": 0.0
        }

    # future: real prediction logic
    return {
        "prediction": "Violence",
        "confidence": 0.85
    }


# Load model on startup
load_model_safely()
