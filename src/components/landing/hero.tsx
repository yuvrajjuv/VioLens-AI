import Link from "next/link";
import React from "react";
import { Brain, Cpu, Eye, Github, Shield, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";


const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute -z-10 top-0 left-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-background"></div>

      {/* Animated beam effect */}
      <div className="absolute -z-10 top-0 right-0 w-full h-full opacity-50">
        {/* <AnimatedBeam className="w-full h-[500px]" delay={0} duration={5000} /> */}
      </div>

      <div className="pt-8 pb-16">
        <div className="flex flex-col items-start">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 border-primary/20 text-primary"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now with Edge AI Processing
          </Badge>

          <h1 className="font-sans font-extrabold text-7xl md:text-8xl tracking-tight mb-8 text-primary glow-text">
            Volience Detection
          </h1>

          <div className="max-w-2xl mb-10">
            <p className="text-xl mb-6 leading-relaxed">
              <span className="font-medium text-foreground">The Watcher</span>{" "}
              is an advanced AI-powered surveillance platform integrating
              <span className="font-semibold text-primary"> Gemini</span>{" "}
              technology and proprietary{" "}
              <span className="font-medium text-foreground">ML models</span> to
              revolutionize security monitoring and threat prediction.
            </p>
            <p className="text-lg mb-8 leading-relaxed text-muted-foreground">
              Our system comprehends environments in real-time, adapts to
              evolving patterns, and identifies potential security risks with
              unparalleled accuracy.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Badge
                variant="outline"
                className="bg-card text-foreground border-primary/20 px-3 py-1.5"
              >
                <Shield className="w-3.5 h-3.5 mr-2" /> Enterprise-grade
                security
              </Badge>
              <Badge
                variant="outline"
                className="bg-card text-foreground border-primary/20 px-3 py-1.5"
              >
                <Brain className="w-3.5 h-3.5 mr-2" /> AI-powered analytics
              </Badge>
              <Badge
                variant="outline"
                className="bg-card text-foreground border-primary/20 px-3 py-1.5"
              >
                <Cpu className="w-3.5 h-3.5 mr-2" /> Edge processing
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 w-full">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              <Link href="/demo" className="flex items-center gap-2">
                <Eye className="w-4 h-4 mr-1" />
                Try Demo
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                window.scrollBy({
                  top: window.innerHeight,
                  behavior: "smooth",
                })
              }
              className="border-primary/20 hover:border-primary/40 transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Learn More
            </Button>

            <div className="ml-auto mt-4 sm:mt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-2 hover:bg-primary/5"
                      size="icon"
                    >
                      <Github className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover border-border"
                  >
                    <p className="text-popover-foreground text-sm">
                      View our GitHub repository
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
