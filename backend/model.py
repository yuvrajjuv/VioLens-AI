import cv2
import numpy as np
import os
from tensorflow.keras.models import load_model

# =========================
# CONFIG
# =========================
MODEL_PATH = "violence_model_lstm.h5"
IMG_SIZE = 64
SEQUENCE_LENGTH = 20

# =========================
# LOAD MODEL (SAFE)
# =========================
model = None

if os.path.exists(MODEL_PATH):
    print("✅ Loading model...")
    model = load_model(MODEL_PATH)
else:
    print("⚠️ Model file not found. Running in dummy mode.")

# =========================
# FRAME EXTRACTION
# =========================
def extract_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    frames = []

    while len(frames) < SEQUENCE_LENGTH:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
        frame = frame / 255.0
        frames.append(frame)

    cap.release()

    # padding if frames less
    while len(frames) < SEQUENCE_LENGTH:
        frames.append(np.zeros((IMG_SIZE, IMG_SIZE, 3)))

    return np.array(frames)

# =========================
# PREDICTION
# =========================
def predict_video(video_path):
    
    # 🔥 अगर model नहीं है
    if model is None:
        return "⚠️ Model not loaded (demo mode)"

    frames = extract_frames(video_path)
    frames = np.expand_dims(frames, axis=0)

    prediction = model.predict(frames)[0][0]

    if prediction > 0.5:
        return "🚨 Violence Detected"
    else:
        return "✅ No Violence"