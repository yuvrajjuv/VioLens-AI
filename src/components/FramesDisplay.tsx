import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface FramesDisplayProps {
  originalFrames: string[];
  processedFrames: string[];
  isCapturing: boolean;
  maxDisplayFrames?: number;
}

export function FramesDisplay({
  originalFrames,
  processedFrames,
  isCapturing,
  maxDisplayFrames = 6,
}: FramesDisplayProps) {
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);

  if (!isCapturing || originalFrames.length === 0) {
    return (
      <div className="bg-muted/30 p-4 rounded-xl text-center w-full">
        <p className="text-muted-foreground">No frames available</p>
      </div>
    );
  }

  const handleFrameClick = (index: number) => {
    setSelectedFrame(index === selectedFrame ? null : index);
  };

  return (
    <div className="mt-2 w-full bg-background/50 rounded-lg border">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
          <h3 className="text-lg font-medium text-foreground">
            Captured Frames
          </h3>
        </div>
        <Badge variant="outline">{originalFrames.length} frames</Badge>
      </div>

      <Separator />

      <Tabs defaultValue="split" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="split" className="mt-2">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-4">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                Original Frames
              </h4>
              <ScrollArea className="h-[320px] rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  {originalFrames
                    .slice(0, maxDisplayFrames)
                    .map((frame, index) => (
                      <div
                        key={`orig-${index}`}
                        className={`aspect-video bg-muted/30 p-1 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedFrame === index
                            ? "ring-2 ring-primary"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleFrameClick(index)}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={frame}
                            alt={`Captured frame ${index + 1}`}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className="md:hidden my-2" />

            <div className="flex-1 p-4">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                Preprocessed Frames
              </h4>
              <ScrollArea className="h-[320px] rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  {processedFrames
                    .slice(0, maxDisplayFrames)
                    .map((frame, index) => (
                      <div
                        key={`proc-${index}`}
                        className={`aspect-video bg-muted/30 p-1 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedFrame === index
                            ? "ring-2 ring-primary"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleFrameClick(index)}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={frame}
                            alt={`Preprocessed frame ${index + 1}`}
                            fill
                            className="rounded-md object-contain"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="original" className="mt-0 p-4">
          <ScrollArea className="h-[400px] rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {originalFrames.map((frame, index) => (
                <div
                  key={`orig-full-${index}`}
                  className={`aspect-video bg-muted/30 p-1 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedFrame === index
                      ? "ring-2 ring-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleFrameClick(index)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={frame}
                      alt={`Captured frame ${index + 1}`}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="processed" className="mt-0 p-4">
          <ScrollArea className="h-[400px] rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {processedFrames.map((frame, index) => (
                <div
                  key={`proc-full-${index}`}
                  className={`aspect-video bg-muted/30 p-1 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedFrame === index
                      ? "ring-2 ring-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleFrameClick(index)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={frame}
                      alt={`Preprocessed frame ${index + 1}`}
                      fill
                      className="rounded-md object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
