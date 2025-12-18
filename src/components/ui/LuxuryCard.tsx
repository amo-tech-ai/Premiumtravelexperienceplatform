import { motion } from "motion/react";
import { cn } from "./utils";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ReactNode } from "react";

interface LuxuryCardProps {
  id?: string;
  image: string;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "default" | "emerald" | "gold" | "neutral";
  };
  metaPrimary?: ReactNode;   // e.g. Location or Price
  metaSecondary?: ReactNode; // e.g. Date or Beds/Baths
  action?: ReactNode;        // e.g. Heart icon
  status?: 'active' | 'unavailable' | 'sold_out'; // New status prop
  onClick?: () => void;
  className?: string;
}

export function LuxuryCard({
  image,
  title,
  subtitle,
  badge,
  metaPrimary,
  metaSecondary,
  action,
  status = 'active',
  onClick,
  className,
}: LuxuryCardProps) {
  const isUnavailable = status !== 'active';

  return (
    <motion.div
      whileHover={isUnavailable ? {} : { y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border border-border/50",
        !isUnavailable && "hover:shadow-luxury cursor-pointer",
        isUnavailable && "opacity-80 grayscale pointer-events-none bg-slate-50",
        className
      )}
      onClick={isUnavailable ? undefined : onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div
          whileHover={!isUnavailable ? { scale: 1.05 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Unavailable Overlay */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm">
              {status === 'sold_out' ? 'Sold Out' : 'Unavailable'}
            </span>
          </div>
        )}

        {/* Badge Slot */}
        {badge && !isUnavailable && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className={cn(
                "px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full backdrop-blur-md",
                badge.variant === "emerald" && "bg-primary/90 text-white",
                badge.variant === "gold" && "bg-accent text-white",
                (!badge.variant || badge.variant === "neutral") && "bg-white/90 text-primary"
              )}
            >
              {badge.text}
            </span>
          </div>
        )}

        {/* Action Slot (e.g. Save) */}
        {action && (
          <div className="absolute top-4 right-4 text-white hover:scale-110 transition-transform">
            {action}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col gap-3">
        {/* Title Slot */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
          )}
        </div>

        {/* Divider */}
        {(metaPrimary || metaSecondary) && (
          <div className="h-px bg-border/50 w-full" />
        )}

        {/* Meta Row */}
        {(metaPrimary || metaSecondary) && (
          <div className="flex items-center justify-between text-sm">
            <div className="font-medium text-foreground">{metaPrimary}</div>
            <div className="text-muted-foreground">{metaSecondary}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
