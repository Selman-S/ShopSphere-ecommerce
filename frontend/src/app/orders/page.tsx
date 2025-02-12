'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orders, isLoading, error, getMyOrders } = useOrderStore();

  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      if (!user) {
        router.push('/login?redirect=/orders');
        return;
      }

      try {
        await getMyOrders();
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    checkAuthAndFetchOrders();
  }, [user, router, getMyOrders]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
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

  if (!orders.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h1>
        <p className="text-gray-600 mb-8">You haven't placed any orders yet</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Order Info */}
              <div className="space-y-2">
                <Link
                  href={`/order/${order._id}`}
                  className="text-lg font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Order {order.orderNumber}
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    order.isPaid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.isPaid ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  {order.isPaid ? 'Paid' : 'Pending Payment'}
                </div>
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    order.isDelivered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {order.isDelivered ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <Package className="h-4 w-4 mr-1" />
                  )}
                  {order.isDelivered ? 'Delivered' : 'In Transit'}
                </div>
              </div>

              {/* Order Summary */}
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {order.orderItems.length} items
                </div>
                <div className="text-lg font-medium text-gray-900">
                  ${order.totalPrice.toFixed(2)}
                </div>
              </div>

              {/* View Details Button */}
              <Button asChild variant="outline">
                <Link href={`/order/${order._id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 