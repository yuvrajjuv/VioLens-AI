import { InferenceSession, env } from "onnxruntime-web";
import { warmupInference } from "./inference";

// Configure ONNX runtime for better performance
env.wasm.numThreads = navigator.hardwareConcurrency || 4;
env.wasm.simd = true;

// Cache loaded models to avoid redundant loading
const modelCache: Record<string, typeof InferenceSession> = {};

/**
 * Load an ONNX model with caching and warmup
 */
export async function loadModel(
  modelUrl: string
): Promise<typeof InferenceSession> {
  try {
    // Return cached model if available
    if (modelCache[modelUrl]) {
      console.log("🧠 Using cached model:", modelUrl);
      return modelCache[modelUrl];
    }

    console.log("🔄 Loading model:", modelUrl);

    // Create optimized session
    const session = await InferenceSession.create(modelUrl, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });

    // Cache and warm up
    modelCache[modelUrl] = session;
    await warmupInference(session);

    console.log("🧠 Model loaded and ready:", modelUrl);
    return session;
  } catch (error) {
    console.error("❌ Failed to load ONNX model:", error);
    throw error;
  }
}

/**
 * Clear model cache (for cleanup or switching models)
 */
export function clearModelCache(modelUrl?: string): void {
  if (modelUrl) {
    delete modelCache[modelUrl];
  } else {
    Object.keys(modelCache).forEach((key) => delete modelCache[key]);
  }
}
