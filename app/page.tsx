'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import OrderHistory from '@/components/OrderHistory';
import Inventory from '@/components/Inventory';
import Reservations from '@/components/Reservations';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingCart as CartIcon, X } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('pos');
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isHighContrast, isLargeText, cart } = useStore();
  const isMobile = useIsMobile();

  // Hydration fix for Zustand persist
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <main className={cn(
      "flex h-screen w-full overflow-hidden transition-all duration-500",
      isHighContrast && "bg-black text-white",
      isLargeText && "text-lg",
      isMobile && "flex-col pb-20"
    )}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'pos' && (
            <motion.div 
              key="pos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex overflow-hidden"
            >
              <ProductGrid />
              {!isMobile && <Cart />}
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex overflow-hidden"
            >
              <Inventory />
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex overflow-hidden"
            >
              <OrderHistory />
            </motion.div>
          )}

          {activeTab === 'reservations' && (
            <motion.div 
              key="reservations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex overflow-hidden"
            >
              <Reservations />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Cart Toggle */}
      {isMobile && activeTab === 'pos' && (
        <>
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-24 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform"
          >
            <CartIcon className="w-7 h-7" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isCartOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex flex-col"
              >
                <div className="flex-1" onClick={() => setIsCartOpen(false)} />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="bg-white rounded-t-[40px] h-[85vh] flex flex-col overflow-hidden"
                >
                  <div className="p-4 flex justify-center">
                    <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="absolute top-4 right-6 p-2 text-zinc-400 hover:text-zinc-600 z-10"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <Cart />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite">
        {activeTab === 'pos' && "Point of Sale aktif. Telusuri produk dan tambahkan ke keranjang."}
        {activeTab === 'inventory' && "Manajemen Inventaris aktif. Tinjau tingkat stok."}
        {activeTab === 'orders' && "Riwayat Pesanan aktif. Tinjau transaksi sebelumnya."}
        {activeTab === 'reservations' && "Menu Reservasi aktif. Kelola pemesanan tempat."}
        {activeTab === 'admin' && "Panel Admin aktif. Kelola sistem."}
      </div>
    </main>
  );
}
