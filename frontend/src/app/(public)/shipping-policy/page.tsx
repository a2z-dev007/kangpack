"use client";
import React from "react";
import { motion } from "framer-motion";
import { Truck, Package, MapPin, Clock, AlertTriangle, DollarSign } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";

const ShippingPolicy: React.FC = () => {
  const lastUpdated = "12-02-2025";

  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-brown/10 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Hero */}
        <section className="relative  h-[50vh] min-h-[400px] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <div className="absolute inset-0 z-0">
            <ParallaxImage
              src={ASSETS.TICKERS.MAIN2}
              className="w-full h-full object-cover grayscale-[10%]"
              alt="Shipping Policy"
            />
          </div>

          <div className="relative z-20 text-center px-6 w-full max-w-none flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/90 text-[12px] md:text-[14px] uppercase tracking-[0.6em] mb-6 font-bold"
            >
              Delivery Information
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-[clamp(3.5rem,10vw,8rem)] font-bold leading-none tracking-tight"
            >
              Shipping Policy
            </motion.h1>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="bg-brand-beige pt-20 pb-12 px-6 md:px-0">
          <div className="w-full max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:pl-[8%] lg:pl-[12%]"
            >
              <h2 className="text-xl md:text-2xl font-black text-[#6B4A2D] leading-[1.2] mb-6 max-w-5xl tracking-tight">
                Fast, reliable delivery across India with transparent timelines and tracking.
              </h2>
              <div className="h-[2px] w-[80px] bg-[#6B4A2D] mb-8" />
              <p className="text-[#8B7E6F] text-[18px] leading-relaxed max-w-4xl font-medium">
                We partner with trusted courier services to ensure your Kangpack reaches you safely and on time. Here's everything you need to know about our shipping process.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="text-[#6B4A2D]/60 text-[8px] font-bold uppercase tracking-[0.6em] flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#6B4A2D]" />
                  Effective Date: {lastUpdated}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="bg-brand-beige pb-48">
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-0">
            <div className="relative border-t border-black/5">
              <div
                className="absolute inset-x-0 inset-y-0 opacity-[0.03] pointer-events-none -z-10"
                style={{
                  backgroundImage: "radial-gradient(#6B4A2D 1.5px, transparent 1.5px)",
                  backgroundSize: "64px 64px",
                }}
              />

              {/* Shipping Coverage */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      1. Shipping Coverage
                    </h3>
                    <p className="text-[#5A544E] text-[18px] leading-[1.7] max-w-5xl">
                      We currently ship across India. International shipping may be available upon request.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Processing Time */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      2. Processing Time
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-[#6B4A2D] font-medium mb-1">Standard Processing</p>
                          <p className="text-[#5A544E] text-[17px]">
                            Orders are processed within 1–3 business days after payment confirmation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <AlertTriangle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[#6B4A2D] font-medium mb-1">Weekend & Holiday Orders</p>
                          <p className="text-[#5A544E] text-[17px]">
                            Orders placed on weekends or public holidays are processed on the next working day
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Delivery Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500">
                      <Truck className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      3. Delivery Timeline
                    </h3>

                    <p className="text-[#5A544E] text-[18px]">
                      Estimated delivery times:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { location: "Metro Cities", time: "3–5 business days", icon: "🏙️" },
                        { location: "Non-Metro Areas", time: "5–8 business days", icon: "🏘️" }
                      ].map((item, i) => (
                        <div key={i} className="bg-[#F9F7F4] rounded-2xl p-6 border border-[#6B4A2D]/5">
                          <div className="text-4xl mb-3">{item.icon}</div>
                          <h4 className="text-xl font-bold text-[#6B4A2D] mb-2">{item.location}</h4>
                          <p className="text-[#5A544E] text-lg font-medium">{item.time}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-[#6B4A2D] font-bold mb-2">Please Note</h4>
                          <p className="text-[#5A544E] text-[16px] mb-3">
                            Delivery timelines are estimates and may vary due to:
                          </p>
                          <ul className="space-y-2">
                            {["Courier delays", "Weather conditions", "Public holidays"].map((factor, i) => (
                              <li key={i} className="text-[#5A544E] text-[16px] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Charges */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      4. Shipping Charges
                    </h3>
                    <p className="text-[#5A544E] text-[18px] leading-[1.7] max-w-5xl">
                      Shipping charges (if applicable) will be displayed at checkout before you complete your purchase.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Risk & Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      5. Risk & Title
                    </h3>
                    <p className="text-[#5A544E] text-[18px] leading-[1.7] max-w-5xl">
                      Ownership and risk transfer to the customer upon successful delivery.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Undelivered Orders */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      6. Undelivered Orders
                    </h3>
                    <p className="text-[#5A544E] text-[18px] mb-4">
                      If delivery fails due to incorrect address or unavailability:
                    </p>
                    <ul className="space-y-3">
                      <li className="text-[#5A544E] text-[17px] flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full mt-2.5 flex-shrink-0" />
                        <span>Re-shipping charges may apply</span>
                      </li>
                      <li className="text-[#5A544E] text-[17px] flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full mt-2.5 flex-shrink-0" />
                        <span>Orders unclaimed after multiple attempts may be cancelled without refund of shipping charges</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShippingPolicy;
