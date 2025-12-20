import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { cn } from "../ui/utils";
import { ConciergeFab } from "../ai/ConciergeFab";
import { ConciergeOverlay } from "../ai/ConciergeOverlay";
import { TripCreateModal } from "../trip-wizard/TripCreateModal";
import { Toaster } from "../ui/sonner";
import { useLocation } from "react-router-dom";
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
    '/trip/'
  ];
  
  const showSidebar = sidebarRoutes.some(route => location.pathname.startsWith(route));
  
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

      {!showSidebar && <Footer />}
      <ConciergeFab />
      <ConciergeOverlay />
      <TripCreateModal />
      <BottomNav />
      <QuickAccessMenu />
      <Toaster />
    </div>
  );
}