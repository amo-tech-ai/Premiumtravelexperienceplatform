import React, { useState } from 'react';
import { 
  Home,
  MapPin,
  DollarSign,
  Ruler,
  Bed,
  Bath,
  Car,
  Wifi,
  Dumbbell,
  UtensilsCrossed,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  Bookmark,
  MessageCircle,
  Eye,
  Navigation,
  Clock,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Property {
  id: string;
  name: string;
  type: 'apartment' | 'house' | 'studio' | 'penthouse';
  price: string;
  pricePerMonth?: string;
  location: string;
  neighborhood: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  distance: string;
  walkTime?: string;
  rating?: string;
  reviews?: string;
  valueScore: number; // -20 to +20 (% above/below market)
  availability: 'available' | 'ending-soon' | 'unavailable';
  furnished: boolean;
  petFriendly: boolean;
  shortTerm: boolean;
  longTerm: boolean;
  aiReason: string;
  saved?: boolean;
  addedToTrip?: boolean;
}

interface PropertyCardProps {
  property: Property;
  onSave?: (id: string) => void;
  onAddToTrip?: (id: string) => void;
  onMessage?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  compact?: boolean;
}

export function PropertyCard({ 
  property, 
  onSave,
  onAddToTrip,
  onMessage,
  onViewDetails,
  compact = false
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const getValueScoreColor = (score: number) => {
    if (score > 10) return 'text-red-600 bg-red-50 border-red-200';
    if (score > 0) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score > -10) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getValueScoreLabel = (score: number) => {
    if (score > 10) return 'Above Market';
    if (score > 0) return 'Fair Value';
    if (score > -10) return 'Good Value';
    return 'Great Value';
  };

  const getValueScoreIcon = (score: number) => {
    return score > 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border transition-all cursor-pointer group",
        isHovered ? "border-emerald-300 shadow-md" : "border-slate-200 hover:shadow-sm",
        property.saved && "ring-1 ring-amber-200",
        property.addedToTrip && "bg-emerald-50/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(property.id)}
    >
      {/* Image Gallery */}
      <div className="relative h-48 bg-slate-100 rounded-t-xl overflow-hidden">
        {/* Placeholder image with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <Home className="w-16 h-16 text-slate-400" />
        </div>

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </>
        )}

        {/* Image Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {property.images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === currentImageIndex 
                    ? "bg-white w-4" 
                    : "bg-white/60"
                )}
              />
            ))}
          </div>
        )}

        {/* Value Score Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className={cn("text-xs font-semibold border", getValueScoreColor(property.valueScore))}>
            {React.createElement(getValueScoreIcon(property.valueScore), { className: "w-3 h-3 mr-1" })}
            {property.valueScore > 0 ? '+' : ''}{property.valueScore}%
          </Badge>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className={cn(
            "text-xs",
            property.availability === 'available' && "bg-emerald-600 text-white",
            property.availability === 'ending-soon' && "bg-amber-600 text-white",
            property.availability === 'unavailable' && "bg-slate-600 text-white"
          )}>
            {property.availability === 'available' && 'Available'}
            {property.availability === 'ending-soon' && 'Ending Soon'}
            {property.availability === 'unavailable' && 'Unavailable'}
          </Badge>
        </div>

        {/* View Photos Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setImageViewerOpen(true);
          }}
          className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <div className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            View {property.images.length} Photos
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 mb-0.5">{property.name}</h4>
            <p className="text-xs text-slate-600 capitalize">{property.type}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-900">{property.price}</p>
            {property.pricePerMonth && (
              <p className="text-[10px] text-slate-500">{property.pricePerMonth}/mo</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="w-3 h-3" />
            <span>{property.neighborhood}, {property.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-0.5">
              <Navigation className="w-3 h-3" />
              {property.distance}
            </span>
            {property.walkTime && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {property.walkTime}
              </span>
            )}
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Ruler className="w-3 h-3" />
            {property.size}
          </span>
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {property.bedrooms} bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {property.bathrooms} bath
          </span>
        </div>

        {/* Amenities Icons */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {property.amenities.slice(0, 6).map((amenity, idx) => {
            let icon = null;
            let label = amenity;
            
            if (amenity.toLowerCase().includes('wifi') || amenity.toLowerCase().includes('internet')) {
              icon = <Wifi className="w-3 h-3" />;
              label = 'WiFi';
            } else if (amenity.toLowerCase().includes('gym') || amenity.toLowerCase().includes('fitness')) {
              icon = <Dumbbell className="w-3 h-3" />;
              label = 'Gym';
            } else if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('garage')) {
              icon = <Car className="w-3 h-3" />;
              label = 'Parking';
            } else if (amenity.toLowerCase().includes('pool')) {
              icon = <span className="text-[10px]">🏊</span>;
              label = 'Pool';
            } else if (amenity.toLowerCase().includes('security')) {
              icon = <Shield className="w-3 h-3" />;
              label = 'Security';
            } else if (amenity.toLowerCase().includes('kitchen')) {
              icon = <UtensilsCrossed className="w-3 h-3" />;
              label = 'Kitchen';
            }

            return (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-[10px] text-slate-700"
                title={amenity}
              >
                {icon}
                <span>{label}</span>
              </div>
            );
          })}
          {property.amenities.length > 6 && (
            <div className="flex items-center px-2 py-1 bg-slate-100 rounded-full text-[10px] text-slate-700">
              +{property.amenities.length - 6} more
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {property.furnished && (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
              Furnished
            </Badge>
          )}
          {property.petFriendly && (
            <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px]">
              Pet Friendly
            </Badge>
          )}
          {property.shortTerm && (
            <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
              Short-term OK
            </Badge>
          )}
        </div>

        {/* Value Score Explanation */}
        <div className={cn(
          "mb-3 p-2.5 rounded-lg border text-[11px] leading-relaxed",
          getValueScoreColor(property.valueScore)
        )}>
          <div className="flex items-start gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{getValueScoreLabel(property.valueScore)}:</span>{' '}
              {property.valueScore < 0 
                ? `${Math.abs(property.valueScore)}% below market average for this area`
                : `${property.valueScore}% above market average for this area`
              }
            </div>
          </div>
        </div>

        {/* AI Reason */}
        <div className="mb-3 bg-gradient-to-r from-emerald-50 to-transparent p-2.5 rounded-lg border border-emerald-100">
          <div className="flex items-start gap-2">
            <Home className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-700 leading-relaxed">{property.aiReason}</p>
          </div>
        </div>

        {/* Rating (if available) */}
        {property.rating && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium">{property.rating}</span>
            {property.reviews && (
              <span className="text-xs text-slate-400">({property.reviews})</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(property.id);
            }}
            className={cn(
              "flex-1",
              property.saved && "bg-amber-100 border-amber-300 text-amber-700"
            )}
          >
            <Bookmark className={cn(
              "w-3.5 h-3.5 mr-1.5",
              property.saved && "fill-amber-600"
            )} />
            {property.saved ? 'Saved' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onMessage?.(property.id);
            }}
            className="flex-1"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Contact
          </Button>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {imageViewerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50"
              onClick={() => setImageViewerOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setImageViewerOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center z-10 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <Home className="w-24 h-24 text-slate-400" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Comparison Table Component
export function PropertyComparisonTable({ properties }: { properties: Property[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-900">Property</th>
              <th className="text-left p-3 font-semibold text-slate-900">Price</th>
              <th className="text-left p-3 font-semibold text-slate-900">Size</th>
              <th className="text-left p-3 font-semibold text-slate-900">Beds</th>
              <th className="text-left p-3 font-semibold text-slate-900">Value</th>
              <th className="text-left p-3 font-semibold text-slate-900">Distance</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-3">
                  <div>
                    <p className="font-medium text-slate-900">{property.name}</p>
                    <p className="text-[10px] text-slate-500">{property.neighborhood}</p>
                  </div>
                </td>
                <td className="p-3 font-semibold text-slate-900">{property.price}</td>
                <td className="p-3 text-slate-600">{property.size}</td>
                <td className="p-3 text-slate-600">{property.bedrooms} / {property.bathrooms}</td>
                <td className="p-3">
                  <Badge className={cn("text-[10px]", getValueScoreColor(property.valueScore))}>
                    {property.valueScore > 0 ? '+' : ''}{property.valueScore}%
                  </Badge>
                </td>
                <td className="p-3 text-slate-600">{property.distance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function exported for table use
function getValueScoreColor(score: number) {
  if (score > 10) return 'text-red-600 bg-red-50 border-red-200';
  if (score > 0) return 'text-orange-600 bg-orange-50 border-orange-200';
  if (score > -10) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  return 'text-blue-600 bg-blue-50 border-blue-200';
}
