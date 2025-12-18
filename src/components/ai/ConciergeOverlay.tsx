import { motion, AnimatePresence } from "motion/react";
import { useAI } from "../../context/AIContext";
import { ChatInterface } from "./ChatInterface";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "../ui/use-mobile";

export function ConciergeOverlay() {
  const { isOpen, toggleOpen } = useAI();
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Mobile Only or Full Screen focus) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleOpen}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
          />

          {/* Main Container */}
          <motion.div
            initial={isDesktop ? { opacity: 0, scale: 0.9, y: 20 } : { y: "100%" }}
            animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.9, y: 20 } : { y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[70] 
              bottom-0 left-0 right-0 h-[85vh] rounded-t-[2rem] overflow-hidden
              md:bottom-24 md:right-8 md:left-auto md:w-[450px] md:h-[600px] md:rounded-2xl
              bg-white shadow-2xl border border-white/20 flex flex-col md:flex-row"
          >
            {/* Mobile Close Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 bg-white cursor-pointer" onClick={toggleOpen}>
              <div className="w-12 h-1.5 bg-muted rounded-full" />
            </div>

            {/* Close Button (Desktop) */}
            <div className="hidden md:block absolute top-4 right-4 z-50">
              <Button size="icon" variant="ghost" onClick={toggleOpen} className="hover:bg-muted/50 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 h-full relative">
              <ChatInterface />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
