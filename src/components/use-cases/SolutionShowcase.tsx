import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface KeyFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SolutionShowcaseProps {
  heading: string;
  flowchartImage?: string;
  keyFeatures: KeyFeature[];
  demoImage?: string;
}

export function SolutionShowcase({
  heading,
  flowchartImage,
  keyFeatures,
  demoImage,
}: SolutionShowcaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="solution" ref={ref} className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-emerald-50/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-bold text-slate-900 text-center mb-16"
          >
            {heading}
          </motion.h2>

          {/* Flowchart Visualization */}
          {flowchartImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16 bg-white rounded-2xl p-8 shadow-md border border-slate-200"
            >
              <img
                src={flowchartImage}
                alt="Solution flowchart"
                className="w-full h-auto"
              />
            </motion.div>
          )}

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Demo Screenshot */}
          {demoImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            >
              <img
                src={demoImage}
                alt="Live demo"
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Live Demo
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
