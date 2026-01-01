import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-glow-primary",
        sizeClasses[size]
      )}>
        <Heart className={cn(
          "text-primary-foreground fill-primary-foreground/20",
          size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : "h-8 w-8"
        )} />
      </div>
      {showText && (
        <span className={cn(
          "font-display font-bold text-foreground tracking-tight",
          textSizes[size]
        )}>
          Naija<span className="text-gradient-primary">Connect</span>
        </span>
      )}
    </div>
  );
}
