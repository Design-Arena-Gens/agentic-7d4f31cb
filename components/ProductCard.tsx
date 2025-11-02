import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    basePrice: number
    images: { url: string; alt: string | null }[]
    averageRating?: number
    reviewCount?: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg mb-4">
        {product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition">
        {product.name}
      </h3>
      <div className="flex items-center justify-between mt-2">
        <p className="text-lg font-semibold">${product.basePrice.toFixed(2)}</p>
        {product.averageRating && product.reviewCount ? (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span>{product.averageRating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
