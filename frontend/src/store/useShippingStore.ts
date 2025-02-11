import { create } from 'zustand';
import axios from 'axios';

interface ShippingHistory {
  status: string;
  location: string;
  timestamp: Date;
  description: string;
}

interface Shipping {
  _id: string;
  order: string;
  trackingNumber: string;
  carrier: 'PTT' | 'Yurtici' | 'Aras';
  status: 'processing' | 'in_transit' | 'delivered' | 'failed';
  estimatedDeliveryDate: Date;
  history: ShippingHistory[];
  createdAt: Date;
  updatedAt: Date;
}

interface ShippingState {
  currentShipping: Shipping | null;
  isLoading: boolean;
  error: string | null;
  getShippingByOrderId: (orderId: string) => Promise<void>;
  updateShippingStatus: (shippingId: string, data: Partial<Shipping>) => Promise<void>;
  createShipping: (data: Partial<Shipping>) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useShippingStore = create<ShippingState>()((set) => ({
  currentShipping: null,
  isLoading: false,
  error: null,

  getShippingByOrderId: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/shipping/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set({ currentShipping: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch shipping details',
        isLoading: false,
      });
    }
  },

  updateShippingStatus: async (shippingId: string, data: Partial<Shipping>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(
        `${API_URL}/shipping/${shippingId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      set({ currentShipping: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update shipping status',
        isLoading: false,
      });
      throw error;
    }
  },

  createShipping: async (data: Partial<Shipping>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/shipping`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set({ currentShipping: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create shipping',
        isLoading: false,
      });
      throw error;
    }
  },
}));