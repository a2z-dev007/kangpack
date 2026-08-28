# Ecommerce Frontend - Next.js 15

A production-ready, scalable, SEO-first ecommerce frontend built with Next.js 15+ (App Router) designed to be sold to individual businesses as a single-vendor ecommerce solution.

## 🚀 Features

### Core Features
- ✅ Next.js 15+ with App Router
- ✅ React 19 & TypeScript
- ✅ Server Components + Client Components
- ✅ Mobile-first responsive design
- ✅ SEO optimized with Metadata API
- ✅ PWA ready (installable)

### UI/UX
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui components
- ✅ Lucide React icons
- ✅ Framer Motion animations
- ✅ Dark mode support
- ✅ CSS variables for dynamic theming

### State Management
- ✅ TanStack Query for server state
- ✅ Zustand for client state
- ✅ React Hook Form + Zod validation
- ✅ Persistent cart with localStorage

### API Integration
- ✅ Axios with interceptors
- ✅ JWT authentication
- ✅ Auto token refresh
- ✅ Centralized error handling
- ✅ REST API integration

### User Features
- ✅ Product browsing & filtering
- ✅ Product detail pages
- ✅ Shopping cart
- ✅ Checkout flow
- ✅ User authentication
- ✅ Order management
- ✅ Profile management

### Admin Panel
- ✅ Dashboard with stats
- ✅ Product management
- ✅ Order management
- ✅ Customer management
- ✅ Coupon management
- ✅ Settings management
- ✅ Responsive admin layout

## 📦 Tech Stack

- **Framework:** Next.js 15+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **State Management:** TanStack Query, Zustand
- **Forms:** React Hook Form
- **Validation:** Zod
- **HTTP Client:** Axios
- **Theme:** next-themes
- **Notifications:** Sonner

## 🛠️ Installation

1. **Clone the repository**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (home, products, cart)
│   ├── (admin)/           # Admin routes (dashboard, management)
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── providers.tsx      # App providers
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (header, footer)
│   ├── product/           # Product components
│   └── cart/              # Cart components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication
│   ├── products/          # Products
│   ├── orders/            # Orders
│   ├── users/             # Users
│   └── settings/          # Settings
├── lib/
│   ├── api.ts             # Axios instance & interceptors
│   ├── auth.ts            # Auth utilities
│   ├── constants.ts       # App constants
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── public/                # Static assets
```

## 🔌 API Integration

The frontend connects to your backend API via environment variables:

```typescript
// All API calls use the configured base URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### API Endpoints Used

**Public:**
- `GET /products` - List products
- `GET /products/:slug` - Product details
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /orders` - Create order

**Admin:**
- `GET /admin/products` - Manage products
- `GET /admin/orders` - Manage orders
- `GET /admin/users` - Manage customers
- `PUT /admin/settings` - Update settings

## 🎨 Dynamic Branding

The frontend fetches settings from `/settings` API endpoint and dynamically applies:

- Brand colors (CSS variables)
- Logo
- Currency
- Tax rates
- Shipping fees
- Feature toggles
- SEO defaults

## 🔐 Authentication

JWT-based authentication with:
- HttpOnly cookies
- Auto token refresh
- Protected routes via middleware
- Role-based access control

## 📱 PWA Support

The app is PWA-ready with:
- Installable on mobile devices
- Offline fallback pages
- Cached assets
- App-like navigation
- Custom splash screen

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

### Environment Variables for Production

Set these in your hosting platform:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🎯 Key Features for Reselling

### Business Customization
- ✅ No hardcoded business data
- ✅ Dynamic branding via API
- ✅ Configurable via environment variables
- ✅ Multi-currency support ready
- ✅ Customizable theme colors

### Production Ready
- ✅ TypeScript for type safety
- ✅ Error boundaries
- ✅ Loading states
- ✅ Optimistic UI updates
- ✅ SEO optimized
- ✅ Performance optimized

### Developer Friendly
- ✅ Clean code structure
- ✅ Reusable components
- ✅ Type-safe API calls
- ✅ Easy to extend
- ✅ Well documented

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🔧 Customization

### Change Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Add New Pages

Create files in `src/app/(public)/` or `src/app/(admin)/`

### Add New API Endpoints

Add to respective feature API files in `src/features/*/api.ts`

## 📄 License

This is a commercial product designed for resale to individual businesses.

## 🤝 Support

For support, contact your development team or refer to the documentation.

---

Built with ❤️ using Next.js 15, React 19, and TypeScript
