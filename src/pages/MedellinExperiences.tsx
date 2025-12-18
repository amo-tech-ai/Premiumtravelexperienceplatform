import { useState } from "react";
import { motion } from "motion/react";
import { LuxuryCard } from "../components/ui/LuxuryCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/button";
import { Map as MapIcon, Grid, Filter, CalendarX } from "lucide-react";

const EVENTS_DATA = [
  {
    id: "e1",
    title: "Rooftop Sunset Jazz",
    subtitle: "Click Clack Hotel • El Poblado",
    image: "https://images.unsplash.com/photo-1514525253440-b393452de23e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "Tonight, 7:00 PM",
    price: "From $25",
    category: "Music",
    tag: "Trending"
  },
  {
    id: "e2",
    title: "Communa 13 Graffiti Tour",
    subtitle: "Private Guide • San Javier",
    image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "Daily, 9:00 AM",
    price: "$45 / person",
    category: "Culture",
    tag: "Must See"
  },
  {
    id: "e3",
    title: "Coffee Farm Immersion",
    subtitle: "Hacienda La Sierra",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "Sat & Sun",
    price: "$80 / person",
    category: "Nature",
    tag: "Exclusive"
  },
  {
    id: "e4",
    title: "Salsa Night VIP",
    subtitle: "Eslabón Prendido",
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "Fri, 10:00 PM",
    price: "Guest List",
    category: "Nightlife",
    tag: "Hot"
  },
  {
    id: "e5",
    title: "Modern Art Museum Private Tour",
    subtitle: "MAMM • Ciudad del Río",
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "Tue - Sun",
    price: "$30 / person",
    category: "Art",
    tag: null
  },
  {
    id: "e6",
    title: "Gastronomy Walk",
    subtitle: "Provenza District",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "Daily, 6:00 PM",
    price: "$60 / person",
    category: "Food",
    tag: "Popular"
  }
];

const FILTERS = ["All", "Music", "Culture", "Nature", "Nightlife", "Food"];

export default function EventsPage() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredEvents = activeFilter === "All" 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(e => e.category === activeFilter);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Curated Experiences</h1>
          <p className="text-muted-foreground">Discover the soul of Medellín through exclusive events.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-primary text-white border-primary" : ""}
          >
            <Grid className="w-4 h-4 mr-2" /> Grid
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setView("map")}
            className={view === "map" ? "bg-primary text-white border-primary" : ""}
          >
            <MapIcon className="w-4 h-4 mr-2" /> Map
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
        <Button variant="ghost" size="sm" className="pointer-events-none">
          <Filter className="w-4 h-4" />
        </Button>
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${activeFilter === filter 
                ? "bg-foreground text-background" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === "grid" ? (
        filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <LuxuryCard
                  image={event.image}
                  title={event.title}
                  subtitle={event.subtitle}
                  badge={event.tag ? { text: event.tag, variant: "neutral" } : undefined}
                  metaPrimary={event.date}
                  metaSecondary={event.price}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={CalendarX}
            title="No experiences found"
            description={`We couldn't find any ${activeFilter.toLowerCase()} experiences matching your criteria at the moment.`}
            actionLabel="View All Experiences"
            onAction={() => setActiveFilter("All")}
          />
        )
      ) : (
        <div className="w-full h-[600px] bg-muted/30 rounded-2xl flex items-center justify-center border border-border">
          <div className="text-center">
            <MapIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">Interactive Map</h3>
            <p className="text-muted-foreground">Map view implementation coming in Phase 4.</p>
          </div>
        </div>
      )}
    </div>
  );
}
