import { motion } from "motion/react";
import { Search, Map, Star } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Discover",
    description: "Browse curated events, properties, and hidden gems.",
    icon: Search,
  },
  {
    id: 2,
    title: "Plan",
    description: "Use our AI Concierge to build your perfect itinerary.",
    icon: Map,
  },
  {
    id: 3,
    title: "Experience",
    description: "Book instantly and enjoy VIP access across Medellín.",
    icon: Star,
  },
];

export function HowItWorksFlow() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Effortless Luxury
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Your journey from discovery to experience, simplified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border/30 -z-10">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="h-full bg-primary/20"
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-background border border-border flex items-center justify-center shadow-sm group-hover:shadow-luxury transition-all duration-300 z-10 relative">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="font-serif text-xl font-medium mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link to="/itinerary" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Start Planning Now
          </Link>
        </div>
      </div>
    </section>
  );
}
