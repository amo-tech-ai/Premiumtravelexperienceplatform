import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronRight, ChevronLeft, ArrowRight, Check, Star, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageSlider } from '../components/ui/image-slider';

export default function HomeV2() {
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <Navigation />
      <HeroSection />
      <TrustBar />
      <ProblemSection />
      <AIAgentsSection />
      <TimelineSection />
      <FeaturesGrid />
      <DemoSection />
      <MetricsSection />
      <TravelShowcaseSlider />
      <UseCasesSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#1A2332]">
            Local Scout
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/how-it-works" className="text-slate-600 hover:text-[#1A2332] transition-colors">
              How It Works
            </Link>
            <Link to="/pricing" className="text-slate-600 hover:text-[#1A2332] transition-colors">
              Pricing
            </Link>
            <Link to="/use-cases" className="text-slate-600 hover:text-[#1A2332] transition-colors">
              Use Cases
            </Link>
            <Link to="/" className="text-slate-600 hover:text-[#1A2332] transition-colors text-sm">
              ← Back to Home V1
            </Link>
            <Button className="bg-[#1A2332] hover:bg-[#2D3748] text-white">
              Start Planning
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/how-it-works" className="block text-slate-600">How It Works</Link>
            <Link to="/pricing" className="block text-slate-600">Pricing</Link>
            <Link to="/use-cases" className="block text-slate-600">Use Cases</Link>
            <Link to="/" className="block text-slate-600">← Back to Home V1</Link>
            <Button className="w-full bg-[#1A2332]">Start Planning</Button>
          </div>
        )}
      </div>
    </nav>
  );
}

// Section 1: Hero
function HeroSection() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#FDFCF9] via-[#F0F4F8] to-[#E8F1F5]"
        style={{ transform: `translateY(${offset}px)` }}
      />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimatedHeadline />
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 animate-fadeIn">
          Six specialized agents work together to plan, optimize, and manage every detail of your perfect journey
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-[#1A2332] hover:bg-[#2D3748] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            Start Planning Free
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-slate-300 px-8 py-6 text-lg rounded-xl hover:border-[#D4AF37] transition-all"
          >
            <Play className="mr-2" size={20} />
            Watch Demo
          </Button>
        </div>

        <FloatingAgents />
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-slate-400 text-sm">Scroll to explore</div>
          <ChevronRight className="mx-auto mt-2 rotate-90" />
        </div>
      </div>
    </section>
  );
}

function AnimatedHeadline() {
  return (
    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fadeIn">
      <span className="bg-gradient-to-r from-[#1A2332] to-[#64748B] bg-clip-text text-transparent">
        Your Dream Trip,
        <br />
        Perfectly Orchestrated by AI
      </span>
    </h1>
  );
}

