import { motion, AnimatePresence } from "motion/react";
import { useAI } from "../../context/AIContext";
import { useWizard } from "../../context/WizardContext";
import { ChatInterface } from "../ai/ChatInterface";
import { X, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "../ui/use-mobile";
import { cn } from "../ui/utils";

export function ChatOverlay() {
  const { messages } = useAI();
  const { ui, setUI } = useWizard();
  
  // Use WizardContext to control visibility in the Wizard flow
  const isOpen = ui.isChatOpen;
  const toggleOpen = () => setUI({ isChatOpen: !isOpen });

  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  return (
    <>
      {/* Floating Trigger Button (FAB) - Visible when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={toggleOpen}
              className="w-14 h-14 rounded-full bg-emerald-900 hover:bg-emerald-800 text-white shadow-luxury flex items-center justify-center relative"
            >
              <MessageSquare className="w-6 h-6" />
              {/* Notification Badge */}
              {messages.length > 1 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                  {messages.length - 1}
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (Mobile Only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleOpen}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Main Container */}
            <motion.div
              initial={isDesktop ? { opacity: 0, scale: 0.95, y: 20 } : { y: "100%" }}
              animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
              exit={isDesktop ? { opacity: 0, scale: 0.95, y: 20 } : { y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed z-[70] flex flex-col bg-white shadow-2xl overflow-hidden border border-border/50",
                // Mobile Styles
                "bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl",
                // Desktop Styles
                "md:bottom-24 md:right-8 md:w-[400px] md:h-[600px] md:rounded-2xl"
              )}
            >
              {/* Mobile Drag Handle */}
              <div className="md:hidden w-full flex justify-center pt-3 pb-1 bg-white cursor-pointer" onClick={toggleOpen}>
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>

              {/* Close Button */}
              <div className="absolute top-3 right-3 z-50">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={toggleOpen} 
                  className="h-8 w-8 hover:bg-muted/50 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Chat Interface */}
              <div className="flex-1 h-full">
                <ChatInterface />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
