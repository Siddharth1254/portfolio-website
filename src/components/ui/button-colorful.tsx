import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function ButtonColorful({
  className,
  label = "Explore Components",
  ...props
}: ButtonColorfulProps) {
  return (
    <Button
      className={cn(
        "relative h-9 px-4 overflow-hidden",
        "bg-foreground",
        "text-background",
        "transition-all duration-300",
        "group",
        className
      )}
      {...props}
    >
      {/* Gradient background effect */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-primary via-accent via-secondary to-muted",
          "opacity-40 group-hover:opacity-80",
          "blur-md",
          "transition-opacity duration-500"
        )}
        style={{
          backgroundSize: "200% 100%",
          animation: "gradient 3s linear infinite",
        }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Button>
  );
}
