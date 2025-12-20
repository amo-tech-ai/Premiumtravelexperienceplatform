import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, DollarSign, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
}

interface DayItinerary {
  day: number;
  title: string;
  activities: Activity[];
  cost?: string;
}

interface ExampleItineraryProps {
  title: string;
  days: DayItinerary[];
  totalCost: string;
  aiSavings?: string;
}

export function ExampleItinerary({
  title,
  days,
  totalCost,
  aiSavings,
}: ExampleItineraryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentDay, setCurrentDay] = useState(0);

  const nextDay = () => {
    setCurrentDay((prev) => (prev + 1) % days.length);
  };

  const prevDay = () => {
    setCurrentDay((prev) => (prev - 1 + days.length) % days.length);
  };

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {title}
            </h2>
            <p className="text-xl text-slate-600">
              See AI planning in action
            </p>
          </motion.div>

          {/* Carousel Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Day Card */}
            <div className="bg-white rounded-2xl shadow-luxury border border-slate-200 overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-primary to-emerald-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-emerald-100 mb-1">
                      Day {days[currentDay].day}
                    </div>
                    <h3 className="text-2xl font-bold">
                      {days[currentDay].title}
                    </h3>
                  </div>
                  {days[currentDay].cost && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-bold">{days[currentDay].cost}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="p-8">
                <div className="space-y-6">
                  {days[currentDay].activities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-4 group"
                    >
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        {index < days[currentDay].activities.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 mt-2" />
                        )}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 pb-6">
                        <div className="text-sm font-medium text-primary mb-1">
                          {activity.time}
                        </div>
                        <h4 className="font-bold text-lg text-slate-900 mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-slate-600 text-sm mb-2">
                          {activity.description}
                        </p>
                        {activity.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {activity.location}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevDay}
                className="rounded-full w-12 h-12"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {days.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDay(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentDay
                        ? 'bg-primary w-8'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to day ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextDay}
                className="rounded-full w-12 h-12"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Cost Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-sm text-emerald-700 font-medium mb-1">
                  Total Trip Cost
                </div>
                <div className="text-4xl font-bold text-emerald-900">
                  {totalCost}
                </div>
                {aiSavings && (
                  <div className="text-sm text-emerald-600 mt-2">
                    AI saved you {aiSavings} vs manual planning
                  </div>
                )}
              </div>
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link to="/dashboard">
                  Create Your Own Itinerary
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
