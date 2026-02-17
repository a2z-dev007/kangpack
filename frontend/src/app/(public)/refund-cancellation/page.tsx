"use client";
import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, XCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";

const RefundCancellation: React.FC = () => {
  const lastUpdated = "12-02-2025";

  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-brown/10 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Hero */}
        <section className="relative h-[80vh] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <div className="absolute inset-0 z-0">
            <ParallaxImage
              src={ASSETS.TICKERS.MAIN2}
              className="w-full h-full object-cover grayscale-[10%]"
              alt="Refund and Cancellation Policy"
            />
          </div>

          <div className="relative z-20 text-center px-6 w-full max-w-none flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/90 text-[12px] md:text-[14px] uppercase tracking-[0.6em] mb-6 font-bold"
            >
              Customer Protection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-[clamp(3rem,10vw,8rem)] font-bold leading-none tracking-tight"
            >
              Refund & Cancellation
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
                Clear policies to ensure your peace of mind when shopping with Kangpack.
              </h2>
              <div className="h-[2px] w-[80px] bg-[#6B4A2D] mb-8" />
              <p className="text-[#8B7E6F] text-[18px] leading-relaxed max-w-4xl font-medium">
                We want you to be completely satisfied with your purchase. This policy outlines our cancellation and refund procedures to ensure transparency and fairness.
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

              {/* Cancellation Policy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500">
                      <XCircle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      1. Cancellation Policy
                    </h3>

                    <div>
                      <h4 className="text-[20px] font-bold text-[#6B4A2D] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#6B4A2D] rounded-full" />
                        Cancellation by Customer
                      </h4>
                      <ul className="space-y-3">
                        <li className="text-[#5A544E] text-[17px] flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>Orders can be cancelled within 12 hours of placing the order or before dispatch, whichever is earlier</span>
                        </li>
                        <li className="text-[#5A544E] text-[17px] flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>Once the product is shipped, cancellation requests will not be accepted</span>
                        </li>
                        <li className="text-[#5A544E] text-[17px] flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>To cancel, email: support@kangpack.in with Order ID</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <h4 className="text-[20px] font-bold text-[#6B4A2D] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#6B4A2D] rounded-full" />
                        Cancellation by Company
                      </h4>
                      <p className="text-[#5A544E] text-[17px] mb-3">
                        Pannovationz reserves the right to cancel orders in case of:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {["Pricing errors", "Stock unavailability", "Payment verification issues", "Suspected fraudulent transactions"].map((item, i) => (
                          <div key={i} className="text-[#5A544E] text-[17px] flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full mt-2.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#F9F7F4] rounded-xl p-4 flex items-start gap-3 mt-4">
                        <Clock className="w-5 h-5 text-[#6B4A2D] mt-0.5 flex-shrink-0" />
                        <p className="text-[#6B4A2D] text-[16px] font-medium">
                          In such cases, full refunds will be processed within 7–10 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Refund Policy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      2. Refund Policy
                    </h3>

                    <p className="text-[#5A544E] text-[18px]">
                      Refunds are applicable only in the following cases:
                    </p>

                    <ul className="space-y-3">
                      {["Product received is damaged during transit", "Product is defective", "Wrong product delivered"].map((item, i) => (
                        <li key={i} className="text-[#5A544E] text-[17px] flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-[#6B4A2D] font-bold mb-2">Important Notice</h4>
                          <p className="text-[#5A544E] text-[16px] mb-3">
                            Customers must notify us within 48 hours of delivery with:
                          </p>
                          <ul className="space-y-1 text-[#5A544E] text-[16px]">
                            {["Order ID", "Clear images/video of the product", "Description of issue"].map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-amber-600 rounded-full" />
                                {item}
                              </li>
                            ))}
                          </ul>
                          <p className="text-[#5A544E] text-[15px] mt-3 italic">
                            Failure to report within 48 hours may result in rejection of the claim.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Non-Refundable */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500">
                      <XCircle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight flex items-center gap-2">
                      3. Non-Refundable Situations
                    </h3>
                    <p className="text-[#5A544E] text-[18px]">
                      Refunds will NOT be provided for:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {["Change of mind", "Minor cosmetic variations", "Misuse or improper handling", "Products returned without original packaging"].map((item, i) => (
                        <div key={i} className="text-[#5A544E] text-[17px] flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Refund Processing */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      4. Refund Processing
                    </h3>
                    <div className="space-y-4">
                      {[
                        { icon: CheckCircle, color: "green", title: "Refund Method", desc: "Approved refunds will be credited to the original payment method" },
                        { icon: Clock, color: "blue", title: "Processing Timeline", desc: "7–10 business days from approval" },
                        { icon: AlertCircle, color: "amber", title: "Shipping Charges", desc: "Non-refundable unless the return is due to our error" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                            <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                          </div>
                          <div>
                            <p className="text-[#6B4A2D] font-medium mb-1">{item.title}</p>
                            <p className="text-[#5A544E] text-[16px]">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default RefundCancellation;
