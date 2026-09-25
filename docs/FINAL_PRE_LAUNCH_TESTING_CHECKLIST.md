# Kangpack — Final Pre-Launch Testing & Production Verification Checklist

> **Target Site:** `kangpack.in` | **API Base:** `api.kangpack.in` | **Version:** 1.0.0  
> **Audience:** QA Team, Engineering Leads, Product Managers, and Store Administrators  
> **Status:** Pre-Go-Live Mandatory Verification  
> **Execution Date:** _____________________ | **Verified By:** _____________________

---

## Table of Contents

1. [Executive Summary & Launch Readiness Gate](#1-executive-summary--launch-readiness-gate)
2. [Critical Pre-Flight Configuration & Secrets Audit](#2-critical-pre-flight-configuration--secrets-audit)
3. [Test Scenario 1: Authentication & Customer Identity](#test-scenario-1-authentication--customer-identity)
4. [Test Scenario 2: Product Catalog, Search & Merchandising](#test-scenario-2-product-catalog-search--merchandising)
5. [Test Scenario 3: Shopping Cart & Guest-to-User State Persistence](#test-scenario-3-shopping-cart--guest-to-user-state-persistence)
6. [Test Scenario 4: Checkout Wizard & Address Processing](#test-scenario-4-checkout-wizard--address-processing)
7. [Test Scenario 5: Payment Gateway, Signature Verification & COD](#test-scenario-5-payment-gateway-signature-verification--cod)
8. [Test Scenario 6: Order Lifecycle, Tracking & Inventory Consistency](#test-scenario-6-order-lifecycle-tracking--inventory-consistency)
9. [Test Scenario 7: Customer Profile & Wishlist Management](#test-scenario-7-customer-profile--wishlist-management)
10. [Test Scenario 8: Admin Dashboard Operations & Business Controls](#test-scenario-8-admin-dashboard-operations--business-controls)
11. [Test Scenario 9: Email Notification Delivery & Template Rendering](#test-scenario-9-email-notification-delivery--template-rendering)
12. [Test Scenario 10: Legal Pages, Invoicing & Regional Compliance (GST)](#test-scenario-10-legal-pages-invoicing--regional-compliance-gst)
13. [Test Scenario 11: Security Hardening & Penetration Sanity](#test-scenario-11-security-hardening--penetration-sanity)
14. [Test Scenario 12: SEO, Social Graph & Web Performance](#test-scenario-12-seo-social-graph--web-performance)
15. [Test Scenario 13: Responsive UX, Mobile Viewports & Cross-Browser](#test-scenario-13-responsive-ux-mobile-viewports--cross-browser)
16. [Go-Live Execution Protocol & Day-1 Monitoring](#16-go-live-execution-protocol--day-1-monitoring)

---

## 1. Executive Summary & Launch Readiness Gate

Before opening the site to real customers, every feature in this checklist must be tested and marked as **PASS**. Any failure in **P0 (Blocker)** categories halts deployment immediately.

### Priority Definitions
- **P0 (Blocker):** Broken payments, security bypasses, order data corruption, checkout halts, unverified emails failing, inventory desynchronization.
- **P1 (High):** Broken filters, missing legal links, UI layout breaks on mobile, email formatting issues, coupon calculation errors.
- **P2 (Medium):** Minor styling discrepancies, missing rich snippets, missing analytics events.

---

## 2. Critical Pre-Flight Configuration & Secrets Audit

Ensure the production environment contains zero debug fallbacks or mock bypasses:

- [ ] **Razorpay Production Keys:** Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env` are live credentials (`rzp_live_...`), NOT test keys (`rzp_test_...`).
- [ ] **Frontend Environment:** Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `frontend/.env.production` matches the live key ID.
- [ ] **Mock Payment Signature Disablement:** Ensure backend `RazorpayService.verifySignature` rejects `signature_ok` and does not accept empty signatures in production.
- [ ] **Removal of Hardcoded Passwords:** Verify that no hardcoded fallback passwords (e.g. `K@ngPack#2025!`) remain in `mail.service.ts` or any source file.
- [ ] **Cookie Secret & JWT Secrets:** Ensure `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `COOKIE_SECRET` are high-entropy, 64-character random strings generated specifically for production.
- [ ] **Storage Bucket:** Verify Cloudflare R2 / AWS S3 bucket has public read permissions configured correctly for product media and avatars.

---

## 3. Test Scenario 1: Authentication & Customer Identity

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | User Registration | 1. Navigate to `/auth/register`<br>2. Submit valid First Name, Last Name, Email, Password. | User registered; redirected with access token; verification email received in inbox. | `[ ] PASS / [ ] FAIL` |
| **AUTH-02** | Duplicate Email Prevention | 1. Register with an email already present in DB. | Clear validation error: "User already exists"; status `409 Conflict`. | `[ ] PASS / [ ] FAIL` |
| **AUTH-03** | Email Verification Flow | 1. Click verification link inside email.<br>2. Land on `/auth/verify-email?token=...`. | Email status updated to `isEmailVerified: true`; success screen displayed; login allowed. | `[ ] PASS / [ ] FAIL` |
| **AUTH-04** | Standard User Login | 1. Navigate to `/auth/login`<br>2. Submit valid credentials. | Successful login; JWT saved in localStorage/cookies; Navbar reflects authenticated user state. | `[ ] PASS / [ ] FAIL` |
| **AUTH-05** | Invalid Password / Email | 1. Attempt login with wrong password. | Error toast "Invalid email or password"; no token issued. | `[ ] PASS / [ ] FAIL` |
| **AUTH-06** | Forgot Password Request | 1. Navigate to `/auth/forgot-password`<br>2. Enter registered email. | Success toast displayed; branded password reset email arrives with 60-minute expiring token. | `[ ] PASS / [ ] FAIL` |
| **AUTH-07** | Reset Password Completion | 1. Click reset link from email.<br>2. Enter new password & confirm.<br>3. Submit. | Password changed in DB (hashed with bcrypt); old sessions invalidated; login works with new password. | `[ ] PASS / [ ] FAIL` |
| **AUTH-08** | Token Refresh Automation | 1. Wait until access token expires (15m) or simulate 401.<br>2. Perform authenticated request. | Axios interceptor transparently issues `/auth/refresh-token`, updates token, and retries request seamlessly. | `[ ] PASS / [ ] FAIL` |
| **AUTH-09** | Logout Execution | 1. Click user menu -> Logout.<br>2. Confirm modal prompt. | Tokens purged from client; refresh token invalidated on backend; user redirected to home page. | `[ ] PASS / [ ] FAIL` |

---

## 4. Test Scenario 2: Product Catalog, Search & Merchandising

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CAT-01** | Catalog Page Display | 1. Navigate to `/products`. | All active products displayed with image, title, price, badges (Low Stock/Featured). | `[ ] PASS / [ ] FAIL` |
| **CAT-02** | Category Filtering | 1. Select a category (e.g. Workstations).<br>2. Filter applied. | Only products belonging to that category are shown in catalog; URL updates with category slug. | `[ ] PASS / [ ] FAIL` |
| **CAT-03** | Product Detail View | 1. Click any product card -> `/product/[slug]`. | Slug resolves correctly; hero banner, high-res gallery, pricing, specs, and trust cards render. | `[ ] PASS / [ ] FAIL` |
| **CAT-04** | Image Gallery Interaction | 1. Click gallery thumbnails or left/right navigation arrows. | Main image transitions smoothly with fade/slide animation; responsive on mobile touch. | `[ ] PASS / [ ] FAIL` |
| **CAT-05** | Quantity Stepper Boundary | 1. Set quantity to 1 -> click minus.<br>2. Set quantity to available stock limit -> click plus. | Minus disabled at 1; plus disabled at max available stock; user alerted to maximum available limit. | `[ ] PASS / [ ] FAIL` |
| **CAT-06** | Out of Stock State | 1. View product with `stock: 0`. | "Add to Cart" button displays "Unavailable" and is disabled; low stock warning shown if stock < 5. | `[ ] PASS / [ ] FAIL` |
| **CAT-07** | Non-existent Product (404) | 1. Visit `/product/random-invalid-slug`. | Branded 404 state rendered with "The masterpiece you're looking for has moved" and CTA to store. | `[ ] PASS / [ ] FAIL` |

---

## 5. Test Scenario 3: Shopping Cart & Guest-to-User State Persistence

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CART-01** | Guest Add-to-Cart | 1. As unauthenticated visitor, add product to cart. | Floating Cart Drawer slides in; cart count increases in Navbar; session ID cookie preserved. | `[ ] PASS / [ ] FAIL` |
| **CART-02** | Cart Quantity Adjustment | 1. Open Cart Drawer or `/cart`.<br>2. Increase & decrease quantity. | Backend API updates quantity; subtotal and total update instantly; stock constraints respected. | `[ ] PASS / [ ] FAIL` |
| **CART-03** | Item Removal | 1. Click trash/remove icon on an item. | Item removed from cart; subtotal recalculates; empty cart state displays if last item removed. | `[ ] PASS / [ ] FAIL` |
| **CART-04** | Cart Persistence on Refresh | 1. Refresh browser window with items in cart. | Cart items and quantities remain intact across page reloads. | `[ ] PASS / [ ] FAIL` |
| **CART-05** | Cart Merging upon Login | 1. Add item A as guest.<br>2. Log in with account having item B. | Guest cart merges with user cart; both items present in unified cart; duplicate items sum quantities. | `[ ] PASS / [ ] FAIL` |
| **CART-06** | Free Shipping Calculation | 1. Add items below free shipping threshold.<br>2. Add items above threshold. | Shipping fee applied when below threshold; shipping becomes ₹0 (Free) when threshold is met. | `[ ] PASS / [ ] FAIL` |

---

## 6. Test Scenario 4: Checkout Wizard & Address Processing

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CHK-01** | Empty Cart Checkout Guard | 1. Visit `/checkout` with 0 items in cart. | Immediate redirection to `/` or `/products`; user prevented from accessing checkout. | `[ ] PASS / [ ] FAIL` |
| **CHK-02** | Step 1 Form Validation | 1. Leave mandatory fields (First name, phone, address, pincode) blank.<br>2. Click Continue. | Form blocked with specific toast errors for each missing field. | `[ ] PASS / [ ] FAIL` |
| **CHK-03** | Saved Address Auto-fill | 1. Log in with an account having saved addresses.<br>2. Enter `/checkout`. | Shipping fields automatically pre-filled with customer's default address. | `[ ] PASS / [ ] FAIL` |
| **CHK-04** | Manual Guest Account Creation | 1. As guest, check "Create an account for faster checkout".<br>2. Enter custom password.<br>3. Complete order. | User account created with chosen password; order linked to user; welcome & verification email sent. | `[ ] PASS / [ ] FAIL` |
| **CHK-05** | Dynamic Tax & Shipping Totals | 1. Review order summary in Step 2 & 3. | Subtotal, Tax (based on configured store tax rate), and Shipping match backend calculation exactly. | `[ ] PASS / [ ] FAIL` |
| **CHK-06** | Default Guest Checkout: Strong Password Generation & Email Dispatch | 1. Place order as guest WITHOUT entering a password or checking create account.<br>2. Submit order. | Backend generates 12+ char strong random password, registers user account, links order, and sends `Your Kangpack Account Details` email containing temporary password. | `[ ] PASS / [ ] FAIL` |
| **CHK-07** | Existing Account Guest Checkout Linking | 1. Place order as guest using an email that already has an account.<br>2. Submit order. | Order attaches to existing user record (`order.customer = existingUser._id`); no duplicate account error; user prompted to log in with existing password. | `[ ] PASS / [ ] FAIL` |

---

## 7. Test Scenario 5: Payment Gateway, Signature Verification & COD

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **PAY-01** | Cash on Delivery (COD) Flow | 1. Select COD in Step 3.<br>2. Click "Place Order". | Order status set to `confirmed`; paymentStatus `pending`; cart cleared; order confirmation page shown. | `[ ] PASS / [ ] FAIL` |
| **PAY-02** | COD Disabled by Admin | 1. Disable COD in Admin Settings.<br>2. Refresh checkout page. | COD option hidden or disabled with clear message; only online payment selectable. | `[ ] PASS / [ ] FAIL` |
| **PAY-03** | Razorpay Modal Launch | 1. Select Razorpay in Step 3.<br>2. Click "Proceed to Pay". | Backend creates Razorpay order; Razorpay SDK popup opens with correct amount in INR. | `[ ] PASS / [ ] FAIL` |
| **PAY-04** | Razorpay Successful Payment | 1. Complete payment via test/live card or UPI.<br>2. Payment gateway returns success. | Signature verified via HMAC-SHA256; order status set to `confirmed`; paymentStatus `completed`; cart cleared. | `[ ] PASS / [ ] FAIL` |
| **PAY-05** | Razorpay Payment Dismissal / Cancel | 1. Open Razorpay modal -> click Close (X). | Modal closes; user remains on checkout step 3; cart items preserved; no phantom order confirmed. | `[ ] PASS / [ ] FAIL` |
| **PAY-06** | Signature Spoofing Protection | 1. Attempt manual POST to `/orders/:id/verify-razorpay` with forged/empty signature. | Backend rejects request with `400 Invalid payment signature`; order NOT marked as paid. | `[ ] PASS / [ ] FAIL` |

---

## 8. Test Scenario 6: Order Lifecycle, Tracking & Inventory Consistency

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ORD-01** | Inventory Decrement on Order | 1. Note stock of product (e.g. 10).<br>2. Order 2 units. | Stock immediately updates to 8 in database and product page. | `[ ] PASS / [ ] FAIL` |
| **ORD-02** | Inventory Restoration on Cancellation | 1. Cancel order from admin dashboard. | Order status `cancelled`; product stock restored by +2 (back to 10); salesCount decremented. | `[ ] PASS / [ ] FAIL` |
| **ORD-03** | Order Status Progression | 1. Transition order: Pending -> Confirmed -> Processing -> Shipped -> Delivered. | Timestamps recorded (`shippedAt`, `deliveredAt`); customer receives notification email on milestone changes. | `[ ] PASS / [ ] FAIL` |
| **ORD-04** | Tracking Number & Carrier Sync | 1. Admin adds tracking number (e.g. `BLUEDART12345`) and carrier (`BlueDart`). | Order tracking info and carrier saved in DB; status moves to `shipped`; tracking visible to customer. | `[ ] PASS / [ ] FAIL` |
| **ORD-05** | Customer Order History | 1. Navigate to `/profile/orders`. | Customer sees full list of past orders with dates, item counts, total amounts, and status badges. | `[ ] PASS / [ ] FAIL` |
| **ORD-06** | Customer Order Details Drawer | 1. Click "View Details" on an order in `/profile/orders`. | Drawer opens showing items, prices, shipping address, carrier info, and tracking timeline. | `[ ] PASS / [ ] FAIL` |
| **ORD-07** | Mandatory Authentication for Order Details | 1. As unauthenticated user, attempt navigating to order details or profile. | Access blocked; user redirected to `/auth/login` with notice that login is required. | `[ ] PASS / [ ] FAIL` |
| **ORD-08** | Login with Auto-Generated Password | 1. Copy strong password received in email.<br>2. Log in at `/auth/login`. | Login succeeds; user redirected to `/profile/orders`; newly placed order is present in account. | `[ ] PASS / [ ] FAIL` |
| **ORD-09** | Courier Direct Portal Redirection | 1. In order drawer, locate carrier info (e.g. `BlueDart`) and AWB.<br>2. Click "Track on Courier Site". | Opens official courier tracking portal (BlueDart, Delhivery, DTDC, India Post) with AWB pre-filled. | `[ ] PASS / [ ] FAIL` |
| **ORD-10** | Customer Self-Service Cancellation | 1. Open order drawer for order in `pending` or `confirmed` status.<br>2. Click "Cancel Order". | Order status moves to `cancelled`; product stock restored; cancellation email sent. | `[ ] PASS / [ ] FAIL` |
| **ORD-11** | Post-Booking Direct Login / Track Link | 1. Complete order on `/checkout` (Step 4). | Confirmation screen clearly informs buyer of account creation, emailed password, and provides "Log In to Track Order" button. | `[ ] PASS / [ ] FAIL` |

---

## 9. Test Scenario 7: User Dashboard, Customer Profile & Wishlist Management

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **DSH-01** | Dashboard Overview & Metric Cards | 1. Log in and navigate to `/profile/dashboard`. | Metrics display accurate counts for Total Orders, Wishlist items, Saved Addresses, and verified status. | `[ ] PASS / [ ] FAIL` |
| **DSH-02** | Active Shipment Hero Widget | 1. With an order in `shipped` or `confirmed` status, open `/profile/dashboard`. | Hero card displays at top showing progress stepper, carrier name (e.g. `BlueDart`), AWB, and direct courier tracking link. | `[ ] PASS / [ ] FAIL` |
| **DSH-03** | Real Recent Orders Preview | 1. Place 1 or more orders.<br>2. Navigate to `/profile/dashboard`. | Recent Orders card renders actual order items with thumbnails, price, and status (no static empty mockup); clicking "View Details" opens modal. | `[ ] PASS / [ ] FAIL` |
| **DSH-04** | Email Verification Alert Banner | 1. Log in with an unverified account (`isEmailVerified: false`).<br>2. Check `/profile/dashboard`.<br>3. Click "Resend Verification". | Amber warning banner is visible; clicking resend triggers verification email and shows success toast. | `[ ] PASS / [ ] FAIL` |
| **DSH-05** | Total Spent Metric | 1. Review Total Spent stat card on dashboard. | Displays accurate cumulative spend across user's placed orders in ₹. | `[ ] PASS / [ ] FAIL` |
| **DSH-06** | Dashboard Quick Shortcuts | 1. Click "Browse Products", "View Cart", "Edit Profile", "Manage Addresses", "My Wishlist". | All buttons route directly to correct endpoints without broken redirects. | `[ ] PASS / [ ] FAIL` |
| **PRF-01** | Profile Data Update | 1. Navigate to `/profile`.<br>2. Update name & phone.<br>3. Save. | Profile info updated in DB; Navbar reflects updated name. | `[ ] PASS / [ ] FAIL` |
| **PRF-02** | Change Password | 1. In `/profile`, enter current password and new password.<br>2. Submit. | Password updated successfully; old password no longer valid. | `[ ] PASS / [ ] FAIL` |
| **PRF-03** | Address Book CRUD | 1. Navigate to `/profile/addresses`.<br>2. Add new address.<br>3. Edit address.<br>4. Set as default.<br>5. Delete address. | All address mutations succeed with immediate UI update. | `[ ] PASS / [ ] FAIL` |
| **PRF-04** | Wishlist Management | 1. Click heart icon on product card / detail page.<br>2. Open `/profile/wishlist`. | Product added to wishlist; heart icon active; product appears on wishlist page with "Move to Cart" button. | `[ ] PASS / [ ] FAIL` |

---

## 10. Test Scenario 8: Admin Dashboard Operations & Business Controls

| Test ID | Test Case | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ADM-01** | Admin Authentication Guard | 1. Attempt accessing `/admin` as guest or regular user. | Access blocked; redirected to login or unauthorized message shown. | `[ ] PASS / [ ] FAIL` |
| **ADM-02** | Product Management (CRUD) | 1. Create product with multi-image upload.<br>2. Edit price and stock.<br>3. Toggle active/featured. | Media uploaded to R2/S3; product record saved and immediately visible on storefront. | `[ ] PASS / [ ] FAIL` |
| **ADM-03** | Inventory Adjustment & History | 1. Navigate to `/admin/inventory`.<br>2. Perform manual stock adjustment (+/-) with reason note. | Stock updated; adjustment logged with timestamp and admin user identity. | `[ ] PASS / [ ] FAIL` |
| **ADM-04** | Coupon Management | 1. Create percentage coupon (e.g. `SAVE20` - 20% off, min order ₹1,000).<br>2. Set expiry date. | Coupon created, displayed in admin table, ready for validation. | `[ ] PASS / [ ] FAIL` |
| **ADM-05** | Order Filtering & Search | 1. Search by order number, customer name, date range, or payment status. | Orders table filters accurately in real time with pagination intact. | `[ ] PASS / [ ] FAIL` |
| **ADM-06** | Store Settings Modification | 1. Change Tax Rate (e.g. 18%), Shipping Fee (₹100), Free Shipping Threshold (₹2,000).<br>2. Save. | Storefront checkout calculations update immediately to match new configuration. | `[ ] PASS / [ ] FAIL` |
| **ADM-07** | Contact Us Inquiries | 1. Submit contact form from `/contact`.<br>2. Check `/admin/contacts`. | Submission appears in admin table with status `unread`; admin can mark `in-progress` or `resolved`. | `[ ] PASS / [ ] FAIL` |

---

## 11. Test Scenario 9: Email Notification Delivery & Template Rendering

| Test ID | Trigger Event | Recipient | Key Verification Points | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MAIL-01** | User Registration | Customer | Verification link present, branding intact, correct domain. | `[ ] PASS / [ ] FAIL` |
| **MAIL-02** | Password Reset Request | Customer | Reset link expires in 60 min, button styled, security warning included. | `[ ] PASS / [ ] FAIL` |
| **MAIL-03** | Order Confirmed (COD & Online) | Customer | Order number, items table, subtotal, tax, shipping, total, and address match. | `[ ] PASS / [ ] FAIL` |
| **MAIL-04** | Payment Received | Customer | Razorpay payment ID, amount received, payment confirmation note. | `[ ] PASS / [ ] FAIL` |
| **MAIL-05** | Order Shipped | Customer | Tracking number, carrier name, tracking link, estimated delivery. | `[ ] PASS / [ ] FAIL` |
| **MAIL-06** | Order Delivered | Customer | Delivery confirmation timestamp, feedback/support link. | `[ ] PASS / [ ] FAIL` |
| **MAIL-07** | Order Cancelled | Customer | Cancellation confirmation, reason, refund guidance note. | `[ ] PASS / [ ] FAIL` |

---

## 12. Test Scenario 10: Legal Pages, Invoicing & Regional Compliance (GST)

| Test ID | Test Case | Target URL | Expected Content / Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **LEG-01** | Terms & Conditions | `/terms-and-conditions` | Proper business entity name, governing law, dispute resolution, user agreements. | `[ ] PASS / [ ] FAIL` |
| **LEG-02** | Privacy Policy | `/privacy-policy` | Data collection, cookie policy, DPDP Act 2023 / GDPR disclosure, contact email. | `[ ] PASS / [ ] FAIL` |
| **LEG-03** | Refund & Cancellation | `/refund-cancellation` | Cancellation window, return process, refund turnaround times (5-7 business days). | `[ ] PASS / [ ] FAIL` |
| **LEG-04** | Shipping Policy | `/shipping-policy` | Delivery partners, service areas, delivery timelines across India, shipping charges. | `[ ] PASS / [ ] FAIL` |
| **LEG-05** | Warranty Policy | `/warranty-policy` | Coverage terms, claim process, exclusions. | `[ ] PASS / [ ] FAIL` |
| **LEG-06** | Footer Legal Navigation | Storefront Footer | All legal links point to valid 200 OK routes (no 404 dead ends like `/privacy` or `/shipping`). | `[ ] PASS / [ ] FAIL` |

---

## 13. Test Scenario 11: Security Hardening & Penetration Sanity

- [ ] **No Secrets Exposed in Client Bundles:** Search client JS build (`_next/static`) for `RAZORPAY_KEY_SECRET`, `JWT_ACCESS_SECRET`, `SMTP_PASS`, or database credentials.
- [ ] **Admin Route Server Guarding:** Test direct API calls to `/api/v1/orders`, `/api/v1/products` (POST/PUT/DELETE) without admin token. Must return `401 Unauthorized` or `403 Forbidden`.
- [ ] **Horizontal Privilege Escalation Prevention:** Verify User A cannot fetch `/api/v1/orders/:id` belonging to User B.
- [ ] **CORS Domain Whitelisting:** Verify API rejects origins other than `https://kangpack.in` (and localhost in dev).
- [ ] **Rate Limiting Active:** Execute >100 rapid requests to `/api/v1/auth/login`. Verify `429 Too Many Requests` triggers.
- [ ] **Input Sanitization & NoSQL Injection:** Test login and search fields with injection payloads (e.g. `{"$gt": ""}`). Verify Zod validation rejects malformed payloads.

---

## 14. Test Scenario 12: SEO, Social Graph & Web Performance

- [ ] **Canonical URLs & Titles:** Every page has a descriptive `<title>` and `<meta name="description">`.
- [ ] **OpenGraph Social Preview:** Share `/product/[slug]` on WhatsApp/Twitter/LinkedIn debugger: preview card shows correct title, description, and high-resolution product image.
- [ ] **Robots.txt & Sitemap:**
  - `robots.txt` disallows `/admin/`, `/profile/`, `/checkout/`, `/api/`.
  - `sitemap.xml` exists, lists all active products and categories, and uses the real production domain `https://kangpack.in`.
- [ ] **Core Web Vitals:**
  - Largest Contentful Paint (LCP) < 2.5s on 4G mobile emulation.
  - Cumulative Layout Shift (CLS) < 0.1.
  - First Input Delay (FID) / INP < 200ms.
- [ ] **Image Optimization:** All product images served in WebP/AVIF format with explicit dimensions or Next.js `Image` component to eliminate layout shift.

---

## 15. Test Scenario 13: Responsive UX, Mobile Viewports & Cross-Browser

| Device / Viewport | Browser | Test Focus | Status |
| :--- | :--- | :--- | :--- |
| **Mobile (375px - 414px)** | Safari iOS | Mobile menu, sticky Add-to-Cart, Cart Drawer slide, checkout form tapping. | `[ ] PASS / [ ] FAIL` |
| **Mobile (360px - 412px)** | Chrome Android | Razorpay UPI Intent flow, keyboard popups on inputs, font readability. | `[ ] PASS / [ ] FAIL` |
| **Tablet (768px - 1024px)**| Safari iPad / Chrome | Grid layouts (2 vs 3 columns), modal centering, header responsiveness. | `[ ] PASS / [ ] FAIL` |
| **Desktop (1440px - 1920px)**| Chrome, Firefox, Safari | Parallax hero animations, sticky image gallery, wide table controls. | `[ ] PASS / [ ] FAIL` |

---

## 16. Go-Live Execution Protocol & Day-1 Monitoring

### Phase 1: Pre-Deployment Final Cut
1. Merge final tested branch to `main`.
2. Clean rebuild backend (`npm run build`) and frontend (`npm run build`).
3. Run `npm run type-check` to confirm zero TypeScript compilation errors.
4. Verify PM2 processes are running cleanly with restart policies:
   ```bash
   pm2 status
   pm2 logs --lines 50
   ```

### Phase 2: Live Smoke Test (First 15 Minutes)
1. Perform 1 live end-to-end purchase on `https://kangpack.in` using a real payment method (₹1 test transaction or standard product).
2. Confirm payment captured in Razorpay Dashboard.
3. Confirm order status moves to `confirmed` in DB and Admin Dashboard.
4. Confirm transactional confirmation email arrives in customer's real email inbox.
5. Refund transaction from Razorpay dashboard to verify settlement flow.

### Phase 3: Day-1 Error & Log Monitoring
- [ ] Monitor Nginx access and error logs: `tail -f /var/log/nginx/error.log`
- [ ] Monitor backend PM2 logs for unhandled rejections: `pm2 logs kangpack-backend`
- [ ] Monitor server memory and CPU utilization: `htop` or `pm2 monit`
- [ ] Check Google Search Console indexing submission.

---

### Sign-Off & Approvals

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| **Lead Developer** | _____________________ | _____________________ | ____________ |
| **QA / Tester** | _____________________ | _____________________ | ____________ |
| **Business Owner** | _____________________ | _____________________ | ____________ |
