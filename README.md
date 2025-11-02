# Fashion E-Commerce Platform

A modern, full-stack e-commerce platform for fashion and apparel built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

### Frontend
- **Homepage**: Hero banner, featured categories, bestsellers, newsletter signup
- **Product Listing**: Filter/sort by category, price, with pagination
- **Product Details**: Image gallery, size/color variants, reviews, add to cart
- **Shopping Cart**: Quantity management, price calculations, promo codes
- **Checkout Flow**: Multi-step checkout with Stripe integration
- **User Dashboard**: Order history, profile management
- **Responsive Design**: Mobile-first, optimized for all devices

### Backend
- **Authentication**: NextAuth with credentials provider
- **Product Management**: Full CRUD for products, categories, variants
- **Order Processing**: Server-side validation, inventory tracking
- **Payment Integration**: Stripe with webhook handling
- **Database**: Prisma ORM with SQLite (production ready for PostgreSQL)

### Security
- Password hashing with bcrypt
- JWT-based authentication
- Server-side cart and price validation
- Environment-based configuration
- CSRF protection via NextAuth

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Prisma ORM (SQLite for demo, PostgreSQL recommended for production)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: Database connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `STRIPE_SECRET_KEY`: Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Default Admin Credentials
- Email: admin@fashion.com
- Password: admin123

## Database Schema

- **Users**: Authentication and user profiles
- **Products**: Product catalog with variants
- **Categories**: Product categorization
- **Orders**: Order management and tracking
- **Cart**: Persistent shopping cart
- **Reviews**: Product reviews (with moderation)
- **Discounts**: Promotional codes

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/products` - List products with filters
- `GET /api/products/[slug]` - Get product details
- `POST /api/cart` - Add to cart
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

For production, update:
- `DATABASE_URL` to PostgreSQL connection string
- `NEXTAUTH_URL` to your production domain
- `STRIPE_WEBHOOK_SECRET` from Stripe dashboard

### Environment Variables

Production requires:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Project Structure

```
/app                 # Next.js app router pages
  /api               # API routes
  /auth              # Authentication pages
  /shop              # Product listing
  /products          # Product details
  /cart              # Shopping cart
  /checkout          # Checkout flow
/components          # React components
/lib                 # Utilities and configuration
/prisma              # Database schema and migrations
/types               # TypeScript type definitions
```

## Features Roadmap

- [ ] Admin dashboard for product/order management
- [ ] Advanced search with Algolia
- [ ] Email notifications
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Multi-currency support
- [ ] Inventory alerts
- [ ] Analytics dashboard

## License

MIT
