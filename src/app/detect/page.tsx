"use client";

import { useState } from "react";

export default function Detect() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload file first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setResult(data.prediction || "No result");
    } catch (err) {
      console.error(err);
      alert("Error connecting backend");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-purple-700 text-white">

      <h1 className="text-3xl font-bold mb-2">🛡️ VioLens AI</h1>
      <p className="opacity-80 mb-6">
        Smart Violence Detection System (CNN + LSTM)
      </p>

      <div className="bg-white text-black p-6 rounded-xl shadow-lg text-center">

        <h2 className="font-semibold mb-3">📤 Upload Video</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <br />

        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Processing..." : "🚀 Upload & Detect"}
        </button>

        {result && (
          <p className="mt-4 font-semibold text-lg">
            Result: {result}
          </p>
        )}
      </div>

      <div className="mt-6 text-sm opacity-80 text-center">
        💡 <b>Pro Tips:</b>
        <ul>
          <li>• Use short clips</li>
          <li>• Ensure clear visibility</li>
          <li>• Avoid blurry videos</li>
        </ul>
      </div>

    </main>
  );
}
