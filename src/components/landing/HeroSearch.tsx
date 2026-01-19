import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Coffee, Mountain, Moon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { slowScale, fadeInUp } from '../../utils/animation';

const QUICK_CHIPS = [
  { label: 'Coffee', icon: Coffee },
  { label: 'Nature', icon: Mountain },
  { label: 'Nightlife', icon: Moon },
];

export const HeroSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/map?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* Background Image with Slow Scale */}
      <motion.div 
        variants={slowScale}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1515366974328-f1181eb25189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhJTIwY2l0eSUyMG1vdW50YWlucyUyMGx1eHVyeXxlbnwxfHx8fDE3NjU5MjMwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Medellín Skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Focus Dim Overlay */}
      <motion.div 
        animate={{ opacity: isFocused ? 0.6 : 0 }}
        className="absolute inset-0 bg-black/60 z-10 pointer-events-none transition-opacity duration-500"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 tracking-tight drop-shadow-lg"
        >
          Discover Medellín
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-10 max-w-xl font-light"
        >
          Experience the city of eternal spring through a curated lens of luxury and local culture.
        </motion.p>

        {/* Search Container */}
        <motion.div 
          initial={{ width: "100%", maxWidth: "600px" }}
          animate={{ 
            maxWidth: isFocused ? "700px" : "600px",
            scale: isFocused ? 1.02 : 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full"
        >
          <div className={`
            relative flex items-center w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-2xl transition-all duration-300
            ${isFocused ? 'bg-white/90 ring-4 ring-primary/20 border-white' : 'hover:bg-white/30'}
          `}>
            <Search className={`w-6 h-6 ml-6 ${isFocused ? 'text-primary' : 'text-white'}`} />
            
            <input 
              type="text"
              placeholder="What are you looking for?"
              aria-label="Search experiences in Medellín"
              className={`
                w-full py-5 px-4 bg-transparent border-none outline-none text-lg placeholder:text-white/70
                ${isFocused ? 'text-primary placeholder:text-primary/50' : 'text-white'}
              `}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button 
              onClick={handleSearch}
              className="mr-2 p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Chips */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/map?filter=${chip.label}`)}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-full 
                  bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium
                  hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105
                "
              >
                <chip.icon className="w-4 h-4" />
                {chip.label}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};