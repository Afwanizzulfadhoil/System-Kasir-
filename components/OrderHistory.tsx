'use client';

import React, { useState } from 'react';
import { useStore, Order } from '@/lib/store';
import { format } from 'date-fns';
import { ShoppingBag, CheckCircle2, RotateCcw, ChevronRight, Printer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatRupiah } from '@/lib/utils';

export default function OrderHistory() {
  const { orders, isHighContrast, isLargeText } = useStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn(
      "flex-1 flex flex-col overflow-hidden bg-zinc-50",
      isHighContrast && "bg-black"
    )}>
      <div className={cn(
        "p-6 border-b bg-white",
        isHighContrast && "bg-black border-zinc-800"
      )}>
        <h2 className={cn(
          "font-display font-bold",
          isLargeText ? "text-3xl" : "text-2xl",
          isHighContrast ? "text-white" : "text-zinc-900"
        )}>
          Riwayat Pesanan
        </h2>
        <p className="text-zinc-500 text-sm">Tinjau dan kelola transaksi sebelumnya</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {orders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <p className="font-medium">Tidak ada pesanan ditemukan</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {orders.sort((a, b) => b.timestamp - a.timestamp).map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className={cn(
                  "bg-white rounded-3xl border overflow-hidden transition-all",
                  isHighContrast && "bg-zinc-900 border-zinc-800 text-white",
                  expandedOrder === order.id && "ring-2 ring-indigo-500 shadow-xl"
                )}
              >
                <div 
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className={cn(
                    "p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors",
                    isHighContrast && "hover:bg-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold font-mono text-sm">{order.id}</h4>
                      <p className="text-zinc-400 text-xs">{format(order.timestamp, 'MMM d, yyyy • h:mm a')}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex gap-2 overflow-x-auto py-1 no-scrollbar">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex-shrink-0 bg-zinc-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-500 border"
                      >
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex-shrink-0 bg-zinc-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-400 border">
                        +{order.items.length - 3} lagi
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Total</p>
                      <p className={cn(
                        "font-mono font-bold text-indigo-600",
                        isLargeText ? "text-xl" : "text-lg"
                      )}>
                        {formatRupiah(order.total)}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "w-5 h-5 text-zinc-400 transition-transform",
                      expandedOrder === order.id && "rotate-90"
                    )} />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={cn(
                        "border-t bg-zinc-50/50 p-6",
                        isHighContrast && "bg-zinc-900 border-zinc-800"
                      )}
                    >
                      <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Rincian Pesanan</h5>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center text-xs font-bold">{item.quantity}x</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="font-mono text-sm">{formatRupiah(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t flex justify-between items-end">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Metode Pembayaran:</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                              order.paymentMethod === 'Cash' && "bg-emerald-100 text-emerald-700",
                              order.paymentMethod === 'QRIS' && "bg-orange-100 text-orange-700",
                              order.paymentMethod === 'Card' && "bg-indigo-100 text-indigo-700"
                            )}>
                              {order.paymentMethod}
                            </span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setReceiptOrder(order);
                            }}
                            className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                          >
                            <Printer className="w-4 h-4" /> Cetak Ulang Struk
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-400">Total Dibayar</span>
                          <p className="font-mono font-bold text-lg">{formatRupiah(order.total)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {receiptOrder && (
          <div 
            onClick={() => setReceiptOrder(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col print:shadow-none print:rounded-none print:max-w-none print:w-full"
            >
              <div className="p-4 border-b flex justify-between items-center print:hidden">
                <h3 className="font-bold">Struk Pembayaran</h3>
                <button onClick={() => setReceiptOrder(null)} className="p-2 hover:bg-zinc-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 font-mono text-sm print:overflow-visible">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-xl font-bold uppercase tracking-tighter">Cafe UMM Zone</h2>
                  <p className="text-[10px] text-zinc-500">Jl. Kopi Nikmat No. 123, Jakarta<br/>Telp: (021) 555-0123</p>
                  <div className="border-b border-dashed border-zinc-300 pt-2"></div>
                </div>

                <div className="space-y-1 mb-6 text-[10px]">
                  <div className="flex justify-between">
                    <span>No. Struk:</span>
                    <span>{receiptOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <span>{format(receiptOrder.timestamp, 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>Admin</span>
                  </div>
                </div>

                <div className="border-b border-dashed border-zinc-300 mb-4"></div>

                <div className="space-y-4 mb-6">
                  {receiptOrder.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{item.name}</span>
                        <span>{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500">
                        <span>{item.quantity} x {formatRupiah(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-b border-dashed border-zinc-300 mb-4"></div>

                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-xs">
                    <span>Subtotal</span>
                    <span>{formatRupiah(receiptOrder.total / 1.1)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Pajak (10%)</span>
                    <span>{formatRupiah(receiptOrder.total - (receiptOrder.total / 1.1))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-zinc-300">
                    <span>TOTAL</span>
                    <span>{formatRupiah(receiptOrder.total)}</span>
                  </div>
                </div>

                <div className="space-y-1 mb-8 text-[10px]">
                  <div className="flex justify-between">
                    <span>Metode Bayar:</span>
                    <span className="font-bold">{receiptOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-bold uppercase">Lunas</span>
                  </div>
                </div>

                <div className="text-center space-y-2 mt-8">
                  <div className="border-b border-dashed border-zinc-300 mb-4"></div>
                  <p className="text-[10px] font-bold">TERIMA KASIH</p>
                  <p className="text-[8px] text-zinc-400 italic">Silakan datang kembali!</p>
                  <div className="pt-4 flex justify-center opacity-20">
                    <div className="w-32 h-8 bg-black"></div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t flex gap-3 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                >
                  <Printer className="w-5 h-5" /> Cetak
                </button>
                <button 
                  onClick={() => setReceiptOrder(null)}
                  className="flex-1 py-3 bg-white border text-zinc-600 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
