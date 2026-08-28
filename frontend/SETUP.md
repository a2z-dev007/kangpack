# Setup Guide

Complete setup guide for the Next.js Ecommerce Frontend.

## Quick Start

### 1. Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend documentation)
- Git

### 2. Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Environment Configuration

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/      # Product listing
│   │   │   ├── product/[slug] # Product detail
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout
│   │   │   └── auth/          # Login/Register
│   │   ├── (admin)/           # Admin routes
│   │   │   └── admin/
│   │   │       ├── dashboard/ # Admin dashboard
│   │   │       ├── products/  # Product management
│   │   │       ├── orders/    # Order management
│   │   │       ├── customers/ # Customer management
│   │   │       ├── coupons/   # Coupon management
│   │   │       └── settings/  # Settings
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── providers.tsx      # React Query, Theme providers
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── label.tsx
│   │   └── layout/            # Layout components
│   │       ├── header.tsx
│   │       └── footer.tsx
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   │   └── queries.ts     # Auth React Query hooks
│   │   ├── products/
│   │   │   └── api.ts         # Product API calls
│   │   ├── orders/
│   │   │   └── api.ts         # Order API calls
│   │   ├── users/
│   │   │   └── api.ts         # User API calls
│   │   └── settings/
│   │       └── api.ts         # Settings API calls
│   ├── hooks/                 # Custom hooks
│   │   ├── use-auth.ts        # Auth state (Zustand)
│   │   ├── use-cart.ts        # Cart state (Zustand)
│   │   └── use-settings.ts    # Settings state (Zustand)
│   ├── lib/
│   │   ├── api.ts             # Axios instance
│   │   ├── auth.ts            # Auth utilities
│   │   ├── constants.ts       # App constants
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── middleware.ts          # Route protection
├── public/                    # Static files
│   ├── manifest.json          # PWA manifest
│   └── robots.txt             # SEO robots
├── .env.example               # Environment template
├── .env.local                 # Local environment (create this)
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
├── README.md                  # Main documentation
├── SETUP.md                   # This file
└── DEPLOYMENT.md              # Deployment guide
```

## Configuration

### API Integration

All API calls go through `src/lib/api.ts` which:
- Adds authentication headers
- Handles token refresh
- Manages errors centrally

### Authentication

JWT-based authentication:
- Token stored in localStorage
- Auto-refresh on 401 errors
- Protected routes via middleware

### State Management

**Server State (TanStack Query):**
- Products
- Orders
- User data
- Settings

**Client State (Zustand):**
- Cart (persisted to localStorage)
- Auth state
- Settings cache

### Styling

**Tailwind CSS** with CSS variables for theming:
- Edit `src/app/globals.css` for theme colors
- Uses shadcn/ui component system
- Mobile-first responsive design

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

### Adding New Pages

**Public Page:**
```bash
# Create file: src/app/(public)/new-page/page.tsx
```

**Admin Page:**
```bash
# Create file: src/app/(admin)/admin/new-page/page.tsx
```

### Adding New API Endpoints

1. Add API function in `src/features/[feature]/api.ts`
2. Create React Query hook if needed
3. Use in components

Example:
```typescript
// src/features/products/api.ts
export const productsApi = {
  getNewEndpoint: async () => {
    const { data } = await api.get('/new-endpoint');
    return data;
  },
};
```

### Adding New Components

**UI Component:**
```bash
# Create: src/components/ui/new-component.tsx
```

**Feature Component:**
```bash
# Create: src/components/[feature]/new-component.tsx
```

## Customization

### Branding

The app fetches branding from backend `/settings` endpoint:
- Store name
- Logo
- Colors
- Currency
- Feature toggles

### Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... more colors */
}
```

### Routes

Routes are defined in `src/lib/constants.ts`:

```typescript
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  // ... more routes
};
```

## Testing

### Manual Testing Checklist

**Public Features:**
- [ ] Homepage loads
- [ ] Product listing works
- [ ] Product detail page works
- [ ] Add to cart works
- [ ] Cart page shows items
- [ ] Checkout flow works
- [ ] Login/Register works

**Admin Features:**
- [ ] Admin login works
- [ ] Dashboard shows stats
- [ ] Product management works
- [ ] Order management works
- [ ] Settings can be updated

### API Testing

Test API connection:

```bash
# Check if backend is running
curl http://localhost:5000/api/v1/products
```

## Troubleshooting

### Common Issues

**1. API Connection Failed**

```bash
# Check backend is running
# Verify NEXT_PUBLIC_API_URL in .env.local
# Check CORS settings in backend
```

**2. Build Errors**

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**3. TypeScript Errors**

```bash
# Run type check
npm run type-check
```

**4. Styling Issues**

```bash
# Rebuild Tailwind
npm run dev
```

### Debug Mode

Enable debug logging:

```typescript
// src/lib/api.ts
api.interceptors.request.use((config) => {
  console.log('API Request:', config);
  return config;
});
```

## Best Practices

### Code Organization

- Keep components small and focused
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Server Components when possible

### Performance

- Use Next.js Image component
- Implement lazy loading
- Optimize bundle size
- Use React Query caching

### Security

- Never expose sensitive data
- Validate all user inputs
- Use environment variables
- Implement rate limiting

## Next Steps

1. **Customize Branding:** Update colors, logo, and content
2. **Configure Backend:** Set correct API URL
3. **Test Features:** Go through all user flows
4. **Deploy:** Follow DEPLOYMENT.md guide
5. **Monitor:** Setup analytics and error tracking

## Support

For issues or questions:
1. Check this documentation
2. Review backend API documentation
3. Check error logs
4. Contact development team

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

Happy coding! 🚀
