# Kangpack — Phasewise Implementation & Go-Live Roadmap

> **Target Site:** `kangpack.in` | **API Base:** `api.kangpack.in`  
> **Purpose:** Sequential implementation guide prioritizing critical go-live blockers first to launch the website to real customers, followed by post-launch enhancements.  
> **Status:** Active Execution Plan | **Version:** 1.0.0

---

## Executive Overview & Phasing Strategy

```mermaid
flowchart LR
    subgraph Phase 1: Go-Live Critical (Now)
        P1A["Guest Auto-Account & Password Email"]
        P1B["Carrier Tracking & Status Pipeline"]
        P1C["Razorpay Security & Webhooks"]
        P1D["Coupon Engine Integration"]
        P1E["Critical Fixes (Links, Secrets, Mail)"]
    end

    subgraph Phase 2: Post-Launch (Week 1-2)
        P2A["Catalog Search, Filters & Pagination"]
        P2B["Real Customer Reviews on Product Page"]
        P2C["SEO OpenGraph & Dynamic Sitemap"]
        P2D["Live Gateway Refunds"]
        P2E["PDF Tax Invoices"]
    end

    subgraph Phase 3: Scaling & Automation (Future)
        P3A["Abandoned Cart & Stock TTL Release"]
        P3B["Pincode Serviceability Checker"]
        P3C["Google OAuth Social Login"]
        P3D["WhatsApp / SMS Notifications"]
    end

    Phase 1 -->|PUBLIC LAUNCH GATE| Phase 2
    Phase 2 --> Phase 3

    style Phase 1 fill:#d4edda,stroke:#28a745,stroke-width:2px
    style Phase 2 fill:#fff3cd,stroke:#ffbb00,stroke-width:2px
    style Phase 3 fill:#e2e3e5,stroke:#6c757d,stroke-width:2px
```

---

## Phase 1: Go-Live Critical (Blockers & Must-Haves)

> [!IMPORTANT]
> **Phase 1 Goal:** Complete all essential, security, and transaction-critical features required to take real customer orders safely and fulfill them without operational failure.

### Milestone 1.1: Automatic Guest Account Creation & Strong Password Dispatch

* **Problem:** Guest checkout leaves orders unlinked, and unauthenticated order tracking leaks customer private data. Customers need secure access to their booked products and tracking milestones.
* **Requirements:**
  1. If a guest places an order without manually setting a password:
     - Generate a cryptographically strong, random 14-character password (letters, digits, symbols).
     - Register a new `User` account, hash password with bcrypt.
     - Link the newly placed `Order` to `newUser._id`.
     - Dispatch `Your Kangpack Account Details` email with the temporary password and verification link.
  2. If the guest email already exists in DB:
     - Link order to existing `user._id` without duplicate account error.
  3. Require login to view order and tracking details in `/profile/orders`.
  4. Checkout Step 4 confirmation notice: *"Your account has been created! Temporary login credentials sent to [email]. Log in to track order."*

#### Target Files & Implementation Tasks:
- **Backend:**
  - `backend/src/common/utils/password.utils.ts` $\rightarrow$ Add `PasswordUtils.generateStrongPassword(length: number = 14)`.
  - `backend/src/modules/orders/orders.service.ts` $\rightarrow$ In `createOrder`, automatically generate password and call `MailService.sendAccountCreatedEmail` when `!userId`.
- **Frontend:**
  - `frontend/src/app/(public)/checkout/page.tsx` $\rightarrow$ Update Step 4 confirmation screen with account notice and primary CTA `"Log In to Track Order"` linking to `/auth/login?redirect=/profile/orders`.

---

### Milestone 1.2: Order Status, Carrier Tracking, User Dashboard & Customer Self-Service

* **Problem:** 
  1. The backend ignores `carrier` input and drops courier partner names like "BlueDart" or "Delhivery".
  2. Customers have no link to the courier's tracking portal.
  3. Customers cannot cancel an order before dispatch.
  4. The User Dashboard (`/profile/dashboard`) contains a **critical placeholder bug**: "Recent Orders" unconditionally displays a static empty-state box even when the user has orders. It also lacks an active in-transit shipment card and email verification warnings.
