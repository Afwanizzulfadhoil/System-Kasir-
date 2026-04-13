'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { 
  ShoppingCart, 
  Package, 
  History, 
  Settings, 
  Accessibility,
  LogOut,
  Sun,
  Moon,
  Type,
  ShieldCheck,
  Calendar,
  Wallet
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

import { useIsMobile } from '@/hooks/use-mobile';

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { isHighContrast, toggleHighContrast, isLargeText, toggleLargeText } = useStore();
  const isMobile = useIsMobile();

  const menuItems = [
    { id: 'pos', icon: ShoppingCart, label: 'POS' },
    { id: 'inventory', icon: Package, label: 'Produk' },
    { id: 'orders', icon: History, label: 'Riwayat' },
    { id: 'reservations', icon: Calendar, label: 'Reservasi' },
  ];

  if (isMobile) {
    return (
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 h-20 bg-white border-t z-50 flex items-center justify-around px-2",
        isHighContrast && "bg-black border-zinc-800"
      )}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all",
              activeTab === item.id 
                ? "text-indigo-600" 
                : "text-zinc-400",
              isHighContrast && activeTab === item.id && "text-white"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    );
  }

  return (
    <aside className={cn(
      "w-20 md:w-64 bg-white border-r flex flex-col transition-all duration-300",
      isHighContrast && "bg-black border-zinc-700"
    )}>
      <div className="p-4 md:p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <span className={cn(
          "font-display font-bold text-xl hidden md:block truncate",
          isHighContrast ? "text-white" : "text-zinc-900"
        )}>
          Cafe UMM Zone
        </span>
      </div>

      <nav className="flex-1 px-2 md:px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl transition-all group relative",
              activeTab === item.id 
                ? "bg-indigo-50 text-indigo-600" 
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              isHighContrast && (
                activeTab === item.id 
                  ? "bg-zinc-800 text-white border border-zinc-600" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )
            )}
            aria-label={item.label}
          >
            <item.icon className={cn(
              "w-6 h-6 transition-transform group-hover:scale-110 flex-shrink-0",
              activeTab === item.id && "scale-110"
            )} />
            <span className={cn(
              "font-medium hidden md:block truncate",
              isLargeText ? "text-lg" : "text-sm"
            )}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full"
              />
            )}
          </button>
        ))}
      </nav>

      <div className={cn(
        "p-2 md:p-4 space-y-2 border-t border-zinc-100",
        isHighContrast && "border-zinc-800"
      )}>
        <button
          onClick={toggleHighContrast}
          className={cn(
            "w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all",
            isHighContrast ? "bg-zinc-800 text-white" : "hover:bg-zinc-50 text-zinc-500"
          )}
          title="Toggle High Contrast"
        >
          {isHighContrast ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          <span className="text-xs font-medium hidden md:block">Contrast</span>
        </button>
        
        <button
          onClick={toggleLargeText}
          className={cn(
            "w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all",
            isLargeText ? "bg-indigo-50 text-indigo-600" : "hover:bg-zinc-50 text-zinc-500"
          )}
          title="Toggle Large Text"
        >
          <Type className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-medium hidden md:block">Text Size</span>
        </button>
      </div>
    </aside>
  );
}
