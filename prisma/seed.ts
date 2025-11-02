import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fashion.com' },
    update: {},
    create: {
      email: 'admin@fashion.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create categories
  const mensCategory = await prisma.category.upsert({
    where: { slug: 'mens' },
    update: {},
    create: {
      name: "Men's Collection",
      slug: 'mens',
      description: 'Premium menswear and accessories',
    },
  })

  const womensCategory = await prisma.category.upsert({
    where: { slug: 'womens' },
    update: {},
    create: {
      name: "Women's Collection",
      slug: 'womens',
      description: 'Elegant women\'s fashion',
    },
  })

  const shoesCategory = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Premium footwear for all occasions',
    },
  })

  // Create sample products
  const products = [
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-tshirt',
      description: 'Premium quality cotton t-shirt with a modern fit. Perfect for everyday wear.',
      basePrice: 29.99,
      categoryId: mensCategory.id,
      brand: 'Fashion Brand',
      featured: true,
    },
    {
      name: 'Slim Fit Denim Jeans',
      slug: 'slim-fit-denim-jeans',
      description: 'Classic slim fit denim jeans with stretch comfort. A wardrobe essential.',
      basePrice: 79.99,
      categoryId: mensCategory.id,
      brand: 'Fashion Brand',
      featured: true,
    },
    {
      name: 'Elegant Silk Dress',
      slug: 'elegant-silk-dress',
      description: 'Luxurious silk dress perfect for special occasions. Features elegant draping and timeless design.',
      basePrice: 149.99,
      categoryId: womensCategory.id,
      brand: 'Luxury Fashion',
      featured: true,
    },
    {
      name: 'Premium Leather Sneakers',
      slug: 'premium-leather-sneakers',
      description: 'Handcrafted leather sneakers combining style and comfort. Perfect for casual and smart-casual wear.',
      basePrice: 119.99,
      categoryId: shoesCategory.id,
      brand: 'Fashion Footwear',
      featured: true,
    },
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    })

    // Create variants
    const sizes = productData.categoryId === shoesCategory.id
      ? ['7', '8', '9', '10', '11']
      : ['XS', 'S', 'M', 'L', 'XL']

    const colors = ['Black', 'White', 'Navy']

    for (const size of sizes.slice(1, 4)) {
      for (const color of colors.slice(0, 2)) {
        await prisma.productVariant.upsert({
          where: { sku: `${product.slug}-${size}-${color}`.toUpperCase() },
          update: {},
          create: {
            productId: product.id,
            sku: `${product.slug}-${size}-${color}`.toUpperCase(),
            size,
            color,
            price: productData.basePrice,
            stock: Math.floor(Math.random() * 50) + 10,
          },
        })
      }
    }

    // Create placeholder image
    await prisma.productImage.upsert({
      where: {
        id: `${product.id}-1`
      },
      update: {},
      create: {
        id: `${product.id}-1`,
        productId: product.id,
        url: `https://placehold.co/800x800/f0f0f0/333333?text=${encodeURIComponent(product.name)}`,
        alt: product.name,
        order: 0,
      },
    })
  }

  // Create sample discount
  await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off your first order',
      type: 'PERCENTAGE',
      value: 10,
      minAmount: 50,
      maxUses: 100,
      active: true,
    },
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
