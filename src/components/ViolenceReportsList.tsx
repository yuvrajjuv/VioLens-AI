import { useState } from "react";
import { ViolenceReport } from "@/lib/gemini";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2,
  FileText,
  AlertTriangle,
  Clock,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ViolenceReportModal } from "./ViolenceReportModal";

interface ViolenceReportsListProps {
  reports: ViolenceReport[];
  onDeleteReport: (reportId: string) => void;
}

export function ViolenceReportsList({
  reports,
  onDeleteReport,
}: ViolenceReportsListProps) {
  const [selectedReport, setSelectedReport] = useState<ViolenceReport | null>(
    null
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "actual" | "false">("all");

  // Sort reports by timestamp (newest first) and apply filter
  const filteredReports = [...reports]
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter((report) => {
      if (filter === "all") return true;
      if (filter === "actual") return report.isActualViolence;
      return !report.isActualViolence;
    });

  const handleViewReport = (report: ViolenceReport) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handleDownloadReport = () => {
    if (!selectedReport) return;

    // Create a formatted text report
    const reportText = `
VIOLENCE DETECTION REPORT
=========================
Generated: ${new Date(selectedReport.timestamp).toLocaleString()}
Severity: ${selectedReport.severity.toUpperCase()}

SUMMARY
-------
${selectedReport.summary}

DETAILS
-------
${selectedReport.details}

RECOMMENDATIONS
--------------
${selectedReport.recommendations.map((rec) => `- ${rec}`).join("\n")}
`;

    // Create and download the file
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `violence-report-${selectedReport.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "primary" : "minimal"}
            onClick={() => setFilter("all")}
          >
            All Reports
          </Button>
          <Button
            size="sm"
            variant={filter === "actual" ? "primary" : "minimal"}
            onClick={() => setFilter("actual")}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Actual Violence
          </Button>
          <Button
            size="sm"
            variant={filter === "false" ? "primary" : "minimal"}
            onClick={() => setFilter("false")}
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            False Positives
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] pr-4">
            {filteredReports.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No{" "}
                {filter !== "all"
                  ? filter === "actual"
                    ? "confirmed violence"
                    : "false positive"
                  : ""}{" "}
                reports available.
              </div>
            ) : (
              <ul className="divide-y">
                {filteredReports.map((report) => (
                  <li key={report.id} className="py-4 px-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {report.isActualViolence ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-amber-500" />
                          )}
                          <span className="font-medium">
                            {report.summary.length > 60
                              ? `${report.summary.substring(0, 60)}...`
                              : report.summary}
                          </span>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(report.timestamp).toLocaleString()}
                          </span>
                          <Badge
                            variant={
                              report.severity === "high"
                                ? "destructive"
                                : report.severity === "medium"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-[10px] h-4 px-1"
                          >
                            {report.severity}
                          </Badge>
                          <Badge
                            variant={
                              report.isActualViolence
                                ? "destructive"
                                : "outline"
                            }
                            className="text-[10px] h-4 px-1"
                          >
                            {report.isActualViolence
                              ? "Actual Violence"
                              : "False Positive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="minimal"
                          onClick={() => onDeleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="minimal"
                          className="flex items-center gap-1"
                          onClick={() => handleViewReport(report)}
                        >
                          <FileText className="h-4 w-4" />
                          <span>View</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <ViolenceReportModal
        report={selectedReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onDownload={handleDownloadReport}
      />
    </>
  );
}
