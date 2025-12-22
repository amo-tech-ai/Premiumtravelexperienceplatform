import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const CITIES = [
  {
    name: 'Medellín',
    slug: 'medellin',
    description: 'City of Eternal Spring',
    image: 'https://images.unsplash.com/photo-1568632234165-5f6d54b6f7a7?auto=format&fit=crop&q=80&w=1200',
    experiences: 24,
    highlighted: true
  },
  {
    name: 'Cartagena',
    slug: 'cartagena',
    description: 'Colonial Caribbean Charm',
    image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?auto=format&fit=crop&q=80&w=1200',
    experiences: 18,
    highlighted: false
  },
  {
    name: 'Bogotá',
    slug: 'bogota',
    description: 'Cultural Capital',
    image: 'https://images.unsplash.com/photo-1568632234146-88f9e97d5b94?auto=format&fit=crop&q=80&w=1200',
    experiences: 31,
    highlighted: false
  }
];

const CATEGORIES = [
  { icon: Sparkles, title: 'Nightlife', count: 42 },
  { icon: Calendar, title: 'Cultural Tours', count: 28 },
  { icon: Users, title: 'Group Activities', count: 19 },
  { icon: MapPin, title: 'Local Experiences', count: 56 }
];

export default function ExperiencesIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 to-stone-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDMwaC02di02aDZ2LTZoNnY2aDZ2NmgtNnY2aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="mb-6 font-serif text-5xl md:text-6xl">
              Curated Experiences
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Discover handpicked activities, events, and local gems across Colombia's most vibrant cities
            </p>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90">
              Explore All Experiences
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-16 container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-serif text-stone-900 mb-3">Browse by City</h2>
          <p className="text-stone-600 text-lg">Select a destination to explore curated experiences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CITIES.map((city, index) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/experiences/${city.slug}`}>
                <Card className="group overflow-hidden border-stone-200 hover:border-stone-300 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {city.highlighted && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Popular
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-serif text-white mb-1">{city.name}</h3>
                      <p className="text-white/80 text-sm mb-2">{city.description}</p>
                      <p className="text-white/60 text-sm">{city.experiences} experiences</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-serif text-stone-900 mb-3">Popular Categories</h2>
            <p className="text-stone-600 text-lg">Find experiences that match your interests</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all text-center">
                  <category.icon className="w-10 h-10 mx-auto mb-4 text-stone-600" />
                  <h3 className="font-semibold text-stone-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-stone-500">{category.count} experiences</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-6">
        <Card className="p-12 bg-gradient-to-br from-stone-900 to-stone-800 text-white text-center border-0">
          <h2 className="text-3xl font-serif mb-4">Can't find what you're looking for?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Let our AI concierge help you discover the perfect experience tailored to your preferences
          </p>
          <Button size="lg" className="bg-white text-stone-900 hover:bg-white/90">
            <Sparkles className="mr-2 h-5 w-5" />
            Ask AI Concierge
          </Button>
        </Card>
      </section>
    </div>
  );
}
