import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Ticket, Bed, Map } from 'lucide-react';
import { LuxuryCard } from '../ui/LuxuryCard';
import { useWizard } from '../../context/WizardContext';
import { UserIntent } from '../../types/wizard';
import { SectionHeading } from '../ui/SectionHeading';

const MODES = [
  {
    id: 'DINING',
    label: 'Gastronomy',
    desc: 'Reservations at top-rated restaurants & hidden gems.',
    image: 'https://images.unsplash.com/photo-1673705988622-18d05a5cf293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmaW5lJTIwZGluaW5nJTIwcGxhdGVkJTIwZm9vZCUyMGRhcmslMjBtb29kfGVufDF8fHx8MTc2NjAzMzU0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: <Utensils className="w-5 h-5" />,
    path: '/wizard/dining'
  },
  {
    id: 'EVENTS',
    label: 'Culture & Nightlife',
    desc: 'VIP access to events, concerts, and exclusive parties.',
    image: 'https://images.unsplash.com/photo-1759239938569-814af926a2ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2NrdGFpbCUyMGJhciUyMG5pZ2h0JTIwYXRtb3NwaGVyZXxlbnwxfHx8fDE3NjYwMzM1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: <Ticket className="w-5 h-5" />,
    path: '/wizard/events'
  },
  {
    id: 'STAYS',
    label: 'Luxury Stays',
    desc: 'Villas, penthouses, and boutique hotels.',
    image: 'https://images.unsplash.com/photo-1757264119016-7e6b568b810d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjB2aWxsYSUyMGFyY2hpdGVjdHVyZSUyMHBvb2x8ZW58MXx8fHwxNzY2MDMzNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: <Bed className="w-5 h-5" />,
    path: '/wizard/stays'
  },
  {
    id: 'TOURIST',
    label: 'Experiences',
    desc: 'Private tours, day trips, and unique adventures.',
    image: 'https://images.unsplash.com/photo-1662218704415-75f5c569bd28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwaGVsaWNvcHRlciUyMHRvdXIlMjB2aWV3fGVufDF8fHx8MTc2NjAzMzU0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: <Map className="w-5 h-5" />,
    path: '/wizard/tourist'
  }
];

export const ModeSelection = () => {
  const navigate = useNavigate();
  const { setIntent } = useWizard();

  const handleModeSelect = (mode: any) => {
    setIntent(mode.id as UserIntent);
    navigate(mode.path);
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-700">
      <SectionHeading 
        title="How can I help you today?" 
        subtitle="Select a category to begin your curated experience."
        align="center"
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        {MODES.map((mode) => (
          <LuxuryCard
            key={mode.id}
            title={mode.label}
            subtitle={mode.desc}
            image={mode.image}
            badge={{ text: mode.id, variant: 'neutral' }}
            action={mode.icon}
            onClick={() => handleModeSelect(mode)}
            className="hover:border-accent/50 hover:shadow-luxury transition-all duration-500"
          />
        ))}
      </div>
    </div>
  );
};