* **Requirements:**
  1. Add `carrier?: string` to `Order.ts` schema and update `orders.controller.ts` & `orders.service.ts`.
  2. Add clickable **"Track on Courier Site"** URL generator for Indian logistics partners (BlueDart, Delhivery, DTDC, India Post, Shiprocket).
  3. Add customer **"Cancel Order"** button in `OrderDetailsModal.tsx` for `pending` or `confirmed` orders.
  4. Add "Track Order" link in Header and Footer pointing to `/profile/orders` (or login redirect).
  5. **Fix User Dashboard (`/profile/dashboard`):**
     - Fetch and render actual top 3 orders in the "Recent Orders" card with thumbnails, date, total amount, status pill, and "View Details" trigger.
     - Add **Active Shipment Hero Widget**: If an order is in `shipped` or `confirmed` state, render a progress stepper with carrier name, AWB, and direct tracking button.
     - Add **Email Verification Alert Banner**: If `user.isEmailVerified === false`, show warning banner with "Resend Verification Email" action.
     - Compute and display real `totalSpent` from order history.

#### Target Files & Implementation Tasks:
- **Backend:**
  - `backend/src/database/models/Order.ts` $\rightarrow$ Add `carrier: { type: String, trim: true }` to interface and schema.
  - `backend/src/modules/orders/orders.controller.ts` $\rightarrow$ Accept `{ trackingNumber, carrier, shippingMethod }` in `addTrackingNumber`.
  - `backend/src/modules/orders/orders.service.ts` $\rightarrow$ Save `order.carrier` and `order.trackingNumber`.
- **Frontend:**
  - `frontend/src/features/admin/components/OrderDetailsModal.tsx` $\rightarrow$
    - Add dynamic courier tracking link (`getTrackingUrl`).
    - Add "Cancel Order" action for customers when `!isAdmin && (order.status === 'pending' || order.status === 'confirmed')`.
  - `frontend/src/app/(public)/profile/dashboard/page.tsx` $\rightarrow$
    - Fix Recent Orders placeholder bug; render top 3 orders.
    - Implement Active Shipment Tracker Hero Widget.
    - Add Email Verification Alert Banner.
    - Calculate and render total spend.
  - `frontend/src/components/home/Navbar.tsx` & `Footer.tsx` $\rightarrow$ Add "Track Order" navigation link.

---

### Milestone 1.3: Razorpay Payment Security & Webhook Listener

* **Problem:** 
  1. `razorpay.service.ts` contains a bypass returning `true` on `"signature_ok"` or empty signature.
  2. `checkout/page.tsx` hardcodes test key `rzp_test_SDt3Oq2hqQz8jt`.
  3. Network drop-offs after UPI/Card payment leave orders pending despite money deduction.
* **Requirements:**
  1. In production (`NODE_ENV === 'production'`), strictly require valid HMAC-SHA256 signature and secret key.
  2. Remove hardcoded fallback test keys in client bundle.
  3. Add Razorpay Webhook endpoint `POST /api/v1/payments/webhook` listening to `order.paid` and `payment.captured` with signature verification.

#### Target Files & Implementation Tasks:
- **Backend:**
  - `backend/src/common/services/razorpay.service.ts` $\rightarrow$ Lock bypasses strictly to `env.NODE_ENV === 'development'`.
  - `backend/src/modules/payments/payments.routes.ts` & `payments.controller.ts` $\rightarrow$ Add `/webhook` endpoint with `crypto.createHmac` verification of `x-razorpay-signature`.
- **Frontend:**
  - `frontend/src/app/(public)/checkout/page.tsx` $\rightarrow$ Remove hardcoded test key fallback and fallback `signature_ok`.

---

### Milestone 1.4: Coupon Engine Integration (Storefront & Order Calculation)

