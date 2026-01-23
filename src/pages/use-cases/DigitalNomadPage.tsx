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
  DollarSign, 
  Wifi, 
  Search, 
  Calendar, 
  TrendingDown, 
  Users,
  MapPin,
  Utensils,
  Shield
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';

export default function DigitalNomadPage() {
  // Problem Statement Data
  const painPoints = [
    {
      icon: Clock,
      title: 'Time-Consuming Research',
      description: 'Spending evenings researching instead of exploring',
    },
    {
      icon: DollarSign,
      title: 'Budget Uncertainty',
      description: 'Tracking expenses across currencies and platforms',
    },
    {
      icon: Wifi,
      title: 'Connectivity Anxiety',
      description: 'Never knowing if your Airbnb has reliable internet',
    },
  ];

  const scenarioStory = 
    "You've just landed in Medellín for a 3-month stay. Between client calls, you need to find coworking spaces, affordable eats, and weekend adventures. But every Google search leads to 47 open tabs and decision paralysis.";

  // Solution Showcase Data
  const keyFeatures = [
    {
      icon: Wifi,
      title: 'WiFi-First Filtering',
      description: 'Every venue shows internet speed ratings from real nomads',
    },
    {
      icon: TrendingDown,
      title: 'Budget Dashboard',
      description: 'Real-time spending tracker across all your bookings',
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Drag-and-drop itinerary that adjusts for work calls',
    },
    {
      icon: Users,
      title: 'Nomad Community',
      description: 'Connect with other remote workers in Medellín',
    },
  ];

  // AI Agents Data
  const aiAgents = [
    {
      name: 'Local Scout',
      icon: Search,
      description: 'Discovers hidden gems and authentic local experiences',
      helpText: 'Finds coworking spaces with fast WiFi and power outlets',
      color: 'emerald',
    },
    {
      name: 'Dining Orchestrator',
      icon: Utensils,
      description: 'Curates dining experiences based on your preferences',
      helpText: 'Recommends cafés with laptop-friendly vibes',
      color: 'amber',
    },
    {
      name: 'Budget Guardian',
      icon: Shield,
      description: 'Monitors spending and optimizes for value',
      helpText: 'Tracks daily spend and alerts you to save money',
      color: 'blue',
    },
  ];

  // Before/After Data
  const beforeItems = [
    { text: '5+ hours researching coworking spaces' },
    { text: 'Spreadsheets to track expenses' },
    { text: 'Missed happy hour deals' },
    { text: 'Overpaid for slow WiFi Airbnb' },
    { text: 'Ate at touristy overpriced spots' },
  ];

  const afterItems = [
    { text: '10 minutes to plan entire week' },
    { text: 'Auto budget tracking' },
    { text: 'Daily alerts for nomad events' },
    { text: 'WiFi speed verified before booking' },
    { text: 'Local spots with laptop seating' },
  ];

  // Example Itinerary Data
  const itineraryDays = [
    {
      day: 1,
      title: 'Arrival + WiFi Setup',
      cost: '$45',
      activities: [
        {
          time: '2:00 PM',
          title: 'Airport → Poblado Airbnb',
          description: 'WiFi: 100 Mbps verified by AI',
          location: 'El Poblado',
        },
        {
          time: '4:00 PM',
          title: 'Coworking Day Pass',
          description: 'AI recommended Selina for first-day productivity',
          location: 'Selina Medellín',
        },
        {
          time: '7:00 PM',
          title: 'Welcome Dinner',
          description: "Mondongo's - budget-friendly, local favorite",
          location: 'El Poblado',
        },
      ],
    },
    {
      day: 2,
      title: 'Work + Explore',
      cost: '$30',
      activities: [
        {
          time: '9:00 AM - 2:00 PM',
          title: 'Deep Work Session',
          description: 'Atom House coworking - quiet zone reserved',
          location: 'Atom House',
        },
        {
          time: '2:00 PM',
          title: 'Lunch Break',
          description: 'Café Zorba - WiFi + healthy menu',
          location: 'Laureles',
        },
        {
          time: '4:00 PM',
          title: 'Walking Tour',
          description: 'Comuna 13 - AI suggested, $15',
          location: 'Comuna 13',
        },
      ],
    },
    {
      day: 3,
      title: 'Productive Work Week',
      cost: '$25',
      activities: [
        {
          time: 'All Day',
          title: 'Daily Coworking Rotation',
          description: 'AI optimizes for variety and networking',
          location: 'Various venues',
        },
        {
          time: 'Lunch',
          title: 'Budget Lunches Under $5',
          description: 'Tracked automatically by Budget Guardian',
          location: 'Local spots',
        },
        {
          time: 'Evening',
          title: 'Language Exchange',
          description: 'Free event discovered by AI',
          location: 'Parque Lleras',
        },
      ],
    },
    {
      day: 6,
      title: 'Weekend Adventure',
      cost: '$80',
      activities: [
        {
          time: '8:00 AM',
          title: 'Day Trip to Guatapé',
          description: 'AI planned route + timing perfectly',
          location: 'Guatapé',
        },
        {
          time: '12:00 PM',
          title: 'Lunch with a View',
          description: 'Lakeside restaurant recommended by Local Scout',
          location: 'Guatapé',
        },
        {
          time: '6:00 PM',
          title: 'Return Journey',
          description: 'All bookings done via AI assistant',
          location: 'Back to Medellín',
        },
      ],
    },
    {
      day: 7,
      title: 'Recovery + Planning',
      cost: '$35',
      activities: [
        {
          time: '10:00 AM',
          title: 'Café Hopping',
          description: 'AI route optimized for 3 best spots',
          location: 'El Poblado',
        },
        {
          time: '2:00 PM',
          title: 'Plan Next 3 Weeks',
          description: 'AI suggestions make planning effortless',
          location: 'Home office',
        },
        {
          time: 'Evening',
          title: 'Sunset Rooftop',
          description: 'Celebrate first week in Medellín',
          location: 'Envy Rooftop',
        },
      ],
    },
  ];

  // Pricing Teaser Data
  const whyThisPlan = [
    'Unlimited trips (plan month-to-month)',
    'Budget Guardian for expense tracking',
    'WiFi ratings on all venues',
    'Coworking space database',
    'Nomad community events',
    'Priority support for time-sensitive needs',
  ];

  return (
    <UseCaseLayout
      persona="For Digital Nomads"
      headline="Work from anywhere. Plan trips that fit your workflow."
      subheadline="AI that understands your schedule, budget, and need for fast WiFi."
      heroImage="https://images.unsplash.com/photo-1606579541129-4ca86a4eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBsYXB0b3AlMjBjYWZlfGVufDF8fHx8MTc2NjI0OTQwNnww&ixlib=rb-4.1.0&q=80&w=1080"
      primaryCTA={{
        text: 'Start Planning',
        link: '/dashboard',
      }}
    >
      {/* Problem Statement */}
      <ProblemStatement
        heading="The Digital Nomad Challenge"
        painPoints={painPoints}
        scenarioStory={scenarioStory}
      />

      {/* Solution Showcase */}
      <SolutionShowcase
        heading="How I Love Medellín Helps Digital Nomads"
        keyFeatures={keyFeatures}
        demoImage="https://images.unsplash.com/photo-1589884629038-b631346a23c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbm9tYWQlMjBjb3dvcmtpbmd8ZW58MXx8fHwxNzY2MjQ5NDA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
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
        title="Sample 7-Day Nomad Welcome Week"
        days={itineraryDays}
        totalCost="$385"
        aiSavings="$120"
      />

      {/* Testimonial */}
      <UseCaseTestimonial
        quote="I used to spend Sunday evenings planning the week ahead. Now the AI does it in 10 minutes, and I actually enjoy my weekends."
        author="Jake Morrison"
        role="Software Engineer & Digital Nomad"
        avatar="https://images.unsplash.com/photo-1758639842445-b58f639119d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHlvdW5nfGVufDF8fHx8MTc2NjI0OTQwNnww&ixlib=rb-4.1.0&q=80&w=1080"
        rating={5}
        plan="Curator"
      />

      {/* Pricing Teaser */}
      <PricingTeaser
        planName="Curator"
        price="$29"
        period="/month"
        badge="Most Popular for Nomads"
        whyThisPlan={whyThisPlan}
        roi="One missed reservation or slow WiFi Airbnb costs more than a month of Curator."
        ctaText="Start 14-Day Free Trial"
        ctaLink="/pricing"
        highlight={true}
      />

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-emerald-600 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready to work from paradise?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join 500+ digital nomads who've already transformed their remote work lifestyle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-slate-100 font-bold text-lg px-8 py-6 h-auto rounded-xl"
              >
                <Link to="/dashboard">
                  Start Planning Your Nomad Life
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-6 h-auto rounded-xl"
              >
                <Link to="/use-cases">
                  Explore Other Use Cases
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-emerald-100">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </UseCaseLayout>
  );
}