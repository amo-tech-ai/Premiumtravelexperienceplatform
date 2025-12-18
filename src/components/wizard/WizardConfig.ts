import { UserIntent } from '../../types/wizard';

export type StepType = 'CHIPS' | 'SLIDER' | 'DATE' | 'LOCATION';

export interface WizardOption {
  value: string;
  label: string;
  icon?: string;
}

export interface WizardStep {
  id: string;
  type: StepType;
  question: string;
  subtitle?: string;
  options?: WizardOption[];
  min?: number;
  max?: number;
  formatLabel?: (value: number) => string;
}

export const WIZARD_CONFIG: Record<UserIntent, WizardStep[]> = {
  DINING: [
    {
      id: 'vibe',
      type: 'CHIPS',
      question: "What's the vibe for tonight?",
      subtitle: "Select one or more vibes to set the mood.",
      options: [
        { value: 'romantic', label: 'Romantic' },
        { value: 'energetic', label: 'Energetic' },
        { value: 'chill', label: 'Chill' },
        { value: 'business', label: 'Business' },
        { value: 'fine-dining', label: 'Fine Dining' },
        { value: 'casual', label: 'Casual' }
      ]
    },
    {
      id: 'companions',
      type: 'CHIPS',
      question: "Who are you with?",
      options: [
        { value: 'solo', label: 'Solo' },
        { value: 'couple', label: 'Couple' },
        { value: 'group', label: 'Group' },
        { value: 'family', label: 'Family' }
      ]
    },
    {
      id: 'date',
      type: 'DATE',
      question: "When are you planning to go?",
      subtitle: "We'll check availability for you."
    }
  ],
  EVENTS: [
    {
      id: 'type',
      type: 'CHIPS',
      question: "What kind of event?",
      options: [
        { value: 'concert', label: 'Concert' },
        { value: 'party', label: 'Party' },
        { value: 'cultural', label: 'Cultural' },
        { value: 'sport', label: 'Sport' }
      ]
    },
    {
      id: 'date',
      type: 'DATE',
      question: "When?",
    }
  ],
  STAYS: [
    {
      id: 'type',
      type: 'CHIPS',
      question: "What type of stay?",
      options: [
        { value: 'hotel', label: 'Hotel' },
        { value: 'apartment', label: 'Apartment' },
        { value: 'villa', label: 'Villa' }
      ]
    },
    {
      id: 'budget',
      type: 'SLIDER',
      question: "What is your nightly budget?",
      min: 50,
      max: 1000,
      formatLabel: (val) => `$${val}`
    }
  ],
  TOURIST: [
    {
      id: 'type',
      type: 'CHIPS',
      question: "What interests you?",
      options: [
        { value: 'nature', label: 'Nature' },
        { value: 'city', label: 'City' },
        { value: 'adventure', label: 'Adventure' }
      ]
    }
  ],
  GENERAL: []
};
