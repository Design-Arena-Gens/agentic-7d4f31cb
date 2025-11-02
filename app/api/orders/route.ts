import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { take: 1, orderBy: { order: 'asc' } } },
                },
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { items, shippingAddressId, discountCode } = body

    // Validate items and calculate total
    const variantIds = items.map((item: any) => item.variantId)
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
    })

    let subtotal = 0
    const validatedItems = items.map((item: any) => {
      const variant = variants.find((v) => v.id === item.variantId)
      if (!variant || variant.stock < item.quantity) {
        throw new Error('Product not available')
      }
      subtotal += variant.price * item.quantity
      return {
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.price,
      }
    })

    let discount = 0
    let discountId = null
    if (discountCode) {
      const discountObj = await prisma.discount.findUnique({
        where: { code: discountCode, active: true },
      })

      if (discountObj) {
        const now = new Date()
        const isValid =
          (!discountObj.startDate || discountObj.startDate <= now) &&
          (!discountObj.endDate || discountObj.endDate >= now) &&
          (!discountObj.minAmount || subtotal >= discountObj.minAmount) &&
          (!discountObj.maxUses || discountObj.usedCount < discountObj.maxUses)

        if (isValid) {
          discountId = discountObj.id
          if (discountObj.type === 'PERCENTAGE') {
            discount = (subtotal * discountObj.value) / 100
          } else {
            discount = discountObj.value
          }
        }
      }
    }

    const shipping = subtotal > 100 ? 0 : 10
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax - discount

    // Create order
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        shippingAddressId,
        discountId,
        items: {
          create: validatedItems,
        },
      },
      include: {
        items: true,
      },
    })

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: paymentIntent.id },
    })

    return NextResponse.json({
      order,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
