import { create } from 'zustand';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
  filters: {
    category: string;
    priceRange: [number, number];
    sortBy: string;
  };
  fetchProducts: (page?: number) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  setFilters: (filters: Partial<ProductState['filters']>) => void;
  applyFilters: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
  filters: {
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'featured',
  },

  fetchProducts: async (page = 1) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products?page=${page}`);
      set({
        products: response.data.products,
        filteredProducts: response.data.products,
        pagination: {
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchProductBySlug: async (slug: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products/${slug}`);
      set({
        selectedProduct: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch product',
        isLoading: false,
      });
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Remove product from state
      const products = get().products.filter(p => p._id !== productId);
      set({ 
        products,
        filteredProducts: products,
        isLoading: false 
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete product',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { products, filters } = get();
    let filtered = [...products];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    set({ filteredProducts: filtered });
  },
})); 