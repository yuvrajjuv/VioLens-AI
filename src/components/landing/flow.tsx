"use client";

import React, { forwardRef, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Video, Bot, Bell, FileText, Save } from "lucide-react";
import { motion } from "framer-motion";
import { CardContent } from "../ui/card";

const CustomLoading = () => (
  <div className="relative w-6 h-6 animate-spin">
    <div className="absolute w-full h-full border-2 border-t-transparent border-foreground/60 rounded-full"></div>
  </div>
);

const Node = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children?: React.ReactNode;
    text?: string;
    shape?: "square" | "rect";
    animate?: boolean;
  }
>(({ className, children, text, shape = "square", animate = true }, ref) => {
  const baseStyle =
    shape === "rect" ? "min-w-[160px] px-6 py-4" : "w-[90px] h-[90px] p-2";

  return (
    <motion.div
      ref={ref}
      initial={animate ? { scale: 0.9, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "z-10 flex flex-col items-center justify-center rounded-2xl text-center",
        "bg-background/10 backdrop-blur-sm",
        "border-2 border-foreground/10",
        "shadow-[0_4px_16px_0_hsl(var(--shadow)/0.1)]",
        "hover:bg-muted/20 hover:border-foreground/20 transition-all duration-300",
        baseStyle,
        className
      )}
    >
      {children ? (
        children
      ) : (
        <span className="text-lg font-medium text-foreground/80">{text}</span>
      )}
    </motion.div>
  );
});
Node.displayName = "Node";

export function VideoPreprocessingFlow() {
  const containerRef = useRef(null);
  const videoInputRef = useRef(null);
  const preprocessRef = useRef(null);
  const modelRef = useRef(null);
  const geminiRef = useRef(null);
  const alertRef = useRef(null);
  const reportRef = useRef(null);
  const saveClipRef = useRef(null);

  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const beamConfig = {
    containerRef,
    duration: 10,
    pathColor: "#366666",
    gradientStartColor: "#8c769b",
    gradientStopColor: "#c9bee8",
    pathWidth: 3,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-foreground/60" />
      </div>
    );
  }

  return (
    <div className="bg-transparent relative w-full mb-16 rounded-lg overflow-hidden p-0 border-none">
      <div className="mb-6">
        <div className="text-card-foreground text-2xl font-semibold">
          Next-Gen AI Surveillance
        </div>
        <div className="text-md max-w-2xl text-muted-foreground">
          Intelligent monitoring powered by advanced machine learning
        </div>
      </div>

      <CardContent>
        <div
          ref={containerRef}
          className="relative w-full flex flex-col gap-10 items-start justify-center lg:flex-row lg:items-center lg:gap-20"
        >
          <Node ref={videoInputRef} text="CCTV Input" shape="square">
            <Video className="h-8 w-8 text-foreground/60" />
          </Node>

          <Node ref={preprocessRef} text="Preprocessing" shape="square">
            <CustomLoading />
          </Node>

          <Node
            ref={modelRef}
            text="Arvie"
            shape="rect"
            className="doto-black text-3xl"
          />

          <div className="flex flex-col items-center gap-20">
            <Node ref={saveClipRef} text="Save Clip" shape="square">
              <Save className="h-8 w-8 text-foreground/60" />
            </Node>
            <Node ref={geminiRef} text="AI Agent" shape="square">
              <Bot className="h-10 w-10 text-foreground/60" />
            </Node>
          </div>

          <div className="flex flex-col gap-20">
            <Node ref={reportRef} text="Report" shape="square">
              <FileText className="h-8 w-8 text-foreground/60" />
            </Node>
            <Node ref={alertRef} text="Alert" shape="square">
              <Bell className="h-8 w-8 text-foreground/60" />
            </Node>
          </div>

          {/* Beams */}
          <AnimatedBeam
            {...beamConfig}
            pathType="step"
            fromRef={videoInputRef}
            toRef={preprocessRef}
          />
          <AnimatedBeam
            {...beamConfig}
            pathType="step"
            fromRef={preprocessRef}
            toRef={modelRef}
          />
          <AnimatedBeam
            {...beamConfig}
            pathType="step"
            fromRef={modelRef}
            toRef={saveClipRef}
            startYOffset={-10}
            endYOffset={0}
          />
          <AnimatedBeam
            {...beamConfig}
            pathType="step"
            fromRef={modelRef}
            toRef={geminiRef}
            startYOffset={10}
            endYOffset={0}
          />
          <AnimatedBeam
            {...beamConfig}
            pathType="curve"
            fromRef={geminiRef}
            toRef={reportRef}
          />
          <AnimatedBeam
            {...beamConfig}
            pathType="step"
            fromRef={geminiRef}
            toRef={alertRef}
          />
          <AnimatedBeam
            {...beamConfig}
            pathType="straight"
            fromRef={reportRef}
            toRef={saveClipRef}
          />
        </div>
      </CardContent>
    </div>
  );
}
