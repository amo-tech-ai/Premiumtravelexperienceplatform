import { Variants } from "motion/react";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const slowScale: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: 1.05,
    transition: { duration: 10, ease: "linear" }
  }
};

export const softSlideIn: Variants = {
  hidden: { y: "100%" },
  visible: { 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30 
    }
  },
  exit: {
    y: "100%",
    transition: { duration: 0.3 }
  }
};
