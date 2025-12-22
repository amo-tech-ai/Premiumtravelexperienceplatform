import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { cn } from "../../lib/utils/utils";
import { ConciergeFab } from "../ai/ConciergeFab";
import { ConciergeOverlay } from "../ai/ConciergeOverlay";
import { TripCreateModal } from "../trip-wizard/TripCreateModal";
import { Toaster } from "../ui/sonner";
import { QuickAccessMenu } from "../navigation/QuickAccessMenu";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const location = useLocation();
  
  // Routes that should show the sidebar instead of TopNav
  const sidebarRoutes = [
    '/itineraries', 
    '/chats', 
    '/saved', 
    '/explore', 
    '/concierge',
    '/collections',
    '/trip/',
    '/app/' // All app routes use sidebar layout
  ];
  
  // Routes that should NOT show the footer
  const noFooterRoutes = [
    '/itineraries',
    '/chats',
    '/saved',
    '/explore',
    '/concierge',
    '/collections',
    '/trip/',
    '/app/',
    '/map',
    '/wizard/',
    '/results',
    '/dashboard',
    '/profile',
    '/style-guide',
    '/architecture',
    '/status',
    '/features',
    '/ai-demo'
  ];
  
  const showSidebar = sidebarRoutes.some(route => location.pathname.startsWith(route));
  const showFooter = !noFooterRoutes.some(route => location.pathname.startsWith(route));
  
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      {!showSidebar && <TopNav />}
      
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        
        <main className={cn(
          "flex-grow",
          showSidebar ? "pt-0" : "pt-20 pb-20 md:pb-0",
          className
        )}>
          {children}
        </main>
      </div>

      {!showSidebar && <BottomNav />}
      {showFooter && <Footer />}
      <ConciergeFab />
      <ConciergeOverlay />
      <TripCreateModal />
      <QuickAccessMenu />
      <Toaster />
    </div>
  );
}