function FloatingAgents() {
  const agents = [
    { icon: '🗺️', name: 'Scout', color: 'from-green-400 to-green-600', delay: '0s' },
    { icon: '📋', name: 'Curator', color: 'from-amber-400 to-amber-600', delay: '0.2s' },
    { icon: '⚡', name: 'Optimizer', color: 'from-blue-400 to-blue-600', delay: '0.4s' },
  ];

  return (
    <div className="flex justify-center gap-6 mb-8">
      {agents.map((agent, index) => (
        <div
          key={agent.name}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
          style={{ animationDelay: agent.delay }}
        >
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl mb-3`}>
            {agent.icon}
          </div>
          <div className="font-semibold text-slate-700">{agent.name}</div>
        </div>
      ))}
    </div>
  );
}

// Section 2: Trust Bar
function TrustBar() {
  return (
    <section className="bg-slate-50 py-8 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-8 items-center">
            <div className="text-slate-400 text-sm">Trusted by</div>
            {/* Logo placeholders */}
            <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-24 h-8 bg-slate-300 rounded" />
              ))}
            </div>
          </div>
          
          <div className="flex gap-8">
            <Counter end={50000} suffix="+ Travelers" />
            <Counter end={2400000} suffix="+ Places" />
            <Counter end={95} suffix="% Satisfaction" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl font-bold text-[#1A2332]">
        {count.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

// Section 3: Problem
function ProblemSection() {
  const problems = [
    {
      icon: '📚',
      title: 'Scattered Research',
      description: 'Hours spent on dozens of websites trying to piece together the perfect trip',
    },
    {
      icon: '🔄',
      title: 'Endless Comparison',
      description: 'Switching between 10+ tabs comparing hotels, flights, and activities',
    },
    {
      icon: '📖',
      title: 'Generic Results',
      description: 'Cookie-cutter itineraries that miss the authentic local experiences',
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          Planning Travel Feels Like Work
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <ProblemCard key={index} {...problem} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ icon, title, description, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-3 transition-all duration-500 border border-slate-100 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-[#1A2332]">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Section 4: AI Agents
function AIAgentsSection() {
  const agents = [
    { icon: '🗺️', name: 'Scout Agent', role: 'Discovery', description: 'Find hidden gems', color: 'border-green-400' },
    { icon: '📋', name: 'Curator Agent', role: 'Curation', description: 'Select perfect places', color: 'border-amber-400' },
    { icon: '⚡', name: 'Optimizer Agent', role: 'Efficiency', description: 'Boost routes', color: 'border-blue-400' },
    { icon: '🎯', name: 'Concierge Agent', role: 'Service', description: 'Handle bookings', color: 'border-purple-400' },
    { icon: '💬', name: 'Collaboration Engine', role: 'Teamwork', description: 'Team planning', color: 'border-pink-400' },
    { icon: '🤖', name: 'Proactive Assistant', role: 'Intelligence', description: 'Monitor & suggest', color: 'border-red-400' },
  ];

  return (
    <section className="py-32 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          Six AI Agents Working as Your
          <br />
          Personal Travel Team
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} index={index} />
          ))}
        </div>

        <div className="flex justify-center gap-12 mt-16">
          <Stat icon="⚡" value="300ms" label="Response" />
          <Stat icon="🎯" value="95%" label="Accuracy" />
          <Stat icon="🕐" value="24/7" label="Available" />
        </div>
      </div>
    </section>
  );
}

function AgentCard({ icon, name, role, description, color, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 border-2 ${color} shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-[#1A2332]">{name}</h3>
      <Badge className="mb-3">{role}</Badge>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function Stat({ icon, value, label }: any) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-[#1A2332]">{value}</div>
      <div className="text-slate-600">{label}</div>
    </div>
  );
}

// Section 5: Timeline
function TimelineSection() {
  const steps = [
    { title: 'Tell Us Your Dream', description: '"I want to explore Colombia\'s coffee region"', icon: '💭' },
    { title: 'AI Agents Collaborate', description: 'Watch 6 agents work together in real-time', icon: '🤝' },
    { title: 'Review Your Plan', description: 'Drag, edit, and refine every detail', icon: '✏️' },
    { title: 'Collaborate with Friends', description: 'Share, vote, and finalize together', icon: '👥' },
    { title: 'Travel with AI Assistant', description: 'Proactive suggestions throughout your trip', icon: '📱' },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          From Idea to Itinerary in Minutes
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-[#D4AF37] to-slate-300" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <TimelineStep key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineStep({ title, description, icon, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex gap-8 items-start">
      {/* Number Badge */}
      <div className={`relative z-10 w-16 h-16 rounded-full bg-white border-4 border-[#D4AF37] flex items-center justify-center text-2xl font-bold text-[#1A2332] shadow-lg ${
        isVisible ? 'scale-100' : 'scale-0'
      } transition-transform duration-500`}>
        {index + 1}
      </div>
      
      <div className={`flex-1 bg-white rounded-2xl p-8 shadow-md ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      } transition-all duration-500 delay-200`}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-[#1A2332]">{title}</h3>
        <p className="text-slate-600 text-lg">{description}</p>
      </div>
    </div>
  );
}

// Section 6: Features
function FeaturesGrid() {
  const features = [
    { icon: '🎯', title: 'Drag & Drop Itinerary', description: 'Intuitive timeline builder' },
    { icon: '🤖', title: 'AI Auto Generate', description: 'Smart AI planning in 60sec' },
    { icon: '💬', title: 'Real-time Chat', description: 'Ask AI anything instantly' },
    { icon: '🔍', title: 'Smart Search', description: 'Filter & discover places' },
    { icon: '🧠', title: 'Context Aware', description: 'Personalized for you' },
    { icon: '📊', title: 'Multi Modal', description: 'Map, List & Detail views' },
  ];

  return (
    <section className="py-32 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          Everything You Need for Perfect Travel
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#CD7F32] flex items-center justify-center text-3xl hover:scale-110 hover:rotate-6 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-[#1A2332]">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

// Section 7: Demo
function DemoSection() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    'Beach vacation under $2000',
    '3-day food tour in Italy',
    'Adventure trip with kids',
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          Try Our AI Travel Assistant
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-slate-200">
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#CD7F32] flex items-center justify-center text-white">
                🤖
              </div>
              <div className="bg-slate-100 rounded-2xl px-6 py-4 max-w-md">
                <p className="text-slate-700">Where would you like to go?</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(suggestion)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your dream destination..."
                className="flex-1 px-6 py-4 border-2 border-slate-300 rounded-xl focus:border-[#D4AF37] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/20 transition-all"
              />
              <Button 
                onClick={handleSend}
                className="bg-[#1A2332] hover:bg-[#2D3748] px-8"
              >
                Send <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
              <Sparkles size={16} />
              Powered by 6 AI agents working together
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 8: Metrics
function MetricsSection() {
  const metrics = [
    { value: 95, suffix: '%', label: 'Accuracy', type: 'radial' },
    { value: 300, suffix: 'ms', label: 'Response Time', type: 'counter' },
    { value: 2400000, suffix: '+', label: 'Places', type: 'counter' },
    { value: 50000, suffix: '+', label: 'Trips Planned', type: 'counter' },
    { value: 87, suffix: '%', label: 'Satisfaction', type: 'stars' },
    { label: '24/7 Monitoring', type: 'pulse' },
  ];

  return (
    <section className="py-32 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          AI-Powered Intelligence You Can Trust
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ value, suffix, label, type, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-8 text-center shadow-md ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } transition-all duration-500`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {type === 'counter' && value && (
        <>
          <Counter end={value} suffix={suffix} />
          <div className="text-slate-600 mt-2">{label}</div>
        </>
      )}
      {type === 'radial' && (
        <>
          <div className="text-5xl font-bold text-[#D4AF37] mb-2">{value}{suffix}</div>
          <div className="text-slate-600">{label}</div>
        </>
      )}
      {type === 'stars' && (
        <>
          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="fill-[#D4AF37] text-[#D4AF37]" size={24} />
            ))}
          </div>
          <div className="text-3xl font-bold text-[#1A2332]">{value}{suffix}</div>
          <div className="text-slate-600">{label}</div>
        </>
      )}
      {type === 'pulse' && (
        <>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
            <div className="relative w-8 h-8 rounded-full bg-green-500" />
          </div>
          <div className="text-xl font-bold text-[#1A2332]">{label}</div>
        </>
      )}
    </div>
  );
}

