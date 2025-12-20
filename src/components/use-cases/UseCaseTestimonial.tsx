import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { Badge } from '../ui/badge';

interface UseCaseTestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating?: number;
  plan?: string;
}

export function UseCaseTestimonial({
  quote,
  author,
  role,
  avatar,
  rating = 5,
  plan,
}: UseCaseTestimonialProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl p-8 md:p-12 border-2 border-slate-200 shadow-luxury overflow-hidden">
            {/* Background Quote Icon */}
            <div className="absolute top-8 right-8 opacity-5">
              <Quote className="w-32 h-32 text-slate-900" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: rating }).map((_, index) => (
                  <Star key={index} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-2xl md:text-3xl text-slate-900 leading-relaxed mb-8">
                "{quote}"
              </blockquote>

              {/* Author Section */}
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={avatar}
                    alt={author}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>

                {/* Author Info */}
                <div className="flex-1">
                  <div className="font-bold text-lg text-slate-900 mb-1">
                    {author}
                  </div>
                  <div className="text-slate-600 text-sm mb-2">
                    {role}
                  </div>
                  {plan && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {plan} Plan
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-primary/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
