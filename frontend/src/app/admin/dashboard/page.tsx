'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/store/useOrderStore';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
  });

  const { orders } = useOrderStore();

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, using dummy data
    setStats({
      totalSales: 15789.45,
      totalOrders: 156,
      totalProducts: 89,
      totalUsers: 234,
      recentOrders: orders.slice(0, 5),
    });
  }, [orders]);

  const overviewCards = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: DollarSign,
      trend: 12.5,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      trend: 8.2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      trend: -2.4,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      trend: 5.7,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-full ${card.bgColor} ${card.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center space-x-1">
                  <span
                    className={`text-sm ${
                      card.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {Math.abs(card.trend)}%
                  </span>
                  {card.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/admin/orders" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    <Link href={`/admin/orders/${order._id}`}>
                      #{order._id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.shippingAddress.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.isPaid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 