'use client';

import React, { useState } from 'react';
import { useStore, Category, Product } from '@/lib/store';
import { Search, Filter, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatRupiah } from '@/lib/utils';
import Image from 'next/image';

export default function ProductGrid() {
  const { products, addToCart, isHighContrast, isLargeText } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const categories: (Category | 'All')[] = ['All', 'Coffee', 'Tea', 'Pastry', 'Food', 'Merch'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className={cn(
      "flex-1 flex flex-col overflow-hidden bg-zinc-50",
      isHighContrast && "bg-black"
    )}>
      {/* Header / Search */}
      <div className={cn(
        "p-4 md:p-6 border-b bg-white flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-0 z-20",
        isHighContrast && "bg-black border-zinc-800"
      )}>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
              isHighContrast && "bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500",
              isLargeText && "text-lg"
            )}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar mask-fade-right">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "bg-white text-zinc-600 border hover:border-indigo-300",
                isHighContrast && (
                  activeCategory === cat 
                    ? "bg-white text-black" 
                    : "bg-zinc-900 text-zinc-400 border-zinc-700"
                ),
                isLargeText && "text-base px-6 py-3"
              )}
            >
              {cat === 'All' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className={cn(
                  "group relative bg-white rounded-3xl border p-3 text-left transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95",
                  isHighContrast && "bg-zinc-900 border-zinc-800 text-white"
                )}
              >
                <div className="aspect-square relative rounded-2xl overflow-hidden mb-4 bg-zinc-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn(
                      "font-display font-bold leading-tight",
                      isLargeText ? "text-xl" : "text-base"
                    )}>
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={cn(
                      "font-mono font-semibold text-indigo-600",
                      isHighContrast && "text-indigo-400",
                      isLargeText ? "text-lg" : "text-sm"
                    )}>
                      {formatRupiah(product.price)}
                    </span>
                    <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                      {product.category}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                  <Plus className="w-5 h-5" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
