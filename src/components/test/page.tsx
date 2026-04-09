// "use client";

// import React, { forwardRef, useRef, useCallback, memo } from "react";
// import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { AnimatedBeam } from "@/components/magicui/animated-beam";

// // Types for component props
// interface SquareProps extends React.HTMLAttributes<HTMLDivElement> {
//   className?: string;
//   children?: React.ReactNode;
//   label: string; // For accessibility
// }

// interface IconProps {
//   className?: string;
//   title: string;
// }

// // Memoized Square component with accessibility improvements
// const Square = memo(
//   forwardRef<HTMLDivElement, SquareProps>(
//     ({ className, children, label, ...props }, ref) => {
//       return (
//         <motion.div
//           ref={ref}
//           role="img"
//           aria-label={label}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           whileHover={{ scale: 1.05 }}
//           className={cn(
//             "z-10 flex size-16 items-center justify-center rounded-xl border-2 bg-foreground p-3",
//             "shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
//             "focus:outline-none focus:ring-2 focus:ring-blue-500",
//             "transition-transform duration-200",
//             className
//           )}
//           tabIndex={0}
//           {...(props as HTMLMotionProps<"div">)}
//         >
//           {children}
//         </motion.div>
//       );
//     }
//   )
// );

// Square.displayName = "Square";

// // Optimized SVG icons with proper accessibility
// const Icons = {
//   camera: Object.assign(
//     memo(({ className, title }: IconProps) => (
//       <svg
//         viewBox="0 0 24 24"
//         className={className}
//         aria-hidden="true"
//         role="img"
//       >
//         <title>{title}</title>
//         <path
//           d="M12 15.2C13.7674 15.2 15.2 13.7674 15.2 12C15.2 10.2326 13.7674 8.8 12 8.8C10.2326 8.8 8.8 10.2326 8.8 12C8.8 13.7674 10.2326 15.2 12 15.2Z"
//           fill="currentColor"
//         />
//         <path
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M16.2 4H7.8C6.11984 4 4.8 5.31984 4.8 7V17C4.8 18.6802 6.11984 20 7.8 20H16.2C17.8802 20 19.2 18.6802 19.2 17V7C19.2 5.31984 17.8802 4 16.2 4ZM12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
//           fill="currentColor"
//         />
//       </svg>
//     )),
//     { displayName: "CameraIcon" }
//   ),

//   stream: Object.assign(
//     memo(({ className, title }: IconProps) => (
//       <svg
//         viewBox="0 0 24 24"
//         className={className}
//         aria-hidden="true"
//         role="img"
//       >
//         <title>{title}</title>
//         <path d="M4 4h16v16H4z" fill="currentColor" />
//       </svg>
//     )),
//     { displayName: "StreamIcon" }
//   ),

//   ai: Object.assign(
//     memo(({ className, title }: IconProps) => (
//       <svg
//         viewBox="0 0 24 24"
//         className={className}
//         aria-hidden="true"
//         role="img"
//       >
//         <title>{title}</title>
//         <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="currentColor" />
//       </svg>
//     )),
//     { displayName: "AIIcon" }
//   ),

//   analytics: Object.assign(
//     memo(({ className, title }: IconProps) => (
//       <svg
//         viewBox="0 0 24 24"
//         className={className}
//         aria-hidden="true"
//         role="img"
//       >
//         <title>{title}</title>
//         <path
//           d="M3 13h2v-2H3v2zm4 0h2v-4H7v4zm4 0h2v-6h-2v6zm4 0h2v-8h-2v8zm4 0h2v-10h-2v10z"
//           fill="currentColor"
//         />
//       </svg>
//     )),
//     { displayName: "AnalyticsIcon" }
//   ),

//   alert: Object.assign(
//     memo(({ className, title }: IconProps) => (
//       <svg
//         viewBox="0 0 24 24"
//         className={className}
//         aria-hidden="true"
//         role="img"
//       >
//         <title>{title}</title>
//         <path
//           d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15h-1v-1h1v1zm0-3h-1V7h1v7z"
//           fill="currentColor"
//         />
//       </svg>
//     )),
//     { displayName: "AlertIcon" }
//   ),
// };

// // Main component with performance optimizations
// const AISurveillanceFlow = Object.assign(
//   memo(() => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const cameraRef = useRef<HTMLDivElement>(null);
//     const streamRef = useRef<HTMLDivElement>(null);
//     const aiRef = useRef<HTMLDivElement>(null);
//     const analyticsRef = useRef<HTMLDivElement>(null);
//     const alertRef = useRef<HTMLDivElement>(null);

//     // Memoized handler for any interactive features
//     const handleInteraction = useCallback(() => {
//       // Add interaction handling logic here
//     }, []);

//     return (
//       <div
//         className="relative text-accent flex w-full items-center justify-center overflow-hidden py-50 p-10"
//         ref={containerRef}
//         role="region"
//         aria-label="AI Surveillance Flow Diagram"
//       >
//         <div className="flex size-full max-w-3xl flex-col items-stretch justify-between">
//           <div className="flex justify-between">
//             <Square
//               ref={cameraRef}
//               label="Camera Input"
//               onClick={handleInteraction}
//             >
//               <Icons.camera title="Camera Icon" />
//             </Square>
//             <Square
//               ref={streamRef}
//               label="Data Stream"
//               onClick={handleInteraction}
//             >
//               <Icons.stream title="Stream Icon" />
//             </Square>
//           </div>

//           <div className="flex justify-center">
//             <Square
//               ref={aiRef}
//               className="size-20"
//               label="AI Processing"
//               onClick={handleInteraction}
//             >
//               <Icons.ai title="AI Processing Icon" />
//             </Square>
//           </div>

//           <div className="flex justify-between">
//             <Square
//               ref={analyticsRef}
//               label="Analytics Dashboard"
//               onClick={handleInteraction}
//             >
//               <Icons.analytics title="Analytics Icon" />
//             </Square>
//             <Square
//               ref={alertRef}
//               label="Alert System"
//               onClick={handleInteraction}
//             >
//               <Icons.alert title="Alert Icon" />
//             </Square>
//           </div>
//         </div>

//         <AnimatePresence>
//           <AnimatedBeam
//             key="camera-to-ai"
//             containerRef={containerRef}
//             fromRef={cameraRef}
//             toRef={aiRef}
//             curvature={-50}
//           />
//           <AnimatedBeam
//             key="stream-to-ai"
//             containerRef={containerRef}
//             fromRef={streamRef}
//             toRef={aiRef}
//             curvature={50}
//           />
//           <AnimatedBeam
//             key="ai-to-analytics"
//             containerRef={containerRef}
//             fromRef={aiRef}
//             toRef={analyticsRef}
//             curvature={50}
//           />
//           <AnimatedBeam
//             key="ai-to-alert"
//             containerRef={containerRef}
//             fromRef={aiRef}
//             toRef={alertRef}
//             curvature={-50}
//           />
//         </AnimatePresence>
//       </div>
//     );
//   }),
//   { displayName: "AISurveillanceFlow" }
// );

// export default AISurveillanceFlow;
