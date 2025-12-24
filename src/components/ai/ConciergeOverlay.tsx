import { motion, AnimatePresence } from "motion/react";
import { useAI } from "../../context/AIContext";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "../ui/use-mobile";
import { useState } from "react";
import { cn } from "../ui/utils";
import ChatbotV2Content from "./ChatbotV2Content";

export function ConciergeOverlay() {
  const { isOpen, toggleOpen } = useAI();
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Mobile Only or Full Screen focus) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isExpanded ? undefined : toggleOpen}
            className={cn(
              "fixed inset-0 z-[60]",
              isExpanded
                ? "bg-black/30 backdrop-blur-sm pointer-events-none"
                : "bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
            )}
          />

          {/* Main Container */}
          <motion.div
            initial={isDesktop ? { opacity: 0, scale: 0.9, y: 20 } : { y: "100%" }}
            animate={
              isExpanded
                ? { opacity: 1, scale: 1, y: 0, x: 0, width: "100vw", height: "100vh" }
                : isDesktop
                ? { opacity: 1, scale: 1, y: 0 }
                : { y: 0 }
            }
            exit={isDesktop ? { opacity: 0, scale: 0.9, y: 20 } : { y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-[70] bg-white shadow-2xl border border-white/20 flex flex-col",
              isExpanded
                ? "inset-0 rounded-none"
                : "bottom-0 left-0 right-0 h-[85vh] rounded-t-[2rem] overflow-hidden md:bottom-24 md:right-8 md:left-auto md:w-[500px] md:h-[700px] md:rounded-2xl"
            )}
          >
            {/* Mobile Close Handle */}
            {!isExpanded && (
              <div className="md:hidden w-full flex justify-center pt-3 pb-1 bg-white cursor-pointer" onClick={toggleOpen}>
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>
            )}

            {/* Header Controls (Desktop) */}
            <div className="hidden md:flex absolute top-4 right-4 z-50 gap-2">
              {/* Expand/Collapse Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleExpanded}
                className="hover:bg-muted/50 rounded-full"
                title={isExpanded ? "Exit fullscreen" : "Expand to fullscreen"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>

              {/* Close Button */}
              <Button size="icon" variant="ghost" onClick={toggleOpen} className="hover:bg-muted/50 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* New ChatbotV2 Interface */}
            <div className="flex-1 h-full relative overflow-hidden">
              <ChatbotV2Content onClose={toggleOpen} isExpanded={isExpanded} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}