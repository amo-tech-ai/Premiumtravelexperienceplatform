import React from 'react';
import { RealEstateHero } from '../../components/real-estate/RealEstateHero';
import { MarketInsights } from '../../components/real-estate/MarketInsights';
import { NeighborhoodSlider } from '../../components/real-estate/NeighborhoodSlider';
import { motion } from 'motion/react';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

const FEATURED_PROPERTIES = [
  {
    id: '1',
    title: 'Grand Poblado Penthouse',
    subtitle: 'El Poblado • 2800 sqft',
    location: 'El Poblado, Medellín',
    price: '$450,000',
    beds: '3 Beds',
    baths: '3.5 Baths',
    roi: '12% Est. ROI',
    imageUrl: 'https://images.unsplash.com/photo-1588724813535-b8ae25946a81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBsaXZpbmclMjByb29tJTIwd2l0aCUyMHZpZXd8ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'High Yield',
    variant: 'emerald'
  },
  {
    id: '2',
    title: 'Laureles Garden Villa',
    subtitle: 'Laureles • 3100 sqft',
    location: 'Laureles, Medellín',
    price: '$320,000',
    beds: '4 Beds',
    baths: '3 Baths',
    roi: 'Family Friendly',
    imageUrl: 'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob21lJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'Verified',
    variant: 'neutral'
  },
  {
    id: '3',
    title: 'Modern Industrial Loft',
    subtitle: 'Manila • 1200 sqft',
    location: 'Manila, Medellín',
    price: '$185,000',
    beds: '1 Bed',
    baths: '2 Baths',
    roi: 'Top Airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1680550723215-1a7b3d6ba19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwbWVkZWxsaW58ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    tag: 'Investment',
    variant: 'gold'
  }
];

const RealEstateHome = () => {
  return (
    <div className="bg-background">
      <RealEstateHero />
      
      {/* Featured Properties Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-serif text-foreground mb-3">Featured Opportunities</h2>
                    <p className="text-muted-foreground text-lg">Curated properties selected by our AI for maximum value.</p>
                </div>
                <Link to="/real-estate/search">
                  <Button variant="ghost" className="hidden md:flex items-center text-primary group">
                      View All Properties <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURED_PROPERTIES.map((property, index) => (
                    <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link to={`/real-estate/listing/${property.id}`}>
                          <LuxuryCard 
                            image={property.imageUrl}
                            title={property.title}
                            subtitle={property.subtitle}
                            badge={{ text: property.tag, variant: property.variant as any }}
                            metaPrimary={property.price}
                            metaSecondary={property.roi}
                            className="h-full"
                          />
                        </Link>
                    </motion.div>
                ))}
            </div>
            
             <div className="mt-12 text-center md:hidden">
                <Link to="/real-estate/search">
                  <Button variant="outline" className="w-full">
                      View All Properties
                  </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* Market Insights */}
      <MarketInsights />

      {/* Neighborhood Slider */}
      <NeighborhoodSlider />
    </div>
  );
};

export default RealEstateHome;
