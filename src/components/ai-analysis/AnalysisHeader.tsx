import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface AnalysisHeaderProps {
  onContinue: () => void;
}

export function AnalysisHeader({ onContinue }: AnalysisHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-start justify-between gap-8">
          {/* Left: Title & Description */}
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                STEP 2 OF 7
              </p>
              <p className="text-xs uppercase tracking-wider text-primary font-medium">
                AI ANALYSIS
              </p>
            </div>
            
            <h1 className="text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
              AI Analysis
            </h1>
            
            <p className="text-base text-muted-foreground max-w-2xl">
              Review and refine what Gemini discovered from your links and inputs.
            </p>
          </div>

          {/* Right: System Status & CTA */}
          <div className="flex items-start gap-4">
            <Badge 
              variant="outline" 
              className="text-xs px-3 py-1.5 bg-secondary/50 text-secondary-foreground border-border"
            >
              Gemini Grounded · URL Context Active
            </Badge>
            
            <Button
              onClick={onContinue}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 shadow-sm"
            >
              Continue → Smart Interview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
