// lib/sendTelegramAlert.ts
import type { ViolenceReport } from "./gemini";

export interface TelegramResponse {
  success: boolean;
  error?: string;
}

/**
 * Gets the Telegram chat ID from session storage or falls back to environment variable
 */
function getChatId(): string {
  // For client-side (browser) context
  if (typeof window !== "undefined") {
    const sessionChatId = sessionStorage.getItem("telegram_chat_id");
    if (sessionChatId) return sessionChatId;
  }

  // Fallback to environment variable
  return process.env.TELEGRAM_CHAT_ID || "6488581574";
}

/**
 * Sends an immediate alert message when violence is detected, before the detailed report is generated
 */
export async function sendImmediateAlert(
  frames?: string[]
): Promise<TelegramResponse> {
  try {
    const token =
      process.env.TELEGRAM_BOT_TOKEN ||
      "8052607894:AAEXeD0I0Iw7fZbsSuTUj1uHpAEz5LDSDRQ";
    const chatId = getChatId();

    const message =
      `🚨 *ALERT: Possible Violence Detected* 🚨\n\n` +
      `Violence has been detected by the surveillance system.\n` +
      `A detailed report is being generated and will be sent shortly.`;

    console.log("Sending immediate alert message");

    const textMessageUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const textRes = await fetch(textMessageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const textData = await textRes.json();
    if (!textData.ok) {
      console.error("❌ Telegram Error (immediate alert):", textData);
      return { success: false, error: "Failed to send immediate alert" };
    }

    // Send key images if available (max 2 images to avoid spam)
    if (frames && frames.length > 0) {
      console.log(`Attempting to send key images with immediate alert...`);

      // Just send up to 2 images to avoid spamming
      const imagesToSend = frames.slice(0, 2);

      for (let i = 0; i < imagesToSend.length; i++) {
        const frame = imagesToSend[i];

        try {
          // Extract base64 data from the data URL
          const base64Data = frame.split(",")[1];

          if (!base64Data) {
            console.error("Invalid image data format");
            continue;
          }

          // Create form data for multipart/form-data upload
          const formData = new FormData();
          formData.append("chat_id", chatId);

          // Convert base64 to blob
          const byteCharacters = atob(base64Data);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }

          const blob = new Blob(byteArrays, { type: "image/jpeg" });
          formData.append("photo", blob);
          formData.append("caption", `Evidence image ${i + 1}`);

          // Send photo using multipart/form-data
          const photoUrl = `https://api.telegram.org/bot${token}/sendPhoto`;
          const photoRes = await fetch(photoUrl, {
            method: "POST",
            body: formData,
          });

          const photoData = await photoRes.json();

          if (!photoData.ok) {
            console.error(`❌ Telegram Error (photo ${i + 1}):`, photoData);
          } else {
            console.log(`✓ Initial alert image ${i + 1} sent successfully`);
          }
        } catch (imgError) {
          console.error(`❌ Failed to process image ${i + 1}:`, imgError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Immediate Alert Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending immediate alert",
    };
  }
}

export async function sendTelegramAlert(
  report: ViolenceReport
): Promise<TelegramResponse> {
  try {
    const token =
      process.env.TELEGRAM_BOT_TOKEN ||
      "8052607894:AAEXeD0I0Iw7fZbsSuTUj1uHpAEz5LDSDRQ";
    const chatId = getChatId();

    // Create a more detailed message with severity and recommendations
    const severityEmoji = {
      low: "🟡",
      medium: "🟠",
      high: "🔴",
    };

    const message =
      `📊 *Violence Report Analysis Complete*\n\n` +
      `📝 *Summary:*\n${report.summary}\n\n` +
      `${
        severityEmoji[report.severity]
      } *Severity:* ${report.severity.toUpperCase()}\n\n` +
      `📋 *Details:*\n${report.details}\n\n` +
      `🛠️ *Recommendations:*\n${report.recommendations
        .map((r) => `• ${r}`)
        .join("\n")}`;

    console.log("Sending detailed report message");

    const textMessageUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const textRes = await fetch(textMessageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const textData = await textRes.json();
    if (!textData.ok) {
      console.error("❌ Telegram Error (text message):", textData);
      return { success: false, error: "Failed to send text message" };
    }

    // No longer sending images here since they were sent with the immediate alert
    console.log("Detailed report sent without additional images");

    return { success: true };
  } catch (error) {
    console.error("❌ Telegram Alert Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error sending alert",
    };
  }
}
