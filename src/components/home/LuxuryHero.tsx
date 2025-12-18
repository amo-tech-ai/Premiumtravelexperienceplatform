import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "../ui/button";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function LuxuryHero() {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div ref={ref} className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1663269275922-6c5af53b317a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMG1vdW50YWlucyUyMGx1eHVyeSUyMHZpZXd8ZW58MXx8fHwxNzY1OTMxMzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Medellín Luxury View"
          className="w-full h-full object-cover scale-110" // Scale up slightly to avoid gaps during parallax
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
        >
          Smarter Discovery for Medellín
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light"
        >
          Events, places, properties, and trips — intelligently connected by AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/itinerary">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-12 text-base font-semibold">
              Plan Your Trip
            </Button>
          </Link>
          <Link to="/concierge">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white rounded-full px-8 h-12 text-base font-semibold backdrop-blur-sm">
              Ask Concierge
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/70"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
      </motion.div>
    </div>
  );
}
