import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { cn } from "../ui/utils";
import { ConciergeFab } from "../ai/ConciergeFab";
import { ConciergeOverlay } from "../ai/ConciergeOverlay";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      <TopNav />
      
      <main className={cn("pt-20 pb-20 md:pb-0 flex-grow", className)}>
        {children}
      </main>

      <Footer />
      <ConciergeFab />
      <ConciergeOverlay />
      <BottomNav />
    </div>
  );
}
