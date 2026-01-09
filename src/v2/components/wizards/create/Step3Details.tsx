/**
 * STEP 3: DETAILS (Combined Travelers + Budget)
 * 
 * Mobile-optimized combined step to reduce wizard length from 5 to 4 steps
 */

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { TouchTargetButton } from '../../mobile/TouchTarget';

interface Step3DetailsProps {
  adults: number;
  children: number;
  budget: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onBudgetChange: (value: number) => void;
}

export function Step3Details({
  adults,
  children,
  budget,
  onAdultsChange,
  onChildrenChange,
  onBudgetChange,
}: Step3DetailsProps) {
  const totalTravelers = adults + children;
  const perPersonBudget = totalTravelers > 0 ? Math.round(budget / totalTravelers) : 0;

  const quickBudgets = [500, 1000, 2500, 5000, 10000];

  const handleQuickBudget = (amount: number) => {
    onBudgetChange(amount);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Trip Details</h2>
        <p className="text-base text-gray-600">
          Who's traveling and what's your budget?
        </p>
      </div>

      {/* Travelers Section */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Travelers</h3>

        {/* Adults */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Adults</p>
            <p className="text-sm text-gray-600">Age 18+</p>
          </div>
          <div className="flex items-center gap-3">
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={() => onAdultsChange(Math.max(1, adults - 1))}
              disabled={adults <= 1}
              aria-label="Decrease adults"
            >
              <Minus className="w-5 h-5" />
            </TouchTargetButton>
            <span className="text-xl font-semibold text-gray-900 min-w-[48px] text-center">
              {adults}
            </span>
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={() => onAdultsChange(Math.min(10, adults + 1))}
              disabled={totalTravelers >= 10}
              aria-label="Increase adults"
            >
              <Plus className="w-5 h-5" />
            </TouchTargetButton>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Children</p>
            <p className="text-sm text-gray-600">Age 0-17</p>
          </div>
          <div className="flex items-center gap-3">
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={() => onChildrenChange(Math.max(0, children - 1))}
              disabled={children <= 0}
              aria-label="Decrease children"
            >
              <Minus className="w-5 h-5" />
            </TouchTargetButton>
            <span className="text-xl font-semibold text-gray-900 min-w-[48px] text-center">
              {children}
            </span>
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={() => onChildrenChange(Math.min(10, children + 1))}
              disabled={totalTravelers >= 10}
              aria-label="Increase children"
            >
              <Plus className="w-5 h-5" />
            </TouchTargetButton>
          </div>
        </div>

        {totalTravelers >= 10 && (
          <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
            Maximum 10 travelers. For larger groups, please contact support.
          </p>
        )}
      </div>

      {/* Budget Section */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Budget</h3>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Total budget for this trip
          </label>

          {/* Quick Select */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickBudgets.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickBudget(amount)}
                className={`
                  h-12 px-4 rounded-lg font-medium text-sm transition-all
                  ${
                    budget === amount
                      ? 'bg-blue-600 text-white border-2 border-blue-600'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-300'
                  }
                `}
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter custom amount:
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                $
              </span>
              <input
                type="number"
                value={budget || ''}
                onChange={(e) => onBudgetChange(Number(e.target.value) || 0)}
                min="0"
                step="100"
                className="w-full h-12 pl-8 pr-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                placeholder="2,500"
              />
            </div>
          </div>

          {/* Per Person Calculation */}
          {budget > 0 && totalTravelers > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Per person:</span>
                <span className="font-semibold text-gray-900">
                  ~${perPersonBudget.toLocaleString()}
                </span>
              </div>
              {children > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Based on {adults} {adults === 1 ? 'adult' : 'adults'} and {children} {children === 1 ? 'child' : 'children'}
                </p>
              )}
            </div>
          )}

          {/* Budget Tips */}
          {budget > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Budget tip:</strong> This includes all expenses like accommodation, food, activities, and transportation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {adults === 0 && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
          At least 1 adult traveler is required.
        </div>
      )}

      {budget > 0 && budget < 100 && (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-lg text-sm">
          Budget seems low. Make sure to include all trip expenses.
        </div>
      )}
    </div>
  );
}
