"use client";
import React, { useState } from "react";
import { Check, X, Briefcase } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart, setCartOpen } from "@/lib/store/features/cart/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import { QUERY_KEYS } from "@/lib/constants";
import { ASSETS } from "@/constants/assets";
import { toast } from "sonner";

const Pricing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<"shield" | "standard">("shield");
  const dispatch = useAppDispatch();

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "pricing"],
    queryFn: () => productsApi.getProducts({ limit: 10 }),
  });

  const plans = [
    {
      id: "shield" as const,
      slug: "kangpack-flagship-edition",
      name: "Radiation Shield Edition",
      price: "14,999",
      numericPrice: 14999,
      description:
        "Built-in shielding for added peace of mind during extended laptop use.",
      features: [
        { name: "Hands-Free Workstation Design", included: true },
        { name: "Ergonomic Harness System", included: true },
        { name: "Premium Leather Build", included: true },
        { name: "Lightweight & Portable", included: true },
        { name: "Laptop Radiation Shield Layer", included: true },
        { name: "Weather-Resistant Finish", included: true },
      ],
      tag: "Most Popular",
    },
    {
      id: "standard" as const,
      slug: "kangpack-classic",
      name: "Standard Edition",
      price: "12,999",
      numericPrice: 12999,
      description:
        "All essential features for mobile productivity without radiation shielding.",
      features: [
        { name: "Hands-Free Workstation Design", included: true },
        { name: "Ergonomic Harness System", included: true },
        { name: "Premium Leather Build", included: true },
        { name: "Lightweight & Portable", included: true },
        { name: "Laptop Radiation Shield Layer", included: false },
        { name: "Weather-Resistant Finish", included: true },
      ],
    },
  ];

  const handleBuyNow = async (plan: (typeof plans)[0]) => {
    const foundProduct = data?.data?.find(
      (p) => p.slug === plan.slug || p.name.toLowerCase().includes(plan.id)
    );

    const productToOrder: any = foundProduct || {
      id: plan.slug,
      _id: plan.slug,
      name: plan.name,
      slug: plan.slug,
      price: plan.numericPrice,
      images: [plan.id === "shield" ? ASSETS.TICKERS.MAIN : ASSETS.TICKERS.FIRST],
      stock: 50,
    };

    try {
      await dispatch(
        addToCart({
          product: productToOrder,
          quantity: 1,
        })
      ).unwrap();
      toast.success(`Added ${plan.name} to cart`);
      dispatch(setCartOpen(true));
    } catch {
      // Handled in thunk
    }
  };

  return (
    <section className="bg-transparent py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center flex flex-col items-center mb-8 sm:mb-10 md:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3">
            <Briefcase className="w-3.5 h-3.5 brand-primary" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
              Variants & Edition
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <span className="heading-gradient">Choose Your Edition</span>
          </h2>

          <p className="light-text text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Pick the variant that fits your workflow and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setActivePlan(plan.id)}
              className={`relative cursor-pointer transition-all duration-300 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 shadow-xs flex flex-col h-full
                ${
                  activePlan === plan.id
                    ? "bg-[#EAE5DC] border-[#6B4A2D]/30 shadow-md scale-[1.01]"
                    : "bg-[#F9F7F4] border-[#6B4A2D]/10 hover:border-[#6B4A2D]/25 hover:shadow-md"
                }
              `}
            >
              {plan.tag && (
                <div className="absolute -top-3 left-6 sm:left-8">
                  <span className="btn-premium text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md border-none">
                    {plan.tag}
                  </span>
                </div>
              )}

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-[#2D241E]">
                {plan.name}
              </h3>

              <div className="mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6B4A2D]">
                  ₹{plan.price.toLocaleString()}
                </span>
              </div>

              <p className="text-[#8B7E6F] text-xs sm:text-sm leading-relaxed mb-6">
                {plan.description}
              </p>

              <div className="space-y-4 xl:space-y-2 2xl:space-y-4 mb-12 xl:mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${feature.included ? "bg-[#6B4A2D]/10" : "bg-[#6B4A2D]/5"}`}
                    >
                      {feature.included ? (
                        <Check
                          className="w-3 h-3 text-[#6B4A2D]"
                          strokeWidth={3}
                        />
                      ) : (
                        <X
                          className="w-3 h-3 text-[#8B7E6F]/40"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm tracking-wide ${feature.included ? "text-[#6B4A2D] font-medium" : "text-[#8B7E6F]/50"}`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <PrimaryButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow(plan);
                }}
                className="mt-auto btn-premium"
              >
                Buy Now
              </PrimaryButton>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Shapes */}
      <div className="absolute -left-20 top-20 w-[400px] h-[400px] bg-[#EAE5DC]/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute -right-20 bottom-20 w-[400px] h-[400px] bg-[#EAE5DC]/30 rounded-full blur-[100px] -z-10" />
    </section>
  );
};

export default Pricing;
