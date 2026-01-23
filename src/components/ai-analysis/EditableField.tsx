import { Sparkles, Info } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

interface AIEnhanceIconProps {
  onAction: (action: string) => void;
}

export function AIEnhanceIcon({ onAction }: AIEnhanceIconProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    { id: 'clarity', label: 'Improve clarity' },
    { id: 'investors', label: 'Rewrite for investors' },
    { id: 'details', label: 'Add missing details' },
    { id: 'benchmark', label: 'Benchmark vs similar startups' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center w-6 h-6 rounded-md text-primary hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="AI enhance"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                onAction(action.id);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface EditableFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onAIEnhance?: (action: string) => void;
  multiline?: boolean;
  placeholder?: string;
  showAIBadge?: boolean;
  badgeText?: string;
}

export function EditableField({
  label,
  value,
  onChange,
  onAIEnhance,
  multiline = false,
  placeholder,
  showAIBadge = false,
  badgeText = "Extracted from website + search grounding",
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(localValue);
  };

  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between gap-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        <div className="flex items-center gap-2">
          {showAIBadge && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
          )}
          
          {onAIEnhance && (
            <AIEnhanceIcon onAction={onAIEnhance} />
          )}
        </div>
      </div>

      {multiline ? (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
            isEditing
              ? 'border-primary bg-white'
              : 'border-border bg-card hover:border-primary/50'
          }`}
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border transition-all ${
            isEditing
              ? 'border-primary bg-white'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        />
      )}
    </div>
  );
}
