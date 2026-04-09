import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface NotificationProps {
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
  color: "red" | "amber" | "blue";
  icon: React.ReactNode;
  title: string;
  progress?: {
    value: number;
    label?: string;
  };
  onClose?: () => void;
}

export function Notification({
  position,
  color,
  icon,
  title,
  progress,
  onClose,
}: NotificationProps) {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} bg-${color}-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50`}
    >
      {icon}
      <span className="font-bold">{title}</span>
      {progress && (
        <div className="flex items-center space-x-2">
          <Progress value={progress.value} className="w-24 h-2 rounded-full" />
          {progress.label && (
            <span className="text-xs text-white">{progress.label}</span>
          )}
        </div>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-white hover:text-gray-300 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
