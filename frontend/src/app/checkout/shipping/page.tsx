'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { toast } from 'sonner';

const shippingSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
  phone: yup.string().required('Phone number is required'),
});

type ShippingFormData = yup.InferType<typeof shippingSchema>;

export default function ShippingPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const { setShippingAddress } = useOrderStore();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: yupResolver(shippingSchema),
    defaultValues: typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('shippingAddress') || '{}')
      : {},
  });

  // Initial cart check
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      if (items.length === 0) {
        router.push('/cart');
      }
      setIsInitialized(true);
    }
  }, [items.length, router, isInitialized]);

  const onSubmit = async (data: ShippingFormData) => {
    try {
      if (items.length === 0) {
        toast.error('Your cart is empty');
        router.push('/cart');
        return;
      }

      setShippingAddress(data);
      localStorage.setItem('shippingAddress', JSON.stringify(data));
      
      // Use replace instead of push to avoid back button issues
      router.replace('/checkout/payment');
    } catch (error) {
      console.error('Shipping submission error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Don't render anything until we've done our initial check
  if (!isInitialized) {
    return null;
  }

  // If cart is empty after initialization, show a message instead of redirecting
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white">
              1
            </div>
            <div className="ml-2 text-sm font-medium text-indigo-600">Shipping</div>
          </div>
          <div className="h-px bg-gray-300 w-16 mx-4" />
          <div className="flex items-center">
            <div className="border-2 border-gray-300 rounded-full h-8 w-8 flex items-center justify-center text-gray-400">
              2
            </div>
            <div className="ml-2 text-sm font-medium text-gray-400">Payment</div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  placeholder="Enter postal code"
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="Enter your country"
                />
                {errors.country && (
                  <p className="text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back to Cart
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Continue to Payment'}
              </Button>
            </div>
          </form>
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
              <span>Calculated next</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-medium text-gray-900">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}