import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useAI } from "../../context/AIContext";
import { Button } from "../ui/button";
import { useLocation } from "react-router";

export function ConciergeFab() {
  const { toggleOpen, isOpen } = useAI();
  const location = useLocation();

  // Hide FAB on the full Concierge page
  if (location.pathname === '/concierge') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50"
      >
        <Button
          size="icon"
          onClick={toggleOpen}
          className="h-14 w-14 rounded-full shadow-luxury bg-emerald-900 text-white hover:bg-emerald-800 hover:scale-105 transition-all duration-300"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}