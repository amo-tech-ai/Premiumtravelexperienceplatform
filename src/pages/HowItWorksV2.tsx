import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { 
  MessageSquare, 
  Calendar, 
  Star, 
  Users, 
  Upload,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  benefits: string[];
  delay?: number;
}

function StepCard({ number, title, description, icon, benefits, delay = 0 }: StepCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: "easeOut" }}
      className="relative"
    >
      {/* Connector Line */}
      <div className="absolute left-8 top-24 bottom-0 w-px bg-gradient-to-b from-amber-200 to-transparent hidden lg:block" />
      
      <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-amber-100/50">
        {/* Number Badge */}
        <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="font-serif text-2xl font-bold text-white">{number}</span>
        </div>

        {/* Icon */}
        <div className="mb-6 w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-serif text-3xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-600 text-lg leading-relaxed mb-8">{description}</p>

        {/* Benefits List */}
        <div className="space-y-3">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: delay * 0.1 + idx * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureHighlight({ icon, title, description }: FeatureHighlightProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-8 border border-amber-100/50 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
        {icon}
      </div>
      <h4 className="font-serif text-xl font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function HowItWorksV2() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const steps = [
    {
      number: "1",
      title: "Start with conversation",
      description: "Tell us about your travel dreams in natural language. Our AI understands context, preferences, and even unspoken desires.",
      icon: <MessageSquare className="w-8 h-8" />,
      benefits: [
        "No forms or rigid inputs—just chat naturally",
        "AI learns your style as you talk",
        "Ask questions and get instant insights",
        "Refine ideas in real-time dialogue"
      ]
    },
    {
      number: "2",
      title: "Receive a smart itinerary",
      description: "Watch as AI crafts a beautiful, optimized trip plan tailored to your interests, pace, and budget.",
      icon: <Calendar className="w-8 h-8" />,
      benefits: [
        "Day-by-day timeline with perfect pacing",
        "Optimized routes to save time and energy",
        "Smart suggestions based on weather and hours",
        "Visual timeline with maps and photos"
      ]
    },
    {
      number: "3",
      title: "Personalize every detail",
      description: "Tweak, swap, and refine. Every recommendation comes with alternatives and AI explains why it's perfect for you.",
      icon: <Star className="w-8 h-8" />,
      benefits: [
        "Drag-and-drop to reorder your day",
        "See confidence scores for each suggestion",
        "Get alternatives with one click",
        "Understand why each place was chosen"
      ]
    },
    {
      number: "4",
      title: "Collaborate seamlessly",
      description: "Invite travel companions to vote, comment, and build the perfect trip together—without endless group chats.",
      icon: <Users className="w-8 h-8" />,
      benefits: [
        "Real-time collaboration without chaos",
        "Vote on activities and resolve conflicts",
        "See who suggested what and why",
        "Comments and reactions keep everyone aligned"
      ]
    },
    {
      number: "5",
      title: "Organize everything",
      description: "Upload receipts, tickets, screenshots—AI automatically sorts and attaches them to the right day and place.",
      icon: <Upload className="w-8 h-8" />,
      benefits: [
        "Drag-and-drop any file or screenshot",
        "Auto-categorization by day and activity",
        "OCR extracts key details automatically",
        "All trip documents in one beautiful place"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-amber-50/30 via-white to-slate-50">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-slate-50"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-200/50 shadow-lg mb-8"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700">Detailed Product Walkthrough</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-serif text-6xl lg:text-8xl font-bold text-slate-900 mb-8 leading-tight"
            >
              How planning
              <br />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                becomes effortless
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              From first conversation to final itinerary—see how AI, collaboration, 
              and beautiful design come together to transform how you plan travel.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/explore">
                  Start planning now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-6 text-lg rounded-2xl hover:bg-slate-50"
              >
                <Link to="/how-it-works">
                  See quick overview
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-slate-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Steps Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
            >
              Five steps to your
              <br />
              perfect trip
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 leading-relaxed"
            >
              Each step is designed to feel natural, intelligent, and delightful. 
              No complexity. No overwhelm. Just thoughtful tools that work.
            </motion.p>
          </div>

          {/* Steps Grid */}
          <div className="max-w-4xl mx-auto space-y-16">
            {steps.map((step, idx) => (
              <StepCard
                key={step.number}
                {...step}
                delay={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
            >
              Why it works beautifully
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600"
            >
              The thoughtful details that make planning feel magical.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureHighlight
              icon={<Clock className="w-6 h-6" />}
              title="Time-aware planning"
              description="AI considers opening hours, travel time, and optimal pacing so you never feel rushed or wait unnecessarily."
            />
            <FeatureHighlight
              icon={<MapPin className="w-6 h-6" />}
              title="Geographic intelligence"
              description="Routes are optimized to minimize backtracking. See everything on a map that updates as you adjust your plan."
            />
            <FeatureHighlight
              icon={<Heart className="w-6 h-6" />}
              title="Vibe-based matching"
              description="Beyond ratings—AI understands atmosphere, local character, and whether a place matches your travel style."
            />
            <FeatureHighlight
              icon={<TrendingUp className="w-6 h-6" />}
              title="Confidence scores"
              description="Every suggestion shows how well it matches your preferences, so you can trust recommendations or explore alternatives."
            />
            <FeatureHighlight
              icon={<Users className="w-6 h-6" />}
              title="Conflict resolution"
              description="Group trips made easy with voting, version history, and AI that finds options everyone will love."
            />
            <FeatureHighlight
              icon={<Sparkles className="w-6 h-6" />}
              title="Continuous learning"
              description="The more you use it, the smarter it gets. AI remembers what you loved and refines future recommendations."
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl lg:text-6xl font-bold mb-6 text-center"
            >
              Old way vs. our way
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {/* Old Way */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl">
                    😓
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-300">The old way</h3>
                </div>
                <ul className="space-y-4 text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    <span>Hours of spreadsheet planning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    <span>Endless browser tabs for research</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    <span>Group chat chaos and indecision</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    <span>Scattered documents and receipts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    <span>No idea if your route makes sense</span>
                  </li>
                </ul>
              </motion.div>

              {/* Our Way */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur rounded-2xl p-8 border border-amber-400/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <h3 className="font-serif text-2xl font-bold">Our way</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Natural conversation builds your plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>AI curates and explains every choice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Seamless collaboration with voting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Everything organized automatically</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Routes optimized before you even ask</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-300/30 to-orange-300/30 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-5xl lg:text-7xl font-bold text-slate-900 mb-8">
                Ready to plan
                <br />
                your next adventure?
              </h2>
              <p className="text-xl lg:text-2xl text-slate-700 mb-12 max-w-2xl mx-auto">
                Join thousands of travelers who've discovered a better way to plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-7 text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <Link to="/explore">
                    Start planning for free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 px-10 py-7 text-lg rounded-2xl transition-all duration-300"
                >
                  <Link to="/pricing">
                    See pricing
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
