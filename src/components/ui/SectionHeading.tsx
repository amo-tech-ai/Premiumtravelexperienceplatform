import React from "react";
import { cn } from "./utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  light?: boolean; // For use on dark backgrounds
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-8",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        className
      )}
    >
      <h2
        className={cn(
          "font-serif text-3xl md:text-4xl font-semibold tracking-tight",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-lg max-w-2xl leading-relaxed",
            light ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "h-1 w-20 mt-2 rounded-full",
          light ? "bg-accent" : "bg-primary"
        )}
      />
    </div>
  );
}
