import { useState } from "react";
import { ChevronDown, ChevronUp, Search, Link2, Linkedin } from "lucide-react";
import { Badge } from "../ui/badge";

interface ResearchQuery {
  query: string;
  sources: string[];
}

interface ResearchQueriesProps {
  queries: ResearchQuery[];
}

export function ResearchQueries({ queries }: ResearchQueriesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'website':
        return <Link2 className="w-3.5 h-3.5" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5" />;
      default:
        return <Search className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-background/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Research Queries Used
          </h2>
          <Badge variant="secondary" className="text-xs">
            {queries.length} queries
          </Badge>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-8 pb-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            These are the queries and sources Gemini used to gather information about your startup.
            This transparency helps you understand the basis of the analysis.
          </p>

          <div className="space-y-3">
            {queries.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-background space-y-2"
              >
                <div className="flex items-start gap-2">
                  <Search className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium flex-1">{item.query}</p>
                </div>
                
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-xs text-muted-foreground">Sources:</span>
                  <div className="flex items-center gap-2">
                    {item.sources.map((source, sourceIndex) => (
                      <Badge
                        key={sourceIndex}
                        variant="outline"
                        className="text-xs flex items-center gap-1.5"
                      >
                        {getSourceIcon(source)}
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
