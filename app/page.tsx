import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        reviews: { where: { approved: true }, select: { rating: true } },
      },
      take: 8,
    })

    return products.map((product) => ({
      ...product,
      averageRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center text-white">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Elevate Your Style
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Discover premium fashion and apparel for every occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?featured=true"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-black transition"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/shop?category=mens" className="group relative h-96 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <span className="text-6xl text-gray-400">👔</span>
            </div>
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h3 className="text-2xl font-bold mb-2">Men&apos;s Collection</h3>
              <p className="text-gray-200">Explore now →</p>
            </div>
          </Link>

          <Link href="/shop?category=womens" className="group relative h-96 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <span className="text-6xl text-gray-400">👗</span>
            </div>
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h3 className="text-2xl font-bold mb-2">Women&apos;s Collection</h3>
              <p className="text-gray-200">Explore now →</p>
            </div>
          </Link>

          <Link href="/shop?category=shoes" className="group relative h-96 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <span className="text-6xl text-gray-400">👟</span>
            </div>
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h3 className="text-2xl font-bold mb-2">Shoes</h3>
              <p className="text-gray-200">Explore now →</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/shop?featured=true" className="text-gray-600 hover:text-black">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-black text-white py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-gray-300 mb-8">
            Subscribe to receive updates on new arrivals, special offers, and exclusive deals.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
