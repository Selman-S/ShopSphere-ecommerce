'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

const paymentMethods = [
  {
    id: 'credit-card',
    title: 'Credit Card',
    description: 'Pay with your credit or debit card',
    icon: CreditCard,
  },
  {
    id: 'bank-transfer',
    title: 'Bank Transfer',
    description: 'Pay directly from your bank account',
    icon: Building2,
  },
  {
    id: 'cash-on-delivery',
    title: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: Truck,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState('credit-card');
  const [shippingAddress, setShippingAddress] = useState<any>(null);

  useEffect(() => {
    // Check if shipping address exists
    const savedAddress = localStorage.getItem('shippingAddress');
    if (!savedAddress) {
      router.push('/checkout/shipping');
      return;
    }
    setShippingAddress(JSON.parse(savedAddress));
  }, [router]);

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleContinue = () => {
    try {
      // Save payment method to localStorage
      localStorage.setItem('paymentMethod', selectedMethod);
      router.push('/checkout/placeorder');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
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
            <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white">
              2
            </div>
            <div className="ml-2 text-sm font-medium text-indigo-600">Payment</div>
          </div>
          <div className="h-px bg-gray-300 w-16 mx-4" />
          <div className="flex items-center">
            <div className="border-2 border-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-gray-400">
              3
            </div>
            <div className="ml-2 text-sm font-medium text-gray-400">Review</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h1>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="sr-only"
                />
                <method.icon className={`h-6 w-6 ${
                  selectedMethod === method.id ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{method.title}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Back to Shipping
            </Button>
            <Button
              onClick={handleContinue}
            >
              Continue to Review
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-base text-gray-600">
              <span>Items ({items.length})</span>
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

          {/* Shipping Address Summary */}
          {shippingAddress && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping to:</h3>
              <p className="text-sm text-gray-600">
                {shippingAddress.fullName}<br />
                {shippingAddress.address}<br />
                {shippingAddress.city}, {shippingAddress.postalCode}<br />
                {shippingAddress.country}<br />
                Phone: {shippingAddress.phone}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}