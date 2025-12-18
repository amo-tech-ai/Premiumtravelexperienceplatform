import React, { ReactNode } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Sparkles, Map } from "lucide-react";
import { Button } from "../ui/button";

interface ResultsDrawerProps {
  hasResults: boolean;
  children: ReactNode;
}

export function ResultsDrawer({ hasResults, children }: ResultsDrawerProps) {
  if (!hasResults) return null;

  return (
    <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
      <Drawer>
        <DrawerTrigger asChild>
          <Button 
            className="w-full h-14 rounded-xl shadow-luxury bg-emerald-900 text-white font-serif text-lg flex items-center justify-between px-6 hover:bg-emerald-800 transition-colors"
          >
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>View Results</span>
            </div>
            <div className="text-xs uppercase tracking-widest opacity-70 font-sans">
                Tap to open
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] flex flex-col rounded-t-[2rem]">
          <DrawerHeader className="border-b border-slate-100 pb-4">
            <DrawerTitle className="flex items-center justify-center gap-2 font-serif text-xl text-emerald-900">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Concierge Suggestions
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="flex-1 overflow-hidden bg-slate-50 relative">
             {children}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
