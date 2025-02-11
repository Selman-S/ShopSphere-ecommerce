import Image from "next/image";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <Image
          src="/images/hero.jpg"
          alt="Hero background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Your Perfect Style
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8">
              Shop the latest trends in fashion, electronics, and more with our curated collection
              of premium products.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/products" className="flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">${product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-100">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Temporary data (will be replaced with API calls)
const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: '/images/categories/electronics.jpg',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    image: '/images/categories/fashion.jpg',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    image: '/images/categories/home.jpg',
  },
  {
    name: 'Sports',
    slug: 'sports',
    image: '/images/categories/sports.jpg',
  },
];

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: '/images/products/headphones.jpg',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: '/images/products/watch.jpg',
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 79.99,
    image: '/images/products/shoes.jpg',
  },
  {
    id: 4,
    name: 'Laptop Backpack',
    price: 49.99,
    image: '/images/products/backpack.jpg',
  },
];

import { Truck, Shield, CreditCard } from 'lucide-react';

const features = [
  {
    title: 'Free Shipping',
    description: 'Free shipping on orders over $100',
    icon: Truck,
  },
  {
    title: 'Secure Payment',
    description: 'Safe & secure payment methods',
    icon: CreditCard,
  },
  {
    title: 'Money Back Guarantee',
    description: '30-day money back guarantee',
    icon: Shield,
  },
];
