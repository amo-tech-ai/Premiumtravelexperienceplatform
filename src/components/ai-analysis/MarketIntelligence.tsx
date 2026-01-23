import { EditableField } from "./EditableField";
import { Badge } from "../ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface Competitor {
  name: string;
  positioning: string;
  logo?: string;
}

interface MarketIntelligenceProps {
  competitors: Competitor[];
  marketTrends: string[];
  marketLabels: string[];
  onUpdateCompetitor: (index: number, field: string, value: string) => void;
  onRemoveCompetitor: (index: number) => void;
  onAddCompetitor: () => void;
  onAIEnhance: (competitorIndex: number, action: string) => void;
}

export function MarketIntelligence({
  competitors,
  marketTrends,
  marketLabels,
  onUpdateCompetitor,
  onRemoveCompetitor,
  onAddCompetitor,
  onAIEnhance,
}: MarketIntelligenceProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <div>
        <h2 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          Competitor & Market Intelligence
        </h2>
      </div>

      {/* Competitors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Competitors</h3>
          <button
            onClick={onAddCompetitor}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Competitor
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {competitors.map((competitor, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-background space-y-3 relative group"
            >
              <button
                onClick={() => onRemoveCompetitor(index)}
                className="absolute top-2 right-2 w-6 h-6 rounded-md bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                aria-label="Remove competitor"
              >
                <X className="w-4 h-4" />
              </button>

              <EditableField
                label="Company Name"
                value={competitor.name}
                onChange={(value) => onUpdateCompetitor(index, 'name', value)}
                placeholder="Competitor name"
              />

              <EditableField
                label="Positioning"
                value={competitor.positioning}
                onChange={(value) => onUpdateCompetitor(index, 'positioning', value)}
                onAIEnhance={(action) => onAIEnhance(index, action)}
                multiline
                placeholder="How they position themselves"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Market Trends</h3>
        <div className="space-y-2">
          {marketTrends.map((trend, index) => (
            <div
              key={index}
              className="px-4 py-3 rounded-lg border border-border bg-background text-sm"
            >
              {trend}
            </div>
          ))}
        </div>
      </div>

      {/* Market Labels */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Market Categories</h3>
        <div className="flex flex-wrap gap-2">
          {marketLabels.map((label, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-1 text-xs"
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
