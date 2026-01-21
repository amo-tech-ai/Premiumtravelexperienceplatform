import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, Compass, Calendar, Building, Sparkles, LayoutDashboard, 
  ArrowRight, Search, MessageSquare, CreditCard, 
  MapPin, Globe, Link as LinkIcon, Zap, User, Users
} from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../components/ui/utils';

// Shared Components
const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-16 max-w-3xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 mb-6 tracking-tight">
      {title}
    </h2>
    <p className="text-xl text-slate-500 font-light">
      {subtitle}
    </p>
  </div>
);

const Card = ({ title, subtitle, primaryAction, secondaryAction, icon: Icon, path, color = "emerald" }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
  >
    <div className="flex items-start justify-between mb-8">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
        color === "emerald" ? "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white" : "",
        color === "amber" ? "bg-amber-50 text-amber-600 group-hover:bg-amber-400 group-hover:text-white" : "",
        color === "rose" ? "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white" : ""
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-mono text-slate-400">{path}</span>
    </div>
    
    <h3 className="text-2xl font-serif text-slate-900 mb-2 group-hover:text-emerald-900 transition-colors">
      {title}
    </h3>
    <p className="text-slate-500 mb-8 flex-grow">
      {subtitle}
    </p>
    
    <div className="space-y-3 mt-auto border-t border-slate-50 pt-6">
      <div className="flex items-center justify-between text-sm font-medium text-emerald-700">
        <span>{primaryAction}</span>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
      </div>
      <div className="text-sm text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
        {secondaryAction}
      </div>
    </div>
  </motion.div>
);

const FlowNode = ({ icon: Icon, label, subLabel }: any) => (
  <div className="flex flex-col items-center gap-4 relative z-10">
    <div className="w-16 h-16 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-emerald-800">
      <Icon className="w-7 h-7" />
    </div>
    <div className="text-center">
      <h4 className="font-semibold text-slate-900">{label}</h4>
      <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{subLabel}</p>
    </div>
  </div>
);

const ConnectionArrow = () => (
  <div className="hidden md:flex flex-1 items-center justify-center px-4 -mt-14">
    <div className="h-px bg-slate-200 w-full relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300" />
    </div>
  </div>
);

// Screen 1: Site Architecture
const SiteArchitecture = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <SectionHeader 
        title="Site Architecture & User Routes" 
        subtitle="How users explore Medellín using AI-guided journeys" 
      />
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        <Link to="/">
          <Card 
            title="Home"
            subtitle="Discovery & inspiration with immersive storytelling."
            primaryAction="Explore Medellín"
            secondaryAction="Ask AI Concierge"
            icon={Home}
            path="/"
          />
        </Link>
        <Link to="/experiences/medellin">
          <Card 
            title="Experiences & Tours"
            subtitle="Curated activities across city, nature, and culture."
            primaryAction="View Experiences"
            secondaryAction="Filter by Mood / Budget"
            icon={Compass}
            path="/experiences"
          />
        </Link>
        <Link to="/experiences/medellin">
          <Card 
            title="Events"
            subtitle="Concerts, nightlife, sports, and local festivals."
            primaryAction="Find Events"
            secondaryAction="Set Event Alerts"
            icon={Calendar}
            path="/events"
            color="rose"
          />
        </Link>
        <Link to="/real-estate">
          <Card 
            title="Real Estate"
            subtitle="Rentals & purchases for nomads and investors."
            primaryAction="Search Properties"
            secondaryAction="Talk to Local Expert"
            icon={Building}
            path="/real-estate"
          />
        </Link>
        <div onClick={() => window.dispatchEvent(new CustomEvent('open-ai-concierge'))} className="cursor-pointer">
           <Card 
            title="AI Concierge"
            subtitle="Conversational planning & real-time recommendations."
            primaryAction="Start AI Chat"
            secondaryAction="Save Plan"
            icon={Sparkles}
            path="/concierge"
            color="amber"
          />
        </div>
        <Link to="/itinerary">
          <Card 
            title="Bookings Dashboard"
            subtitle="Manage trips, bookings, and saved places."
            primaryAction="View My Plan"
            secondaryAction="Modify Booking"
            icon={LayoutDashboard}
            path="/dashboard"
          />
        </Link>
      </div>

      {/* Conversion Flow */}
      <div className="bg-slate-50 rounded-[3rem] p-12 md:p-16 border border-slate-100">
        <h3 className="text-center text-xl font-serif text-slate-900 mb-12">City Conversion Flow</h3>
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
          <FlowNode icon={Search} label="Inspiration" subLabel="Discover" />
          <ConnectionArrow />
          <FlowNode icon={MessageSquare} label="Personalization" subLabel="Ask AI" />
          <ConnectionArrow />
          <FlowNode icon={LayoutDashboard} label="Decision" subLabel="Compare" />
          <ConnectionArrow />
          <FlowNode icon={CreditCard} label="Booking" subLabel="Book" />
          <ConnectionArrow />
          <FlowNode icon={Sparkles} label="Enjoyment" subLabel="Experience" />
        </div>
      </div>
    </section>
  );
};

