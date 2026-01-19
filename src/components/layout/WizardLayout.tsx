import { ReactNode } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useWizard } from '../../context/WizardContext';
import { cn } from '../../lib/utils/utils';
import { motion } from 'motion/react';

interface WizardLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const WizardLayout = ({ 
  children, 
  title, 
  showBack = false, 
  onBack 
}: WizardLayoutProps) => {
  const { ui } = useWizard();
  const navigate = useNavigate();

  // Calculate progress percentage
  const progress = ((ui.currentStep + 1) / ui.totalSteps) * 100;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-border/10 bg-white/50 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-900" />
            </button>
          )}
          {title && (
            <h1 className="text-lg font-serif font-medium text-emerald-900 animate-in fade-in slide-in-from-left-4">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-emerald-900 transition-colors rounded-full hover:bg-black/5"
          >
            <span className="hidden sm:inline">Exit Planning</span>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-emerald-900/5 z-50">
        <motion.div 
          className="h-full bg-emerald-900"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 container mx-auto max-w-5xl">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};