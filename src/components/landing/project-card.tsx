import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
}: ProjectCardProps) {
  return (
    <div className="bg-card rounded-md overflow-hidden border border-border hover:shadow-md transition-all">
      <div className="relative h-40 sm:h-48">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
