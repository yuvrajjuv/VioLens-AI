import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with key
const API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyDp2luq01bXhCLfJZUli2FSouO0DI00W4E";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ViolenceReport {
  id: string;
  timestamp: number;
  summary: string;
  details: string;
  severity: "low" | "medium" | "high";
  recommendations: string[];
  frames: string[];
  isActualViolence: boolean;
}

/**
 * Select representative frames based on confidence scores
 */
function selectRepresentativeFrames(
  frames: string[],
  confidenceScores: number[],
  maxFrames: number,
  threshold: number = 0.5
): string[] {
  const framesWithScores = frames
    .map((frame, index) => ({ frame, score: confidenceScores[index] || 0 }))
    .filter((item) => item.score >= threshold);
  if (framesWithScores.length === 0) {
    // Fallback: use highest scoring frames if none pass the threshold.
    const fallback = frames
      .map((frame, index) => ({ frame, score: confidenceScores[index] || 0 }))
      .sort((a, b) => b.score - a.score);
    return fallback.slice(0, maxFrames).map((item) => item.frame);
  }
  if (framesWithScores.length <= maxFrames)
    return framesWithScores.map((item) => item.frame);
  return framesWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxFrames)
    .map((item) => item.frame);
}

/**
 * Generate a unique ID for reports
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * Generate a violence report using Gemini AI
 */
export async function generateViolenceReport(
  frames: string[],
  confidenceScores: number[]
): Promise<ViolenceReport> {
  try {
    if (!API_KEY) {
      throw new Error("Gemini API key missing");
    }

    // Use updated frame selection with threshold.
    const frameSubset = selectRepresentativeFrames(frames, confidenceScores, 8);

    // Directly map frames to Gemini-compatible format.
    const imageParts = frameSubset.map((frame) => ({
      inlineData: {
        data: frame.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
        mimeType: "image/jpeg",
      },
    }));

    // Updated prompt with stricter instructions to minimize false positives.
    const prompt = `
    You are a security analysis expert. I'm showing you frames from a surveillance system.
    
    Analyze the frames and provide:
    1. A brief summary (2-3 sentences).
    2. A detailed description of any concerning behavior.
    3. A severity assessment: low, medium, or high.
    4. Clear recommendations for response.
    5. MOST IMPORTANTLY: Only mark as violent if there is clear, unmistakable physical violence (e.g. assault or weapons). Do not flag ambiguous or low-evidence scenes.
    
    Format as JSON:
    {
      "summary": "Brief overview",
      "details": "Detailed description",
      "severity": "low|medium|high",
      "recommendations": ["Recommendation 1", "Recommendation 2"],
      "isActualViolence": true|false
    }
    
    RESPOND WITH JSON ONLY.`;

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();

    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [
      null,
      text,
    ];
    const jsonContent = jsonMatch[1].trim();
    const parsedResponse = JSON.parse(jsonContent);

    // Create and return report
    return {
      id: generateId(),
      timestamp: Date.now(),
      summary: parsedResponse.summary,
      details: parsedResponse.details,
      severity: parsedResponse.severity as "low" | "medium" | "high",
      recommendations: parsedResponse.recommendations,
      frames: frameSubset, // Ensure we're passing the correct frames for alerts
      isActualViolence: Boolean(parsedResponse.isActualViolence),
    };
  } catch (error) {
    console.error("Error generating violence report:", error);
    throw error;
  }
}
