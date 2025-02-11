'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { selectedProduct, isLoading, error, fetchProductBySlug } = useProductStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (typeof slug === 'string') {
      fetchProductBySlug(slug);
    }
  }, [slug, fetchProductBySlug]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart({
        _id: selectedProduct._id,
        name: selectedProduct.name,
        slug: selectedProduct.slug,
        price: selectedProduct.price,
        image: selectedProduct.images[0],
        quantity: 1,
        countInStock: selectedProduct.countInStock,
      });
      toast.success('Added to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedProduct.name}
            </h1>
            <p className="text-lg text-gray-500 mt-2">{selectedProduct.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < selectedProduct.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({selectedProduct.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-gray-900">
            ${selectedProduct.price.toFixed(2)}
          </div>

          {/* Stock Status */}
          <div>
            <p className="text-sm text-gray-500">
              Status:{' '}
              <span
                className={`font-medium ${
                  selectedProduct.countInStock > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {selectedProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{selectedProduct.description}</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={selectedProduct.countInStock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 