// Section 9: Travel Showcase Slider
function TravelShowcaseSlider() {
  const slides = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzY2MjkzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Tropical beach paradise with turquoise water and palm trees',
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1595368062405-e4d7840cba14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjYzNTcyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Mountain hiking adventure with stunning peaks and trails',
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1764525640531-4fb4d33435c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjaXR5JTIwdHJhdmVsfGVufDF8fHx8MTc2NjQwOTA2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Luxury city travel destination with modern architecture',
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1759663783528-9ca0d54d9043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY2NDA5MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Cultural food market with local cuisine and vibrant atmosphere',
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1523652378734-5f7f62b35aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMGFyY2hpdGVjdHVyZSUyMHRyYXZlbHxlbnwxfHx8fDE3NjY0MDkwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Historic architecture showcasing ancient travel destinations',
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1712330138676-60e86456c218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjB0cmF2ZWx8ZW58MXx8fHwxNzY2NDA5MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Nature landscape with breathtaking scenic views',
    },
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          Discover Your Next Adventure
        </h2>
        <p className="text-center text-slate-600 text-xl max-w-2xl mx-auto mb-6">
          From pristine beaches to mountain peaks, explore destinations curated by AI
        </p>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <ImageSlider
          slides={slides}
          aspectRatio="4/3"
          slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap={24}
          showArrows={true}
          showDots={true}
          autoAdvance={true}
          interval={5000}
          className="mb-12"
        />

        <div className="text-center">
          <Link to="/explore">
            <Button 
              size="lg"
              className="bg-[#1A2332] hover:bg-[#2D3748] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Explore All Destinations <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Section 10: Use Cases
function UseCasesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const useCases = [
    { title: 'Family Vacation', description: 'Multi-gen planning made simple', icon: '👨‍👩‍👧‍👦', color: 'from-blue-400 to-blue-600' },
    { title: 'Solo Adventure', description: 'Flexible itinerary for one', icon: '🎒', color: 'from-purple-400 to-purple-600' },
    { title: 'Business Travel', description: 'Optimize your schedule', icon: '💼', color: 'from-green-400 to-green-600' },
    { title: 'Romantic Getaway', description: 'Perfect moments together', icon: '💑', color: 'from-pink-400 to-pink-600' },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          Perfect for Every Type of Traveler
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all snap-start"
              >
                <div className={`h-48 bg-gradient-to-br ${useCase.color} flex items-center justify-center text-6xl`}>
                  {useCase.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#1A2332]">{useCase.title}</h3>
                  <p className="text-slate-600">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {useCases.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? 'w-8 bg-[#D4AF37]' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 11: Testimonials
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  
  const testimonials = [
    {
      quote: "Local Scout transformed how we plan trips. The AI agents feel like having a personal travel advisor who knows exactly what we want.",
      author: "Sarah Martinez",
      role: "Digital Nomad",
      trips: "12 trips planned",
      avatar: "👩",
    },
    {
      quote: "I saved 15 hours of research on my last trip. The AI found hidden gems I would never have discovered on my own.",
      author: "James Chen",
      role: "Business Traveler",
      trips: "8 trips planned",
      avatar: "👨",
    },
    {
      quote: "Planning our family vacation has never been easier. Everyone could contribute and we made decisions together seamlessly.",
      author: "Maria Rodriguez",
      role: "Family Traveler",
      trips: "5 trips planned",
      avatar: "👩‍🦰",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const testimonial = testimonials[current];

  return (
    <section className="py-32 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-[#1A2332]">
          Loved by Travelers Worldwide
        </h2>
        <div className="w-32 h-1 bg-[#D4AF37] mx-auto mb-16" />
        
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center relative">
          <div className="text-8xl text-slate-200 absolute top-8 left-8 font-serif">"</div>
          
          <div className="relative z-10">
            <p className="font-serif text-2xl md:text-3xl text-[#1A2332] leading-relaxed mb-8">
              {testimonial.quote}
            </p>
            
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="fill-[#D4AF37] text-[#D4AF37]" size={28} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#CD7F32] flex items-center justify-center text-3xl border-3 border-[#D4AF37]">
                {testimonial.avatar}
              </div>
              <div className="text-left">
                <div className="font-bold text-lg text-[#1A2332]">{testimonial.author}</div>
                <div className="text-slate-600 text-sm">{testimonial.role} • {testimonial.trips}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all"
          >
            <ChevronLeft />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'w-8 bg-[#D4AF37]' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
            className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

// Section 12: CTA
function CTASection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2332] via-[#2D3748] to-[#1A2332]" />
      <div className="absolute inset-0 opacity-10">
        <div className="text-9xl">✈️🗺️🌍🏖️🏔️🎒</div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-black text-white mb-6">
          Ready to Plan Your Dream Trip?
        </h2>
        <p className="text-xl text-slate-300 mb-12">
          Join 50,000+ travelers who trust AI to plan their perfect adventures
        </p>
        
        <Button 
          size="lg"
          className="bg-white text-[#1A2332] hover:bg-slate-100 px-12 py-8 text-xl rounded-xl shadow-2xl hover:shadow-white/30 hover:-translate-y-2 transition-all mb-6"
        >
          Start Planning Free - No Credit Card
        </Button>
        
        <div className="text-slate-400 mb-12">
          Or <Link to="/pricing" className="text-white underline">Watch Demo →</Link>
        </div>

        <div className="flex justify-center gap-8 opacity-60">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-24 h-8 bg-white/20 rounded" />
          ))}
        </div>
        <div className="text-slate-400 text-sm mt-4">Featured in leading publications</div>
      </div>
    </section>
  );
}

// Section 13: Footer
function FooterSection() {
  return (
    <footer className="bg-gradient-to-b from-[#1A2332] to-[#0F1419] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-2">
            <div className="text-3xl font-bold mb-4">Local Scout</div>
            <p className="text-slate-400 mb-6">
              Your AI-powered trip operating system
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/ai-demo" className="text-slate-400 hover:text-white transition-colors">AI Agents</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Guides</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-12 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
          <p className="text-slate-400 mb-6">Get travel tips and AI updates</p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border-2 border-white/20 focus:border-[#D4AF37] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/20 transition-all text-white placeholder-slate-400"
            />
            <Button className="bg-[#D4AF37] hover:bg-[#CD7F32] text-[#1A2332] font-bold px-8">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © 2024 Local Scout. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}