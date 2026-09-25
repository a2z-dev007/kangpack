"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  removeCartItem,
  updateCartItem,
} from "@/lib/store/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getImageUrl, formatPrice, cn } from "@/lib/utils";
import { useCoupon } from "@/hooks/use-coupon";
import CouponPicker from "@/components/common/CouponPicker";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const [showCoupon, setShowCoupon] = useState(true);

  const validItems = (items || []).filter(
    (item: any) => item && item.product && typeof item.product === "object",
  );

  const subtotal = validItems.reduce(
    (sum: number, item: any) =>
      sum + (item.product?.price || 0) * (item.quantity || 1),
    0,
  );

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

  const total = Math.max(0, subtotal - couponDiscount);

  const handleCheckout = () => {
    onClose();
    const checkoutUrl = appliedCoupon?.code
      ? `/checkout?coupon=${encodeURIComponent(appliedCoupon.code)}`
      : "/checkout";
    router.push(checkoutUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FFFBF6] shadow-2xl z-[70] flex flex-col border-l border-[#6B4A2D]/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#6B4A2D]/10 flex-shrink-0">
              <h2 className="text-xl font-black uppercase text-[#6B4A2D] flex items-center gap-2.5">
                Your Cart
                <span className="text-xs font-bold normal-case text-[#6B4A2D]/60 bg-[#6B4A2D]/6 px-2.5 py-0.5 rounded-full border border-[#6B4A2D]/10">
                  {validItems.length} {validItems.length === 1 ? "item" : "items"}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#6B4A2D]/5 rounded-full text-[#6B4A2D]/60 hover:text-[#6B4A2D] transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items — scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain">
              {validItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-20 h-20 bg-[#6B4A2D]/5 rounded-full flex items-center justify-center text-[#6B4A2D]/25">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#6B4A2D]">
                      Your cart is empty
                    </h3>
                    <p className="text-[#6B4A2D]/50 text-sm mt-1 mb-6">
                      Looks like you haven't added anything yet.
                    </p>
                    <Button
                      onClick={() => {
                        onClose();
                        router.push("/products");
                      }}
                      className="bg-[#6B4A2D] text-white hover:bg-[#543820]"
                    >
                      Start Shopping
                    </Button>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {validItems.map((item: any) => (
                    <motion.div
                      layout
                      key={`${item.productId}-${item.variantId || ""}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 bg-white p-3 rounded-2xl border border-[#6B4A2D]/8 shadow-sm"
                    >
                      {/* Product Image */}
                      <div className="h-18 w-18 sm:h-20 sm:w-20 bg-[#FAF8F5] rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img
                          src={getImageUrl(item.product?.images?.[0])}
                          alt={item.product?.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B7E6F] truncate">
                              {item.product?.category?.name || "Kangpack"}
                            </p>
                            <h3 className="font-bold text-[#6B4A2D] text-sm leading-tight line-clamp-2 mt-0.5">
                              {item.product?.name || "Product"}
                            </h3>
                          </div>
                          <button
                            onClick={() =>
                              dispatch(
                                removeCartItem({
                                  productId: item.productId,
                                  variantId: item.variantId,
                                }),
                              )
                            }
                            className="text-[#8B7E6F]/50 hover:text-rose-500 transition-colors p-1 flex-shrink-0 rounded-lg hover:bg-rose-50"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 bg-[#FAF8F5] rounded-lg border border-[#6B4A2D]/10 p-0.5">
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
                              className="w-6 h-6 flex items-center justify-center rounded-md text-[#6B4A2D] hover:bg-white transition-all disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-black text-[#6B4A2D] w-5 text-center tabular-nums">
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
                              className="w-6 h-6 flex items-center justify-center rounded-md text-[#6B4A2D] hover:bg-white transition-all"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span className="font-black text-[#6B4A2D] text-sm tabular-nums">
                            {formatPrice((item.product?.price || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {validItems.length > 0 && (
              <div className="border-t border-[#6B4A2D]/10 bg-white flex-shrink-0">
                {/* Coupon Toggle Section */}
                <div className="px-4 pt-3 pb-2">
                  <button
                    type="button"
                    onClick={() => setShowCoupon((p) => !p)}
                    className={cn(
                      "w-full flex items-center justify-between text-xs font-bold text-[#6B4A2D] px-3 py-2.5 rounded-xl border transition-all",
                      appliedCoupon
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-[#FAF8F5] border-[#6B4A2D]/10 hover:border-[#6B4A2D]/20 hover:bg-white",
                    )}
                  >
                    <span className="flex items-center gap-2 uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5" />
                      {appliedCoupon
                        ? `${appliedCoupon.code} — Saving ${formatPrice(couponDiscount)}`
                        : "Apply Coupon / Promo Code"}
                    </span>
                    {showCoupon ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showCoupon && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3">
                          <CouponPicker
                            subtotal={subtotal}
                            appliedCoupon={appliedCoupon}
                            couponInput={couponInput}
                            isApplyingCoupon={isApplyingCoupon}
                            onCouponInputChange={setCouponInput}
                            onApplyCoupon={handleApplyCoupon}
                            onApplyPublicCoupon={handleApplyPublicCoupon}
                            onRemoveCoupon={handleRemoveCoupon}
                            compact
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price Breakdown */}
                <div className="px-4 py-3 space-y-1.5 border-t border-[#6B4A2D]/8">
                  <div className="flex justify-between text-xs text-[#8B7E6F]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#6B4A2D]">{formatPrice(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600">
                      <span className="font-medium">Coupon discount</span>
                      <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6B4A2D] font-black text-base pt-1.5 border-t border-dashed border-[#6B4A2D]/15">
                    <span>Total</span>
                    <span className="tabular-nums">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-4 pb-5 space-y-2.5">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#6B4A2D] hover:bg-[#543820] text-white h-12 text-sm font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 group shadow-sm active:scale-[0.98] transition-all"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>

                  <button
                    onClick={() => {
                      onClose();
                      router.push("/cart");
                    }}
                    className="w-full text-xs text-[#6B4A2D]/50 hover:text-[#6B4A2D] font-medium transition-colors py-1"
                  >
                    View Full Cart →
                  </button>

                  {!isAuthenticated && (
                    <p className="text-[10px] text-center text-[#6B4A2D]/35 uppercase tracking-widest font-bold">
                      Login to track orders & view history
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
