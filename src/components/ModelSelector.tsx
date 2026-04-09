import { Loader2, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelData } from "@/constants/models";

interface ModelSelectorProps {
  modelUrl: string;
  setModelUrl: (url: string) => void;
  session: boolean | null;
}

export function ModelSelector({
  modelUrl,
  setModelUrl,
  session,
}: ModelSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const currentModel = modelData.find((model) => model.modelPath === modelUrl);
  const CurrentModelIcon = currentModel?.logo;

  return (
    <div className="flex flex-col w-full rounded-lg overflow-hidden transition-all duration-500 ease-in-out">
      <div className="flex w-full items-center justify-between gap-6 px-6 py-4">
        {/* Model Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Model:
          </span>
          <Select value={modelUrl} onValueChange={setModelUrl}>
            <SelectTrigger className="min-w-[180px] rounded-md border bg-background px-4 py-2 text-sm shadow-sm focus:ring-ring">
              <SelectValue placeholder="Choose Model">
                {currentModel && (
                  <div className="flex items-center gap-2">
                    {CurrentModelIcon && (
                      <CurrentModelIcon
                        width={18}
                        height={18}
                        className="mr-1"
                      />
                    )}
                    {currentModel.name}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-md border bg-popover text-popover-foreground shadow-lg">
              {modelData.map((model) => (
                <SelectItem
                  key={model.id} // Use the unique ID as the key
                  value={model.modelPath}
                  className="px-4 py-2 hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <model.logo width={20} height={20} />
                    <span>{model.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            {session ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Loaded
              </span>
            ) : (
              <span className="flex items-center gap-2 text-yellow-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading
              </span>
            )}
          </div>

          {/* Toggle Details Button */}
          <Button
            variant="ghost"
            size="sm"
            className="ml-3 flex items-center gap-1 text-xs transition-colors duration-300 hover:bg-muted/50"
            onClick={toggleExpand}
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-500 ease-out ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
            {isExpanded ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </div>

      {/* Expandable Details Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out  border rounded-2xl ${
          isExpanded ? "max-h-96 py-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-6 space-y-4 transition-transform duration-500 ease-in-out ${
            isExpanded ? "translate-y-0" : "-translate-y-8"
          }`}
        >
          <div className="flex items-center space-x-3">
            {CurrentModelIcon && (
              <CurrentModelIcon width={32} height={32} className="opacity-90" />
            )}
            <h3 className="text-lg font-semibold">{currentModel?.name}</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            {currentModel?.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-4 rounded-lg">
            <div className="space-y-3">
              <h4 className="text-sm font-medium border-b pb-1">
                Model Specifications
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{currentModel?.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Zones:</span>
                  <span className="font-medium">{currentModel?.zones}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Latency:</span>
                  <span className="font-medium">{currentModel?.latency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium">{currentModel?.accuracy}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium border-b pb-1">
                Evaluation Metrics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Precision:</span>
                  <span className="font-medium">
                    {currentModel?.evaluation.precision}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Recall:</span>
                  <span className="font-medium">
                    {currentModel?.evaluation.recall}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">F1 Score:</span>
                  <span className="font-medium">
                    {currentModel?.evaluation.f1Score}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Last Updated:</strong> {currentModel?.lastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}