* **Problem:** `orders.service.ts` line 200 hardcodes `const discountAmount = 0; // TODO: Apply coupon`. Checkout page has no coupon code input.
* **Requirements:**
  1. Add Coupon code input, apply button, and discount display in `checkout/page.tsx` and `/cart`.
  2. Call `/api/v1/coupons/validate` on client to preview discount.
  3. Pass `couponCode` in `/api/v1/orders` request body.
  4. Validate coupon on server, compute dynamic discount amount, deduct from total, and increment `usageCount`.

#### Target Files & Implementation Tasks:
- **Backend:**
  - `backend/src/modules/orders/orders.service.ts` $\rightarrow$ Replace `const discountAmount = 0` with coupon validation and discount calculation.
- **Frontend:**
  - `frontend/src/app/(public)/checkout/page.tsx` $\rightarrow$ Add coupon input UI, apply/remove mutation, and order summary discount row.

---

### Milestone 1.5: Critical Storefront Fixes & Sanitization

* **Requirements:**
  1. **Fix Broken Footer Links:** Update `/privacy` to `/privacy-policy`, `/shipping` to `/shipping-policy`, remove dead `/blog` link in `frontend/src/components/home/Footer.tsx`.
  2. **Wire Newsletter:** Connect footer subscription form to `POST /api/v1/newsletter`.
  3. **Purge Hardcoded Secrets:** Remove default password string (`K@ngPack#2025!`) from `backend/src/common/services/mail.service.ts`.
  4. **Dynamic Tax in Email:** Replace hardcoded `"Tax (10%)"` in order email with dynamic `settings.tax.rate`.

---

## Phase 2: Post-Launch Enhancements (Week 1–2 After Go-Live)

> [!NOTE]
> **Phase 2 Goal:** Elevate storefront merchandising, search discovery, customer reviews, SEO rankings, and invoicing compliance once live traffic begins.

### Milestone 2.1: Product Catalog Search, Filtering & Pagination
- **Features:**
  - Keyword search with auto-suggest debounce on `/products`.
  - Category filter dropdown / pills (reading `?category=slug`).
  - Price range slider / min-max inputs.
  - Sorting: Price Low-to-High, High-to-Low, Newest, Bestseller.
  - Clean pagination or "Load More" controls (replacing hardcoded limit 12).
- **Target Files:**
  - `frontend/src/app/(public)/products/page.tsx`
  - `frontend/src/features/products/api.ts`

### Milestone 2.2: Real Customer Reviews on Product Detail Page
- **Features:**
  - Replace static `4.9/5 (120 Reviews)` text on `/product/[slug]` with dynamic reviews from `Review` model.
  - Customer review submission modal: 1-5 Star rating, title, review text, verified purchaser tag.
  - Reviews moderation queue in `/admin/reviews`.
- **Target Files:**
  - `frontend/src/app/(public)/product/[slug]/page.tsx`
  - `frontend/src/features/reviews/` (new frontend feature slice)

### Milestone 2.3: SEO Dynamic Metadata, OpenGraph & XML Sitemap
- **Features:**
  - Add Next.js `generateMetadata` on `/product/[slug]` to generate dynamic OpenGraph & Twitter preview cards (`og:image`, `og:title`, `og:price`).
  - Dynamic `app/sitemap.ts` querying all product slugs from API.
  - Clean `public/robots.txt` disallowing `/admin/`, `/profile/`, `/api/`.
  - Schema.org JSON-LD `Product` structured data for Google Rich Snippets.
- **Target Files:**
  - `frontend/src/app/(public)/product/[slug]/page.tsx` (or server wrapper)
  - `frontend/src/app/sitemap.ts`
  - `frontend/public/robots.txt`

### Milestone 2.4: Payment Gateway Live Refunds
- **Features:**
  - Wire `processRefund` in `backend/src/modules/payments/payments.service.ts` to execute `razorpay.payments.refund(payment.paymentIntentId, { amount })`.
  - Handle partial vs. full refund settlements and gateway response logging.

### Milestone 2.5: Downloadable GST Tax Invoices (PDF)
- **Features:**
  - Generate GST Tax Invoices (PDF) with seller GSTIN, HSN code, tax breakdown (CGST, SGST, IGST), and invoice numbering.
  - Provide "Download Invoice" button in customer `/profile/orders` and admin drawer.
