# Quick Start Guide

Get your ecommerce frontend up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:5000`
- npm or yarn package manager

## Installation Steps

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- And more...

### 3. Setup Environment

```bash
cp .env.example .env.local
```

The `.env.local` file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open in Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

## 🎉 You're Done!

The frontend is now running and connected to your backend API.

## What's Next?

### Test the Application

**Public Pages:**
- Homepage: `http://localhost:3000`
- Products: `http://localhost:3000/products`
- Login: `http://localhost:3000/auth/login`
- Register: `http://localhost:3000/auth/register`

**Admin Panel:**
- Dashboard: `http://localhost:3000/admin/dashboard`
- Products: `http://localhost:3000/admin/products`
- Orders: `http://localhost:3000/admin/orders`

### Default Test Accounts

Use these credentials from your backend:

**Admin Account:**
```
Email: admin@example.com
Password: admin123
```

**User Account:**
```
Email: user@example.com
Password: user123
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run linter
npm run type-check       # Check TypeScript types
```

## Project Structure Overview

```
frontend/
├── src/
│   ├── app/              # Pages & routes
│   │   ├── (public)/    # Public pages
│   │   └── (admin)/     # Admin pages
│   ├── components/       # Reusable components
│   ├── features/         # Feature modules
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── public/               # Static files
└── [config files]        # Configuration
```

## Key Features

✅ **User Features:**
- Browse products
- Add to cart
- Checkout
- Order tracking
- Profile management

✅ **Admin Features:**
- Dashboard with stats
- Product management
- Order management
- Customer management
- Settings

✅ **Technical:**
- Server & Client Components
- API integration
- State management
- Form validation
- SEO optimized

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### API Connection Failed

1. Verify backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is enabled in backend

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Need Help?

- 📖 Read [README.md](./README.md) for full documentation
- 🛠️ Check [SETUP.md](./SETUP.md) for detailed setup
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
- ✨ View [FEATURES.md](./FEATURES.md) for feature list

## Production Deployment

When ready to deploy:

1. Build the application:
```bash
npm run build
```

2. Test production build locally:
```bash
npm start
```

3. Deploy to your platform:
   - Vercel (recommended)
   - Docker
   - Traditional VPS
   - AWS/GCP/Azure

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Customization

### Change Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Change this */
}
```

### Update Store Name

The store name is fetched from backend `/settings` API.
Update it in the admin panel at `/admin/settings`.

### Add New Pages

Create files in:
- `src/app/(public)/` for public pages
- `src/app/(admin)/admin/` for admin pages

## Support

For issues or questions:
1. Check documentation files
2. Review error logs in terminal
3. Check browser console
4. Contact development team

---

Happy coding! 🚀
