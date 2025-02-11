export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                ShopSphere
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                Your one-stop shop for all your needs. Quality products, great prices, and excellent
                service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="/products" className="text-sm text-gray-600 hover:text-gray-900">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/categories" className="text-sm text-gray-600 hover:text-gray-900">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="/cart" className="text-sm text-gray-600 hover:text-gray-900">
                    Shopping Cart
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Customer Service
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/shipping" className="text-sm text-gray-600 hover:text-gray-900">
                    Shipping Information
                  </a>
                </li>
                <li>
                  <a href="/returns" className="text-sm text-gray-600 hover:text-gray-900">
                    Returns & Exchanges
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Newsletter
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                Subscribe to our newsletter for updates and exclusive offers.
              </p>
              <form className="mt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 text-center">
              © {new Date().getFullYear()} ShopSphere. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 