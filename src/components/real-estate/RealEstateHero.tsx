import React from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight, PlayCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

export const RealEstateHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent opacity-70" />
      
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-sm font-medium mb-6 border border-emerald-200/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Real Estate Discovery</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif text-slate-900 leading-[1.1] mb-6">
              Smarter Property <br />
              Decisions, <span className="text-emerald-900">Powered by AI.</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
              Discover, analyze, and compare real estate with real-time market intelligence and local context. From investment opportunities to dream homes.
            </p>

            {/* Mock AI Input */}
            <div className="bg-white p-2 rounded-2xl shadow-luxury border border-slate-100 flex items-center gap-3 mb-8 max-w-lg group transition-shadow hover:shadow-xl cursor-pointer" onClick={() => navigate('/real-estate/search')}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Try &quot;Penthouse in Poblado with high ROI&quot;"
                className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium cursor-pointer"
                readOnly
              />
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-900 transition-colors flex items-center gap-2">
                Search
              </button>
            </div>

            <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate('/real-estate/search')}
                  className="text-slate-900 font-medium flex items-center gap-2 hover:gap-3 transition-all"
                >
                    Browse Collections <ArrowRight className="w-4 h-4" />
                </button>
                <button className="text-slate-500 font-medium flex items-center gap-2 hover:text-emerald-700 transition-colors">
                    <PlayCircle className="w-4 h-4" /> How it works
                </button>
            </div>

            {/* Mobile-only Hero Image */}
            <div className="mt-12 lg:hidden w-full aspect-video rounded-2xl overflow-hidden shadow-xl relative">
                <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1680550723215-1a7b3d6ba19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwbWVkZWxsaW58ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=800"
                    alt="Luxury Building"
                    className="w-full h-full object-cover"
                />
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/40">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Market Trend</div>
                    <div className="text-lg font-serif text-slate-900">+12.5%</div>
                </div>
            </div>
          </motion.div>

          {/* Right Column: Imagery Stack */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Main Image */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-0 right-0 w-[85%] h-[85%] rounded-[32px] overflow-hidden shadow-2xl z-10"
            >
                <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1680550723215-1a7b3d6ba19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwbWVkZWxsaW58ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Luxury Building"
                    className="w-full h-full object-cover"
                />
                {/* Floating Stats Card */}
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 max-w-[200px]">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Market Trend</div>
                    <div className="text-2xl font-serif text-slate-900 mb-1">+12.5%</div>
                    <div className="text-xs text-emerald-600 font-medium">Annual Growth in El Poblado</div>
                </div>
            </motion.div>

            {/* Secondary Image (Behind) */}
            <motion.div
                initial={{ opacity: 0, x: -30, rotate: -3 }}
                animate={{ opacity: 1, x: 0, rotate: -3 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-0 left-0 w-[55%] h-[50%] rounded-[32px] overflow-hidden shadow-xl z-20 border-4 border-white"
            >
                <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob21lJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Interior"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-soft-gold/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
