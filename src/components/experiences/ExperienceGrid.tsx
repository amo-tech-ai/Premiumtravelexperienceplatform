import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExperienceCard } from './ExperienceCard';

const experiences = [
  {
    id: 1,
    title: "Premium Coffee Tasting & Farm Tour",
    description: "Journey to a private coffee estate in the hills. Learn the entire process from bean to cup with an expert barista, followed by a gourmet lunch with panoramic views.",
    image: "https://images.unsplash.com/photo-1644621967217-bc7681c46aec?q=80&w=800&auto=format&fit=crop",
    category: "Food & Drink",
    location: "Envigado",
    duration: "4 Hours",
    price: "$85 USD",
    rating: 4.9,
    reviews: 124
  },
  {
    id: 2,
    title: "Comuna 13: Private Street Art & History",
    description: "Explore the transformation of Medellín's most iconic neighborhood with a local artist. Discover hidden murals, breakdancing performances, and the famous outdoor escalators.",
    image: "https://images.unsplash.com/photo-1565012355505-9cefe58e4fd3?q=80&w=800&auto=format&fit=crop",
    category: "Culture",
    location: "Comuna 13",
    duration: "3 Hours",
    price: "$45 USD",
    rating: 5.0,
    reviews: 312
  },
  {
    id: 3,
    title: "La Deriva - Click Clack Rooftop",
    description: "A refined rooftop escape blending modern design, city views, and relaxed elegance atop the Click Clack Hotel. Perfect for sunset cocktails.",
    image: "https://images.unsplash.com/photo-1623298460174-371443cc45f0?q=80&w=800&auto=format&fit=crop",
    category: "Nightlife",
    location: "El Poblado",
    duration: "Open Ended",
    price: "$$$",
    rating: 4.8,
    reviews: 89
  },
  {
    id: 4,
    title: "Guatapé & El Peñol Helicopter Tour",
    description: "Skip the traffic and fly over the stunning lake region. Climb the rock, explore the colorful zocalos of Guatapé, and enjoy a private boat ride.",
    image: "https://images.unsplash.com/photo-1621945035540-b0c8762d4d81?q=80&w=800&auto=format&fit=crop",
    category: "Adventure",
    location: "Guatapé",
    duration: "6 Hours",
    price: "$350 USD",
    rating: 5.0,
    reviews: 42
  },
  {
    id: 5,
    title: "Silleteros Flower Farm Tradition",
    description: "Visit Santa Elena to meet the families who carry the flower heritage of Medellín. Create your own silleta and enjoy traditional countryside snacks.",
    image: "https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?q=80&w=800&auto=format&fit=crop",
    category: "Culture",
    location: "Santa Elena",
    duration: "5 Hours",
    price: "$65 USD",
    rating: 4.9,
    reviews: 156
  },
  {
    id: 6,
    title: "Botero & Downtown Architecture Walk",
    description: "A curated walking tour through the Plaza Botero and historic downtown. Understand the architectural evolution of the city from colonial to modern.",
    image: "https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?q=80&w=800&auto=format&fit=crop", // Using plating image as placeholder for "Art/Architecture" feel if specific one missing, or better finding a building shot. The Botero one failed earlier? No, I requested it. Let's check results. Ah, I got plating. I'll stick with a generic 'Art' feel or reuse a city shot if needed. Actually, let's use the plating one for a 'Gastronomy' card instead? No, let's use the 'cocktail' one for Nightlife and maybe swap.
    // Actually I'll use the mountains one for a 'Nature Hike'
    category: "Art & Design",
    location: "Downtown",
    duration: "3 Hours",
    price: "$40 USD",
    rating: 4.7,
    reviews: 98
  }
];

// Swapping image 6 for a more relevant one if possible, or just using a generic placeholder from the search.
// The search for Botero returned plating? No, I searched 'fine dining plating' separately.
// Let's use the mountain mist one for a hiking experience instead of Botero for now to match the image better.
const experiencesFixed = [
  ...experiences.slice(0, 5),
  {
    id: 6,
    title: "Andean Cloud Forest Trek",
    description: "Hike through the misty cloud forests surrounding the valley. Discover endemic birds, waterfalls, and pristine nature just minutes from the city.",
    image: "https://images.unsplash.com/photo-1652265843310-9953cd934a8c?q=80&w=800&auto=format&fit=crop",
    category: "Nature",
    location: "Parque Arví",
    duration: "4 Hours",
    price: "$55 USD",
    rating: 4.9,
    reviews: 76
  }
];


export const ExperienceGrid = () => {
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    // For demo purposes, only linking La Deriva (ID 3) to the detail page
    if (id === 3) {
      navigate('/experiences/medellin/la-deriva');
    } else {
      // Potentially other links or just do nothing/log
      console.log(`Clicked experience ${id}`);
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiencesFixed.map((exp) => (
          <ExperienceCard 
            key={exp.id} 
            {...exp} 
            onClick={() => handleCardClick(exp.id)}
          />
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <button className="px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-900 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
          Load More Experiences
        </button>
      </div>
    </div>
  );
};
