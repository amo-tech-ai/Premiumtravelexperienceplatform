import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Laptop, Sparkles, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function UseCasesIndex() {
  const useCases = [
    {
      id: 'digital-nomad',
      icon: Laptop,
      title: 'Digital Nomads',
      description: 'Work remotely while exploring Medellín. AI finds WiFi-verified spots, tracks your budget, and plans around your work schedule.',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      color: 'emerald',
      link: '/use-cases/digital-nomad',
      highlights: ['WiFi-first filtering', 'Budget tracking', 'Flexible scheduling']
    },
    {
      id: 'luxury-traveler',
      icon: Sparkles,
      title: 'Luxury Travelers',
      description: 'White-glove concierge service powered by AI. Exclusive reservations, private experiences, and seamless coordination.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      color: 'amber',
      link: '/use-cases/luxury-traveler',
      highlights: ['Curated exclusivity', 'Automated booking', '24/7 concierge']
    },
    {
      id: 'group-trip',
      icon: Users,
      title: 'Group Trip Organizers',
      description: 'Stop herding cats. AI coordinates polls, splits costs, and manages shared itineraries so everyone stays in sync.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      color: 'blue',
      link: '/use-cases/group-trip',
      highlights: ['Smart polls', 'Cost splitting', 'Shared calendar']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-emerald-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Find Your Travel Style
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 mb-8 leading-relaxed">
                See how the AI Trip Operating System solves real problems for different types of travelers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={useCase.link}>
                    <Card className="group h-full hover:shadow-luxury transition-all duration-300 overflow-hidden border-border/50">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={useCase.image}
                          alt={useCase.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Icon Badge */}
                        <div className="absolute top-4 left-4">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md
                            ${useCase.color === 'emerald' && 'bg-emerald-500/90'}
                            ${useCase.color === 'amber' && 'bg-amber-400/90'}
                            ${useCase.color === 'blue' && 'bg-blue-500/90'}
                          `}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {useCase.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {useCase.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Highlights */}
                        <ul className="space-y-2">
                          {useCase.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className={`
                                w-1.5 h-1.5 rounded-full
                                ${useCase.color === 'emerald' && 'bg-emerald-500'}
                                ${useCase.color === 'amber' && 'bg-amber-400'}
                                ${useCase.color === 'blue' && 'bg-blue-500'}
                              `} />
                              {highlight}
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                            Learn More
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold text-slate-900 mb-4">
              Not Sure Which Fits You?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Start planning your trip and let our AI recommend the best features for your travel style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link to="/dashboard">
                  Start Planning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
