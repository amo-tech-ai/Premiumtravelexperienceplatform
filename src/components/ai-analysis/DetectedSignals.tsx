import { Badge } from "../ui/badge";
import { Sparkles } from "lucide-react";

interface Signal {
  label: string;
  validated: boolean;
}

interface SignalGroup {
  category: string;
  signals: Signal[];
}

interface DetectedSignalsProps {
  signalGroups: SignalGroup[];
  onChallengeSignal: (category: string, signalIndex: number) => void;
}

export function DetectedSignals({
  signalGroups,
  onChallengeSignal,
}: DetectedSignalsProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <div>
        <h2 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          Detected Signals
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Key indicators identified by AI analysis
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {signalGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
              {group.category}
            </h3>
            
            <div className="space-y-2">
              {group.signals.map((signal, signalIndex) => (
                <div
                  key={signalIndex}
                  className="flex items-center justify-between gap-2 group"
                >
                  <Badge
                    variant={signal.validated ? "default" : "outline"}
                    className={`flex-1 justify-start px-3 py-2 text-xs ${
                      signal.validated
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-background text-foreground'
                    }`}
                  >
                    {signal.label}
                  </Badge>
                  
                  <button
                    onClick={() => onChallengeSignal(group.category, signalIndex)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Challenge</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
