import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });
          set({ user: response.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(`${API_URL}/auth/register`, {
            name,
            email,
            password,
          });
          set({ user: response.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 