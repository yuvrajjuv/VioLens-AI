"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-purple-700 text-white text-center px-4">

      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        🛡️ Violence Detection in Video Using CNN/RNN
      </h1>

      <p className="opacity-80 mb-6">
        AI-powered system for real-time violence detection
      </p>

      <button
        onClick={() => router.push("/detect")}
        className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
      >
        Get Started 🚀
      </button>

      {/* About Section */}
      <div className="mt-10 bg-white text-black p-6 rounded-xl max-w-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">ℹ️ About the Project</h2>
        <p className="text-sm">
          This system detects violence in videos using deep learning.
          It uses CNN for spatial features and LSTM for temporal analysis.
        </p>

        <ul className="mt-3 text-sm">
          <li>✔ Real-time processing</li>
          <li>✔ AI-powered alerts</li>
          <li>✔ User-friendly interface</li>
        </ul>
      </div>

    </main>
  );
}