import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';
import { useCartStore } from './useCartStore';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  clientSecret: string | null;
  createPaymentIntent: (amount: number) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const usePaymentStore = create<PaymentState>()((set) => ({
  isLoading: false,
  error: null,
  clientSecret: null,

  createPaymentIntent: async (amount: number) => {
    try {
      const user = useAuthStore.getState().user;
      const { items } = useCartStore.getState();
      
      if (!user?.token) {
        throw new Error('Not authenticated');
      }

      set({ isLoading: true, error: null });
      const response = await axios.post(
        `${API_URL}/payment/create-payment-intent`,
        { 
          amount,
          items: items.map(item => ({
            id: item._id,
            quantity: item.quantity,
            price: item.price
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      set({ clientSecret: response.data.clientSecret, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create payment intent',
        isLoading: false,
      });
      throw error;
    }
  },
})); 