import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Sparkles, Compass, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface PricingCardProps {
  tier: 'explorer' | 'curator' | 'concierge';
  title: string;
  icon: string;
  price: {
    monthly: number;
    annual: number;
  };
  badge?: string;
  features: {
    included: string[];
    excluded?: string[];
  };
  agentCount: number;
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
  isPremium?: boolean;
  billingCycle: 'monthly' | 'annual';
  isHighlighted?: boolean;
}

const iconMap = {
  compass: Compass,
  sparkles: Sparkles,
  crown: Crown
};

export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  title,
  icon,
  price,
  badge,
  features,
  agentCount,
  ctaText,
  ctaLink,
  isPopular,
  isPremium,
  billingCycle,
  isHighlighted
}) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Sparkles;
  const currentPrice = price[billingCycle];
  const savings = billingCycle === 'annual' ? ((price.monthly - price.annual) * 12) : 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative group h-full",
        isHighlighted && "animate-pulse"
      )}
    >
      {/* Glow effect for popular/premium cards */}
      {(isPopular || isPremium) && (
        <div className={cn(
          "absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500",
          isPopular && "bg-gradient-to-r from-emerald-400 to-emerald-600",
          isPremium && "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500"
        )} />
      )}

      {/* Card */}
      <div className={cn(
        "relative h-full bg-white/80 backdrop-blur-xl rounded-3xl border-2 overflow-hidden transition-all duration-300",
        "shadow-lg hover:shadow-2xl",
        isPopular && "border-emerald-500 scale-105 z-10",
        isPremium && "border-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        !isPopular && !isPremium && "border-slate-200 hover:border-emerald-300"
      )}>
        {/* Premium gradient overlay */}
        {isPremium && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-500/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl" />
          </>
        )}

        <div className="relative p-8">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute top-6 right-6"
            >
              <Badge className={cn(
                "px-3 py-1 font-semibold",
                isPopular && "bg-emerald-100 text-emerald-900 border-emerald-300",
                isPremium && "bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-none shadow-lg shadow-amber-500/50"
              )}>
                {badge}
              </Badge>
            </motion.div>
          )}

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
              isPopular && "bg-emerald-100",
              isPremium && "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/50",
              !isPopular && !isPremium && "bg-slate-100"
            )}
          >
            <IconComponent className={cn(
              "w-8 h-8",
              isPopular && "text-emerald-600",
              isPremium && "text-white",
              !isPopular && !isPremium && "text-slate-600"
            )} />
          </motion.div>

          {/* Title */}
          <h3 className={cn(
            "text-2xl font-serif font-bold mb-2",
            isPremium ? "text-white" : "text-slate-900"
          )}>
            {title}
          </h3>

          {/* Agent Count */}
          <div className={cn(
            "flex items-center gap-2 mb-6 text-sm",
            isPremium ? "text-amber-300" : "text-slate-500"
          )}>
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">
              {agentCount === 6 ? 'All 6' : agentCount} AI Agent{agentCount !== 1 ? 's' : ''} included
            </span>
          </div>

          {/* Price */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={billingCycle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-baseline gap-2"
              >
                <span className={cn(
                  "text-5xl font-bold",
                  isPremium ? "bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent" : "text-slate-900"
                )}>
                  ${currentPrice}
                </span>
                <span className={cn(
                  "text-lg",
                  isPremium ? "text-slate-300" : "text-slate-500"
                )}>
                  /month
                </span>
              </motion.div>
            </AnimatePresence>

            {billingCycle === 'annual' && currentPrice > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-sm mt-2",
                  isPremium ? "text-emerald-300" : "text-emerald-600"
                )}
              >
                Save ${savings}/year with annual billing
              </motion.p>
            )}

            {currentPrice === 0 && (
              <p className="text-sm text-slate-500 mt-2">
                Forever free
              </p>
            )}
          </div>

          {/* CTA Button */}
          <Button
            asChild
            size="lg"
            className={cn(
              "w-full rounded-xl font-semibold shadow-lg transition-all duration-300",
              isPopular && "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105",
              isPremium && "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-105",
              !isPopular && !isPremium && "bg-slate-900 hover:bg-slate-800 text-white hover:scale-105"
            )}
          >
            <a href={ctaLink}>
              {ctaText}
            </a>
          </Button>

          {/* Feature List */}
          <div className="mt-8 space-y-3">
            {features.included.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                  isPremium ? "bg-emerald-400/20" : "bg-emerald-100"
                )}>
                  <Check className={cn(
                    "w-3.5 h-3.5",
                    isPremium ? "text-emerald-300" : "text-emerald-600"
                  )} />
                </div>
                <span className={cn(
                  "text-sm",
                  isPremium ? "text-slate-200" : "text-slate-700"
                )}>
                  {feature}
                </span>
              </motion.div>
            ))}

            {features.excluded && features.excluded.length > 0 && (
              <>
                <div className="my-4 border-t border-slate-200/50" />
                {features.excluded.map((feature, index) => (
                  <motion.div
                    key={`excluded-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (features.included.length + index) * 0.05 }}
                    className="flex items-start gap-3 opacity-50"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 mt-0.5">
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-500 line-through">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