- **Target Files:**
  - `backend/src/modules/orders/orders.controller.ts` (`GET /orders/:id/invoice`)
  - Integration with `pdfkit` or lightweight HTML-to-PDF template.

---

## Phase 3: Scaling, Automation & Marketing (Future Roadmap)

> [!TIP]
> **Phase 3 Goal:** Operational automation, high-volume order processing, retention marketing, and omnichannel communication.

| Feature | Description | Business Value |
| :--- | :--- | :--- |
| **Abandoned Cart & Stock TTL Release Worker** | Auto-cancel pending Razorpay checkouts after 30 minutes to release reserved inventory; send automated abandoned cart email reminder. | Prevents inventory leakage; recovers 10-15% of dropped checkouts. |
| **Pincode Serviceability & Delivery Time** | Customer enters pincode on product page to check if serviceable and get estimated delivery date (e.g., "Delivery by Friday"). | Boosts purchase confidence and reduces checkout abandonment. |
| **Google OAuth Social Login** | One-tap login via Google Identity Services (`@react-oauth/google`). | Frictionless authentication for mobile visitors. |
| **WhatsApp / SMS Order Notifications** | Automated WhatsApp messages on Order Confirmed, Dispatched with tracking link, and Out for Delivery via Gupshup/MSG91. | 95%+ open rate in India compared to email. |
| **Product Variants Picker** | Dynamic size/color switcher on `/product/[slug]` with variant-specific image galleries and independent stock counts. | Required for multi-SKU inventory expansion. |

---

## Phase 1 Implementation Checklist & Status Tracker

Mark items as completed as development proceeds:

- [ ] **1.1 Guest Auto-Account & Strong Password Email**
  - [ ] Add `PasswordUtils.generateStrongPassword()` in `backend/src/common/utils/password.utils.ts`
  - [ ] Auto-provision user account & send password email in `orders.service.ts`
  - [ ] Update Step 4 confirmation UX in `checkout/page.tsx`
- [ ] **1.2 Carrier Tracking, User Dashboard & Customer Self-Service**
  - [ ] Add `carrier` field to `Order.ts` schema and update `orders.controller.ts`
  - [ ] Add dynamic courier tracking link in `OrderDetailsModal.tsx`
  - [ ] Add "Cancel Order" button for pending/confirmed orders in `OrderDetailsModal.tsx`
  - [ ] Fix Recent Orders placeholder bug in `frontend/src/app/(public)/profile/dashboard/page.tsx`
  - [ ] Implement Active Shipment Tracker Hero Widget on `/profile/dashboard`
  - [ ] Add Email Verification Alert Banner with resend action on `/profile/dashboard`
  - [ ] Compute real `totalSpent` from order history on `/profile/dashboard`
  - [ ] Add "Track Order" link in Navbar & Footer
- [ ] **1.3 Payment Security & Razorpay Webhook**
  - [ ] Lock signature bypass in `razorpay.service.ts` strictly to development
  - [ ] Remove hardcoded test keys from `checkout/page.tsx`
  - [ ] Implement Razorpay Webhook endpoint `POST /payments/webhook`
- [ ] **1.4 Coupon Engine Integration**
  - [ ] Add coupon input & apply button in `checkout/page.tsx`
  - [ ] Implement dynamic discount calculation in `orders.service.ts`
- [ ] **1.5 Storefront & Security Fixes**
  - [ ] Fix broken footer links in `Footer.tsx`
  - [ ] Wire newsletter form to `POST /api/v1/newsletter`
  - [ ] Purge hardcoded SMTP password from `mail.service.ts`
  - [ ] Dynamic tax calculation in order confirmation emails

---

## Launch Sign-Off Gate

All Phase 1 tasks must be completed and verified against **[`docs/FINAL_PRE_LAUNCH_TESTING_CHECKLIST.md`](./FINAL_PRE_LAUNCH_TESTING_CHECKLIST.md)** prior to opening `kangpack.in` to public traffic.
