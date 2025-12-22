import React, { useState } from 'react';
import { MessageSquare, Briefcase, Compass, Heart, Bell, Zap, PlusSquare, Menu, LogOut, Sparkles, Home } from 'lucide-react';
import { cn } from '../../lib/utils/utils';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useWizard } from '../../context/WizardContext';

import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { openCreateTrip } = useWizard();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Chats', path: '/chats', count: 2 },
    { icon: Briefcase, label: 'Trips', path: '/itineraries' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Heart, label: 'Saved', path: '/saved' },
    { icon: Sparkles, label: 'Concierge', path: '/concierge' },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-slate-100 py-6 w-[240px] hidden md:flex", className)}>
      {/* Logo Area */}
      <div className="px-6 mb-8 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-serif text-xl font-bold tracking-tight">Concierge</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-slate-50 text-slate-900" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span>{item.label}</span>
              
              {/* Badges/Counts */}
              {item.count && (
                <span className="ml-auto bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span className="ml-auto bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-100">
           <button 
             onClick={openCreateTrip}
             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
           >
              <PlusSquare className="w-5 h-5 text-slate-400" />
              <span>Create</span>
           </button>
        </div>
      </nav>

      {/* User / Bottom */}
      <div className="px-4 mt-auto">
        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="User" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Alex Morgan</p>
                <p className="text-xs text-slate-500 truncate">Premium Member</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}