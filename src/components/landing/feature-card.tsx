import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-card rounded-md p-4 sm:p-6 border border-border hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="bg-muted p-3 rounded-md mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 text-primary">
          {icon}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
