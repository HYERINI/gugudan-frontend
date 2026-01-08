import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  variant?: "default" | "compact" | "spacious";
}

const variantStyles = {
  default: "pt-20 pb-28",
  compact: "pt-12 pb-16",
  spacious: "pt-40 pb-40",
};

export function Section({
  id,
  children,
  className = "",
  containerClassName = "",
  variant = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("bg-gradient-to-b from-purple-50 to-pink-50", className)}
    >
      <div
        className={cn(
          "max-w-6xl mx-auto px-4",
          variantStyles[variant],
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
