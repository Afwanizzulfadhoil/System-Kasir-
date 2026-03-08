import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'Coffee' | 'Tea' | 'Pastry' | 'Food' | 'Merch';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  status: 'completed' | 'refunded';
}

export interface Reservation {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  type: 'Meeting' | 'Iftar' | 'Gathering';
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  preOrders?: CartItem[];
}

interface POSState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  reservations: Reservation[];
  isHighContrast: boolean;
  isLargeText: boolean;
  
  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  completeOrder: () => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Espresso', price: 15000, category: 'Coffee', image: 'https://picsum.photos/seed/espresso-coffee/300/300' },
  { id: '2', name: 'Cappuccino', price: 25000, category: 'Coffee', image: 'https://picsum.photos/seed/cappuccino-cup/300/300' },
  { id: '3', name: 'Latte', price: 28000, category: 'Coffee', image: 'https://picsum.photos/seed/latte-art/300/300' },
  { id: '4', name: 'Green Tea', price: 18000, category: 'Tea', image: 'https://picsum.photos/seed/matcha-tea/300/300' },
  { id: '5', name: 'Earl Grey', price: 20000, category: 'Tea', image: 'https://picsum.photos/seed/black-tea/300/300' },
  { id: '6', name: 'Croissant', price: 22000, category: 'Pastry', image: 'https://picsum.photos/seed/croissant-pastry/300/300' },
  { id: '7', name: 'Blueberry Muffin', price: 24000, category: 'Pastry', image: 'https://picsum.photos/seed/blueberry-muffin/300/300' },
  { id: '8', name: 'Avocado Toast', price: 45000, category: 'Food', image: 'https://picsum.photos/seed/avocado-toast/300/300' },
  { id: '9', name: 'Club Sandwich', price: 55000, category: 'Food', image: 'https://picsum.photos/seed/club-sandwich/300/300' },
  { id: '10', name: 'Lumina Mug', price: 75000, category: 'Merch', image: 'https://picsum.photos/seed/coffee-mug/300/300' },
];

export const useStore = create<POSState>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,
      cart: [],
      orders: [],
      reservations: [],
      isHighContrast: false,
      isLargeText: false,

      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item => 
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),

      updateQuantity: (productId, delta) => set((state) => ({
        cart: state.cart.map(item => {
          if (item.id === productId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
      })),

      clearCart: () => set({ cart: [] }),

      completeOrder: () => set((state) => {
        const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          items: [...state.cart],
          total,
          timestamp: Date.now(),
          status: 'completed'
        };
        
        return {
          orders: [newOrder, ...state.orders],
          cart: [],
        };
      }),

      toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
      toggleLargeText: () => set((state) => ({ isLargeText: !state.isLargeText })),
      
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: `PROD-${Date.now()}` }]
      })),

      deleteProduct: (productId) => set((state) => ({
        products: state.products.filter(p => p.id !== productId)
      })),

      updateProductPrice: (productId, newPrice) => set((state) => ({
        products: state.products.map(p => p.id === productId ? { ...p, price: newPrice } : p)
      })),

      addReservation: (reservation) => set((state) => ({
        reservations: [...state.reservations, { ...reservation, id: `RES-${Date.now()}` }]
      })),

      updateReservationStatus: (id, status) => set((state) => ({
        reservations: state.reservations.map(r => r.id === id ? { ...r, status } : r)
      })),
      
      updateReservation: (id, updates) => set((state) => ({
        reservations: state.reservations.map(r => r.id === id ? { ...r, ...updates } : r)
      })),

      deleteReservation: (id) => set((state) => ({
        reservations: state.reservations.filter(r => r.id !== id)
      })),
    }),
    {
      name: 'kasir-sekarang-storage',
    }
  )
);

