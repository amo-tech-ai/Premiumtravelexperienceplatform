import { UseCaseLayout } from '../../components/use-cases/UseCaseLayout';
import { ProblemStatement } from '../../components/use-cases/ProblemStatement';
import { SolutionShowcase } from '../../components/use-cases/SolutionShowcase';
import { AIAgentsShowcase } from '../../components/use-cases/AIAgentsShowcase';
import { BeforeAfterComparison } from '../../components/use-cases/BeforeAfterComparison';
import { ExampleItinerary } from '../../components/use-cases/ExampleItinerary';
import { UseCaseTestimonial } from '../../components/use-cases/UseCaseTestimonial';
import { PricingTeaser } from '../../components/use-cases/PricingTeaser';
import { 
  Clock, 
  AlertCircle, 
  Lock, 
  Crown, 
  Calendar, 
  TrendingUp, 
  Headphones,
  Utensils,
  Sparkles,
  Bell
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export default function LuxuryTravelerPage() {
  // Problem Statement Data
  const painPoints = [
    {
      icon: Clock,
      title: 'Time is Your Most Valuable Asset',
      description: 'Wasting hours coordinating reservations',
    },
    {
      icon: AlertCircle,
      title: 'Inconsistent Service Quality',
      description: 'One bad restaurant ruins the entire trip',
    },
    {
      icon: Lock,
      title: 'Missing Exclusive Experiences',
      description: 'Not knowing about private events and hidden gems',
    },
  ];

  const scenarioStory = 
    "You're planning a milestone anniversary trip to Medellín. You want Michelin-quality dining, private tours, and seamless logistics. But you don't have time to vet 50 options or haggle with booking agents.";

  // Solution Showcase Data
  const keyFeatures = [
    {
      icon: Crown,
      title: 'Curated Exclusivity',
      description: 'Only top 5% of venues make it into our recommendations',
    },
    {
      icon: Calendar,
      title: 'Automated Booking',
      description: 'AI handles reservations, confirmations, and reminders',
    },
    {
      icon: TrendingUp,
      title: 'Price Monitoring',
      description: 'Get alerts when better rates or upgrades are available',
    },
    {
      icon: Headphones,
      title: '24/7 Concierge Chat',
      description: 'White-glove support whenever you need it',
    },
  ];

  // AI Agents Data
  const aiAgents = [
    {
      name: 'Dining Orchestrator',
      icon: Utensils,
      description: 'Curates dining experiences based on your preferences',
      helpText: 'Secures reservations at fully-booked restaurants',
      color: 'amber',
    },
    {
      name: 'Event Curator',
      icon: Sparkles,
      description: 'Discovers exclusive events and VIP experiences',
      helpText: 'Finds private tastings, exclusive clubs, VIP access',
      color: 'purple',
    },
    {
      name: 'Booking Assistant',
      icon: Bell,
      description: 'Automates all coordination and confirmations',
      helpText: 'Handles all coordination while you relax',
      color: 'rose',
    },
  ];

  // Before/After Data
  const beforeItems = [
    { text: '8+ hours calling restaurants' },
    { text: "Missed private wine tasting (didn't know it existed)" },
    { text: 'Paid $200 for mediocre "tourist trap" dinner' },
    { text: 'Spent trip coordinating logistics' },
    { text: 'No concierge at boutique hotel' },
  ];

  const afterItems = [
    { text: 'All reservations confirmed in 2 hours' },
    { text: 'Private coffee farm tour (AI discovered it)' },
    { text: "Chef's table at El Cielo ($180, perfect)" },
    { text: 'Itinerary managed automatically' },
    { text: '24/7 AI concierge via chat' },
  ];

  // Example Itinerary Data
  const itineraryDays = [
    {
      day: 1,
      title: 'VIP Arrival',
      cost: '$420',
      activities: [
        {
          time: '3:00 PM',
          title: 'Private Airport Transfer',
          description: 'AI pre-booked luxury car service',
          location: 'José María Córdova Airport',
        },
        {
          time: '4:30 PM',
          title: 'Check-in at The Charlee Hotel',
          description: 'Rooftop pool with city views',
          location: 'El Poblado',
        },
        {
          time: '6:00 PM',
          title: 'Sunset Cocktails',
          description: 'Envy Rooftop - AI reserved best table',
          location: 'Envy Rooftop',
        },
        {
          time: '8:00 PM',
          title: 'Dinner at Carmen',
          description: 'Michelin-recommended, AI booked 3 weeks ahead',
          location: 'El Poblado',
        },
      ],
    },
    {
      day: 2,
      title: 'Coffee & Culture',
      cost: '$385',
      activities: [
        {
          time: '9:00 AM',
          title: 'Private Coffee Farm Tour',
          description: 'AI found exclusive tour not listed online',
          location: 'Santa Elena',
        },
        {
          time: '1:00 PM',
          title: 'Lunch at Hacienda',
          description: 'Traditional cuisine, AI verified quality',
          location: 'Santa Elena',
        },
        {
          time: '3:00 PM',
          title: 'Botero Plaza Private Guide',
          description: 'Art historian matched by AI',
          location: 'Centro',
        },
        {
          time: '7:00 PM',
          title: 'Salsa Class + VIP Dinner',
          description: "Mondongo's private room arranged",
          location: 'El Poblado',
        },
      ],
    },
    {
      day: 3,
      title: 'Wellness & Indulgence',
      cost: '$520',
      activities: [
        {
          time: '10:00 AM',
          title: 'Morning Spa',
          description: 'The Charlee - AI booked treatments',
          location: 'Hotel Spa',
        },
        {
          time: '1:00 PM',
          title: 'Healthy Lunch at Verde',
          description: 'AI knows your dietary preferences',
          location: 'Laureles',
        },
        {
          time: '3:00 PM',
          title: 'Private Helicopter Tour',
          description: 'AI discovered via Event Curator',
          location: 'Medellín Valley',
        },
        {
          time: '7:00 PM',
          title: "Chef's Table at El Cielo",
          description: 'AI secured reservation 3 weeks prior',
          location: 'El Poblado',
        },
      ],
    },
    {
      day: 4,
      title: 'Adventure + Wine',
      cost: '$480',
      activities: [
        {
          time: '9:00 AM',
          title: 'Day Trip to Guatapé',
          description: 'Private driver coordinated by AI',
          location: 'Guatapé',
        },
        {
          time: '12:00 PM',
          title: 'Wine Tasting at Vineyard',
          description: 'AI found hidden gem winery',
          location: 'Guatapé Region',
        },
        {
          time: '7:00 PM',
          title: 'Return Rooftop Dinner',
          description: 'AI adjusted for late arrival',
          location: 'Medellín',
        },
      ],
    },
    {
      day: 5,
      title: 'Departure + Gifts',
      cost: '$340',
      activities: [
        {
          time: '10:00 AM',
          title: 'Shopping at Oviedo Mall',
          description: 'AI suggested best luxury stores',
          location: 'Oviedo Mall',
        },
        {
          time: '1:00 PM',
          title: 'Gourmet Lunch at Oci.Mde',
          description: 'Final memorable meal, AI reservation',
          location: 'El Poblado',
        },
        {
          time: '4:00 PM',
          title: 'Private Transfer to Airport',
          description: 'AI scheduled based on flight time',
          location: 'Airport',
        },
        {
          time: 'Post-Trip',
          title: 'All Receipts Organized',
          description: 'AI tracked expenses for report',
          location: 'Digital',
        },
      ],
    },
  ];

  // Pricing Teaser Data
  const whyThisPlan = [
    'All 6 AI agents (including Booking Assistant)',
    'Automated reservation management',
    'Exclusive event access',
    'Priority phone support',
    'Dedicated account manager',
    'White-glove concierge chat',
  ];

  return (
    <UseCaseLayout
      persona="For Luxury Travelers"
      headline="White-glove service. AI-powered precision."
      subheadline="Your personal concierge that never sleeps, never forgets, and always delivers."
      heroImage="https://images.unsplash.com/photo-1729707690998-1d4c5d755c0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbmZpbml0eSUyMHBvb2x8ZW58MXx8fHwxNzY2MjQ5NDczfDA&ixlib=rb-4.1.0&q=80&w=1080"
      primaryCTA={{
        text: 'Experience Concierge-Level AI',
        link: '/dashboard',
      }}
    >
      {/* Problem Statement */}
      <ProblemStatement
        heading="The Luxury Travel Challenge"
        painPoints={painPoints}
        scenarioStory={scenarioStory}
      />

      {/* Solution Showcase */}
      <SolutionShowcase
        heading="Your AI Concierge Team"
        keyFeatures={keyFeatures}
        demoImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjYxNzY1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
      />

      {/* AI Agents */}
      <AIAgentsShowcase agents={aiAgents} />

      {/* Before/After Comparison */}
      <BeforeAfterComparison
        beforeItems={beforeItems}
        afterItems={afterItems}
      />

      {/* Example Itinerary */}
      <ExampleItinerary
        title="Sample 5-Day Luxury Escape"
        days={itineraryDays}
        totalCost="$4,200 for 2 people"
        aiSavings="Priceless memories"
      />

      {/* Testimonial */}
      <UseCaseTestimonial
        quote="This isn't just an app. It's like having a personal assistant who knows Medellín better than the concierge at a 5-star hotel."
        author="Victoria Lawson"
        role="CEO & Luxury Travel Enthusiast"
        avatar="https://images.unsplash.com/photo-1692482386532-7a3c6a051144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY2MjQ5NDczfDA&ixlib=rb-4.1.0&q=80&w=1080"
        rating={5}
        plan="Concierge"
      />

      {/* Pricing Teaser */}
      <PricingTeaser
        planName="Concierge"
        price="$79"
        period="/month"
        badge="Best for Luxury Travelers"
        whyThisPlan={whyThisPlan}
        roi="One missed reservation or bad restaurant can cost $300+. Concierge plan pays for itself in one trip."
        ctaText="Get Concierge Access"
        ctaLink="/pricing"
        highlight={true}
      />

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-900">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready for effortless luxury?
            </h2>
            <p className="text-xl text-amber-900 mb-8">
              Join discerning travelers who demand excellence without the hassle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-slate-900 text-white hover:bg-slate-800 font-bold text-lg px-8 py-6 h-auto rounded-xl"
              >
                <Link to="/dashboard">
                  Start Your VIP Experience
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900/10 font-bold text-lg px-8 py-6 h-auto rounded-xl"
              >
                <Link to="/pricing">
                  Schedule a Concierge Demo
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-amber-900">
              White-glove onboarding included • Dedicated account manager
            </p>
          </div>
        </div>
      </section>
    </UseCaseLayout>
  );
}
