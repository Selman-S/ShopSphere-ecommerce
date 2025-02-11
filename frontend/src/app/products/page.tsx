'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/useProductStore';

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const {
    filteredProducts,
    filters,
    isLoading,
    error,
    pagination,
    fetchProducts,
    setFilters,
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          All Products ({pagination.total})
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Sort by:
            </label>
            <select
              id="sort"
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value })}
              className="text-sm border rounded-md px-2 py-1"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className={`w-full sm:w-64 space-y-6 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </h3>
            {/* Categories */}
            <div className="space-y-2">
              <h4 className="font-medium">Categories</h4>
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.toLowerCase()}
                    checked={filters.category === category.toLowerCase()}
                    onChange={(e) => setFilters({ category: e.target.value })}
                    className="text-indigo-600"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <h4 className="font-medium mb-4">Price Range</h4>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    setFilters({
                      priceRange: [Number(e.target.value), filters.priceRange[1]],
                    })
                  }
                  className="w-20 px-2 py-1 border rounded-md"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      priceRange: [filters.priceRange[0], Number(e.target.value)],
                    })
                  }
                  className="w-20 px-2 py-1 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                {[...Array(pagination.pages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant="outline"
                    className={pagination.page === index + 1 ? 'bg-gray-100' : ''}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Temporary data
const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports',
]; 