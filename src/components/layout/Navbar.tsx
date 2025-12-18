import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  variant?: 'light' | 'dark'; // 'light' means light text (for dark bg), 'dark' means dark text (for light bg)
}

const NavLink = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
  
  return (
    <Link to={to} className={`relative group ${className} ${isActive ? 'font-semibold' : ''}`}>
      {children}
      <span className={`absolute left-0 -bottom-1 w-full h-[1px] bg-current transition-transform duration-300 ease-out origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
    </Link>
  );
};

export const Navbar = ({ variant = 'dark' }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColorClass = isScrolled 
    ? "text-primary" 
    : variant === 'light' ? "text-white" : "text-primary";
    
  const linkColorClass = isScrolled
    ? "text-primary/70 hover:text-primary"
    : variant === 'light' ? "text-white/80 hover:text-white" : "text-primary/70 hover:text-primary";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-background/90 backdrop-blur-md py-4 shadow-luxury' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className={`text-2xl font-serif font-bold tracking-tight z-50 transition-colors ${textColorClass}`}>
            i love <span className="text-accent">Medellín</span>.
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/map" className={`text-sm font-medium transition-colors ${linkColorClass}`}>Map Explorer</NavLink>
            <NavLink to="/experiences/medellin" className={`text-sm font-medium transition-colors ${linkColorClass}`}>Experiences</NavLink>
            <NavLink to="/real-estate" className={`text-sm font-medium transition-colors ${linkColorClass}`}>Real Estate</NavLink>
            <NavLink to="/concierge" className={`text-sm font-medium transition-colors ${linkColorClass}`}>Concierge</NavLink>
            <NavLink to="/dashboard" className={`text-sm font-medium transition-colors ${linkColorClass}`}>Dashboard</NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className={`p-2 transition-colors ${isScrolled ? "text-primary/70 hover:text-primary" : variant === 'light' ? "text-white hover:text-accent" : "text-primary/70 hover:text-primary"}`} aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/itinerary" className={`px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-lg ${
              isScrolled 
                ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
                : variant === 'light' 
                  ? "bg-white text-primary hover:bg-gray-100 shadow-white/10" 
                  : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
            }`}>
              Plan My Trip
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden p-2 z-50 transition-colors ${isMobileMenuOpen ? "text-primary" : textColorClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />} 
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden flex flex-col h-screen"
          >
            <div className="flex flex-col gap-6 text-2xl font-serif text-primary">
              <Link to="/" className="block py-2 border-b border-primary/10">Home</Link>
              <Link to="/map" className="block py-2 border-b border-primary/10">Map Explorer</Link>
              <Link to="/experiences/medellin" className="block py-2 border-b border-primary/10">Experiences</Link>
              <Link to="/real-estate" className="block py-2 border-b border-primary/10">Real Estate</Link>
              <Link to="/dashboard" className="block py-2 border-b border-primary/10">Dashboard</Link>
              
              <Link to="/itinerary" className="block w-full py-4 bg-primary text-white rounded-2xl mt-4 shadow-luxury text-lg font-sans font-medium text-center">
                Plan My Trip
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
