'use client';

import React, { useState } from 'react';
import { useStore, Reservation } from '@/lib/store';
import { Calendar, Users, Clock, Plus, CheckCircle2, XCircle, Clock4, Search, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Reservations() {
  const { reservations, products, addReservation, updateReservationStatus, updateReservation, deleteReservation, isHighContrast, isLargeText } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{id: string, qty: number}[]>([]);

  const [newRes, setNewRes] = useState<Omit<Reservation, 'id'>>({
    name: '',
    phone: '',
    notes: '',
    type: 'Meeting',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '18:00',
    guests: 2,
    status: 'pending',
    preOrders: []
  });

  const handleAddProductToRes = (productId: string) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === productId);
      if (existing) {
        return prev.map(p => p.id === productId ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { id: productId, qty: 1 }];
    });
  };

  const handleRemoveProductFromRes = (productId: string) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === productId);
      if (existing && existing.qty > 1) {
        return prev.map(p => p.id === productId ? { ...p, qty: p.qty - 1 } : p);
      }
      return prev.filter(p => p.id !== productId);
    });
  };

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.name || newRes.guests <= 0) {
      toast.error('Mohon isi detail reservasi dengan benar');
      return;
    }

    const preOrders = selectedProducts.map(sp => {
      const product = products.find(p => p.id === sp.id)!;
      return { ...product, quantity: sp.qty };
    });

    addReservation({ ...newRes, preOrders });
    setIsAdding(false);
    setSelectedProducts([]);
    setNewRes({
      name: '',
      phone: '',
      notes: '',
      type: 'Meeting',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '18:00',
      guests: 2,
      status: 'pending',
      preOrders: []
    });
    toast.success('Reservasi berhasil dibuat!');
  };

  const handleUpdateTime = (id: string) => {
    if (!editTime) return;
    updateReservation(id, { time: editTime });
    setEditingId(null);
    toast.success('Waktu reservasi diperbarui');
  };

  const handleDeleteReservation = (id: string) => {
    if (window.confirm('Hapus reservasi ini?')) {
      deleteReservation(id);
      toast.success('Reservasi berhasil dihapus');
    }
  };

  const handleUpdateStatus = (id: string, status: Reservation['status']) => {
    updateReservationStatus(id, status);
  };

  const filteredReservations = reservations.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn(
      "flex-1 flex flex-col overflow-hidden bg-zinc-50",
      isHighContrast && "bg-black"
    )}>
      <div className={cn(
        "p-6 border-b bg-white flex flex-col md:flex-row gap-4 items-center justify-between",
        isHighContrast && "bg-black border-zinc-800"
      )}>
        <div>
          <h2 className={cn(
            "font-display font-bold",
            isLargeText ? "text-3xl" : "text-2xl",
            isHighContrast ? "text-white" : "text-zinc-900"
          )}>
            Reservasi Tempat
          </h2>
          <p className="text-zinc-500 text-sm">Kelola pemesanan tempat untuk Meeting atau Buka Puasa</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Buat Reservasi
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "bg-white rounded-[40px] border p-8 shadow-2xl relative z-10",
                  isHighContrast && "bg-zinc-900 border-zinc-700"
                )}
              >
                <button 
                  onClick={() => setIsAdding(false)}
                  className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-600"
                >
                  <XCircle className="w-8 h-8" />
                </button>
                <h3 className="text-2xl font-display font-bold mb-8">Formulir Reservasi</h3>
                <form onSubmit={handleAddReservation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Nama Pemesan</label>
                    <input 
                      type="text"
                      required
                      value={newRes.name}
                      onChange={e => setNewRes({...newRes, name: e.target.value})}
                      className={cn(
                        "w-full p-4 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                      placeholder="Nama Lengkap / Perusahaan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Nomor Telepon</label>
                    <input 
                      type="tel"
                      value={newRes.phone}
                      onChange={e => setNewRes({...newRes, phone: e.target.value})}
                      className={cn(
                        "w-full p-4 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Tipe Acara</label>
                    <select 
                      value={newRes.type}
                      onChange={e => setNewRes({...newRes, type: e.target.value as any})}
                      className={cn(
                        "w-full p-4 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                    >
                      <option value="Meeting">Meeting / Rapat</option>
                      <option value="Iftar">Buka Puasa Bersama (Iftar)</option>
                      <option value="Gathering">Gathering / Kumpul Keluarga</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Tanggal</label>
                    <input 
                      type="date"
                      required
                      value={newRes.date}
                      onChange={e => setNewRes({...newRes, date: e.target.value})}
                      className={cn(
                        "w-full p-4 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Waktu</label>
                      <input 
                        type="time"
                        required
                        value={newRes.time}
                        onChange={e => setNewRes({...newRes, time: e.target.value})}
                        className={cn(
                          "w-full p-4 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
                          isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Jumlah Orang</label>
                      <input 
                        type="number"
                        required
                        min="0"
                        value={newRes.guests}
                        onChange={e => setNewRes({...newRes, guests: parseInt(e.target.value)})}
                        className={cn(
                          "w-full p-4 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
                          isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Catatan Tambahan</label>
                    <input 
                      type="text"
                      value={newRes.notes}
                      onChange={e => setNewRes({...newRes, notes: e.target.value})}
                      className={cn(
                        "w-full p-4 rounded-2xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                      placeholder="Contoh: Meja pojok, alergi kacang, dll"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Pre-order Menu (Opsional)</label>
                    <div className={cn(
                      "flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded-2xl bg-zinc-50",
                      isHighContrast && "bg-zinc-800 border-zinc-700"
                    )}>
                      {products.map(product => {
                        const selected = selectedProducts.find(p => p.id === product.id);
                        return (
                          <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded-xl border">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{product.name}</span>
                              <span className="text-xs text-zinc-500">Rp {product.price.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {selected && selected.qty > 0 ? (
                                <>
                                  <button type="button" onClick={() => handleRemoveProductFromRes(product.id)} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold">-</button>
                                  <span className="font-bold w-4 text-center">{selected.qty}</span>
                                  <button type="button" onClick={() => handleAddProductToRes(product.id)} className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">+</button>
                                </>
                              ) : (
                                <button type="button" onClick={() => handleAddProductToRes(product.id)} className="px-4 py-2 rounded-full bg-zinc-100 text-xs font-bold hover:bg-zinc-200">Tambah</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                      Konfirmasi Reservasi
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text"
              placeholder="Cari nama reservasi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-white focus:shadow-lg transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReservations.length === 0 ? (
              <div className="md:col-span-2 py-20 text-center text-zinc-400">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-medium">Belum ada reservasi terdaftar</p>
              </div>
            ) : (
              filteredReservations.map((res) => (
                <motion.div
                  layout
                  key={res.id}
                  className={cn(
                    "bg-white rounded-3xl border p-6 flex flex-col gap-6 hover:shadow-xl transition-all",
                    isHighContrast && "bg-zinc-900 border-zinc-800 text-white"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        res.type === 'Iftar' ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                      )}>
                        {res.type === 'Iftar' ? <Clock4 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{res.name}</h4>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{res.type}</span>
                          {res.phone && <span className="text-[10px] text-zinc-500">{res.phone}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        res.status === 'confirmed' ? "bg-emerald-50 text-emerald-600" : 
                        res.status === 'cancelled' ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-500"
                      )}>
                        {res.status}
                      </div>
                      <button
                        onClick={() => handleDeleteReservation(res.id)}
                        className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                        title="Hapus Reservasi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {res.notes && (
                    <div className={cn(
                      "px-4 py-2 bg-zinc-50 rounded-xl text-[10px] text-zinc-600 italic",
                      isHighContrast && "bg-zinc-800 text-zinc-400"
                    )}>
                      &ldquo;{res.notes}&rdquo;
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-50">
                    <div className="text-center">
                      <Calendar className="w-4 h-4 mx-auto mb-1 text-zinc-400" />
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Tanggal</p>
                      <p className="text-xs font-bold">{format(new Date(res.date), 'dd MMM')}</p>
                    </div>
                    <div className="relative group/time text-center">
                      {editingId === res.id ? (
                        <div className="flex flex-col items-center">
                          <input 
                            type="time"
                            value={editTime}
                            onChange={e => setEditTime(e.target.value)}
                            className="w-full p-1 text-[10px] border rounded"
                          />
                          <div className="flex gap-1 mt-1">
                            <button onClick={() => handleUpdateTime(res.id)} className="text-[8px] bg-indigo-600 text-white px-1 rounded">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-[8px] bg-zinc-200 px-1 rounded">X</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mx-auto mb-1 text-zinc-400" />
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">Waktu</p>
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-xs font-bold">{res.time}</p>
                            <button 
                              onClick={() => {
                                setEditingId(res.id);
                                setEditTime(res.time);
                              }}
                              className="opacity-0 group-hover/time:opacity-100 p-1 text-indigo-600 transition-opacity"
                            >
                              <Plus className="w-2 h-2" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <Users className="w-4 h-4 mx-auto mb-1 text-zinc-400" />
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Tamu</p>
                      <p className="text-xs font-bold">{res.guests} Orang</p>
                    </div>
                  </div>

                  {res.preOrders && res.preOrders.length > 0 && (
                    <div className={cn(
                      "bg-zinc-50 p-4 rounded-2xl",
                      isHighContrast && "bg-zinc-800"
                    )}>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Pre-order Menu</p>
                      <ul className="space-y-1">
                        {res.preOrders.map(item => (
                          <li key={item.id} className="text-xs flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-mono text-zinc-500">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-zinc-200 flex justify-between text-xs font-bold">
                        <span>Total Pesanan</span>
                        <span className="text-indigo-600 font-mono">
                          Rp {res.preOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {res.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                        className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Konfirmasi
                      </button>
                    )}
                    {res.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                        className="flex-1 bg-zinc-100 text-zinc-500 py-3 rounded-xl font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Batalkan
                      </button>
                    )}
                    {res.status === 'confirmed' && (
                      <button 
                        onClick={() => handleDeleteReservation(res.id)}
                        className="flex-1 bg-indigo-100 text-indigo-600 py-3 rounded-xl font-bold text-xs hover:bg-indigo-200 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Selesai (Hapus)
                      </button>
                    )}
                    {res.status === 'cancelled' && (
                      <button 
                        onClick={() => handleDeleteReservation(res.id)}
                        className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus Reservasi
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
