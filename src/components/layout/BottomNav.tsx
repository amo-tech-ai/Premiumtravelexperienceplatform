import { Link, useLocation } from "react-router";
import { cn } from "../../lib/utils/utils";
import { Home, Compass, Building, Map } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Events", path: "/experiences/medellin", icon: Compass }, // Updated path
    { name: "Real Estate", path: "/real-estate", icon: Building },
    { name: "Plan", path: "/itinerary", icon: Map },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-md border-t border-border pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current/10")} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}