// Screen 2: AI Workflows
const AIWorkflows = () => {
  const tools = [
    { icon: Search, title: "Search Grounding", desc: "Local trends & data" },
    { icon: MapPin, title: "Google Maps", desc: "Spatial awareness" },
    { icon: LinkIcon, title: "URL Context", desc: "Live listings" },
    { icon: Zap, title: "Function Calling", desc: "Execution engine" },
  ];

  const scenarios = [
    "3-Day Medellín Trip Planner",
    "Concert + Dinner Night",
    "Digital Nomad Monthly Stay",
    "Family Relocation Rental",
    "Investor Property Shortlist",
    "Weekend Nature Escape"
  ];

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-slate-50/50">
      <SectionHeader 
        title="How the AI Concierge Works" 
        subtitle="Real-world city intelligence powered by Gemini 3" 
      />

      {/* Workflow Diagram */}
      <div className="relative mt-12 mb-24">
        {/* Connection Lines (Visual representation) */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
           <div className="absolute left-1/2 top-[100px] h-[120px] border-l-2 border-slate-200" />
           <div className="absolute left-1/2 top-[450px] h-[100px] border-l-2 border-slate-200" />
        </div>

        {/* Section 1: Entry Points */}
        <div className="flex justify-center gap-4 md:gap-8 mb-16 flex-wrap">
           {[
             { l: "Tourist", i: Compass }, 
             { l: "Digital Nomad", i: Globe }, 
             { l: "Investor", i: Building }, 
             { l: "Local Resident", i: Users }
            ].map((persona, idx) => (
             <div key={idx} className="bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100 flex items-center gap-3 text-sm font-medium text-slate-600">
               <persona.i className="w-4 h-4 text-emerald-600" />
               {persona.l}
             </div>
           ))}
        </div>

        {/* Section 2: Central AI Brain */}
        <div className="relative z-10 max-w-2xl mx-auto bg-gradient-to-br from-emerald-900 to-slate-900 rounded-[2.5rem] p-1 text-white shadow-2xl shadow-emerald-900/20 mb-16">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2.3rem] p-12 text-center border border-white/10">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
               <Sparkles className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-serif mb-2">Gemini 3 Pro</h3>
            <p className="text-emerald-200/80 font-light mb-8">City Intelligence Engine</p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {["Reasoning", "Context Awareness", "Tool Orchestration", "Structured Outputs"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Tools */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 mb-3">
                <tool.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">{tool.title}</h4>
              <p className="text-xs text-slate-500">{tool.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 4: Actions (List) */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-lg mb-16">
            <h4 className="text-center font-serif text-lg text-slate-900 mb-6">Automated Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {["Generate personalized itinerary", "Recommend events & tours", "Match properties to preferences", "Create day-by-day plans", "Trigger booking flows", "Send WhatsApp reminders"].map((action, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-sm text-slate-600">{action}</span>
                   </div>
               ))}
            </div>
        </div>

        {/* Section 5: Scenarios */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {scenarios.map((scene, i) => (
               <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                   <p className="text-xs font-medium text-slate-700 leading-tight">{scene}</p>
               </div>
           ))}
        </div>

      </div>
    </section>
  );
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="bg-slate-900 text-white py-4 text-center text-xs tracking-widest uppercase font-medium">
        Internal Documentation
      </div>
      <SiteArchitecture />
      <div className="h-px bg-slate-100 w-full" />
      <AIWorkflows />
    </div>
  );
}