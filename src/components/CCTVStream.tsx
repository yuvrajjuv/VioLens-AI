// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Loader2 } from "lucide-react";
// import Hls from "hls.js";

// export interface CCTVStreamProps {
//   streamUrl: string;
//   width?: string | number;
//   height?: string | number;
//   onError?: (error: Error) => void;
//   onLoad?: () => void;
// }

// export function CCTVStream({
//   streamUrl,
//   width = "100%",
//   height = "100%",
//   onError,
//   onLoad,
// }: CCTVStreamProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [streamType, setStreamType] = useState<
//     "direct" | "hls" | "rtsp" | "mjpeg"
//   >("direct");

//   useEffect(() => {
//     setIsLoading(true);
//     setError(null);

//     // Clean up previous HLS instance if exists
//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }

//     // Detect stream type
//     if (streamUrl.startsWith("rtsp://")) {
//       setStreamType("rtsp");
//     } else if (streamUrl.endsWith(".m3u8")) {
//       setStreamType("hls");
//     } else if (streamUrl.includes(".mjpg") || streamUrl.includes(".mjpeg")) {
//       setStreamType("mjpeg");
//     } else {
//       setStreamType("direct");
//     }

//     // Handle stream type
//     const loadStream = async () => {
//       try {
//         if (streamType === "direct") {
//           // Direct camera feed through HTML video element
//           if (videoRef.current) {
//             videoRef.current.src = streamUrl;
//             videoRef.current.load();
//           }
//         } else if (streamType === "hls") {
//           try {
//             if (Hls.isSupported() && videoRef.current) {
//               const hls = new Hls({
//                 maxBufferLength: 30,
//                 maxMaxBufferLength: 60,
//                 maxBufferSize: 60 * 1000 * 1000, // 60MB
//                 maxBufferHole: 0.5,
//                 lowLatencyMode: true,
//               });

//               hlsRef.current = hls;
//               hls.loadSource(streamUrl);
//               hls.attachMedia(videoRef.current);

//               hls.on(Hls.Events.MANIFEST_PARSED, () => {
//                 if (videoRef.current) {
//                   videoRef.current
//                     .play()
//                     .catch((e) =>
//                       console.error("Failed to play HLS stream:", e)
//                     );
//                 }
//               });

//               hls.on(Hls.Events.ERROR, (event, data) => {
//                 if (data.fatal) {
//                   console.error("Fatal HLS error:", data);
//                   const err = new Error(`HLS error: ${data.type}`);
//                   setError(err);
//                   if (onError) onError(err);
//                 }
//               });
//             } else {
//               // Try native HLS support as fallback
//               if (
//                 videoRef.current &&
//                 videoRef.current.canPlayType("application/vnd.apple.mpegurl")
//               ) {
//                 videoRef.current.src = streamUrl;
//                 videoRef.current.load();
//               } else {
//                 throw new Error(
//                   "HLS not supported in this browser and HLS.js not available"
//                 );
//               }
//             }
//           } catch (err) {
//             console.error("Failed to load HLS.js or stream:", err);
//             const error =
//               err instanceof Error
//                 ? err
//                 : new Error("Failed to load HLS stream");
//             setError(error);
//             if (onError) onError(error);
//           }
//         } else if (streamType === "rtsp") {
//           // RTSP streams can't be played directly in the browser
//           setError(
//             new Error(
//               "RTSP streaming requires a WebRTC gateway or RTSP-to-WebRTC proxy"
//             )
//           );
//           if (onError)
//             onError(
//               new Error("RTSP streaming requires additional server setup")
//             );
//         } else if (streamType === "mjpeg") {
//           // For MJPEG streams, we'll use an img tag with auto-refresh
//           if (containerRef.current) {
//             const imgElement = document.createElement("img");
//             imgElement.src = streamUrl;
//             imgElement.style.width = "100%";
//             imgElement.style.height = "100%";
//             imgElement.style.objectFit = "contain";

//             // Clear container and add image
//             containerRef.current.innerHTML = "";
//             containerRef.current.appendChild(imgElement);

//             // Hide video element
//             if (videoRef.current) {
//               videoRef.current.style.display = "none";
//             }

//             // Consider stream loaded
//             setIsLoading(false);
//             if (onLoad) onLoad();
//           }
//         }
//       } catch (err) {
//         console.error("Stream loading error:", err);
//         const error =
//           err instanceof Error ? err : new Error("Failed to load stream");
//         setError(error);
//         if (onError) onError(error);
//       }
//     };

//     loadStream();

//     // Cleanup function
//     return () => {
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//         hlsRef.current = null;
//       }
//     };
//   }, [streamUrl, streamType, onError, onLoad]);

//   // Handle video events
//   const handleLoadedData = () => {
//     setIsLoading(false);
//     if (onLoad) onLoad();
//   };

//   const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
//     console.error("Video element error:", e);
//     setIsLoading(false);
//     const error = new Error("Failed to load video stream");
//     setError(error);
//     if (onError) onError(error);
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="relative bg-black rounded-md overflow-hidden"
//       style={{ width, height }}
//     >
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
//           <Loader2 className="h-8 w-8 animate-spin text-white" />
//         </div>
//       )}

//       {error && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
//           <div className="text-center p-4 max-w-[80%]">
//             <p className="text-red-400 font-medium mb-2">Stream Error</p>
//             <p className="text-white text-sm">{error.message}</p>

//             {streamType === "rtsp" && (
//               <div className="mt-4 text-xs text-gray-300">
//                 <p>
//                   RTSP streams require a proxy server to convert to WebRTC or
//                   HLS.
//                 </p>
//                 <p className="mt-1">
//                   Try using an HLS stream instead if available from your camera.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {streamType !== "mjpeg" && (
//         <video
//           ref={videoRef}
//           className="w-full h-full object-contain"
//           autoPlay
//           playsInline
//           muted
//           onLoadedData={handleLoadedData}
//           onError={handleError}
//           style={{ display: error ? "none" : "block" }}
//         />
//       )}
//     </div>
//   );
// }
