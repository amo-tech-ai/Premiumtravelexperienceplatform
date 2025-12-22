import React from 'react';
import { ImageSlider, sliderPresets } from '../components/ui/image-slider';

export default function SliderDemo() {
  // Sample product images
  const productSlides = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop',
      alt: 'Modern minimalist fashion photography - white background',
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop',
      alt: 'Fashion model in beige tones - neutral background',
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop',
      alt: 'Colorful fashion product shot - vibrant background',
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200&fit=crop',
      alt: 'Editorial fashion photography - dark background',
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop',
      alt: 'Lifestyle product photography - natural light',
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1200&fit=crop',
      alt: 'Contemporary fashion styling - gray background',
    },
  ];

  const heroSlides = [
    {
      id: 'hero-1',
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
      alt: 'Hero banner - Spring collection',
    },
    {
      id: 'hero-2',
      src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop',
      alt: 'Hero banner - Summer essentials',
    },
    {
      id: 'hero-3',
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop',
      alt: 'Hero banner - New arrivals',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-[#1A2332] mb-4">
            Image Slider Component
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Production-ready slider with accessibility, touch gestures, and responsive design
          </p>
        </div>

        {/* Demo Sections */}
        <div className="space-y-20">
          {/* Product Slider */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1A2332] mb-3">Product Showcase</h2>
              <p className="text-slate-600">
                3:4 portrait ratio, 3-4 slides visible on desktop, responsive down to 1 on mobile
              </p>
            </div>
            <ImageSlider
              slides={productSlides}
              {...sliderPresets.product}
              onSlideChange={(index) => console.log('Current slide:', index)}
            />
          </section>

          {/* Hero Slider */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1A2332] mb-3">Hero Banner</h2>
              <p className="text-slate-600">
                16:9 aspect ratio, full-width single slide, auto-advance enabled
              </p>
            </div>
            <ImageSlider
              slides={heroSlides}
              {...sliderPresets.hero}
              className="max-w-6xl mx-auto"
            />
          </section>

          {/* Gallery Slider */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1A2332] mb-3">Gallery Grid</h2>
              <p className="text-slate-600">
                1:1 square ratio, 5 slides on desktop, minimal navigation
              </p>
            </div>
            <ImageSlider
              slides={productSlides}
              {...sliderPresets.gallery}
            />
          </section>

          {/* Custom Configuration */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1A2332] mb-3">Custom Configuration</h2>
              <p className="text-slate-600">
                4:3 ratio, auto-advance with 7s interval, 2 slides per view
              </p>
            </div>
            <ImageSlider
              slides={productSlides}
              aspectRatio="4/3"
              slidesPerView={{ mobile: 1, tablet: 2, desktop: 2 }}
              gap={32}
              autoAdvance
              interval={7000}
              showArrows
              showDots
              className="max-w-4xl mx-auto"
            />
          </section>
        </div>

        {/* Features List */}
        <div className="mt-20 bg-white rounded-2xl p-12 shadow-lg">
          <h3 className="text-2xl font-bold text-[#1A2332] mb-8">Component Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureItem
              icon="✅"
              title="Accessibility"
              description="ARIA labels, keyboard navigation, screen reader support"
            />
            <FeatureItem
              icon="📱"
              title="Touch Gestures"
              description="Swipe support with momentum, snap behavior, elastic bounce"
            />
            <FeatureItem
              icon="⚡"
              title="Performance"
              description="Lazy loading, responsive images, CSS transforms"
            />
            <FeatureItem
              icon="🎨"
              title="Customizable"
              description="Aspect ratios, gaps, slides per view, colors"
            />
            <FeatureItem
              icon="⌨️"
              title="Keyboard Nav"
              description="Arrow keys navigate, tab focuses controls"
            />
            <FeatureItem
              icon="🔄"
              title="Auto-Advance"
              description="Optional auto-play with pause on hover/interaction"
            />
            <FeatureItem
              icon="📐"
              title="Responsive"
              description="Adapts slides per view based on screen size"
            />
            <FeatureItem
              icon="🎯"
              title="Smooth Animations"
              description="60fps transitions, custom easing curves"
            />
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-20 bg-slate-900 text-white rounded-2xl p-12">
          <h3 className="text-2xl font-bold mb-6">Usage Example</h3>
          <pre className="bg-slate-800 rounded-xl p-6 overflow-x-auto">
            <code className="text-sm text-emerald-400">{`import { ImageSlider, sliderPresets } from '@/components/ui/image-slider';

const slides = [
  {
    id: '1',
    src: '/images/product-1.jpg',
    alt: 'Product description',
  },
  // ... more slides
];

export function MyComponent() {
  return (
    <ImageSlider
      slides={slides}
      {...sliderPresets.product}
      onSlideChange={(index) => console.log(index)}
    />
  );
}`}</code>
          </pre>
        </div>

        {/* Presets */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-[#1A2332] mb-8">Available Presets</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PresetCard
              name="product"
              description="3:4 ratio, 4 slides desktop"
              use="E-commerce product showcases"
            />
            <PresetCard
              name="hero"
              description="16:9 ratio, auto-advance"
              use="Homepage hero banners"
            />
            <PresetCard
              name="gallery"
              description="1:1 ratio, 5 slides desktop"
              use="Image galleries, portfolios"
            />
            <PresetCard
              name="testimonials"
              description="4:3 ratio, auto-advance"
              use="Customer testimonials, reviews"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold text-[#1A2332] mb-1">{title}</h4>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

function PresetCard({ name, description, use }: { name: string; description: string; use: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="font-mono text-sm text-[#D4AF37] mb-2">{name}</div>
      <h4 className="font-bold text-[#1A2332] mb-2">{description}</h4>
      <p className="text-slate-600 text-sm">{use}</p>
    </div>
  );
}
