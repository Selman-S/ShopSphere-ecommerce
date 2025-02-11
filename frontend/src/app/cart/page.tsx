'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number, maxStock: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0 && newQuantity <= maxStock) {
      updateQuantity(productId, newQuantity);
      toast.success('Cart updated');
    } else if (newQuantity > maxStock) {
      toast.error('Not enough stock available');
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout/shipping');
      return;
    }
    router.push('/checkout/shipping');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some products to your cart and they will appear here</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center space-x-4 p-4 bg-white rounded-lg border"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-medium text-gray-900 hover:text-gray-600"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item._id, item.quantity, -1, item.countInStock)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item._id, item.quantity, 1, item.countInStock)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-base text-gray-600">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-medium text-gray-900">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 