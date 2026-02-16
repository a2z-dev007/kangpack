"use client";
import React, { useState } from "react";
import { Check, X, Briefcase } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { motion } from "framer-motion";

const Pricing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<"shield" | "standard">("shield");

  const plans = [
    {
      id: "shield" as const,
      name: "Radiation Shield Edition",
      price: "14,999",
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
      name: "Standard Edition",
      price: "12,999",
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

  return (
    <section className="bg-transparent py-16 md:py-24 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center flex flex-col items-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-8">
            <Briefcase className="w-3.5 h-3.5 brand-primary" />
            <span className="text-[11px] font-medium tracking-wide brand-primary uppercase">
              Variants & Edition
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl leading-[1.1] mb-6 tracking-tight font-bold">
            <span className="heading-gradient underline decoration-primary/10 underline-offset-[12px]">
              Choose Your Edition
            </span>
          </h2>

          <p className="light-text text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Pick the variant that fits your workflow and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setActivePlan(plan.id)}
              className={`relative cursor-pointer transition-all duration-500 rounded-[40px] p-8 md:p-12 xl:p-14 2xl:p-16 border-[2px] shadow-sm flex flex-col h-full
                ${
                  activePlan === plan.id
                    ? "bg-[#EAE5DC] border-[#6B4A2D]/20 border-dashed border-[3px] shadow-md scale-[1.02]"
                    : "bg-[#F9F7F4] border-[#6B4A2D]/10 hover:border-[#6B4A2D]/30"
                }
              `}
            >
              {plan.tag && (
                <div className="absolute -top-3 left-10">
                  <span className="btn-premium text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border-none">
                    {plan.tag}
                  </span>
                </div>
              )}

              <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-6 xl:mb-8 text-[#2D241E]">
                {plan.name}
              </h3>

              <div className="mb-8 xl:mb-10">
                <span className="text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-[#6B4A2D]">
                  ₹{plan.price}
                </span>
              </div>

              <p className="text-[#8B7E6F] text-base xl:text-sm leading-relaxed mb-10 xl:mb-4 min-h-[3rem] xl:min-h-[2.5rem]">
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

              <PrimaryButton className="mt-auto pointer-events-none btn-premium">
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
