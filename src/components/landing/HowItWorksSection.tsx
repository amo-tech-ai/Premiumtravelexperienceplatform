import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  Waves, 
  Utensils, 
  Building2, 
  Bird, 
  Theater, 
  Bike, 
  Landmark,
  Palmtree,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Image tile configuration matching the reference layout
const imageTiles = [
  {
    id: 'resort',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop',
    width: 140,
    height: 140,
    position: { top: '12%', left: '8%' },
    zIndex: 3,
  },
  {
    id: 'beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop',
    width: 170,
    height: 210,
    position: { top: '0%', left: '32%' },
    zIndex: 4,
  },
  {
    id: 'wildlife',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=400&fit=crop',
    width: 140,
    height: 140,
    position: { top: '8%', right: '8%' },
    zIndex: 3,
  },
  {
    id: 'historical',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=500&h=400&fit=crop',
    width: 170,
    height: 140,
    position: { top: '42%', left: '5%' },
    zIndex: 2,
  },
  {
    id: 'dining',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
    width: 140,
    height: 140,
    position: { top: '35%', right: '5%' },
    zIndex: 5,
  },
  {
    id: 'water-sports',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&h=400&fit=crop',
    width: 180,
    height: 140,
    position: { bottom: '8%', right: '8%' },
    zIndex: 3,
  },
  {
    id: 'cycling',
    image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&h=400&fit=crop',
    width: 140,
    height: 140,
    position: { bottom: '15%', left: '18%' },
    zIndex: 2,
  },
  {
    id: 'theater',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop',
    width: 140,
    height: 110,
    position: { top: '4%', right: '25%' },
    zIndex: 2,
  },
];

// Pill labels with icons
const pillLabels = [
  { id: 'spa', text: 'Spa / Wellness', icon: Sparkles, position: { top: '8%', left: '2%' }, linkedTile: 'resort' },
  { id: 'resorts', text: 'Resorts', icon: Building2, position: { top: '22%', left: '18%' }, linkedTile: 'resort' },
  { id: 'beach', text: 'Beach', icon: Palmtree, position: { top: '16%', left: '50%' }, linkedTile: 'beach' },
  { id: 'wildlife', text: 'Wildlife', icon: Bird, position: { top: '12%', right: '2%' }, linkedTile: 'wildlife' },
  { id: 'theater', text: 'Theater', icon: Theater, position: { top: '2%', right: '18%' }, linkedTile: 'theater' },
  { id: 'dining', text: 'Fine Dining', icon: Utensils, position: { top: '38%', right: '0%' }, linkedTile: 'dining' },
  { id: 'historical', text: 'Historical Tours', icon: Landmark, position: { top: '48%', left: '8%' }, linkedTile: 'historical' },
  { id: 'cycling', text: 'Cycling', icon: Bike, position: { bottom: '18%', left: '8%' }, linkedTile: 'cycling' },
  { id: 'water-sports', text: 'Water Sports', icon: Waves, position: { bottom: '4%', right: '2%' }, linkedTile: 'water-sports' },
];

