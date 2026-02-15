"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  removeCartItem,
  updateCartItem,
  clearCartAsync,
} from "@/lib/store/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import Navbar from "@/components/home/Navbar";
import { motion } from "framer-motion";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
        <Navbar darkText />
        <div className="flex-grow container flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 bg-[#6B4A2D]/5 rounded-full flex items-center justify-center text-[#6B4A2D]/20 mb-8">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-4xl font-black text-[#6B4A2D] uppercase tracking-tighter mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-[#8B7E6F] mb-10 max-w-md mx-auto">
            Looks like you haven't added any premium gear to your cart yet. Time
            to gear up!
          </p>
          <Link href={ROUTES.PRODUCTS}>
            <Button className="bg-[#6B4A2D] hover:bg-[#6B4A2D]/90 text-white px-8 h-14 rounded-2xl font-bold uppercase tracking-widest flex items-center gap-2">
              Browse Products
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar solid />

      <div className="flex-grow container py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black text-[#6B4A2D] uppercase tracking-tighter mb-12">
            Shopping Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <motion.div
                  layout
                  key={item.productId}
                  className="bg-white rounded-[32px] p-6 shadow-sm border border-[#6B4A2D]/5 flex flex-col sm:flex-row gap-6 relative"
                >
                  <div className="w-full sm:w-32 h-32 bg-[#F5F5F0] rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images?.[0] || "/placeholder.png"}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-[#6B4A2D]">
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
                          className="text-[#6B4A2D]/30 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-[#6B4A2D]/40 uppercase tracking-widest mt-1">
                        {item.product.category?.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4 bg-[#F5F5F0] rounded-xl p-1.5 border border-[#6B4A2D]/5">
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
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#6B4A2D] transition-all shadow-none hover:shadow-sm disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-[#6B4A2D] w-6 text-center">
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
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#6B4A2D] transition-all shadow-none hover:shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-2xl font-black text-[#6B4A2D] tracking-tighter">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-between items-center pt-6">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="text-[#6B4A2D] font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <ArrowRight className="rotate-180 w-4 h-4" />
                  Continue Shopping
                </Link>
                <button
                  onClick={() => dispatch(clearCartAsync())}
                  className="text-red-500/60 hover:text-red-500 font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  Clear All Items
                </button>
              </div>
            </div>

            <div className="h-fit sticky top-32">
              <div className="bg-[#FFFBF6] rounded-[40px] p-10 border border-[#6B4A2D]/10">
                <h2 className="text-2xl font-black text-[#6B4A2D] uppercase tracking-tighter mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[#8B7E6F] font-bold uppercase tracking-widest text-[10px]">
                    <span>Subtotal</span>
                    <span className="text-[#6B4A2D] text-sm">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8B7E6F] font-bold uppercase tracking-widest text-[10px]">
                    <span>Shipping</span>
                    <span className="text-green-600 text-sm">Free</span>
                  </div>
                  <div className="border-t border-[#6B4A2D]/10 pt-6 flex justify-between items-center">
                    <span className="text-[#6B4A2D] font-black uppercase tracking-tighter text-xl">
                      Total
                    </span>
                    <span className="text-[#6B4A2D] font-black tracking-tighter text-3xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <Link href={ROUTES.CHECKOUT}>
                  <Button className="w-full bg-[#6B4A2D] hover:bg-[#6B4A2D]/90 text-white h-16 rounded-3xl text-lg font-bold uppercase tracking-widest shadow-xl shadow-[#6B4A2D]/20 transition-all hover:-translate-y-1 active:scale-95">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale contrast-125">
                  <span className="font-bold text-[8px] tracking-widest uppercase">
                    Visa
                  </span>
                  <span className="font-bold text-[8px] tracking-widest uppercase">
                    Mastercard
                  </span>
                  <span className="font-bold text-[8px] tracking-widest uppercase">
                    Stripe
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
