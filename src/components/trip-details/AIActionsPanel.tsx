import { Button } from '../ui/button';
import { cn } from '../../lib/utils/utils';
import { useTripDetails } from './TripDetailsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';

interface AIAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  action: () => void;
  badge?: string;
}

export function AIActionsPanel() {
  const { 
    autoGenerateTrip, 
    optimizeItinerary, 
    checkConflicts, 
    conflicts,
    recommendations,
    autoScheduleDay,
    days 
  } = useTripDetails();

  const [showOptimizeDialog, setShowOptimizeDialog] = useState(false);
  const [showConflictsDialog, setShowConflictsDialog] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const handleOptimize = () => {
    // Mock optimization results
    setOptimizationResult({
      timeSaved: 45,
      distanceSaved: 12.3,
      costSaved: 15,
      changes: [
        'Grouped nearby activities in El Poblado',
        'Moved coffee tasting after Comuna 13 tour (same area)',
        'Scheduled indoor activities during afternoon heat'
      ]
    });
    setShowOptimizeDialog(true);
  };

  const handleConflictCheck = () => {
    checkConflicts();
    setShowConflictsDialog(true);
  };

  const actions: AIAction[] = [
    {
      id: 'auto-generate',
      title: 'Auto-Generate',
      description: 'Let AI build your entire itinerary',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: autoGenerateTrip,
      badge: 'Popular'
    },
    {
      id: 'optimize',
      title: 'Optimize Route',
      description: 'Reorder activities by proximity',
      icon: Map,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: handleOptimize,
      badge: 'Save time'
    },
    {
      id: 'check-conflicts',
      title: 'Check Conflicts',
      description: 'Find scheduling issues',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      action: handleConflictCheck,
      badge: conflicts.length > 0 ? `${conflicts.length} found` : undefined
    },
    {
      id: 'budget-optimize',
      title: 'Budget Optimizer',
      description: 'Find cost-effective alternatives',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => alert('Budget optimization coming soon!')
    },
    {
      id: 'auto-schedule',
      title: 'Auto-Schedule',
      description: 'Add times to all activities',
      icon: Calendar,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      action: () => {
        days.forEach((_, idx) => autoScheduleDay(idx));
      }
    },
    {
      id: 'weather-check',
      title: 'Weather Check',
      description: 'Get climate-aware suggestions',
      icon: Cloud,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      action: () => alert('Weather integration coming soon!')
    }
  ];

  return (
    <>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Concierge Actions</h3>
            <p className="text-xs text-slate-500">Let AI optimize your trip</p>
          </div>
        </div>

        <div className="space-y-2">
          {actions.map((action) => (
            <motion.button
              key={action.id}
              onClick={action.action}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-emerald-500 hover:shadow-md transition-all group text-left"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", action.bgColor, action.color)}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">{action.title}</span>
                  {action.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{action.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-6 p-3 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-xl border border-emerald-100">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">AI Suggestions</p>
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <p key={idx} className="text-xs text-slate-600 mb-1">• {rec}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optimization Results Dialog */}
      <Dialog open={showOptimizeDialog} onOpenChange={setShowOptimizeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              Optimization Complete
            </DialogTitle>
            <DialogDescription>
              Your itinerary has been optimized for efficiency and experience.
            </DialogDescription>
          </DialogHeader>

          {optimizationResult && (
            <div className="space-y-4 py-4">
              {/* Savings Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-900">{optimizationResult.timeSaved} min</div>
                  <div className="text-xs text-emerald-700 font-medium">Time Saved</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-900">{optimizationResult.distanceSaved} km</div>
                  <div className="text-xs text-blue-700 font-medium">Less Travel</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-purple-900">${optimizationResult.costSaved}</div>
                  <div className="text-xs text-purple-700 font-medium">Saved</div>
                </div>
              </div>

              {/* Changes */}
              <div>
                <p className="text-sm font-bold text-slate-900 mb-2">What Changed:</p>
                <div className="space-y-2">
                  {optimizationResult.changes.map((change: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptimizeDialog(false)}>
              Undo
            </Button>
            <Button onClick={() => { optimizeItinerary(); setShowOptimizeDialog(false); }} className="bg-emerald-600 hover:bg-emerald-700">
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conflicts Dialog */}
      <Dialog open={showConflictsDialog} onOpenChange={setShowConflictsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {conflicts.length > 0 ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  {conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Found
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  No Conflicts Found
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {conflicts.length > 0 
                ? 'I found some scheduling issues in your itinerary.' 
                : 'Your itinerary looks great! No scheduling conflicts detected.'
              }
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-96">
            <div className="space-y-2 py-4">
              {conflicts.length > 0 ? (
                conflicts.map((conflict, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{conflict}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                  <p className="text-sm">All activities are well-spaced with no overlaps.</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button onClick={() => setShowConflictsDialog(false)}>Close</Button>
            {conflicts.length > 0 && (
              <Button variant="outline">
                Fix Automatically
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}