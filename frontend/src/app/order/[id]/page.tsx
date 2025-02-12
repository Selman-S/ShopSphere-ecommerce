'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Truck, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentOrder, isLoading, error, getOrderById } = useOrderStore();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/order/' + id);
      return;
    }

    if (typeof id === 'string') {
      getOrderById(id);
    }
  }, [id, user, router, getOrderById]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading order details...</div>
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

  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Order Header */}
          <div className="border-b pb-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Order {currentOrder.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Order Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-medium">Payment Status</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                currentOrder.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentOrder.isPaid ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Paid on {new Date(currentOrder.paidAt!).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    Pending Payment
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-medium">Delivery Status</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                currentOrder.isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {currentOrder.isDelivered ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Delivered on {new Date(currentOrder.deliveredAt!).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    In Transit
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                {currentOrder.shippingAddress.fullName}<br />
                {currentOrder.shippingAddress.address}<br />
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}<br />
                {currentOrder.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {currentOrder.orderItems.map((item) => (
                <div
                  key={item.product}
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
                    <Link
                      href={`/products/${item.product}`}
                      className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {item.name}
                    </Link>
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
                <span>${currentOrder.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Shipping</span>
                <span>${currentOrder.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Tax</span>
                <span>${currentOrder.taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-medium text-gray-900">
                <span>Total</span>
                <span>${currentOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button asChild variant="outline">
              <Link href="/orders">Back to Orders</Link>
            </Button>
            {!currentOrder.isPaid && (
              <Button asChild>
                <Link href={`/checkout/payment?orderId=${currentOrder._id}`}>
                  Pay Now
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}