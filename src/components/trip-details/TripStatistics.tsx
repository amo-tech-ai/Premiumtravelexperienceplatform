import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Clock, MapPin, Calendar, Users, AlertCircle } from 'lucide-react';
import { cn } from '../ui/utils';
import { useTripDetails } from './TripDetailsContext';
import { Progress } from '../ui/progress';

interface TripStatisticsProps {
  totalBudget: number;
  travelers: number;
  className?: string;
}

export function TripStatistics({ totalBudget, travelers, className }: TripStatisticsProps) {
  const { days } = useTripDetails();

  // Calculate statistics
  const stats = useMemo(() => {
    let totalCost = 0;
    let totalActivities = 0;
    let foodCount = 0;
    let activityCount = 0;
    let logisticsCount = 0;
    let bookedCount = 0;
    let plannedCount = 0;

    days.forEach(day => {
      day.items.forEach(item => {
        totalCost += item.cost || 0;
        totalActivities++;

        if (item.type === 'food') foodCount++;
        if (item.type === 'activity') activityCount++;
        if (item.type === 'logistics') logisticsCount++;

        if (item.status === 'booked' || item.status === 'confirmed') bookedCount++;
        if (item.status === 'planned') plannedCount++;
      });
    });

    const budgetUsed = totalBudget > 0 ? (totalCost / totalBudget) * 100 : 0;
    const costPerPerson = travelers > 0 ? totalCost / travelers : totalCost;
    const costPerDay = days.length > 0 ? totalCost / days.filter(d => d.items.length > 0).length : 0;

    return {
      totalCost,
      budgetUsed,
      totalActivities,
      foodCount,
      activityCount,
      logisticsCount,
      bookedCount,
      plannedCount,
      costPerPerson,
      costPerDay,
      daysPlanned: days.filter(d => d.items.length > 0).length
    };
  }, [days, totalBudget, travelers]);

  const budgetStatus = stats.budgetUsed > 100 ? 'over' : stats.budgetUsed > 80 ? 'warning' : 'good';

  return (
    <div className={cn("space-y-4", className)}>
      {/* Budget Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-bold text-slate-900">Budget Overview</h3>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1",
            budgetStatus === 'over' ? "bg-red-100 text-red-700" :
            budgetStatus === 'warning' ? "bg-amber-100 text-amber-700" :
            "bg-emerald-100 text-emerald-700"
          )}>
            {budgetStatus === 'over' ? (
              <><AlertCircle className="w-3 h-3" /> Over Budget</>
            ) : budgetStatus === 'warning' ? (
              <><AlertCircle className="w-3 h-3" /> {stats.budgetUsed.toFixed(0)}% Used</>
            ) : (
              <>On Track</>
            )}
          </div>
        </div>

        {/* Budget Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Spent</span>
            <span className="font-bold text-slate-900">${stats.totalCost.toFixed(0)} / ${totalBudget}</span>
          </div>
          <Progress 
            value={Math.min(stats.budgetUsed, 100)} 
            className={cn(
              "h-3",
              budgetStatus === 'over' ? "[&>div]:bg-red-500" :
              budgetStatus === 'warning' ? "[&>div]:bg-amber-500" :
              "[&>div]:bg-emerald-500"
            )}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Remaining: ${Math.max(0, totalBudget - stats.totalCost).toFixed(0)}</span>
            <span>{stats.budgetUsed.toFixed(1)}%</span>
          </div>
        </div>

        {/* Cost Breakdown Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Per Person</p>
              <p className="font-bold text-slate-900">${stats.costPerPerson.toFixed(0)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Per Day</p>
              <p className="font-bold text-slate-900">${stats.costPerDay.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">Trip Statistics</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">Days Planned</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{stats.daysPlanned} / {days.length}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">Total Activities</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{stats.totalActivities}</span>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">🍽️ Food & Dining</span>
              <span className="font-semibold text-slate-900">{stats.foodCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">🎯 Experiences</span>
              <span className="font-semibold text-slate-900">{stats.activityCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">✈️ Logistics</span>
              <span className="font-semibold text-slate-900">{stats.logisticsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Status */}
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">Booking Progress</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Confirmed</span>
            <span className="text-sm font-bold text-emerald-700">{stats.bookedCount} items</span>
          </div>
          
          <Progress 
            value={stats.totalActivities > 0 ? (stats.bookedCount / stats.totalActivities) * 100 : 0} 
            className="h-2 [&>div]:bg-emerald-500"
          />

          <div className="flex justify-between text-xs text-slate-600">
            <span>Still planning: {stats.plannedCount}</span>
            <span>{stats.totalActivities > 0 ? ((stats.bookedCount / stats.totalActivities) * 100).toFixed(0) : 0}% booked</span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">Quick Insights</h3>
        
        <div className="space-y-3">
          {stats.budgetUsed > 100 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900">Over Budget</p>
                <p className="text-xs text-red-700 mt-1">
                  You're ${(stats.totalCost - totalBudget).toFixed(0)} over budget. Consider cheaper alternatives.
                </p>
              </div>
            </div>
          )}

          {stats.foodCount === 0 && stats.totalActivities > 0 && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">No Meals Planned</p>
                <p className="text-xs text-amber-700 mt-1">
                  Don't forget to schedule dining reservations!
                </p>
              </div>
            </div>
          )}

          {stats.daysPlanned < days.length && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Finish Planning</p>
                <p className="text-xs text-blue-700 mt-1">
                  You have {days.length - stats.daysPlanned} empty days. Want AI to fill them?
                </p>
              </div>
            </div>
          )}

          {stats.bookedCount === 0 && stats.totalActivities > 0 && (
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
              <Clock className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-900">Start Booking</p>
                <p className="text-xs text-purple-700 mt-1">
                  No confirmed bookings yet. Secure your experiences early!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
