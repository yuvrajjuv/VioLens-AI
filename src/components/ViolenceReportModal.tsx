import { ViolenceReport } from "@/lib/gemini";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AlertTriangle, XCircle } from "lucide-react";
import Image from "next/image";

interface ViolenceReportModalProps {
  report: ViolenceReport | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function ViolenceReportModal({
  report,
  isOpen,
  onClose,
  onDownload,
}: ViolenceReportModalProps) {
  if (!report) return null;

  // Format timestamp for display
  const formattedDate = new Date(report.timestamp).toLocaleString();

  // Map severity to appropriate badge variant
  const severityVariant =
    report.severity === "high"
      ? "destructive"
      : report.severity === "medium"
      ? "secondary"
      : "outline";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <DialogTitle>Violence Detection Report</DialogTitle>
            <div className="flex gap-2">
              <Badge variant={severityVariant} className="uppercase">
                {report.severity} Severity
              </Badge>
              <Badge
                variant={report.isActualViolence ? "destructive" : "outline"}
              >
                {report.isActualViolence ? (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Actual Violence</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    <span>False Positive</span>
                  </div>
                )}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-sm">
            Generated on {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-hidden">
          <Tabs defaultValue="summary" className="w-full h-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="footage">Footage</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4 h-[calc(100%-40px)]">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p className="text-muted-foreground">{report.summary}</p>
                  </div>

                  <div className="p-4 rounded-md bg-muted/50 border">
                    <div className="flex items-center gap-2 mb-2">
                      {report.isActualViolence ? (
                        <>
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <h3 className="text-lg font-semibold text-red-500">
                            Actual Violence Detected
                          </h3>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-amber-500" />
                          <h3 className="text-lg font-semibold text-amber-500">
                            False Positive
                          </h3>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {report.isActualViolence
                        ? "This incident has been verified as containing actual violence that may require intervention."
                        : "This incident has been determined not to contain actual violence requiring intervention."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Recommendations
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.recommendations.map((rec, i) => (
                        <li key={i} className="text-muted-foreground">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="details" className="mt-4 h-[calc(100%-40px)]">
              <ScrollArea className="h-full pr-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Detailed Analysis
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {report.details}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="footage" className="mt-4 h-[calc(100%-40px)]">
              <div className="relative h-full">
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {report.frames.map((frame, idx) => (
                      <CarouselItem key={idx} className="h-full">
                        <div className="flex flex-col items-center justify-center h-full p-2">
                          <div className="relative w-full h-[300px] bg-muted rounded-md overflow-hidden">
                            <Image
                              src={frame}
                              alt={`Violence detection frame ${idx + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="text-xs text-center mt-2 text-muted-foreground">
                            Frame {idx + 1} of {report.frames.length}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="minimal" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onDownload}>Download Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
