'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Receipt, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatRupiah } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, completeOrder, isHighContrast, isLargeText } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const isMobile = useIsMobile();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const confirmOrder = () => {
    completeOrder();
    setIsCheckoutOpen(false);
    toast.success('Pesanan berhasil diselesaikan!');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#10B981', '#F59E0B']
    });
  };

  return (
    <div className={cn(
      "w-full flex flex-col transition-all h-full",
      !isMobile && "lg:w-96 border-l",
      isHighContrast && "bg-black border-zinc-800"
    )}>
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className={cn(
          "font-display font-bold flex items-center gap-2",
          isLargeText ? "text-2xl" : "text-xl",
          isHighContrast ? "text-white" : "text-zinc-900"
        )}>
          Pesanan Saat Ini
          <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">{cart.length}</span>
        </h2>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
            title="Kosongkan Keranjang"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4"
            >
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <p className="font-medium">Keranjang Anda kosong</p>
            </motion.div>
          ) : (
            cart.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key={item.id}
                className={cn(
                  "p-4 rounded-2xl border bg-zinc-50 flex gap-4 items-center group",
                  isHighContrast && "bg-zinc-900 border-zinc-800 text-white"
                )}
              >
                <div className="flex-1">
                  <h4 className={cn(
                    "font-bold leading-tight",
                    isLargeText ? "text-lg" : "text-sm"
                  )}>
                    {item.name}
                  </h4>
                  <p className="text-zinc-400 text-xs font-mono">{formatRupiah(item.price)}</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white rounded-xl border p-1 shadow-sm">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className={cn(
        "p-6 border-t space-y-4 bg-zinc-50/50",
        isHighContrast && "bg-zinc-900 border-zinc-800"
      )}>
        <div className="space-y-2">
          <div className="flex justify-between text-zinc-500 text-sm">
            <span>Subtotal</span>
            <span className="font-mono">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-500 text-sm">
            <span>Pajak (10%)</span>
            <span className="font-mono">{formatRupiah(tax)}</span>
          </div>
          <div className={cn(
            "flex justify-between pt-2 border-t font-bold",
            isLargeText ? "text-2xl" : "text-xl",
            isHighContrast ? "text-white" : "text-zinc-900"
          )}>
            <span>Total</span>
            <span className="font-mono text-indigo-600">{formatRupiah(total)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className={cn(
            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-95",
            cart.length === 0 
              ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none" 
              : "bg-indigo-600 text-white hover:bg-indigo-700",
            isLargeText && "text-xl py-6"
          )}
        >
          <CreditCard className="w-6 h-6" />
          Bayar Sekarang
        </button>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden",
                isHighContrast && "bg-zinc-900 text-white border border-zinc-700"
              )}
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <Receipt className="w-10 h-10 text-indigo-600" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">Selesaikan Pembayaran</h3>
                  <p className="text-zinc-500">Pilih metode pembayaran untuk <span className="font-bold text-zinc-900">{formatRupiah(total)}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={confirmOrder}
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-zinc-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                  >
                    <CreditCard className="w-8 h-8 text-zinc-400 group-hover:text-indigo-600" />
                    <span className="font-bold">Kartu</span>
                  </button>
                  <button 
                    onClick={confirmOrder}
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-zinc-100 hover:border-emerald-600 hover:bg-emerald-50 transition-all group"
                  >
                    <Banknote className="w-8 h-8 text-zinc-400 group-hover:text-emerald-600" />
                    <span className="font-bold">Tunai</span>
                  </button>
                </div>

                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full py-4 text-zinc-400 font-medium hover:text-zinc-600 transition-colors"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
