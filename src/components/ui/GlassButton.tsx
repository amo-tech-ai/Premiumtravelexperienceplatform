import React from "react";
import { cn } from "./utils";
import { Button, ButtonProps } from "./button";

export interface GlassButtonProps extends ButtonProps {
  glow?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "outline", glow = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 transition-all duration-300",
          glow && "shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] border-white/40",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GlassButton.displayName = "GlassButton";
