import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link } from 'react-router';

interface PricingTeaserProps {
  planName: string;
  price: string;
  period?: string;
  badge?: string;
  whyThisPlan: string[];
  roi?: string;
  ctaText?: string;
  ctaLink?: string;
  highlight?: boolean;
}

export function PricingTeaser({
  planName,
  price,
  period = '/month',
  badge,
  whyThisPlan,
  roi,
  ctaText = 'Start Free Trial',
  ctaLink = '/pricing',
  highlight = false,
}: PricingTeaserProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Recommended For You
            </h2>
            <p className="text-xl text-slate-300">
              The perfect plan for your travel style
            </p>
          </div>

          {/* Pricing Card */}
          <div className={`
            relative bg-white rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden
            ${highlight ? 'ring-4 ring-amber-400' : ''}
          `}>
            {/* Highlight Badge */}
            {badge && (
              <div className="absolute top-0 right-8">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-6 py-2 rounded-b-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-sm">{badge}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                {planName}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">
                  {price}
                </span>
                <span className="text-xl text-slate-600">
                  {period}
                </span>
              </div>
            </div>

            {/* Why This Plan Section */}
            <div className="mb-8">
              <h4 className="font-bold text-lg text-slate-900 mb-4">
                Why This Plan?
              </h4>
              <ul className="space-y-3">
                {whyThisPlan.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* ROI Highlight */}
            {roi && (
              <div className="mb-8 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-emerald-900 mb-1">
                      ROI Guarantee
                    </div>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      {roi}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Button
              size="lg"
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Link to={ctaLink}>
                {ctaText}
                <Zap className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            {/* Trust Badge */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>14-day free trial • No credit card required</span>
              </div>
            </div>

            {/* Decorative Background */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/5 to-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Link to Full Pricing */}
          <div className="text-center mt-8">
            <Link
              to="/pricing"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              View all plans and features →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}