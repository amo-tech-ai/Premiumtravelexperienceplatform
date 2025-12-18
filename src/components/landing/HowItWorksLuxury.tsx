import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { 
  MessageSquare, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2,
  ArrowRight,
  Brain,
  Zap,
  TrendingUp
} from 'lucide-react';

// Activity card data from the design
const activityCards = [
  { title: 'Spa / Wellness', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop', position: { top: '15%', left: '52%' } },
  { title: 'Theater', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop', position: { top: '8%', right: '18%' } },
  { title: 'Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', position: { top: '18%', right: '30%' } },
  { title: 'Wildlife', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop', position: { top: '18%', right: '10%' } },
  { title: 'Resorts', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop', position: { top: '32%', left: '60%' } },
  { title: 'Fine Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', position: { top: '35%', right: '12%' } },
  { title: 'Historical Tours', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop', position: { top: '48%', left: '52%' } },
  { title: 'Cycling', image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&h=300&fit=crop', position: { top: '55%', right: '30%' } },
  { title: 'Water Sports', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop', position: { top: '50%', right: '10%' } },
];

const steps = [
  {
    id: 1,
    title: 'Start chatting with us',
    description: 'Ask us for suggestions for any destination or ask us for an entire itinerary. Be as specific as you can about the types of experiences you\'d like or take our quiz to determine your travel style.',
    icon: MessageSquare,
    stat: { value: '95%', label: 'Accuracy' },
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 2,
    title: 'AI curates your journey',
    description: 'Our 6 specialized AI agents work together to analyze your preferences, find hidden gems, optimize your schedule, and create the perfect itinerary.',
    icon: Sparkles,
    stat: { value: '10K+', label: 'Venues' },
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 3,
    title: 'Refine & personalize',
    description: 'Drag, drop, and adjust your itinerary. Swap activities, change timing, or ask our AI to suggest alternatives that match your vibe.',
    icon: Calendar,
    stat: { value: '3 min', label: 'Avg Time' },
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    title: 'Book & experience',
    description: 'Seamlessly book reservations, get VIP access, and receive real-time updates. Your personal concierge is available 24/7.',
    icon: CheckCircle2,
    stat: { value: '24/7', label: 'Support' },
    color: 'from-blue-500 to-indigo-600'
  }
];

// Animated connector line component
const AnimatedConnector = ({ 
  from, 
  to, 
  delay = 0 
}: { 
  from: { x: number; y: number }; 
  to: { x: number; y: number }; 
  delay?: number;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const isInView = useInView(pathRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
    }
  }, [isInView]);

  return (
    <motion.line
      ref={pathRef}
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="url(#gradient)"
      strokeWidth="2"
      strokeDasharray="1000"
      strokeDashoffset="1000"
      initial={{ strokeDashoffset: 1000 }}
      animate={isInView ? { strokeDashoffset: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: "easeInOut" }}
    />
  );
};

export const HowItWorksLuxury = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.95]);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
    >
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/10 to-purple-100/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-6 lg:px-12 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full text-violet-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Travel Intelligence
            </span>
            <h2 className="text-5xl lg:text-6xl font-serif text-slate-900 mb-6">
              How it Works
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              From conversation to confirmation in minutes. Experience the future of travel planning.
            </p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="space-y-32 mb-32">
          {steps.map((step, index) => (
            <StepCard 
              key={step.id} 
              step={step} 
              index={index} 
              isReverse={index % 2 === 1}
            />
          ))}
        </div>

        {/* AI Performance Dashboard */}
        <AIPerformancePanel />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-medium shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Individual Step Card Component
const StepCard = ({ 
  step, 
  index, 
  isReverse 
}: { 
  step: typeof steps[0]; 
  index: number;
  isReverse: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-150px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`grid lg:grid-cols-2 gap-12 items-center ${isReverse ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Content */}
      <div className={`${isReverse ? 'lg:order-2' : ''} space-y-6`}>
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-0.5`}
          >
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-slate-700" />
            </div>
          </motion.div>
          
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: isReverse ? 20 : -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-sm font-semibold text-violet-600 mb-2">
                STEP {index + 1}
              </div>
              <h3 className="text-3xl font-serif text-slate-900 mb-4">
                {step.title}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>

            {/* Stat Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-flex items-center gap-3 mt-6 px-6 py-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-full border border-slate-200"
            >
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{step.stat.value}</div>
                <div className="text-xs text-slate-500">{step.stat.label}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Visual */}
      <div className={`${isReverse ? 'lg:order-1' : ''}`}>
        {index === 0 ? (
          <ChatVisualization isInView={isInView} />
        ) : (
          <IllustratedCard 
            index={index} 
            isInView={isInView} 
            color={step.color}
          />
        )}
      </div>
    </motion.div>
  );
};

// Chat Interface Visualization
const ChatVisualization = ({ isInView }: { isInView: boolean }) => {
  const [activeCards, setActiveCards] = useState<number[]>([]);

  useEffect(() => {
    if (isInView) {
      activityCards.forEach((_, index) => {
        setTimeout(() => {
          setActiveCards(prev => [...prev, index]);
        }, index * 150);
      });
    }
  }, [isInView]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-8"
    >
      {/* User Avatar Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" 
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-violet-500/10 animate-pulse" />
        </motion.div>
      </div>

      {/* Activity Cards Floating Around */}
      {activityCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={activeCards.includes(index) ? {
            opacity: 1,
            scale: 1,
            x: card.position.left ? `calc(${card.position.left} - 50%)` : card.position.right ? `calc(${card.position.right} - 50%)` : 0,
            y: `calc(${card.position.top} - 50%)`
          } : {}}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            whileHover={{ scale: 1.1, zIndex: 30 }}
            className="group relative cursor-pointer"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="text-white text-xs font-medium leading-tight">
                  {card.title}
                </span>
              </div>
            </div>
            
            {/* Connecting line to center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
              <AnimatedConnector
                from={{ x: 48, y: 48 }}
                to={{ x: 0, y: 0 }}
                delay={index * 0.1 + 0.5}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Chat Input at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-8 right-8"
      >
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-4 flex items-center gap-3">
          <span className="text-slate-400 flex-1">Ask us anything...</span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Illustrated Card for other steps
const IllustratedCard = ({ 
  index, 
  isInView, 
  color 
}: { 
  index: number; 
  isInView: boolean; 
  color: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
      style={{ perspective: 1000 }}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90`} />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { 
              opacity: [0.1, 0.3, 0.1],
              scale: [0, 1, 0],
              x: Math.random() * 400,
              y: Math.random() * 400
            } : {}}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Content based on step */}
      <div className="relative z-10 p-12 h-full flex flex-col items-center justify-center text-white">
        {index === 1 && <AIAgentsVisualization isInView={isInView} />}
        {index === 2 && <DragDropVisualization isInView={isInView} />}
        {index === 3 && <BookingVisualization isInView={isInView} />}
      </div>
    </motion.div>
  );
};

// AI Agents Network Visualization
const AIAgentsVisualization = ({ isInView }: { isInView: boolean }) => {
  const agents = [
    'Dining', 'Itinerary', 'Booking', 'Events', 'Local Intel', 'Budget'
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center"
      >
        <Brain className="w-16 h-16 text-white" />
      </motion.div>

      {agents.map((agent, index) => {
        const angle = (index * 360) / agents.length;
        const radius = 140;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={agent}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
            }}
          >
            <div className="w-20 h-20 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center p-2">
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
                {agent}
              </span>
            </div>

            {/* Connecting line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              <motion.line
                x1="50%"
                y1="50%"
                x2={-x}
                y2={-y}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

// Drag and Drop Visualization
const DragDropVisualization = ({ isInView }: { isInView: boolean }) => {
  return (
    <div className="w-full space-y-4">
      {[1, 2, 3].map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { 
            opacity: 1, 
            x: 0,
            y: [0, -10, 0]
          } : {}}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.15,
            y: {
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              delay: index * 0.3
            }
          }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500" />
          <div className="flex-1">
            <div className="h-3 bg-slate-200 rounded-full w-3/4 mb-2" />
            <div className="h-2 bg-slate-100 rounded-full w-1/2" />
          </div>
          <div className="text-white/50">⋮⋮</div>
        </motion.div>
      ))}
    </div>
  );
};

// Booking Success Visualization
const BookingVisualization = ({ isInView }: { isInView: boolean }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: [0, 1.2, 1] } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-32 h-32 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h4 className="text-2xl font-serif mb-2">Confirmed!</h4>
        <p className="text-white/80">Your reservation is complete</p>
      </motion.div>

      {/* Confirmation details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl p-6 text-left space-y-3"
      >
        {['Dining at El Cielo', 'Today at 7:30 PM', '4 Guests', 'VIP Table'].map((detail, i) => (
          <div key={i} className="flex items-center gap-3 text-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm">{detail}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// AI Performance Dashboard Panel
const AIPerformancePanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { label: 'Response Time', value: 2.3, unit: 's', max: 5, color: 'from-violet-500 to-purple-600' },
    { label: 'Match Accuracy', value: 94, unit: '%', max: 100, color: 'from-emerald-500 to-teal-600' },
    { label: 'User Satisfaction', value: 4.8, unit: '/5', max: 5, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl border border-slate-700"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-white">AI Performance</h3>
          <p className="text-slate-400 text-sm">Real-time intelligence metrics</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-end">
              <span className="text-slate-400 text-sm">{metric.label}</span>
              <span className="text-3xl font-bold text-white">
                {metric.value}
                <span className="text-lg text-slate-400">{metric.unit}</span>
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(metric.value / metric.max) * 100}%` } : {}}
                transition={{ duration: 1.5, delay: index * 0.15 + 0.3, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${metric.color} rounded-full relative`}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 pt-8 border-t border-slate-700"
      >
        <div className="flex items-end gap-2 h-24">
          {[45, 62, 58, 73, 81, 78, 94, 89, 95, 92, 94].map((value, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${value}%` } : {}}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.05 }}
              className="flex-1 bg-gradient-to-t from-violet-500 to-purple-600 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-3 text-center">
          AI learning curve - Last 30 days
        </p>
      </motion.div>
    </motion.div>
  );
};
