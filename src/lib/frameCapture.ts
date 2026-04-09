import { preprocessFrame } from "./preprocess";

interface CaptureResult {
  originalFrame: string;
  processedFrame: string | null;
}

/**
 * Captures and processes a frame from a video element
 * @param video Video element to capture from
 * @param canvas Canvas for original frame capture
 * @param processCanvas Canvas for processing (smaller size)
 * @returns Original and processed frames as data URLs
 */
export function captureVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  processCanvas: HTMLCanvasElement
): CaptureResult {
  const ctx = canvas.getContext("2d");
  const processCtx = processCanvas.getContext("2d");

  if (!ctx || !processCtx) {
    throw new Error("Could not get canvas contexts");
  }

  // Draw original frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frameData = canvas.toDataURL("image/jpeg");

  // Create downscaled version for preprocessing
  processCtx.drawImage(video, 0, 0, processCanvas.width, processCanvas.height);

  try {
    // Process the frame
    const processed = preprocessFrame(processCanvas);

    // Visualize the processed data
    const processedImageData = processCtx.createImageData(
      processCanvas.width,
      processCanvas.height
    );

    for (let i = 0, j = 0; i < processed.length; i += 3, j += 4) {
      processedImageData.data[j] = processed[i] * 255; // R
      processedImageData.data[j + 1] = processed[i + 1] * 255; // G
      processedImageData.data[j + 2] = processed[i + 2] * 255; // B
      processedImageData.data[j + 3] = 255; // Alpha
    }

    // Draw the processed image data
    processCtx.putImageData(processedImageData, 0, 0);
    const processedFrameData = processCanvas.toDataURL("image/jpeg");

    return {
      originalFrame: frameData,
      processedFrame: processedFrameData,
    };
  } catch (err) {
    console.error("Error processing frame:", err);
    return {
      originalFrame: frameData,
      processedFrame: null,
    };
  }
}
