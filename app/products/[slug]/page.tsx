'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.slug}`)
      const data = await res.json()
      setProduct(data)
      if (data.variants?.length > 0) {
        setSelectedVariant(data.variants[0])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant')
      return
    }

    if (selectedVariant.stock < quantity) {
      toast.error('Not enough stock available')
      return
    }

    addItem({
      variantId: selectedVariant.id,
      quantity,
      productName: product.name,
      variantDetails: `${selectedVariant.size || ''} ${selectedVariant.color || ''}`.trim(),
      price: selectedVariant.price,
      image: product.images[0]?.url || '',
    })

    if (session) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variantId: selectedVariant.id,
            quantity,
          }),
        })
      } catch (error) {
        console.error('Error syncing cart:', error)
      }
    }

    toast.success('Added to cart!')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-6 w-1/4 rounded"></div>
            <div className="bg-gray-200 h-20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage].url}
                alt={product.images[activeImage].alt || product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    activeImage === idx ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          {product.averageRating > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <p className="text-3xl font-bold mb-6">
            ${selectedVariant?.price.toFixed(2) || product.basePrice.toFixed(2)}
          </p>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Options</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`px-4 py-3 border rounded-md text-sm ${
                      selectedVariant?.id === variant.id
                        ? 'border-black bg-black text-white'
                        : variant.stock === 0
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {variant.size && <div>{variant.size}</div>}
                    {variant.color && <div className="text-xs">{variant.color}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(
                    Math.min(selectedVariant?.stock || 99, quantity + 1)
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                +
              </button>
              {selectedVariant && (
                <span className="text-sm text-gray-600">
                  {selectedVariant.stock} in stock
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-4 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button className="px-6 py-4 border border-gray-300 rounded-md hover:bg-gray-50">
              <Heart size={20} />
            </button>
          </div>

          {/* Product Info */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Category</h4>
              <p className="text-gray-700">{product.category?.name}</p>
            </div>
            {product.brand && (
              <div>
                <h4 className="font-semibold mb-2">Brand</h4>
                <p className="text-gray-700">{product.brand}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-2">SKU</h4>
              <p className="text-gray-700">{selectedVariant?.sku}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{review.user.name}</span>
                  <span className="text-gray-600 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.title && (
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                )}
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
