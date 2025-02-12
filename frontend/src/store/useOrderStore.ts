import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  shippingAddress: ShippingAddress | null;
  paymentMethod: string;
  createOrder: (orderData: Partial<Order>) => Promise<string>;
  getOrderById: (orderId: string) => Promise<void>;
  getMyOrders: () => Promise<void>;
  payOrder: (orderId: string, paymentResult: any) => Promise<void>;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useOrderStore = create<OrderState>()((set, get) => ({
  currentOrder: null,
  orders: [],
  isLoading: false,
  error: null,
  shippingAddress: null,
  paymentMethod: '',

  createOrder: async (orderData) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.token) {
        throw new Error('Not authenticated');
      }

      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      set({ currentOrder: response.data, isLoading: false });
      return response.data._id;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create order',
        isLoading: false,
      });
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.token) {
        throw new Error('Not authenticated');
      }

      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      set({ currentOrder: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch order',
        isLoading: false,
      });
    }
  },

  getMyOrders: async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.token) {
        throw new Error('Not authenticated');
      }

      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      set({ orders: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch orders',
        isLoading: false,
      });
    }
  },

  payOrder: async (orderId, paymentResult) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.token) {
        throw new Error('Not authenticated');
      }

      set({ isLoading: true, error: null });
      const response = await axios.put(
        `${API_URL}/orders/${orderId}/pay`,
        paymentResult,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      set({ currentOrder: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update payment',
        isLoading: false,
      });
    }
  },

  setShippingAddress: (address) => {
    set({ shippingAddress: address });
    localStorage.setItem('shippingAddress', JSON.stringify(address));
  },

  setPaymentMethod: (method) => {
    set({ paymentMethod: method });
    localStorage.setItem('paymentMethod', method);
  },
})); 