import { EditableField } from "./EditableField";
import { Badge } from "../ui/badge";

interface StartupOverviewProps {
  companyName: string;
  description: string;
  industry: string;
  tags: string[];
  onUpdate: (field: string, value: string) => void;
  onAIEnhance: (field: string, action: string) => void;
}

export function StartupOverview({
  companyName,
  description,
  industry,
  tags,
  onUpdate,
  onAIEnhance,
}: StartupOverviewProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <div>
        <h2 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          Startup Overview
        </h2>
      </div>

      <EditableField
        label="Company Name"
        value={companyName}
        onChange={(value) => onUpdate('companyName', value)}
        placeholder="Enter company name"
        showAIBadge
      />

      <EditableField
        label="Description"
        value={description}
        onChange={(value) => onUpdate('description', value)}
        onAIEnhance={(action) => onAIEnhance('description', action)}
        multiline
        placeholder="Enter company description"
      />

      <EditableField
        label="Industry"
        value={industry}
        onChange={(value) => onUpdate('industry', value)}
        placeholder="Enter industry"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 text-xs bg-secondary text-secondary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
