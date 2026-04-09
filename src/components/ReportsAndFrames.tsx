"use client";

import { Badge } from "@/components/ui/badge";
import { ViolenceReport } from "@/lib/gemini";
import { ViolenceReportsList } from "@/components/ViolenceReportsList";
import { InferenceResult } from "@/lib/inference";

interface ReportsAndFramesProps {
  violenceReports: (ViolenceReport | null)[];
  actualViolence: number;
  falsePositives: number;
  reportCooldown: boolean;
  cooldownTimeLeft: number;
  formatCooldownTime: (seconds: number) => string;
  setViolenceReports: React.Dispatch<
    React.SetStateAction<(ViolenceReport | null)[]>
  >;
  isCapturing: boolean;
  recentFrames: string[];
  inferenceResult: InferenceResult | null;
  cameraInfo: {
    name: string;
    resolution: string;
    fps: number;
  };
}

export default function ReportsAndFrames({
  violenceReports,
  actualViolence,
  falsePositives,
  reportCooldown,
  cooldownTimeLeft,
  formatCooldownTime,
  setViolenceReports,
  isCapturing,
  recentFrames,
  inferenceResult,
  cameraInfo,
}: ReportsAndFramesProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Camera Status Panel */}
      <div className="bg-background/60 backdrop-blur-sm border rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isCapturing ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <h3 className="font-medium text-foreground/90">
              Camera {isCapturing ? "Active" : "Inactive"}
            </h3>
          </div>

          <div className="text-sm text-foreground/70">
            <p>Camera: {cameraInfo.name}</p>
            <p>Resolution: {cameraInfo.resolution}</p>
            <p>FPS: {cameraInfo.fps}</p>
          </div>

          <div className="flex items-center gap-3">
            {reportCooldown && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50 py-1.5 px-3 text-sm font-medium animate-pulse"
              >
                <span className="inline-block mr-1 rounded-full w-2 h-2 bg-blue-500"></span>
                Cooldown: {formatCooldownTime(cooldownTimeLeft)}
              </Badge>
            )}
            {violenceReports.length > 0 && (
              <Badge
                variant="secondary"
                className="py-1.5 px-3 text-sm font-medium"
              >
                {violenceReports.length} Report
                {violenceReports.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Reports Section - Always Visible */}
      <div className="bg-background/60 backdrop-blur-sm border rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-foreground/90">
            Violence Reports
          </h3>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800/50 py-1.5 px-3 text-sm font-medium"
            >
              <span className="inline-block mr-1 rounded-full w-2 h-2 bg-green-500"></span>
              Verified: {actualViolence}
            </Badge>

            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50 py-1.5 px-3 text-sm font-medium"
            >
              <span className="inline-block mr-1 rounded-full w-2 h-2 bg-amber-500"></span>
              False Alerts: {falsePositives}
            </Badge>
          </div>
        </div>

        <ViolenceReportsList
          reports={violenceReports.filter(
            (report): report is ViolenceReport => report !== null
          )}
          onDeleteReport={(id) =>
            setViolenceReports((prev) => prev.filter((r) => r?.id !== id))
          }
        />
      </div>

      {/* Frames Panel */}
      {isCapturing && recentFrames.length > 0 && (
        <div className="bg-background/60 backdrop-blur-sm border rounded-xl p-5 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h3 className="text-base font-semibold text-foreground/90">
              Live Monitoring
            </h3>
            <div className="flex items-center gap-3">
              <Badge className="py-1.5 px-3 bg-foreground/10 text-foreground/90 hover:bg-foreground/15 transition-colors">
                {recentFrames.length} frames captured
              </Badge>

              {inferenceResult && (
                <Badge
                  className={`py-1.5 px-3 font-medium ${
                    inferenceResult.prediction === "Safe"
                      ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400"
                  }`}
                >
                  {inferenceResult.prediction === "Safe" ? (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Safe
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Violence Detected
                    </span>
                  )}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
