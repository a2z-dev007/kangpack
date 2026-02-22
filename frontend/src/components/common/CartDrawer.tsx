"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  removeCartItem,
  updateCartItem,
} from "@/lib/store/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

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
            <div className="flex items-center justify-between p-6 border-b border-[#6B4A2D]/10">
              <h2 className="text-2xl font-black uppercase text-[#6B4A2D] flex items-center gap-2">
                Your Cart
                <span className="text-sm font-normal normal-case text-[#6B4A2D]/60 bg-[#6B4A2D]/5 px-3 py-1 rounded-full">
                  {items.length} items
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#6B4A2D]/5 rounded-full text-[#6B4A2D]/60 hover:text-[#6B4A2D] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-[#6B4A2D]/5 rounded-full flex items-center justify-center text-[#6B4A2D]/30">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#6B4A2D]">
                      Your cart is empty
                    </h3>
                    <p className="text-[#6B4A2D]/60 text-sm mt-1 mb-6">
                      Looks like you haven't added anything yet.
                    </p>
                    <Button
                      onClick={onClose}
                      className="bg-[#6B4A2D] text-white hover:bg-[#6B4A2D]/90"
                    >
                      Start Shopping
                    </Button>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    key={`${item.productId}-${item.variantId || ""}`}
                    className="flex gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-[#6B4A2D]/5"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 md:h-24 md:w-24 bg-[#F5F5F0] rounded-xl overflow-hidden flex-shrink-0 relative group">
                      <img
                        src={item.product.images?.[0] || "/placeholder.png"}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-[#6B4A2D] line-clamp-1">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() =>
                              dispatch(
                                removeCartItem({
                                  productId: item.productId,
                                  variantId: item.variantId,
                                }),
                              )
                            }
                            className="text-[#6B4A2D]/40 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-[#6B4A2D]/60">
                          {item.product.category?.name}
                        </p>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
                        <div className="flex items-center gap-2 bg-[#F5F5F0] rounded-lg p-1">
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
                            className="p-1 hover:bg-white rounded-md text-[#6B4A2D] transition-colors shadow-sm disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-[#6B4A2D] w-4 text-center">
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
                            className="p-1 hover:bg-white rounded-md text-[#6B4A2D] transition-colors shadow-sm"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-[#6B4A2D] text-sm whitespace-nowrap">
                          ₹
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-[#6B4A2D]/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[#6B4A2D]/60 text-sm">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B4A2D]/60 text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-[#6B4A2D] font-bold text-lg pt-2 border-t border-dashed border-[#6B4A2D]/20">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    onClose();
                    router.push("/checkout");
                  }}
                  className="w-full bg-[#6B4A2D] hover:bg-[#6B4A2D]/90 text-white h-14 text-lg font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 group"
                >
                  Checkout
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
                {!isAuthenticated && (
                  <p className="text-[10px] text-center text-[#6B4A2D]/40 uppercase tracking-widest font-bold">
                    Login to track orders & view history
                  </p>
                )}
                <div className="text-center">
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/cart");
                    }}
                    className="text-xs text-[#6B4A2D]/60 hover:text-[#6B4A2D] underline font-medium"
                  >
                    View Full Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
