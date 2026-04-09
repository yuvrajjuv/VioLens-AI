"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { loadModel, clearModelCache } from "@/lib/model";
import { InferenceSession } from "onnxruntime-web";
import { captureVideoFrame } from "@/lib/frameCapture";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { runInference, InferenceResult } from "@/lib/inference";
import { Progress } from "@/components/ui/progress";
import { ViolenceReport } from "@/lib/gemini";
import { AlertCircle, Clock, Loader2 } from "lucide-react";
import { processAndAlertIfNeeded } from "@/lib/alertManager";
import {
  MAX_FRAMES,
  MAX_VIOLENCE_FRAMES,
  VIOLENCE_THRESHOLD,
  COOLDOWN_PERIOD,
  CAPTURE_INTERVAL,
} from "@/app/demo/_constants/constants";
import Model500Icon from "@/Icon/model500Icon";
import { Notification } from "@/components/ui/Notification";
import { TabsComponent } from "@/app/demo/_component/TabsComponent";

interface CameraFeedProps {
  onBeforeCameraStart?: () => boolean;
}

export default function CameraFeed({
  onBeforeCameraStart,
}: CameraFeedProps = {}) {
  // DOM References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processCanvasRef = useRef<HTMLCanvasElement>(null);

  // Camera and capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [modelUrl, setModelUrl] = useState("/models/model50kv3.onnx");
  const [session, setSession] = useState<typeof InferenceSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // UI state
  const [showReports, setShowReports] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Frame collection
  const [recentFrames, setRecentFrames] = useState<string[]>([]);
  const [processedFrames, setProcessedFrames] = useState<string[]>([]);
  const [inferenceResult, setInferenceResult] =
    useState<InferenceResult | null>(null);

  // Performance metrics
  const lastCapture = useRef<number>(0);

  // Violence detection
  const [violenceDetected, setViolenceDetected] = useState(false);
  const [violenceFrames, setViolenceFrames] = useState<string[]>([]);
  const [violenceScores, setViolenceScores] = useState<number[]>([]);
  const [violenceReports, setViolenceReports] = useState<
    (ViolenceReport | null)[]
  >([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const violenceDetectionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Stats and cooldown
  const [falsePositives, setFalsePositives] = useState(0);
  const [actualViolence, setActualViolence] = useState(0);
  const [reportCooldown, setReportCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const cooldownInterval = useRef<NodeJS.Timeout | null>(null);

  const [showGeneratingReport, setShowGeneratingReport] = useState(true);
  const [showReportCooldown, setShowReportCooldown] = useState(true);

  // Camera control functions
  const startCamera = useCallback(async () => {
    try {
      // Check if we should proceed with starting the camera
      if (onBeforeCameraStart && !onBeforeCameraStart()) {
        console.log("Camera start prevented by onBeforeCameraStart callback");
        return;
      }

      setErrorMessage(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setErrorMessage("Camera access denied. Please check permissions.");
    }
  }, [onBeforeCameraStart]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;

      setStream(null);
      setIsCameraActive(false);
      setIsCapturing(false);
      setRecentFrames([]);
      setProcessedFrames([]);
      setInferenceResult(null);
    }
  }, [stream]);

  // Handle violence detection
  const handleViolenceDetection = useCallback(
    (frame: string, confidenceScore: number) => {
      // Set violence detected flag
      setViolenceDetected(true);

      // Add frame and score to collections if under limit
      setViolenceFrames((prev) =>
        prev.length < MAX_VIOLENCE_FRAMES ? [...prev, frame] : prev
      );

      setViolenceScores((prev) =>
        prev.length < MAX_VIOLENCE_FRAMES ? [...prev, confidenceScore] : prev
      );

      // Reset timeout if exists
      if (violenceDetectionTimeout.current) {
        clearTimeout(violenceDetectionTimeout.current);
      }

      // Reset violence detection if no more violence detected in 5s
      violenceDetectionTimeout.current = setTimeout(() => {
        setViolenceDetected(false);
      }, 5000);
    },
    []
  );

  // Cooldown handling
  const startCooldown = useCallback(() => {
    setReportCooldown(true);
    setCooldownTimeLeft(COOLDOWN_PERIOD);

    if (cooldownInterval.current) {
      clearInterval(cooldownInterval.current);
    }

    cooldownInterval.current = setInterval(() => {
      setCooldownTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownInterval.current!);
          setReportCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Format time as MM:SS
  const formatCooldownTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Frame processing
  const captureFrame = useCallback(async () => {
    const now = performance.now();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const processCanvas = processCanvasRef.current;

    if (!video || !canvas || !processCanvas || !session) return;
    if (now - lastCapture.current < CAPTURE_INTERVAL) return;

    lastCapture.current = now;
    try {
      setIsProcessing(true);

      // Capture and process frame
      const { originalFrame, processedFrame } = captureVideoFrame(
        video,
        canvas,
        processCanvas
      );

      // Update frame collections
      setRecentFrames((prev) => [
        originalFrame,
        ...prev.slice(0, MAX_FRAMES - 1),
      ]);

      if (processedFrame) {
        setProcessedFrames((prev) => [
          processedFrame,
          ...prev.slice(0, MAX_FRAMES - 1),
        ]);
      }

      // Run inference
      if (session && processCanvas) {
        try {
          const result = await runInference(processCanvas, session, modelUrl);
          setInferenceResult(result);

          // Check for violence
          if (
            result?.prediction === "Violence" &&
            result?.confidence >= VIOLENCE_THRESHOLD
          ) {
            handleViolenceDetection(originalFrame, result.confidence);
          }

          setErrorMessage(null);
        } catch (err) {
          console.error("Inference failed:", err);
          setErrorMessage("Inference failed. Check console for details.");
        }
      }
    } catch (err) {
      console.error("Frame capture failed:", err);
      setErrorMessage("Frame capture failed. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  }, [session, handleViolenceDetection, modelUrl]);

  // Report generation effect
  useEffect(() => {
    // Check conditions for report generation
    if (
      violenceFrames.length >= MAX_VIOLENCE_FRAMES &&
      !isGeneratingReport &&
      violenceDetected &&
      !reportCooldown
    ) {
      const generateReport = async () => {
        setIsGeneratingReport(true);
        try {
          // Process frames and send alert if needed
          const result = await processAndAlertIfNeeded(
            [...violenceFrames],
            [...violenceScores]
          );

          if (result.report) {
            // Update stats
            if (result.report.isActualViolence) {
              setActualViolence((prev) => prev + 1);
            } else {
              setFalsePositives((prev) => prev + 1);
            }

            // Update UI state
            if (result.report) {
              setViolenceReports((prev) => [...prev, result.report]);
            }

            // Show alert status
            if (result.alertSent) {
              setErrorMessage("Alert sent to monitoring team!");
              setTimeout(() => setErrorMessage(null), 5000);
            }

            setViolenceFrames([]);
            setViolenceScores([]);
            setViolenceDetected(result.report.isActualViolence);

            // Start cooldown period
            startCooldown();
          }
        } catch (error) {
          console.error("Failed to generate report:", error);
          setErrorMessage(
            "Failed to generate report. Check console for details."
          );
        } finally {
          setIsGeneratingReport(false);
        }
      };

      generateReport();
    }
  }, [violenceFrames, violenceDetected, reportCooldown, startCooldown]);

  // Animation frame for continuous capture
  useEffect(() => {
    let animationFrame: number;

    if (isCapturing) {
      const processFrame = () => {
        captureFrame();
        animationFrame = requestAnimationFrame(processFrame);
      };

      animationFrame = requestAnimationFrame(processFrame);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isCapturing, captureFrame]);

  // Clean up resources
  useEffect(() => {
    return () => {
      // Clean up stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Clean up timers
      if (violenceDetectionTimeout.current) {
        clearTimeout(violenceDetectionTimeout.current);
      }
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }

      // Clean up models
      clearModelCache();
    };
  }, [stream]);

  // Reset violence detection when stopping
  useEffect(() => {
    if (!isCapturing && violenceDetectionTimeout.current) {
      clearTimeout(violenceDetectionTimeout.current);
      violenceDetectionTimeout.current = null;
      setViolenceDetected(false);
    }
  }, [isCapturing]);

  // Load model when URL changes
  useEffect(() => {
    setInferenceResult(null);
    setRecentFrames([]);
    setProcessedFrames([]);

    loadModel(modelUrl)
      .then(setSession)
      .catch((err) => {
        console.error("Model loading failed:", err);
        setSession(null);
        setErrorMessage("Failed to load model. Check console for details.");
      });
  }, [modelUrl]);

  // Camera information
  const cameraInfo = {
    name: "Virtual Camera",
    resolution: "1280x720",
    fps: 30,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-full px-6 lg:px-12 mx-auto">
      {/* Left Column: Camera Feed */}
      <div className="flex flex-col gap-6">
        <Card className="w-full bg-transparent h-fit border-none">
          <CardContent className="p-0">
            <div className="relative w-full">
              {/* Inactive camera overlay */}
              {!isCameraActive && (
                <div className="absolute inset-0 bg-muted/50 flex flex-col items-center justify-center rounded-lg z-10">
                  <Model500Icon />
                  <div className="bg-background/80 px-4 py-2 rounded-md backdrop-blur-sm">
                    <p className="text-muted-foreground font-medium">
                      Camera inactive
                    </p>
                  </div>
                </div>
              )}

              {/* Video element */}
              <video
                ref={videoRef}
                autoPlay
                muted
                className="rounded-lg border border-border w-full h-auto aspect-video bg-muted/20"
              />

              {/* Inference results overlay */}
              {inferenceResult && (
                <div className="absolute bottom-4 right-4 bg-background/80 p-3 rounded-lg backdrop-blur-sm border shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-lg font-bold ${
                        inferenceResult.prediction === "Safe"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {inferenceResult.prediction === "Safe"
                        ? "✅ Safe"
                        : "⚠️ Violence"}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {/* <div className="flex justify-between text-xs">
                      <span>Confidence:</span>
                      <span className="font-medium">
                        {Math.round(inferenceResult.confidence * 100)}%
                      </span>
                    </div> */}
                    <Progress
                      value={inferenceResult.confidence * 100}
                      className={`h-1.5 ${
                        inferenceResult.prediction === "Safe"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {inferenceResult.inferenceTime.toFixed(2)}ms
                    </div>
                  </div>
                </div>
              )}

              {/* Status indicators */}
              {isProcessing && (
                <div className="absolute top-2 left-2">
                  <Badge
                    variant="outline"
                    className="bg-background/50 animate-pulse"
                  >
                    Processing...
                  </Badge>
                </div>
              )}

              {errorMessage && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-md backdrop-blur-sm">
                  {errorMessage}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Camera Controls */}
        <div className="flex gap-4 w-full justify-center items-center">
          <Button
            onClick={isCameraActive ? stopCamera : startCamera}
            variant={isCameraActive ? "destructive" : "accent"}
            size="lg"
          >
            {isCameraActive ? "Stop Camera" : "Start Camera"}
          </Button>
          <Button
            onClick={() => setIsCapturing((prev) => !prev)}
            disabled={!isCameraActive}
            variant={isCapturing ? "secondary" : "minimal"}
            size="lg"
          >
            {isCapturing ? (
              <>
                <span className="mr-2">●</span> Stop Capturing
              </>
            ) : (
              "Start Capturing"
            )}
          </Button>
        </div>

        {/* Alert notifications */}
        {violenceDetected && (
          <Notification
            position="bottom-right"
            color="red"
            icon={<AlertCircle className="h-5 w-5" />}
            title="Potential Violence Detected"
            progress={{
              value: (violenceFrames.length / MAX_VIOLENCE_FRAMES) * 100,
              label: `${violenceFrames.length}/${MAX_VIOLENCE_FRAMES}`,
            }}
          />
        )}

        {isGeneratingReport && showGeneratingReport && (
          <Notification
            position="bottom-center"
            color="amber"
            icon={<Loader2 className="h-5 w-5 animate-spin" />}
            title="Generating report..."
            onClose={() => setShowGeneratingReport(false)}
          />
        )}

        {reportCooldown && showReportCooldown && (
          <Notification
            position="top-left"
            color="blue"
            icon={<Clock className="h-5 w-5" />}
            title={`Cooldown: ${formatCooldownTime(cooldownTimeLeft)}`}
            onClose={() => setShowReportCooldown(false)}
          />
        )}

        {/* Hidden canvases */}
        <canvas ref={canvasRef} width={640} height={480} className="hidden" />
        <canvas
          ref={processCanvasRef}
          width={128}
          height={128}
          className="hidden"
        />
      </div>

      {/* Right Column: Analytics and Controls */}
      <div className="flex flex-col gap-6 mt-6">
        <TabsComponent
          modelUrl={modelUrl}
          setModelUrl={setModelUrl}
          session={!!session}
          originalFrames={recentFrames}
          processedFrames={processedFrames}
          isCapturing={isCapturing}
          showReports={showReports}
          setShowReports={setShowReports}
          violenceReports={violenceReports}
          actualViolence={actualViolence}
          falsePositives={falsePositives}
          reportCooldown={reportCooldown}
          cooldownTimeLeft={cooldownTimeLeft}
          formatCooldownTime={formatCooldownTime}
          setViolenceReports={setViolenceReports}
          inferenceResult={inferenceResult}
          cameraInfo={cameraInfo} // Pass cameraInfo here
        />

        {/* Remove duplicate Report Controls and Stats section */}

        {/* Remove duplicate Reports List section */}

        {/* Remove duplicate Frames Controls section */}
      </div>
    </div>
  );
}
