# Kangpack — Fullstack E‑Commerce Platform

A production‑oriented, single‑vendor e‑commerce platform. The repository is a monorepo with two applications:

- **`backend/`** — a TypeScript REST API built on Express and MongoDB (Mongoose), with JWT auth, Razorpay payments, AWS S3 uploads, and SMTP email.
- **`frontend/`** — a Next.js 15 (App Router) storefront and admin dashboard built with React 19, Tailwind CSS, and shadcn/ui.

The live product is branded **Kangpack — "Your Smart Workstation"** and is deployed at `kangpack.in` (API at `api.kangpack.in`).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Data Models](#data-models)
- [Authentication & Authorization](#authentication--authorization)
- [Payments, Uploads & Email](#payments-uploads--email)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [License](#license)

---

## Features

- **Storefront** — home page, product catalog with search and filtering, product detail pages, categories, cart, and a multi‑step checkout wizard.
- **Guest & authenticated flows** — guest carts and guest checkout via a generated session id, alongside registered‑user accounts.
- **User accounts** — registration, login, email verification, password reset, profile, saved addresses, order history, and wishlist.
- **Admin dashboard** — full CRUD for products, categories, inventory, orders, customers, coupons, reviews, payments, CMS pages, and store settings.
- **Payments** — Razorpay (INR) and Cash on Delivery (COD), with server‑side signature verification.
- **Media** — product/avatar image uploads to AWS S3 (with a local‑disk fallback served from `/uploads`).
- **Content** — CMS pages, FAQs, testimonials, and newsletter subscriptions.
- **Hardening** — Helmet, CORS allow‑list, rate limiting, request compression, and centralized error handling.

## Tech Stack

### Backend

| Area | Technology |
| --- | --- |
| Language / Runtime | TypeScript 5, Node.js ≥ 18 |
| Framework | Express 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (`jsonwebtoken`) access + refresh, `bcryptjs` hashing |
| Validation | Zod, express‑validator |
| Payments | Razorpay |
| File storage | Multer + AWS SDK v3 (S3), local‑disk fallback |
| Email | Nodemailer (SMTP) |
| Security | Helmet, CORS, express‑rate‑limit, compression, cookie‑parser, morgan |
| Testing | Jest + ts‑jest, mongodb‑memory‑server |
| Process manager | PM2 (`ecosystem.config.js`) |

### Frontend

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, `output: standalone`) |
| UI runtime | React 19, TypeScript 5 |
| Styling | Tailwind CSS 3, shadcn/ui (Radix UI), `next-themes` |
| State | Redux Toolkit (cart/checkout), Zustand (auth/cart), TanStack React Query (server state) |
| Forms | react‑hook‑form + Zod |
| HTTP | Axios (shared instance with token refresh) |
| Icons / UX | lucide‑react, framer‑motion, Swiper, Sonner (toasts), Lottie |
| Payments | Razorpay Checkout (hosted script) |

## Repository Structure

```
kanpack/
├── backend/                 # Express + MongoDB REST API (TypeScript)
│   ├── src/
│   │   ├── server.ts        # Entry point (DB connect + app.listen)
│   │   ├── app.ts           # Express app, middleware, route mounting
│   │   ├── config/          # env (Zod), db, jwt
│   │   ├── common/          # middlewares, services (razorpay, mail, s3), utils
│   │   ├── database/        # Mongoose models + seed scripts
│   │   ├── modules/         # Feature modules (controller/service/routes/validation)
│   │   ├── multer/          # Upload strategies (memory→S3, local disk)
│   │   ├── routes/          # v1 route aggregation
│   │   └── scripts/         # seedProducts, data fixes
│   ├── dist/                # Compiled JS output (tsc)
│   ├── tests/               # Jest setup (in‑memory MongoDB)
│   └── uploads/             # Local upload fallback (served at /uploads)
├── frontend/                # Next.js 15 App Router app
│   └── src/
│       ├── app/             # Routes: (public) storefront + (admin) dashboard
│       ├── components/      # ui/ (shadcn), home/, layout/, common/, profile/
│       ├── features/        # Feature‑sliced api.ts + queries.ts (React Query)
│       ├── hooks/           # Zustand stores + feature hooks
│       ├── lib/             # axios instance, auth, constants, Redux store
│       └── types/           # Shared + Razorpay/Lottie typings
├── ecosystem.config.js      # PM2 config for backend + frontend
├── run.sh / run.ps1         # Unified dev/build/prod launchers (Bash / PowerShell)
├── DEPLOYMENT_AWS.md        # AWS EC2 + Nginx + Certbot deployment guide
└── .github/workflows/       # CI/CD: production-deploy.yml (SSH deploy to EC2)
```

## Prerequisites

- **Node.js 18+** and **npm** (the CI/CD pipeline builds with Node 22).
- **MongoDB** — a connection string (e.g. MongoDB Atlas). In development the backend will fall back to an in‑memory MongoDB if the configured URI is unreachable.
- Optional for full functionality: an **AWS S3** bucket (image uploads), a **Razorpay** account (online payments), and **SMTP** credentials (transactional email).

## Quick Start

Unified launcher scripts are provided at the repo root. They check prerequisites, create env files from examples if missing, install dependencies when needed, and run both apps together.

**macOS / Linux / Git Bash / WSL:**

```bash
./run.sh install     # install dependencies for backend and frontend
./run.sh             # start both apps in development mode (default)
./run.sh build       # build both apps for production
./run.sh prod        # start both in production (PM2 if available, else manual)
./run.sh help        # show all commands
```

**Windows PowerShell:**

```powershell
.\run.ps1 install
.\run.ps1            # development mode
.\run.ps1 build
.\run.ps1 prod
.\run.ps1 help
```

Once running (development):

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8000/api/v1> (health check at `/api/v1/health`)

> **Port note:** The frontend defaults to talking to the backend at `http://localhost:8000/api/v1`, while the backend's default `PORT` is `3000` (which collides with Next.js). For local development, set the backend `PORT=8000` so it matches the frontend's `NEXT_PUBLIC_API_URL`.

## Manual Setup

If you prefer to run each app on its own:

### Backend

```bash
cd backend
cp .env.example .env        # then fill in the required values (see below)
npm install
npm run dev                 # ts-node-dev with hot reload
# or, for production:
npm run build && npm start  # compiles to dist/ and runs node dist/server.js
```

Optionally seed the database:

```bash
npm run seed          # full seed (src/database/seed.ts)
npm run seed:simple   # lightweight seed (simple-seed.js)
```

### Frontend

```bash
cd frontend
cp .env.example .env.local  # then set NEXT_PUBLIC_API_URL etc. (see below)
npm install
npm run dev                 # http://localhost:3000
# or, for production:
npm run build && npm start
```

## Environment Variables

### Backend

Environment variables are validated at startup with Zod (`src/config/env.ts`). In production the app loads `.env.production`; otherwise `.env`. Missing required values cause the process to exit.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | no | `development` | `development` \| `production` \| `test` |
| `PORT` | no | `3000` | HTTP port (use `8000` to match the frontend default) |
| `MONGODB_URI` | **yes** | — | MongoDB connection string |
| `JWT_ACCESS_SECRET` | **yes** | — | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | **yes** | — | Refresh token secret (min 32 chars) |
| `JWT_ACCESS_EXPIRES_IN` | no | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | no | `7d` | Refresh token lifetime |
| `COOKIE_SECRET` | **yes** | — | Cookie signing secret (min 16 chars) |
| `CORS_ORIGIN` | no | `*` | Comma‑separated allow‑list of origins |
| `BCRYPT_SALT_ROUNDS` | no | `12` | Password hashing cost |
| `MAX_FILE_SIZE` | no | `5242880` | Max upload size in bytes (5 MB) |
| `UPLOAD_PATH` | no | `uploads` | Local upload directory |
| `RATE_LIMIT_WINDOW_MS` | no | `900000` | Rate‑limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | no | `100` | Max requests per window |
| `FRONTEND_URL` | no | `https://kangpack.in` | Used in email links |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | no | — | SMTP transport config |
| `SMTP_USER` / `SMTP_PASS` | no | — | SMTP credentials |
| `FROM_NAME` / `FROM_EMAIL` | no | — | Sender identity for emails |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | no | — | AWS credentials for S3 uploads |
| `AWS_REGION` / `S3_BUCKET_NAME` | no | — | S3 bucket configuration |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | no | — | Razorpay API keys (read directly from env) |

### Frontend

All client‑exposed variables must be prefixed with `NEXT_PUBLIC_`.

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public URL of the frontend |
| `NEXT_PUBLIC_APP_ASSETS` | `http://localhost:8000/` | Base URL for served assets |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | — | Razorpay publishable key for Checkout |

## Available Scripts

### Backend (`backend/package.json`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start the API with `ts-node-dev` (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server (`node dist/server.js`) |
| `npm test` | Run the Jest test suite |
| `npm run lint` / `lint:fix` | Lint (and fix) TypeScript sources |
| `npm run seed` / `seed:simple` | Seed the database |

### Frontend (`frontend/package.json`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (`output: standalone`) |
| `npm start` | Serve the production build |
| `npm run lint` | Run `next lint` |
| `npm run type-check` | Type‑check with `tsc --noEmit` |

## API Overview

All endpoints are served under **`/api/v1`** and return a consistent envelope: `{ success, message, data, pagination?, errors? }`. Route groups include:

`auth`, `users`, `products`, `categories`, `settings`, `carts`, `orders`, `coupons`, `reviews`, `payments`, `inventory`, `cms`, `faqs`, `testimonials`, `newsletter`, `contact`, and `dashboard`, plus `GET /health`.

Public reads (products, categories) support pagination and use optional authentication, so both guests and logged‑in users can browse. Order creation and Razorpay verification support guest checkout via a session id, while administrative operations require an `admin`/`staff` role. Additional API references live in the `backend/` directory (`API_ENDPOINTS.md`, `FINAL_API_SUMMARY.md`, and a Postman collection).

## Data Models

The MongoDB schema (Mongoose) covers: **User**, **Product** (with variants, pricing, inventory, SEO, and ratings), **Category** (self‑referencing for nesting), **Cart** (user or guest session, TTL‑expiring), **Order** (guest or customer, Razorpay fields, status tracking), **Payment**, **Coupon**, **Inventory** (stock‑movement ledger), **Review** (moderated), **CmsPage**, **Faq**, **Testimonial**, **Subscriber**, and a **Settings** singleton for store configuration.

## Authentication & Authorization

Authentication is **JWT‑based and stateless**, using separate secrets for short‑lived access tokens and longer‑lived refresh tokens. Refresh tokens are stored per‑user in the database, which enables logout and "logout everywhere" revocation. Passwords are hashed with bcrypt.

Three roles are supported — **`admin`**, **`staff`**, and **`user`** — enforced by middleware (`authenticate`, `optionalAuth`, and role guards such as `requireAdmin` / `requireAdminOrStaff`). On the frontend, tokens are held client‑side and the Axios instance automatically attaches the bearer token and transparently refreshes it on a `401`. Admin routes are gated in the browser by the admin layout (there is no server‑side middleware guard).

## Payments, Uploads & Email

- **Payments** — Razorpay order creation with amounts in paise (INR) and HMAC‑SHA256 signature verification on the server; Cash on Delivery is also supported. The checkout page loads Razorpay's hosted Checkout script and verifies the payment via `POST /orders/:id/verify-razorpay`.
- **Uploads** — Product images and avatars are uploaded via Multer to **AWS S3** (SDK v3), returning public URLs. A local‑disk strategy is available as a fallback and is served statically from `/uploads`.
- **Email** — Transactional emails (verification, password reset, order confirmation, payment received, status updates) are sent via **Nodemailer** over SMTP using branded HTML templates.

## Deployment

The project is designed to run on a single AWS EC2 instance behind Nginx, managed by PM2. `ecosystem.config.js` defines two processes — `kangpack-backend` (`dist/server.js`) and `kangpack-frontend` (Next.js standalone `server.js` on port 3000).

A typical production topology maps `kangpack.in` → frontend (port 3000) and `api.kangpack.in` → backend (port 8000) via an Nginx reverse proxy, with HTTPS provisioned by Certbot. Full step‑by‑step instructions are in **[DEPLOYMENT_AWS.md](./DEPLOYMENT_AWS.md)**.

**Continuous deployment:** `.github/workflows/production-deploy.yml` triggers on pushes to `main`, SSHes into the EC2 host, pulls the latest code, rebuilds both apps, syncs static assets into the Next.js standalone folder, and restarts PM2. Configure the `EC2_HOST`, `EC2_USER`, and `EC2_SSH_KEY` repository secrets to enable it.

## Security Notes

- **Do not commit real secrets.** Configure secrets locally via `.env` / `.env.local` / `.env.production` (all git‑ignored where possible) and provide them out‑of‑band in production. If any live credentials (database URIs, JWT secrets, SMTP passwords, AWS or Razorpay keys) have been committed, rotate them and purge them from history.
- Frontend production builds currently **ignore TypeScript and ESLint errors** (`next.config.ts`); run `npm run type-check` and `npm run lint` in CI to catch regressions before deploy.
- JWT tokens are stored in the browser's `localStorage` (exposed to XSS) and admin routes are protected **client‑side only**. Consider httpOnly cookies and server/edge middleware if a stronger posture is required.

## License

The backend is published under the **MIT** license (see `backend/package.json`). Add a root `LICENSE` file if you intend to license the entire monorepo.
