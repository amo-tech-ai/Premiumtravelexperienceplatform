import React from 'react';
import { Check, Clock } from 'lucide-react';

interface AmenitiesProps {
  amenities: string[];
  schedule: {
    days: string;
    hours: string;
    notes: string;
  };
}

export const Amenities = ({ amenities, schedule }: AmenitiesProps) => {
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Amenities Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-serif text-slate-900 mb-6">Amenities Available</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-serif text-slate-900 mb-6">Schedule Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Opening Hours</h4>
                  <p className="text-slate-500 text-sm mt-1">{schedule.days}</p>
                  <p className="text-slate-500 text-sm">{schedule.hours}</p>
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-amber-900 text-sm">
                <strong>Note: </strong> {schedule.notes}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
