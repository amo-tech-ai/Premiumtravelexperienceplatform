import { EditableField } from "./EditableField";
import { Info } from "lucide-react";

interface WebsiteInsight {
  label: string;
  value: string;
  note: string;
}

interface WebsiteContextProps {
  insights: WebsiteInsight[];
  onUpdate: (index: number, value: string) => void;
  onAIEnhance: (index: number, action: string) => void;
}

export function WebsiteContext({
  insights,
  onUpdate,
  onAIEnhance,
}: WebsiteContextProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <div>
        <h2 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          Website Context Insights
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Key information extracted from your website and public sources
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="space-y-3">
            <EditableField
              label={insight.label}
              value={insight.value}
              onChange={(value) => onUpdate(index, value)}
              onAIEnhance={(action) => onAIEnhance(index, action)}
              multiline
              placeholder={`Enter ${insight.label.toLowerCase()}`}
            />
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{insight.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
