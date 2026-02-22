"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";
import {
  Truck,
  RotateCcw,
  Package,
  Clock,
  ShieldCheck,
  Globe,
  CreditCard,
  Box,
  Mail,
  HelpCircle,
} from "lucide-react";

const ShippingReturnsPage = () => {
  const lastUpdated = "February 13, 2026";

  const shippingSections = [
    {
      id: "order-processing",
      title: "1. Order Processing",
      icon: <Clock className="w-6 h-6" />,
      content:
        "All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.",
    },
    {
      id: "shipping-rates",
      title: "2. Shipping Rates & Delivery",
      icon: <Truck className="w-6 h-6" />,
      content:
        "Shipping charges for your order will be calculated and displayed at checkout. We offer standard shipping (5-7 business days) and expedited shipping (2-3 business days). Delivery delays can occasionally occur due to external factors beyond our control.",
    },
    {
      id: "international-shipping",
      title: "3. International Shipping",
      icon: <Globe className="w-6 h-6" />,
      content:
        "We ship to over 50 countries worldwide. Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. Kangpack is not responsible for these charges if they are applied and are your responsibility as the customer.",
    },
    {
      id: "shipment-confirmation",
      title: "4. Shipment Confirmation",
      icon: <Package className="w-6 h-6" />,
      content:
        "You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours. You can track your package directly through our website or the carrier's portal.",
    },
    {
      id: "return-policy",
      title: "5. Return Policy",
      icon: <RotateCcw className="w-6 h-6" />,
      content:
        "We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.",
    },
    {
      id: "damages-issues",
      title: "6. Damages & Issues",
      icon: <ShieldCheck className="w-6 h-6" />,
      content:
        "Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right. We will provide a pre-paid return label for any defective items.",
    },
    {
      id: "refunds",
      title: "7. Refunds",
      icon: <CreditCard className="w-6 h-6" />,
      content:
        "We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process the refund.",
    },
    {
      id: "exchanges",
      title: "8. Exchanges",
      icon: <Box className="w-6 h-6" />,
      content:
        "The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. We offer free size exchanges within the domestic territory, subject to stock availability.",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-brown/10 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Hero - Full Width & Centered Content */}
        <section className="relative  h-[50vh] min-h-[400px] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <div className="absolute inset-0 z-0">
            <ParallaxImage
              src={ASSETS.TICKERS.MAIN}
              className="w-full h-full object-cover grayscale-[10%]"
              alt="Shipping and Returns background image"
            />
          </div>

          <div className="relative z-20 text-center px-6 w-full max-w-none flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/90 text-[12px] md:text-[14px] uppercase tracking-[0.6em] mb-6 font-bold"
            >
              Logistics & Care
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-[clamp(2.5rem,10vw,8rem)] font-bold leading-none tracking-tight"
            >
              Shipping & Returns
            </motion.h1>
          </div>
        </section>

        {/* Introduction Section - Edge to Edge */}
        <section className="bg-brand-beige pt-20 pb-12 px-6 md:px-0">
          <div className="w-full max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:pl-[8%] lg:pl-[12%]"
            >
              <h2 className="text-xl md:text-2xl font-black text-[#6B4A2D] leading-[1.2] mb-6 max-w-5xl tracking-tight">
                Our commitment to excellence extends beyond our products to the
                way they reach your doorstep and how we handle returns.
              </h2>
              <div className="h-[2px] w-[80px] bg-[#6B4A2D] mb-8" />
              <p className="text-[#8B7E6F] text-[18px] leading-relaxed max-w-4xl font-medium">
                We strive to provide a seamless shipping experience and a
                generous return policy. Whether you're across the street or
                across the globe, our logistics partners ensure your premium
                Kangpack gear arrives safely and on time. If you're not
                completely satisfied, our return process is designed to be
                simple and hassle-free.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Detailed Sections - CONSISTENT WITH T&C & PRIVACY */}
        <section className="bg-brand-beige pb-48">
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-0">
            <div className="relative border-t border-black/5">
              {/* Expansive dot pattern background */}
              <div
                className="absolute inset-x-0 inset-y-0 opacity-[0.03] pointer-events-none -z-10"
                style={{
                  backgroundImage:
                    "radial-gradient(#6B4A2D 1.5px, transparent 1.5px)",
                  backgroundSize: "64px 64px",
                }}
              />

              {shippingSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="py-10 md:py-12 border-b border-black/5 last:border-0 md:px-[8%] lg:px-[12%] group"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                    {/* Circular Icon Container */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                          index % 2 === 1
                            ? "bg-[#6B4A2D] text-white"
                            : "bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)]"
                        }`}
                      >
                        {section.icon}
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <h3 className="text-[20px] font-bold text-[#6B4A2D] tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                        {section.title}
                      </h3>
                      <p className="text-[#5A544E] text-[18px] leading-[1.7] max-w-5xl font-normal">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section - BRAND THEME LIGHT */}
        <section className="py-24 bg-brand-beige relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-[12%] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="text-[#6B4A2D]/60 text-[8px] font-bold uppercase tracking-[0.6em] flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#6B4A2D]" />
                Last Updated: {lastUpdated}
              </div>
              <h4 className="text-[#6B4A2D] text-2xl md:text-5xl font-black tracking-tight leading-[1.1]">
                Need delivery <br /> assistance?
              </h4>
              <p className="text-[#8B7E6F] text-[15px] md:text-[18px] max-w-md leading-relaxed font-medium">
                Our support desk is ready to assist with any specific shipping
                or return queries.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <a
                href="mailto:support@kangpack.in"
                className="flex items-center justify-between gap-4 p-5 md:p-8 rounded-3xl bg-white border border-[#6B4A2D]/5 hover:border-[#6B4A2D]/20 shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)] hover:shadow-[0_10px_40px_-1px_rgba(107,74,45,0.08)] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-4 md:gap-14">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#F9F7F4] flex items-center justify-center text-[#6B4A2D] group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#6B4A2D]/50 text-[12px] md:text-[20px] font-bold uppercase tracking-[0.1em] mb-1">
                      Direct Support
                    </div>
                    <div className="text-[14px] md:text-[18px] font-bold text-[#6B4A2D] truncate">
                      support@kangpack.in
                    </div>
                  </div>
                </div>
                <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full border border-[#6B4A2D]/10 flex items-center justify-center group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </a>

              <Link
                href="/faqs"
                className="flex items-center justify-between gap-4 p-5 md:p-8 rounded-3xl bg-white border border-[#6B4A2D]/5 hover:border-[#6B4A2D]/20 shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)] hover:shadow-[0_10px_40px_-1px_rgba(107,74,45,0.08)] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-4 md:gap-14">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#6B4A2D] flex items-center justify-center text-white transition-all duration-500 flex-shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#6B4A2D]/50 text-[12px] md:text-[20px] font-bold uppercase tracking-[0.1em] mb-1">
                      Resource center
                    </div>
                    <div className="text-[14px] md:text-[18px] font-bold text-[#6B4A2D] truncate">
                      Help Center
                    </div>
                  </div>
                </div>
                <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full border border-[#6B4A2D]/10 flex items-center justify-center group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Helper component for the arrow icon
const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default ShippingReturnsPage;
