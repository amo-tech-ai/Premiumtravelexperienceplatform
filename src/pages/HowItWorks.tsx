import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { 
  MessageSquare, Sparkles, Map, Share2, CreditCard, 
  ArrowRight, Check, Star, Zap, Search, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';

// --- Animated Typing Component ---
const TypingAnimation = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[index];
      
      if (isDeleting) {
        setDisplayedText(prev => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedText(prev => currentText.substring(0, prev.length + 1));
      }

      if (!isDeleting && displayedText === currentText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, index, texts]);

  return (
    <span className="font-medium text-slate-800">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// --- Hero Section ---
const Hero = () => (
  <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden bg-[#FAFAF9]">
    {/* Subtle Mesh Gradient Background */}
    <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-100/50 rounded-full blur-[100px]" />
    </div>

    <div className="container mx-auto max-w-7xl relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900 tracking-wide uppercase">AI-Powered Luxury Travel</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-serif font-medium text-slate-900 leading-[1.1] mb-6">
            Experience Medellín. <br />
            <span className="text-emerald-800 italic">Intelligently.</span>
          </h1>
          
          <p className="text-xl text-slate-500 font-light mb-10 max-w-lg leading-relaxed">
            Plan unforgettable trips with an AI concierge that knows the city like a local. 
            From hidden rooftop bars to private coffee tours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/concierge">
              <Button className="h-14 px-8 rounded-full bg-slate-900 text-white text-lg hover:bg-emerald-800 shadow-xl shadow-emerald-900/10 w-full sm:w-auto transition-all hover:scale-105">
                Start Planning
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" className="h-14 px-8 rounded-full border-slate-300 text-slate-700 text-lg hover:bg-white hover:border-emerald-300 w-full sm:w-auto">
                Explore Experiences
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Visuals */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 relative"
        >
          {/* Main Image Card */}
          <div className="relative z-20 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 rotate-1 hover:rotate-0 transition-transform duration-700 bg-white p-2">
             <div className="relative rounded-[2rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1591503487373-c466436e2978?q=80&w=1200&auto=format&fit=crop" 
                  alt="Medellín Cityscape" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-8">
                    <div className="flex gap-2 mb-2">
                      {['Culture', 'Nightlife', 'Luxury'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-serif text-white">The City of Eternal Spring</h3>
                    <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                        <Map className="w-3 h-3" /> 
                        El Poblado, Medellín
                    </p>
                </div>
             </div>
          </div>

          {/* Floating Live Interaction Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -top-6 -right-4 md:-right-8 z-30 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-slate-100 w-[260px] p-4 hidden md:block"
          >
             <div className="flex items-start gap-3 mb-3">
               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                 <Sparkles className="w-4 h-4 text-emerald-700" />
               </div>
               <div className="space-y-1">
                 <p className="text-xs text-slate-400 font-medium">AI Concierge Suggests</p>
                 <div className="text-sm leading-tight text-slate-700">
                    How about a <TypingAnimation texts={["rooftop dinner?", "coffee tasting?", "salsa class?"]} />
                 </div>
               </div>
             </div>
             
             {/* Mock Actions */}
             <div className="flex gap-2 mt-3">
                <div className="h-8 bg-slate-50 border border-slate-100 rounded-lg w-full flex items-center justify-center text-xs font-medium text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors">
                    Yes, book it
                </div>
                <div className="h-8 bg-slate-50 border border-slate-100 rounded-lg w-full flex items-center justify-center text-xs font-medium text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors">
                    View details
                </div>
             </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        </motion.div>
      </div>
    </div>
  </section>
);

// --- Step Card Component ---
const StepCard = ({ number, title, description, icon: Icon, delay, isLast }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
            className="relative flex-1"
        >
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group z-10 h-full flex flex-col items-start relative">
                <div className="absolute -top-5 -left-3 md:-top-6 md:left-8 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-serif font-bold shadow-lg group-hover:bg-emerald-600 transition-colors z-20">
                    {number}
                </div>
                <div className="mt-6 mb-6 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors border border-slate-100">
                    <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                    {description}
                </p>
            </div>
            
            {/* Mobile Connector Line */}
            {!isLast && (
                <div className="lg:hidden absolute left-8 top-full h-8 w-0.5 bg-slate-200 -ml-[1px] z-0" />
            )}
        </motion.div>
    );
};

// --- Journey Section ---
const Journey = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const width = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-32 px-6 lg:px-12 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 mb-6">
            Your Intelligent Journey
          </h2>
          <p className="text-xl text-slate-500 font-light">
            From a simple question to a fully booked luxury experience in five simple steps.
          </p>
        </div>

        <div className="relative">
             {/* Connector Line (Desktop) - Animated */}
             <div className="hidden lg:block absolute top-[40px] left-0 w-full h-0.5 bg-slate-100 z-0 rounded-full overflow-hidden">
                 <motion.div style={{ width }} className="h-full bg-emerald-500 origin-left" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative z-10">
                <StepCard 
                  number="01"
                  title="Ask"
                  description="Chat with our AI Concierge. Tell it your vibe, budget, and dreams."
                  icon={MessageSquare}
                  delay={0}
                />
                <StepCard 
                  number="02"
                  title="Suggest"
                  description="Get personalized recommendations for stays, dining, and events."
                  icon={Sparkles}
                  delay={0.1}
                />
                <StepCard 
                  number="03"
                  title="Build"
                  description="Drag and drop your favorites into a cohesive day-by-day itinerary."
                  icon={Map}
                  delay={0.2}
                />
                <StepCard 
                  number="04"
                  title="Share"
                  description="Invite friends to collaborate or share your plan with travel partners."
                  icon={Share2}
                  delay={0.3}
                />
                <StepCard 
                  number="05"
                  title="Book"
                  description="Secure reservations seamlessly and enjoy your trip."
                  icon={CreditCard}
                  delay={0.4}
                  isLast
                />
             </div>
        </div>
      </div>
    </section>
  );
};

// --- Features Grid (Why Us) ---
const Feature = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex gap-4 group">
    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-1 border border-emerald-100 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-colors">
      <Check className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
    </div>
    <div>
      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const WhyUs = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
      <section ref={ref} className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div>
                <div className="inline-block px-4 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    Why Choose AI?
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-medium text-slate-900 mb-8 leading-tight">
                  Stop planning. <br/>Start exploring.
                </h2>
                <div className="space-y-8">
                  <Feature 
                    title="Local Knowledge, Instantly" 
                    desc="Access thousands of curated data points about Medellín's best hidden gems without reading 50 blog posts."
                  />
                  <Feature 
                    title="Dynamic Planning" 
                    desc="Plans change. Our AI adapts your itinerary in seconds if it rains or you wake up late."
                  />
                  <Feature 
                    title="Luxury Curation" 
                    desc="We filter for quality. Only the best rooftops, chefs, and guides make it into our knowledge base."
                  />
                </div>
                
                <div className="mt-12 pt-10 border-t border-slate-100">
                   <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                               <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                            </div>
                         ))}
                      </div>
                      <div>
                         <div className="flex items-center text-amber-400 text-sm mb-1">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                         </div>
                         <p className="text-sm font-bold text-slate-900">Trusted by 2,000+ travelers</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="relative h-[600px] w-full hidden lg:block rounded-3xl overflow-hidden">
                 <motion.div style={{ y }} className="absolute inset-0">
                     <img 
                       src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop" 
                       alt="Luxury Hotel" 
                       className="w-full h-[120%] object-cover"
                     />
                 </motion.div>
                 
                 {/* Chat Bubble UI Overlay */}
                 <div className="absolute bottom-12 left-8 right-8 z-20 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-emerald-700" />
                       </div>
                       <div className="text-sm text-slate-700">
                          <p className="font-bold mb-1 text-slate-900 text-base">Personalized Suggestion</p>
                          <p className="leading-relaxed">Since you enjoy architecture and history, I've added a private guided tour of the <strong>El Castillo Museum</strong> for Sunday morning, followed by brunch in the gardens.</p>
                       </div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
}

