'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function PlaceOrderPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    // Check if shipping address and payment method exist
    const savedAddress = localStorage.getItem('shippingAddress');
    const savedPaymentMethod = localStorage.getItem('paymentMethod');

    if (!savedAddress || !savedPaymentMethod) {
      router.push('/checkout/shipping');
      return;
    }

    setShippingAddress(JSON.parse(savedAddress));
    setPaymentMethod(savedPaymentMethod);
  }, [router]);

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);

      const order = {
        orderItems: items.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: getTotalPrice(),
        shippingPrice: 10,
        totalPrice: getTotalPrice() + 10,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/orders`, order, config);

      // Clear cart and local storage
      clearCart();
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');

      // Redirect to order details
      router.push(`/order/${data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="bg-green-600 rounded-full h-8 w-8 flex items-center justify-center text-white">
              ✓
            </div>
            <div className="ml-2 text-sm font-medium text-green-600">Shipping</div>
          </div>
          <div className="h-px bg-gray-300 w-16 mx-4" />
          <div className="flex items-center">
            <div className="bg-green-600 rounded-full h-8 w-8 flex items-center justify-center text-white">
              ✓
            </div>
            <div className="ml-2 text-sm font-medium text-green-600">Payment</div>
          </div>
          <div className="h-px bg-gray-300 w-16 mx-4" />
          <div className="flex items-center">
            <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white">
              3
            </div>
            <div className="ml-2 text-sm font-medium text-indigo-600">Review</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Review</h1>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {shippingAddress.fullName}<br />
                  {shippingAddress.address}<br />
                  {shippingAddress.city}, {shippingAddress.postalCode}<br />
                  {shippingAddress.country}<br />
                  Phone: {shippingAddress.phone}
                </p>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {paymentMethod && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 capitalize">
                  {paymentMethod.replace('-', ' ')}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-base text-gray-600">
                <span>Items</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-medium text-gray-900">
                <span>Total</span>
                <span>${(getTotalPrice() + 10).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Back to Payment
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={isLoading}
            >
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}