// Individual tile card component
const TileCard = ({ 
  tile, 
  index, 
  isInView, 
  mouseX, 
  mouseY,
  hoveredTile,
  onHover 
}: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect based on mouse position
  const [parallaxX, setParallaxX] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    if (cardRef.current && mouseX !== null && mouseY !== null) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (mouseX - centerX) / 100;
      const deltaY = (mouseY - centerY) / 100;
      
      // Vary movement based on depth (index)
      const movement = 2 + (index % 3);
      setParallaxX(deltaX * movement);
      setParallaxY(deltaY * movement);
    }
  }, [mouseX, mouseY, index]);

  const isHovered = hoveredTile === tile.id;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        x: parallaxX,
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => onHover(tile.id)}
      onMouseLeave={() => onHover(null)}
      className="absolute cursor-pointer group"
      style={{
        width: tile.width,
        height: tile.height,
        ...tile.position,
        zIndex: isHovered ? 100 : tile.zIndex,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? -4 : parallaxY,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full h-full rounded-3xl overflow-hidden shadow-lg relative"
        style={{
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0,0,0,0.15)' 
            : '0 8px 24px rgba(0,0,0,0.08)'
        }}
      >
        <img 
          src={tile.image} 
          alt={tile.id}
          className="w-full h-full object-cover"
        />
        
        {/* Subtle highlight on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
        />
      </motion.div>
    </motion.div>
  );
};

// Pill label component
const PillTag = ({ 
  pill, 
  index, 
  isInView, 
  hoveredTile,
  onHover 
}: any) => {
  const Icon = pill.icon;
  const isActive = hoveredTile === pill.linkedTile;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: 0.3 + index * 0.06,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => onHover(pill.linkedTile)}
      onMouseLeave={() => onHover(null)}
      className="absolute cursor-pointer"
      style={pill.position}
    >
      <motion.div
        animate={{
          y: isActive ? -2 : 0,
          scale: isActive ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
      >
        <Icon className="w-4 h-4 text-slate-700" />
        <span className="text-sm font-medium text-slate-800 whitespace-nowrap">
          {pill.text}
        </span>
      </motion.div>
    </motion.div>
  );
};

// Center avatar component
const AvatarChip = ({ isInView }: { isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
    >
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-200/30 to-purple-200/30 blur-2xl scale-150" />
      
      {/* Avatar container */}
      <div className="relative w-28 h-28 rounded-full bg-white p-1 shadow-xl">
        <div className="w-full h-full rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" 
            alt="Travel Concierge"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Pulse effect */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full border-2 border-violet-400"
      />
    </motion.div>
  );
};

// Chat input component
const ChatInput = ({ isInView }: { isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
    >
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-4 flex items-center gap-3">
        <input 
          type="text"
          placeholder="Ask us anything..."
          className="flex-1 bg-transparent outline-none text-slate-600 placeholder:text-slate-400"
        />
        <div className="flex items-center gap-2 text-slate-400">
          <button className="hover:text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10h14M10 3v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="hover:text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
              <circle cx="7" cy="9" r="1" fill="currentColor"/>
              <circle cx="13" cy="9" r="1" fill="currentColor"/>
              <path d="M7 12c0 1.657 1.343 3 3 3s3-1.343 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="hover:text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main section component
export const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: null as number | null, y: null as number | null });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const isInView = useTransform(scrollYProgress, [0, 0.2], [false, true]);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    return isInView.on('change', (latest) => {
      if (latest && !inView) setInView(true);
    });
  }, [isInView, inView]);

  // Parallax for collage
  const collageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Mouse move parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (collageRef.current) {
      const rect = collageRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: null, y: null });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            How it Works
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 lg:pr-12"
          >
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Start chatting with us.
            </h3>
            
            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed">
              Ask for suggestions for any destination or ask us for an entire itinerary. 
              Tell us what you love—food, beaches, nightlife, nature—or take a quick quiz 
              and we'll tailor your trip style.
            </p>

            <motion.a
              href="#quiz"
              className="inline-flex items-center gap-2 text-slate-700 font-medium hover:text-slate-900 transition-colors group"
              whileHover={{ x: 4 }}
            >
              <span>Take the quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Right Column - Floating Collage */}
          <motion.div
            ref={collageRef}
            style={{ y: collageY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-[600px] lg:h-[700px]"
          >
            {/* Image Tiles */}
            {imageTiles.map((tile, index) => (
              <TileCard
                key={tile.id}
                tile={tile}
                index={index}
                isInView={inView}
                mouseX={mousePosition.x}
                mouseY={mousePosition.y}
                hoveredTile={hoveredTile}
                onHover={setHoveredTile}
              />
            ))}

            {/* Pill Labels */}
            {pillLabels.map((pill, index) => (
              <PillTag
                key={pill.id}
                pill={pill}
                index={index}
                isInView={inView}
                hoveredTile={hoveredTile}
                onHover={setHoveredTile}
              />
            ))}

            {/* Center Avatar */}
            <AvatarChip isInView={inView} />

            {/* Chat Input */}
            <ChatInput isInView={inView} />
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-violet-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};
