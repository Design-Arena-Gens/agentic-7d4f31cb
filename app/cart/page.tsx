'use client'

import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some items to get started</p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center space-x-6 border-b border-gray-200 pb-6"
              >
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.variantDetails}</p>
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.variantId, Math.max(1, item.quantity - 1))
                    }
                    className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-lg w-24 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {getTotal() > 100 ? 'FREE' : '$10.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold">${(getTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-4 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  $
                  {(
                    getTotal() +
                    (getTotal() > 100 ? 0 : 10) +
                    getTotal() * 0.1
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full px-6 py-4 bg-black text-white text-center rounded-md hover:bg-gray-800 transition font-semibold mb-4"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="block w-full px-6 py-4 border border-gray-300 text-center rounded-md hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>

            <div className="mt-6 p-4 bg-white rounded-md border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Have a promo code?</p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
                <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black text-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
