import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface UseCaseLayoutProps {
  persona: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  children: ReactNode;
}

export function UseCaseLayout({
  persona,
  headline,
  subheadline,
  heroImage,
  primaryCTA,
  children,
}: UseCaseLayoutProps) {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effect for hero image
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling past hero
      setShowFloatingCTA(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/use-cases" className="hover:text-foreground transition-colors">
              Use Cases
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{persona}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] overflow-hidden bg-slate-900">
        {/* Parallax Background Image */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={heroImage}
            alt={persona}
            className="w-full h-full object-cover"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 h-full flex items-center"
        >
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl">
              {/* Persona Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="secondary" className="mb-6 bg-white/90 text-primary backdrop-blur-md border-0 px-4 py-2 text-sm">
                  {persona}
                </Badge>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                {headline}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed"
              >
                {subheadline}
              </motion.p>

              {/* Primary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="bg-accent hover:bg-accent/90 text-slate-900 font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <a href="#solution">
                    {primaryCTA.text}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {children}
      </div>

      {/* Floating CTA Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: showFloatingCTA ? 0 : 100,
          opacity: showFloatingCTA ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          size="lg"
          asChild
          className="bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl rounded-full px-8 py-6 h-auto"
        >
          <Link to={primaryCTA.link}>
            {primaryCTA.text}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
