import { motion } from "motion/react";
import { LuxuryCard } from "../ui/LuxuryCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

const categories = [
  {
    id: "nightlife",
    title: "Vibrant Nightlife",
    subtitle: "Exclusive parties & rooftop bars",
    image: "https://images.unsplash.com/photo-1515366974328-f1181eb25189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMG5pZ2h0bGlmZSUyMGx1eHVyeSUyMHBhcnR5fGVufDF8fHx8MTc2NTkzMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Trending",
    link: "/events",
  },
  {
    id: "nature",
    title: "Nature Escapes",
    subtitle: "Private tours & jungle retreats",
    image: "https://images.unsplash.com/photo-1750955424699-94d6ad2d350c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMG5hdHVyZSUyMGp1bmdsZSUyMGx1eHVyeXxlbnwxfHx8fDE3NjU5MzEzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Experiences",
    link: "/map",
  },
  {
    id: "investment",
    title: "Prime Real Estate",
    subtitle: "High-yield investment properties",
    image: "https://images.unsplash.com/photo-1680550723215-1a7b3d6ba19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMG1vZGVybiUyMGx1eHVyeSUyMGFwYXJ0bWVudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NTkzMTQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Investment",
    link: "/real-estate",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function CuratedCategories() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Curated Collections
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Handpicked experiences and properties tailored for the sophisticated traveler.
            </p>
          </div>
          <Link to="/experiences/medellin" className="hidden md:block">
            <Button variant="ghost" className="text-primary hover:text-primary/80 group">
              View All Categories <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link to={cat.link}>
                <LuxuryCard
                  image={cat.image}
                  title={cat.title}
                  subtitle={cat.subtitle}
                  badge={{ text: cat.badge, variant: cat.id === 'investment' ? 'emerald' : 'neutral' }}
                  className="h-full aspect-[4/5]"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}