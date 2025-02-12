'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useOrderStore } from '@/store/useOrderStore';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import PaymentForm from '@/components/payment/PaymentForm';
import { Button } from '@/components/ui/button';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotalPrice } = useCartStore();
  const { shippingAddress } = useOrderStore();
  const { clientSecret, createPaymentIntent, isLoading, error } = usePaymentStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate totals
  const itemsTotal = getTotalPrice();
  const shippingCost = 10; // Fixed shipping cost
  const taxRate = 0.18; // 18% tax rate
  const taxAmount = itemsTotal * taxRate;
  const totalAmount = itemsTotal + shippingCost + taxAmount;

  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      const checkRequirements = async () => {
        if (!user) {
          router.replace('/login?redirect=/checkout/payment');
          return;
        }

        if (items.length === 0) {
          router.replace('/cart');
          return;
        }

        if (!shippingAddress) {
          router.replace('/checkout/shipping');
          return;
        }

        // Only create payment intent if all requirements are met
        try {
          await createPaymentIntent(totalAmount);
        } catch (error) {
          console.error('Failed to create payment intent:', error);
        }
      };

      checkRequirements();
      setIsInitialized(true);
    }
  }, [user, items, shippingAddress, router, createPaymentIntent, isInitialized]);

  // Don't render anything until we've done our initial check
  if (!isInitialized || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading payment details...</div>
      </div>
    );
  }

  // Show appropriate messages for missing requirements
  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (!shippingAddress) {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Preparing payment...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Payment Details</h1>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Items Total</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (18%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-gray-900">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Stripe Elements */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
}