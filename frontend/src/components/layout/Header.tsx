'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ShopSphere
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Categories
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[200px] bg-white rounded-md shadow-lg p-2 mt-2"
                    sideOffset={5}
                  >
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="px-2 py-1.5 text-sm text-gray-500">
                      {user.email}
                    </div>
                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                    {user.role === 'admin' && (
                      <DropdownMenu.Item className="outline-none">
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item className="outline-none">
                      <Link
                        href="/profile"
                        className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="outline-none">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Link href="/login">
                <Button>Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 