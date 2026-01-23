import { UseCaseLayout } from '../../components/use-cases/UseCaseLayout';
import { ProblemStatement } from '../../components/use-cases/ProblemStatement';
import { SolutionShowcase } from '../../components/use-cases/SolutionShowcase';
import { AIAgentsShowcase } from '../../components/use-cases/AIAgentsShowcase';
import { BeforeAfterComparison } from '../../components/use-cases/BeforeAfterComparison';
import { ExampleItinerary } from '../../components/use-cases/ExampleItinerary';
import { UseCaseTestimonial } from '../../components/use-cases/UseCaseTestimonial';
import { PricingTeaser } from '../../components/use-cases/PricingTeaser';
import { 
  MessageCircle, 
  Calculator, 
  User, 
  Vote, 
  Split, 
  Calendar, 
  ListChecks,
  Search,
  Shield,
  Route
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';

export default function GroupTripPage() {
  // Problem Statement Data
  const painPoints = [
    {
      icon: MessageCircle,
      title: 'Endless Group Chats',
      description: '47 messages just to pick a restaurant',
    },
    {
      icon: Calculator,
      title: 'Budget Chaos',
      description: 'Who paid what? Who owes who?',
    },
    {
      icon: User,
      title: 'Planning Falls on One Person',
      description: "You do all the work while everyone 'approves'",
    },
  ];

  const scenarioStory = 
    "You're organizing a bachelor party for 8 friends. Every suggestion gets 3 thumbs up, 2 maybes, and 3 people who didn't see the message. By day 3, you're the only one who knows the plan.";

  // Solution Showcase Data
  const keyFeatures = [
    {
      icon: Vote,
      title: 'One-Click Polls',
      description: 'AI suggests options, group votes, decision made in minutes',
    },
    {
      icon: Split,
      title: 'Smart Cost Splitting',
      description: 'Venmo/PayPal integration tracks who\'s paid',
    },
    {
      icon: Calendar,
      title: 'Shared Itinerary',
      description: 'Everyone sees the plan in real-time, no group chat confusion',
    },
    {
      icon: ListChecks,
      title: 'Task Assignment',
      description: "AI delegates: 'Sarah books hotels, Mike handles activities'",
    },
  ];

  // AI Agents Data
  const aiAgents = [
    {
      name: 'Local Scout',
      icon: Search,
      description: 'Discovers hidden gems and authentic local experiences',
      helpText: 'Finds group-friendly venues (table for 8+)',
      color: 'emerald',
    },
    {
      name: 'Budget Guardian',
      icon: Shield,
      description: 'Monitors spending and optimizes for value',
      helpText: 'Splits costs fairly, tracks payments',
      color: 'blue',
    },
    {
      name: 'Itinerary Optimizer',
      icon: Route,
      description: 'Creates efficient routes and schedules',
      helpText: 'Ensures no one is left behind (routes for group size)',
      color: 'cyan',
    },
  ];

  // Before/After Data
  const beforeItems = [
    { text: '3 weeks of group chat debates' },
    { text: 'Excel spreadsheet to track who owes what' },
    { text: 'One person does all planning (and gets blamed for issues)' },
    { text: "Half the group shows up late because they didn't see the plan" },
    { text: 'Awkward "who\'s paying?" moments' },
  ];

  const afterItems = [
    { text: 'Decisions made in 24 hours via polls' },
    { text: 'Auto cost splitting with payment tracking' },
    { text: 'Everyone contributes ideas (AI consolidates)' },
    { text: 'Calendar sync ensures no one is late' },
    { text: 'Clear receipts and split calculations' },
  ];

  // Example Itinerary Data
  const itineraryDays = [
    {
      day: 1,
      title: 'Friday Night Arrival',
      cost: '$45/person',
      activities: [
        {
          time: '6:00 PM',
          title: 'Group Arrival',
          description: 'AI sent calendar invites, everyone on time',
          location: 'El Poblado',
        },
        {
          time: '8:00 PM',
          title: 'Dinner at Herbario',
          description: 'AI polled group, booked table for 8',
          location: 'Herbario Restaurant',
        },
        {
          time: '10:00 PM',
          title: 'Nightlife in Parque Lleras',
          description: 'AI suggested 3 bars within walking distance',
          location: 'Parque Lleras',
        },
      ],
    },
    {
      day: 2,
      title: 'Saturday Adventure',
      cost: '$120/person',
      activities: [
        {
          time: '10:00 AM',
          title: 'Hungover Breakfast',
          description: 'AI knows recovery food - Pergamino Café',
          location: 'Pergamino',
        },
        {
          time: '1:00 PM',
          title: 'ATV Tour',
          description: 'AI found group activity, $60/person',
          location: 'Medellín Outskirts',
        },
        {
          time: '7:00 PM',
          title: 'BBQ at Rooftop',
          description: 'AI coordinated private chef for group',
          location: 'Private Rooftop',
        },
        {
          time: '11:00 PM',
          title: 'VIP Club Access',
          description: 'AI got group VIP table, split cost tracked',
          location: 'Nightclub',
        },
      ],
    },
    {
      day: 3,
      title: 'Sunday Recovery',
      cost: '$55/person',
      activities: [
        {
          time: '11:00 AM',
          title: 'Recovery Brunch',
          description: 'AI adjusted plan for late start',
          location: 'El Poblado',
        },
        {
          time: '2:00 PM',
          title: 'Pool Day at Hotel',
          description: 'Free activity, AI knew this',
          location: 'Hotel Pool',
        },
        {
          time: '6:00 PM',
          title: 'Farewell Dinner at Carmen',
          description: 'AI booked 3 weeks prior for group',
          location: 'Carmen Restaurant',
        },
        {
          time: 'Post-Trip',
          title: 'Payment Reminders',
          description: 'AI sent reminders to last person who owes',
          location: 'Digital',
        },
      ],
    },
  ];

  // Pricing Teaser Data
  const whyThisPlan = [
    'Collaborate with up to 4 people (or split cost for more)',
    'Budget Guardian for group expense tracking',
    'Polling and voting features',
    'Shared itinerary with real-time sync',
    'Payment reminders and split calculator',
    'Group chat integration',
  ];

  return (
    <UseCaseLayout
      persona="For Group Organizers"
      headline="Stop herding cats. Let AI coordinate your group."
      subheadline="Polls, splits, shared itineraries — all automated so you can actually enjoy the trip."
      heroImage="https://images.unsplash.com/photo-1765582870011-ff3cfdb06700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwcmVzdGF1cmFudCUyMGdyb3VwfGVufDF8fHx8MTc2NjI0OTU0NXww&ixlib=rb-4.1.0&q=80&w=1080"
      primaryCTA={{
        text: 'See How It Works for Groups',
        link: '/dashboard',
      }}
    >
      {/* Problem Statement */}
      <ProblemStatement
        heading="The Group Trip Headache"
        painPoints={painPoints}
        scenarioStory={scenarioStory}
      />

      {/* Solution Showcase */}
      <SolutionShowcase
        heading="How AI Coordinates Your Group"
        keyFeatures={keyFeatures}
        demoImage="https://images.unsplash.com/photo-1740506700638-01aba0ffbbc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGNlbGVicmF0aW9uJTIwZGlubmVyfGVufDF8fHx8MTc2NjI0OTU0NXww&ixlib=rb-4.1.0&q=80&w=1080"
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
        title="Bachelor Party Weekend (8 Guys)"
        days={itineraryDays}
        totalCost="$220/person all-in"
        aiSavings="7/8 paid (AI tracking)"
      />

      {/* Testimonial */}
      <UseCaseTestimonial
        quote="Usually I'm the one stuck planning everything and getting complaints. This time, the AI did the heavy lifting and everyone thought I was a genius."
        author="Marcus Chen"
        role="Group Trip Organizer (3x/year)"
        avatar="https://images.unsplash.com/photo-1734864489622-0406baee014f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjYyMzk4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        rating={5}
        plan="Curator"
      />

      {/* Pricing Teaser */}
      <PricingTeaser
        planName="Curator"
        price="$29"
        period="/month"
        badge="Perfect for Groups"
        whyThisPlan={whyThisPlan}
        roi="Split the $29/month among the group. That's $3.60/person for zero planning stress."
        ctaText="Start Free Trial for Your Group"
        ctaLink="/pricing"
        highlight={true}
      />

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready to stop being the planner and start being the party?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of group organizers who've ditched the spreadsheets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-slate-100 font-bold text-lg px-8 py-6 h-auto rounded-xl"
              >
                <Link to="/dashboard">
                  Organize Your Group Trip
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-6 h-auto rounded-xl"
              >
                <Link to="/use-cases">
                  See Other Use Cases
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              Free trial • Split the cost with your group • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </UseCaseLayout>
  );
}