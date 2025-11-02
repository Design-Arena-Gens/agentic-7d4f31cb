'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const items = useCartStore((state) => state.items)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FASHION
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/shop" className="text-gray-700 hover:text-black transition">
              Shop
            </Link>
            <Link href="/shop?category=mens" className="text-gray-700 hover:text-black transition">
              Men
            </Link>
            <Link href="/shop?category=womens" className="text-gray-700 hover:text-black transition">
              Women
            </Link>
            <Link href="/shop?category=shoes" className="text-gray-700 hover:text-black transition">
              Shoes
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button className="hidden md:block text-gray-700 hover:text-black">
              <Search size={20} />
            </button>

            {session ? (
              <div className="relative group">
                <button className="text-gray-700 hover:text-black">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/signin" className="text-gray-700 hover:text-black">
                <User size={20} />
              </Link>
            )}

            <Link href="/cart" className="relative text-gray-700 hover:text-black">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/shop"
              className="block text-gray-700 hover:text-black py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/shop?category=mens"
              className="block text-gray-700 hover:text-black py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Men
            </Link>
            <Link
              href="/shop?category=womens"
              className="block text-gray-700 hover:text-black py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              href="/shop?category=shoes"
              className="block text-gray-700 hover:text-black py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shoes
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
