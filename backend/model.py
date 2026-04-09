import cv2
import numpy as np
from tensorflow.keras.models import load_model

# model load
model = load_model("violence_model_lstm.h5")

IMG_SIZE = 64
SEQUENCE_LENGTH = 20

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

    while len(frames) < SEQUENCE_LENGTH:
        frames.append(np.zeros((IMG_SIZE, IMG_SIZE, 3)))

    return np.array(frames)

def predict_video(video_path):
    frames = extract_frames(video_path)
    frames = np.expand_dims(frames, axis=0)

    prediction = model.predict(frames)[0][0]

    if prediction > 0.5:
        return "Violence Detected 🚨"
    else:
        return "No Violence ✅"