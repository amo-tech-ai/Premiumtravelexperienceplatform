import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface PainPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ProblemStatementProps {
  heading: string;
  painPoints: PainPoint[];
  scenarioStory: string;
}

export function ProblemStatement({
  heading,
  painPoints,
  scenarioStory,
}: ProblemStatementProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-bold text-slate-900 text-center mb-16"
          >
            {heading}
          </motion.h2>

          {/* Pain Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {painPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {point.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Scenario Story Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 opacity-10">
                <svg
                  className="w-16 h-16 text-slate-900"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>
              </div>

              {/* Story Text */}
              <p className="font-serif text-lg md:text-xl text-slate-700 leading-relaxed mb-6 relative z-10">
                {scenarioStory}
              </p>

              {/* Transition Arrow */}
              <div className="flex items-center gap-3 text-primary font-bold">
                <span className="text-lg">There's a better way</span>
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
