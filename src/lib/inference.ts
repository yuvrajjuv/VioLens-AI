import { InferenceSession, Tensor } from "onnxruntime-web";
import { preprocessFrame } from "./preprocess";

export interface InferenceResult {
  prediction: string;
  confidence: number;
  inferenceTime: number;
  timestamp: number;
}

/**
 * Run inference on a single frame.
 * Updated to handle different model input requirements.
 */
export async function runInference(
  canvas: HTMLCanvasElement,
  session: typeof InferenceSession,
  modelPath?: string // this parameter represents the modelPath
): Promise<InferenceResult> {
  const startTime = performance.now();
  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];

  console.log("Session properties:", Object.keys(session));
  console.log("InputNames:", session.inputNames);

  let inputTensor: typeof Tensor;

  // Identify model type
  const isBiLSTM = modelPath?.toLowerCase().includes("bilstm");
  const isMobileNetV3 = modelPath?.includes("model50kv3.onnx");

  console.log("Using BiLSTM model:", isBiLSTM);
  console.log("Using MobileNetV3 model:", isMobileNetV3);

  if (isBiLSTM) {
    // For bilstm, create a 5D tensor with sequence length
    const SEQUENCE_LENGTH = 20;
    const singleFrame = preprocessFrame(canvas, modelPath);

    // Log the frame size to verify it matches our expectations
    console.log("Frame size:", singleFrame.length);

    const frameSize = singleFrame.length; // should be 128*128*3
    const sequenceData = new Float32Array(SEQUENCE_LENGTH * frameSize);

    // Duplicate the same frame for each sequence position
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      sequenceData.set(singleFrame, i * frameSize);
    }

    // [batch, sequence, height, width, channels]
    inputTensor = new Tensor("float32", sequenceData, [
      1,
      SEQUENCE_LENGTH,
      128,
      128,
      3,
    ]);

    console.log("Created tensor with shape:", [
      1,
      SEQUENCE_LENGTH,
      128,
      128,
      3,
    ]);
  } else {
    const preprocessedData = preprocessFrame(canvas, modelPath);

    // Use different dimensions based on model type
    if (isMobileNetV3) {
      // Fix tensor shape - the error shows a mismatch between tensor size and data length
      // 224*224*3 = 150528 (tensor size) vs 49152 (data length from 128*128*3)
      // The model expects [1, 3, 224, 224] (channels first format) not [1, 224, 224, 3]
      inputTensor = new Tensor("float32", preprocessedData, [1, 224, 224, 3]);
      console.log(
        "Using 224x224 input for MobileNetV3 in channels-first format"
      );
    } else {
      inputTensor = new Tensor("float32", preprocessedData, [1, 128, 128, 3]);
    }
  }

  // Run inference
  try {
    const feeds = { [inputName]: inputTensor };
    console.log("Running inference with input shape:", inputTensor.dims);
    const outputMap = await session.run(feeds);

    // Process output
    const outputTensor = outputMap[outputName];
    const outputData = outputTensor.data as Float32Array;
    const inferenceTime = performance.now() - startTime;

    let confidence: number;
    let prediction: string;
    if (outputData.length === 1) {
      confidence = outputData[0];
      prediction = confidence >= 0.7 ? "Violence" : "Safe";
    } else {
      const safeScore = outputData[0];
      const violenceScore = outputData[1];
      prediction = violenceScore > safeScore ? "Violence" : "Safe";
      confidence = Math.max(safeScore, violenceScore);
    }

    inputTensor.dispose();

    return {
      prediction,
      confidence,
      inferenceTime,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error during inference:", error);
    throw error;
  }
}

/**
 * Pre-warm the model with a dummy run.
 */
export async function warmupInference(
  session: typeof InferenceSession,
  modelPath?: string
): Promise<void> {
  const canvas = document.createElement("canvas");

  // Set canvas size based on model requirements
  const size = modelPath?.includes("model50kv3.onnx") ? 224 : 128;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size, size);
    try {
      await runInference(canvas, session, modelPath);
      console.log("🔥 Inference pipeline warmed up");
    } catch (e) {
      console.warn("Warmup failed:", e);
    }
  }
}
