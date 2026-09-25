"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  removeCartItem,
  updateCartItem,
  clearCartAsync,
} from "@/lib/store/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { formatPrice, getImageUrl, cn } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import Navbar from "@/components/home/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicSettings } from "@/features/settings/queries";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/lib/toast";
import { useCoupon } from "@/hooks/use-coupon";
import CouponPicker from "@/components/common/CouponPicker";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Store Settings (Shipping, Taxes)
  const { data: publicSettings } = usePublicSettings();

  const isShippingEnabled = publicSettings?.shipping?.enabled !== false;
  const freeShippingThreshold =
    publicSettings?.shipping?.freeShippingThreshold ??
    publicSettings?.freeShippingThreshold ??
    0;
  const defaultShippingRate =
    publicSettings?.shipping?.defaultRate ??
    publicSettings?.shippingFee ??
    0;

  const isTaxEnabled = publicSettings?.tax?.enabled !== false;
  const taxRate = isTaxEnabled
    ? (publicSettings?.tax?.rate ?? publicSettings?.taxRate ?? 0)
    : 0;

  // Filter valid cart items
  const validItems = (items || []).filter(
    (item: any) => item && item.product && typeof item.product === "object",
  );

  const subtotal = validItems.reduce(
    (sum: number, item: any) =>
      sum + (item.product?.price || 0) * (item.quantity || 1),
    0,
  );

  const totalQuantity = validItems.reduce(
    (sum: number, item: any) => sum + (item.quantity || 1),
    0,
  );

  // Coupon (shared hook — must be after subtotal is declared)
  const {
    couponInput,
    setCouponInput,
    appliedCoupon,
    couponDiscount,
    isApplyingCoupon,
    handleApplyCoupon,
    handleApplyPublicCoupon,
    handleRemoveCoupon,
  } = useCoupon(subtotal);


  // Free shipping progress logic
  const isFreeShipping =
    !isShippingEnabled ||
    freeShippingThreshold === 0 ||
    subtotal >= freeShippingThreshold;

  const shippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      : 100;

  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal,
  );

  const shipping = validItems.length > 0 ? (isFreeShipping ? 0 : defaultShippingRate) : 0;
  const estimatedTax = isTaxEnabled
    ? Number((((subtotal - couponDiscount) * taxRate) / 100).toFixed(2))
    : 0;
  const total = Number(
    Math.max(0, subtotal - couponDiscount + shipping + estimatedTax).toFixed(2),
  );


  const handleClearCart = async () => {
    try {
      setIsClearing(true);
      await dispatch(clearCartAsync()).unwrap();
      toast.success("Cart cleared");
      setIsClearModalOpen(false);
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      setIsClearing(false);
    }
  };

  // URL for Checkout (preserving coupon if applied)
  const checkoutUrl = appliedCoupon?.code
    ? `${ROUTES.CHECKOUT}?coupon=${encodeURIComponent(appliedCoupon.code)}`
    : ROUTES.CHECKOUT;

  // Empty state
  if (validItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] font-sans flex flex-col">
        <Navbar solid />
        <div className="flex-grow container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center py-24 sm:py-32 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-24 h-24 sm:w-28 sm:h-28 bg-[#6B4A2D]/5 rounded-3xl flex items-center justify-center text-[#6B4A2D]/30 mb-8 border border-[#6B4A2D]/10 shadow-xs"
          >
            <ShoppingBag className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#6B4A2D] uppercase tracking-tight mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-[#8B7E6F] text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
            Looks like you haven&apos;t added any modular gear to your bag yet. Explore our handcrafted collection to find your next companion.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link href={ROUTES.PRODUCTS} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#6B4A2D] hover:bg-[#543820] text-white px-8 h-13 sm:h-14 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-95">
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-[#6B4A2D]/20 text-[#6B4A2D] hover:bg-white px-6 h-13 sm:h-14 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans flex flex-col selection:bg-[#6B4A2D] selection:text-white">
      <Navbar solid />

      <main className="flex-grow container mx-auto pt-24 sm:pt-28 md:pt-32 pb-28 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#8B7E6F]">
          <Link href="/" className="hover:text-[#6B4A2D] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-[#6B4A2D]">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#6B4A2D]/10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#6B4A2D] uppercase tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-[#8B7E6F] mt-1.5 font-medium">
              Carefully review your items before seamless, secure checkout.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-4 py-2 rounded-full border border-[#6B4A2D]/10 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#6B4A2D] tracking-wide">
              {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"} ({validItems.length} Products)
            </span>
          </div>
        </div>

        {/* Main Grid: Items (Left) vs Order Summary (Right) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: Items List & Actions (7 Cols on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Free Shipping Progress Meter */}
            {isShippingEnabled && freeShippingThreshold > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#6B4A2D]/10 shadow-xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                      isFreeShipping
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-[#FAF8F5] text-[#6B4A2D] border border-[#6B4A2D]/10",
                    )}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
                      {isFreeShipping ? (
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            You&apos;ve unlocked <strong>FREE Express Delivery!</strong>
                          </span>
                        </span>
                      ) : (
                        <span className="text-[#6B4A2D]">
                          Add{" "}
                          <strong className="text-emerald-700 font-bold">
                            {formatPrice(amountNeededForFreeShipping)}
                          </strong>{" "}
                          more to unlock <strong>FREE Express Delivery</strong>
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#8B7E6F] tabular-nums">
                        {shippingProgress}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#6B4A2D]/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          isFreeShipping ? "bg-emerald-500" : "bg-[#6B4A2D]",
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items Cards */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {validItems.map((item: any) => {
                  const product = item.product || {};
                  const prodId = product.id || product._id || item.productId;
                  const itemTotal = (product.price || 0) * (item.quantity || 1);
                  const detailUrl = ROUTES.PRODUCT_DETAIL(product.slug || prodId);
                  const rawImage = product.images?.[0];
                  const imageUrl = getImageUrl(rawImage);

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      key={`${item.productId}-${item.variantId || "default"}`}
                      className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#6B4A2D]/10 shadow-xs hover:shadow-sm transition-all duration-300"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Image Thumbnail */}
                        <Link
                          href={detailUrl}
                          className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#6B4A2D]/5 flex-shrink-0 relative group/img"
                        >
                          <img
                            src={imageUrl}
                            alt={product.name || "Product"}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </Link>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {/* Category & Remove Button */}
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8B7E6F]">
                                {product.category?.name || "Kangpack"}
                              </span>
                              <button
                                onClick={() =>
                                  dispatch(
                                    removeCartItem({
                                      productId: item.productId,
                                      variantId: item.variantId,
                                    }),
                                  )
                                }
                                aria-label={`Remove ${product.name} from cart`}
                                title="Remove item"
                                className="text-[#8B7E6F]/60 hover:text-rose-600 transition-colors p-1 -mr-1 rounded-lg hover:bg-rose-50"
                              >
                                <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                              </button>
                            </div>

                            {/* Title */}
                            <Link href={detailUrl} className="block mt-1">
                              <h3 className="text-base sm:text-lg font-bold text-[#6B4A2D] hover:text-[#543820] transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                            </Link>

                            {/* In Stock Badge & Unit Price */}
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                In Stock
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-xs text-[#8B7E6F] font-medium">
                                  {formatPrice(product.price)} each
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Bottom Row: Quantity Stepper & Line Price */}
                          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-[#6B4A2D]/5">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-[#FAF8F5] rounded-xl border border-[#6B4A2D]/10 p-1">
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateCartItem({
                                      productId: item.productId,
                                      quantity: item.quantity - 1,
                                      variantId: item.variantId,
                                    }),
                                  )
                                }
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[#6B4A2D] hover:bg-white transition-all shadow-none hover:shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 sm:w-10 text-center font-bold text-xs sm:text-sm text-[#6B4A2D] tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateCartItem({
                                      productId: item.productId,
                                      quantity: item.quantity + 1,
                                      variantId: item.variantId,
                                    }),
                                  )
                                }
                                aria-label="Increase quantity"
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[#6B4A2D] hover:bg-white transition-all shadow-none hover:shadow-2xs active:scale-95"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Total Line Price */}
                            <div className="text-right">
                              <span className="text-lg sm:text-xl font-black text-[#6B4A2D] tracking-tight">
                                {formatPrice(itemTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#6B4A2D] hover:text-[#543820] transition-colors py-2 px-3 rounded-xl hover:bg-white border border-transparent hover:border-[#6B4A2D]/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600/70 hover:text-rose-600 transition-colors py-2 px-3 rounded-xl hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Items</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Order Summary Card (5 Cols on Desktop - Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#6B4A2D]/10 shadow-sm relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#6B4A2D]/10">
                <h2 className="text-xl sm:text-2xl font-black text-[#6B4A2D] uppercase tracking-tight">
                  Order Summary
                </h2>
                <span className="text-xs font-bold text-[#8B7E6F] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#6B4A2D]/10">
                  {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Coupon / Promo Code */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B7E6F] mb-2.5">
                  Have a Coupon Code?
                </label>
                <CouponPicker
                  subtotal={subtotal}
                  appliedCoupon={appliedCoupon}
                  couponInput={couponInput}
                  isApplyingCoupon={isApplyingCoupon}
                  onCouponInputChange={setCouponInput}
                  onApplyCoupon={handleApplyCoupon}
                  onApplyPublicCoupon={handleApplyPublicCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3.5 text-xs sm:text-sm mb-6">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-[#8B7E6F]">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-[#6B4A2D] tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-[#8B7E6F]">
                  <span className="font-medium flex items-center gap-1.5">
                    Shipping
                    {isFreeShipping && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-bold tabular-nums">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold">Free</span>
                    ) : (
                      <span className="text-[#6B4A2D]">{formatPrice(shipping)}</span>
                    )}
                  </span>
                </div>

                {/* Coupon Discount (if applied) */}
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <span className="font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Coupon Discount
                    </span>
                    <span className="font-bold tabular-nums">
                      -{formatPrice(couponDiscount)}
                    </span>
                  </div>
                )}


                {/* Tax / GST */}
                {isTaxEnabled && taxRate > 0 && (
                  <div className="flex justify-between items-center text-[#8B7E6F]">
                    <span className="font-medium">Estimated GST / Tax ({taxRate}%)</span>
                    <span className="font-bold text-[#6B4A2D] tabular-nums">
                      {formatPrice(estimatedTax)}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-[#6B4A2D]/10 pt-4 mt-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="block text-sm font-bold uppercase tracking-wider text-[#6B4A2D]">
                        Total Amount
                      </span>
                      <span className="text-[10px] text-[#8B7E6F] font-medium">
                        {isTaxEnabled && taxRate > 0 ? "Includes all taxes" : "All taxes included"}
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-[#6B4A2D] tracking-tight tabular-nums">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link href={checkoutUrl} className="block w-full">
                <Button className="w-full h-14 sm:h-15 rounded-2xl bg-[#6B4A2D] hover:bg-[#543820] text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {/* Security & Guarantees */}
              <div className="mt-6 pt-5 border-t border-[#6B4A2D]/10 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-[#8B7E6F]">
                  <Lock className="w-4 h-4 text-[#6B4A2D] flex-shrink-0" />
                  <span>256-Bit SSL Encrypted & Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#8B7E6F]">
                  <ShieldCheck className="w-4 h-4 text-[#6B4A2D] flex-shrink-0" />
                  <span>100% Genuine Kangpack Handcrafted Gear</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#8B7E6F]">
                  <RotateCcw className="w-4 h-4 text-[#6B4A2D] flex-shrink-0" />
                  <span>7-Day Easy Replacement Policy</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-4 border-t border-[#6B4A2D]/10">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#8B7E6F]/70 text-center mb-2.5">
                  Accepted Payment Methods
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap text-[#6B4A2D]/60">
                  <span className="px-2 py-1 bg-[#FAF8F5] border border-[#6B4A2D]/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    UPI
                  </span>
                  <span className="px-2 py-1 bg-[#FAF8F5] border border-[#6B4A2D]/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    Visa
                  </span>
                  <span className="px-2 py-1 bg-[#FAF8F5] border border-[#6B4A2D]/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    Mastercard
                  </span>
                  <span className="px-2 py-1 bg-[#FAF8F5] border border-[#6B4A2D]/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    RuPay
                  </span>
                  <span className="px-2 py-1 bg-[#FAF8F5] border border-[#6B4A2D]/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    NetBanking
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Dock for Mobile (Screens < lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#6B4A2D]/10 p-4 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8B7E6F] tracking-widest block">
              Total ({totalQuantity})
            </span>
            <span className="text-xl font-black text-[#6B4A2D] tracking-tight tabular-nums block">
              {formatPrice(total)}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {isFreeShipping ? "Free Delivery" : "+ Shipping"}
            </span>
          </div>
          <Link href={checkoutUrl} className="flex-1">
            <Button className="w-full h-12 rounded-xl bg-[#6B4A2D] hover:bg-[#543820] text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCart}
        title="Clear Shopping Cart?"
        description="Are you sure you want to remove all items from your shopping cart? This action cannot be undone."
        confirmText="Clear Cart"
        variant="destructive"
        isLoading={isClearing}
      />
    </div>
  );
}
