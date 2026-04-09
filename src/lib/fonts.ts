import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

// Local OpenAI Sans font
export const openAiSans = localFont({
  variable: "--font-openai-sans",
  display: "swap",
  src: [
    {
      path: "../font/open sans woff/OpenAISans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/open sans woff/OpenAISans-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../font/open sans woff/OpenAISans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../font/open sans woff/OpenAISans-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../font/open sans woff/OpenAISans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../font/open sans woff/OpenAISans-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../font/open sans woff/OpenAISans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../font/open sans woff/OpenAISans-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../font/open sans woff/OpenAISans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/open sans woff/OpenAISans-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

// Re-export JetBrains Mono for consistency
export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
