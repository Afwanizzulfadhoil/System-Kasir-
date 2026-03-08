'use client';

import React, { useState } from 'react';
import { useStore, Product, Category } from '@/lib/store';
import { Package, Plus, Trash2, Edit2, Save, X, MoreHorizontal, DollarSign, Tag, ShoppingBag } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

import { useIsMobile } from '@/hooks/use-mobile';

export default function Inventory() {
  const { products, addProduct, deleteProduct, updateProductPrice, isHighContrast, isLargeText } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const isMobile = useIsMobile();

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: 'Coffee',
    image: 'https://picsum.photos/seed/new/300/300'
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price <= 0) {
      toast.error('Mohon isi detail produk dengan benar');
      return;
    }
    addProduct(newProduct);
    setIsAdding(false);
    setNewProduct({
      name: '',
      price: 0,
      category: 'Coffee',
      image: 'https://picsum.photos/seed/new/300/300'
    });
    toast.success('Produk berhasil ditambahkan!');
  };

  const handleUpdatePrice = (id: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Harga tidak valid');
      return;
    }
    updateProductPrice(id, price);
    setEditingPriceId(null);
    setNewPrice('');
    toast.success('Harga berhasil diperbarui!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
      toast.success('Produk berhasil dihapus');
    }
  };

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
            Manajemen Produk
          </h2>
          <p className="text-zinc-500 text-sm">Kelola daftar menu dan harga</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Tambah Produk
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "bg-white rounded-3xl border p-8 shadow-xl relative",
                  isHighContrast && "bg-zinc-900 border-zinc-700"
                )}
              >
                <button 
                  onClick={() => setIsAdding(false)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold mb-6">Tambah Produk Baru</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Nama Produk</label>
                    <input 
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className={cn(
                        "w-full p-4 rounded-xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                      placeholder="Contoh: Kopi Susu Gula Aren"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Kategori</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                      className={cn(
                        "w-full p-4 rounded-xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                    >
                      <option value="Coffee">Coffee</option>
                      <option value="Tea">Tea</option>
                      <option value="Pastry">Pastry</option>
                      <option value="Food">Food</option>
                      <option value="Merch">Merch</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">Harga (Rp)</label>
                    <input 
                      type="number"
                      required
                      value={newProduct.price || ''}
                      onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className={cn(
                        "w-full p-4 rounded-xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-400">URL Gambar</label>
                    <input 
                      type="text"
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className={cn(
                        "w-full p-4 rounded-xl border bg-zinc-50 focus:bg-white transition-all",
                        isHighContrast && "bg-zinc-800 border-zinc-700 focus:bg-zinc-900"
                      )}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                      Simpan Produk
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List/Table */}
          {isMobile ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className={cn(
                  "bg-white rounded-3xl border p-4 flex items-center gap-4",
                  isHighContrast && "bg-zinc-900 border-zinc-800 text-white"
                )}>
                  <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm">{product.name}</h4>
                      <span className="font-mono text-xs font-bold text-indigo-600">{formatRupiah(product.price)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[8px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn(
              "bg-white rounded-[32px] border overflow-hidden",
              isHighContrast && "bg-zinc-900 border-zinc-800"
            )}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={cn(
                    "bg-zinc-50/50 border-b",
                    isHighContrast ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50/50 border-b"
                  )}>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Produk</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Kategori</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Harga</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((product) => (
                    <tr key={product.id} className={cn(
                      "hover:bg-zinc-50/50 transition-colors group",
                      isHighContrast && "hover:bg-zinc-800"
                    )}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-bold">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingPriceId === product.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              autoFocus
                              value={newPrice}
                              onChange={e => setNewPrice(e.target.value)}
                              className="w-32 p-2 rounded-lg border text-sm font-mono"
                            />
                            <button onClick={() => handleUpdatePrice(product.id)} className="p-2 bg-emerald-500 text-white rounded-lg">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingPriceId(null)} className="p-2 bg-zinc-200 text-zinc-600 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-mono font-bold text-indigo-600">
                            {formatRupiah(product.price)}
                            <button 
                              onClick={() => {
                                setEditingPriceId(product.id);
                                setNewPrice(product.price.toString());
                              }}
                              className="p-1 text-zinc-300 hover:text-zinc-600"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