// --- CTA Section ---
const CTA = () => (
  <section className="py-32 px-6 lg:px-12 bg-[#0F172A] text-white text-center relative overflow-hidden">
     {/* Background Pattern */}
     <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
     </div>
     
     <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-8 backdrop-blur-sm border border-white/10 shadow-lg shadow-emerald-500/20"
        >
           <Zap className="w-8 h-8 text-amber-400" />
        </motion.div>
        
        <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Ready to experience <br/>
            <span className="text-emerald-400">Medellín like a VIP?</span>
        </h2>
        
        <p className="text-xl text-slate-300 mb-12 font-light max-w-xl mx-auto leading-relaxed">
           Start chatting with our AI Concierge and build your dream itinerary in minutes. No credit card required.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/concierge">
               <Button className="h-16 px-10 rounded-full bg-white text-slate-900 text-lg hover:bg-emerald-50 font-bold shadow-xl shadow-white/5 w-full sm:w-auto hover:scale-105 transition-all">
                  Start Planning Now
               </Button>
            </Link>
            <Link to="/how-it-works">
                <Button variant="outline" className="h-16 px-10 rounded-full border-slate-700 text-white text-lg hover:bg-slate-800 hover:border-slate-600 w-full sm:w-auto">
                    View Sample Itinerary
                </Button>
            </Link>
        </div>
     </div>
  </section>
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Journey />
      <WhyUs />
      <CTA />
    </div>
  );
}
