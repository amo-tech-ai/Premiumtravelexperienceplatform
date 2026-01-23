import { CheckCircle2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

interface IntelligenceRailProps {
  aiInsight: {
    brief: string;
    strength: string;
    risk: string;
  };
  recommendedActions: Array<{
    label: string;
    completed: boolean;
    targetSection: string;
  }>;
  confidenceScore: number;
}

export function IntelligenceRail({
  aiInsight,
  recommendedActions,
  confidenceScore,
}: IntelligenceRailProps) {
  return (
    <div className="space-y-6 sticky top-6">
      {/* AI Insight Card */}
      <div className="bg-primary text-primary-foreground rounded-xl p-6 space-y-4 shadow-sm">
        <h3
          className="text-xl"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          AI Analyst Brief
        </h3>

        <div className="space-y-4 text-sm leading-relaxed">
          <p className="opacity-95">{aiInsight.brief}</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-90" />
              <div>
                <p className="font-medium opacity-90 mb-1">Primary Strength</p>
                <p className="opacity-80 text-sm">{aiInsight.strength}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-90" />
              <div>
                <p className="font-medium opacity-90 mb-1">Primary Risk</p>
                <p className="opacity-80 text-sm">{aiInsight.risk}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="text-lg font-medium">Recommended Actions</h3>

        <div className="space-y-2">
          {recommendedActions.map((action, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3 group"
              onClick={() => {
                document.querySelector(`[data-section="${action.targetSection}"]`)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              {action.completed ? (
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex-shrink-0 group-hover:border-primary transition-colors" />
              )}
              <span className="text-sm flex-1">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="text-lg font-medium">Analysis Confidence</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-medium">{confidenceScore}%</span>
            {confidenceScore >= 80 ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Based on data quality, source credibility, and signal strength
          </p>
        </div>
      </div>
    </div>
  );
}
