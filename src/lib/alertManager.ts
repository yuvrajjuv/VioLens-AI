import { generateViolenceReport, type ViolenceReport } from "./gemini";
import { sendTelegramAlert, sendImmediateAlert } from "./sendTelegramAlert";

/**
 * Process frames from surveillance, generate a violence report, and send alert if necessary
 */
export async function processAndAlertIfNeeded(
  frames: string[],
  confidenceScores: number[]
): Promise<{ report: ViolenceReport | null; alertSent: boolean }> {
  try {
    // If confidence scores indicate violence, send an immediate alert
    const hasHighConfidence = confidenceScores.some((score) => score >= 0.8);

    if (hasHighConfidence) {
      console.log(
        "Potential violence detected - sending immediate alert with key images..."
      );
      const immediateResult = await sendImmediateAlert(frames);

      if (!immediateResult.success) {
        console.error(
          `Failed to send immediate alert: ${immediateResult.error}`
        );
      } else {
        console.log("Immediate alert sent successfully!");
      }
    }

    // Generate the violence report using Gemini
    console.log(`Generating violence report from ${frames.length} frames...`);
    const report = await generateViolenceReport(frames, confidenceScores);
    console.log(
      `Report generated with ID: ${report.id}, severity: ${report.severity}`
    );

    // Log frame info for debugging
    console.log(`Report contains ${report.frames.length} images`);
    if (report.frames.length > 0) {
      console.log(
        `First image format check: ${report.frames[0].substring(0, 50)}...`
      );
    }

    // Only send detailed alerts for actual violence or high severity incidents
    if (report.isActualViolence || report.severity === "high") {
      console.log(
        `Violence confirmed - sending detailed report without images...`
      );
      const result = await sendTelegramAlert(report);

      if (!result.success) {
        console.error(`Failed to send detailed report: ${result.error}`);
      } else {
        console.log(`Detailed report sent successfully!`);
      }

      return { report, alertSent: result.success || hasHighConfidence };
    } else {
      console.log(
        `No actual violence detected (${report.severity} severity) - skipping detailed alert`
      );
      // If we sent an immediate alert but the report concludes no violence,
      // we could potentially send a follow-up "all clear" message here
    }

    return { report, alertSent: hasHighConfidence };
  } catch (error) {
    console.error("Error in processAndAlertIfNeeded:", error);
    return { report: null, alertSent: false };
  }
}
