import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  countInStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item._id === product._id);

          if (existingItem) {
            // If item exists, update quantity
            const newQuantity = existingItem.quantity + 1;
            if (newQuantity <= product.countInStock) {
              return {
                items: state.items.map((item) =>
                  item._id === product._id
                    ? { ...item, quantity: newQuantity }
                    : item
                ),
              };
            }
            return state; // Return unchanged state if exceeding stock
          }

          // If item doesn't exist, add new item
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
); 