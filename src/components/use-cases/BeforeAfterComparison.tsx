import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { X, Check } from 'lucide-react';

interface ComparisonItem {
  text: string;
}

interface BeforeAfterComparisonProps {
  beforeItems: ComparisonItem[];
  afterItems: ComparisonItem[];
}

export function BeforeAfterComparison({
  beforeItems,
  afterItems,
}: BeforeAfterComparisonProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              The Difference AI Makes
            </h2>
            <p className="text-xl text-slate-600">
              See the before and after transformation
            </p>
          </motion.div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
            {/* VS Badge (Desktop Only) */}
            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-xl border-4 border-white"
              >
                <span className="text-white font-bold text-sm">VS</span>
              </motion.div>
            </div>

            {/* WITHOUT AI - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border-2 border-slate-200 h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
                    <X className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-700">
                    Without AI
                  </h3>
                </div>

                {/* Pain Points List */}
                <ul className="space-y-4">
                  {beforeItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 leading-relaxed">
                        {item.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* VS Badge (Mobile Only) */}
            <div className="flex lg:hidden justify-center -my-4 z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-xl border-4 border-white"
              >
                <span className="text-white font-bold text-xs">VS</span>
              </motion.div>
            </div>

            {/* WITH AI - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-emerald-900">
                    With AI
                  </h3>
                </div>

                {/* Benefits List */}
                <ul className="space-y-4">
                  {afterItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-900 leading-relaxed font-medium">
                        {item.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
