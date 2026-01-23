import { EditableField } from "./EditableField";
import { Badge } from "../ui/badge";
import { User } from "lucide-react";

interface Founder {
  name: string;
  role: string;
  bio: string;
  experience: string[];
  signals: string[];
}

interface FounderIdentityProps {
  founders: Founder[];
  onUpdate: (founderIndex: number, field: string, value: string | string[]) => void;
  onAIEnhance: (founderIndex: number, field: string, action: string) => void;
}

export function FounderIdentity({
  founders,
  onUpdate,
  onAIEnhance,
}: FounderIdentityProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <div>
        <h2 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          Founder Identity & Experience
        </h2>
      </div>

      {founders.map((founder, index) => (
        <div key={index} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Founder Card */}
            <div className="space-y-4 p-6 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <EditableField
                    value={founder.name}
                    onChange={(value) => onUpdate(index, 'name', value)}
                    placeholder="Founder name"
                  />
                </div>
              </div>

              <EditableField
                label="Role"
                value={founder.role}
                onChange={(value) => onUpdate(index, 'role', value)}
                placeholder="Enter role"
              />

              <div className="flex flex-wrap gap-2">
                {founder.signals.map((signal, signalIndex) => (
                  <Badge
                    key={signalIndex}
                    className="px-3 py-1 text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {signal}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience Summary */}
            <div className="space-y-4">
              <EditableField
                label="Bio"
                value={founder.bio}
                onChange={(value) => onUpdate(index, 'bio', value)}
                onAIEnhance={(action) => onAIEnhance(index, 'bio', action)}
                multiline
                placeholder="Enter bio"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Experience Highlights
                </label>
                <div className="space-y-2">
                  {founder.experience.map((exp, expIndex) => (
                    <div
                      key={expIndex}
                      className="px-4 py-2 rounded-lg bg-background border border-border text-sm"
                    >
                      {exp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
