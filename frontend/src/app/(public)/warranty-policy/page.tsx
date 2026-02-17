"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, AlertCircle, Mail } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";

const WarrantyPolicy: React.FC = () => {
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
              alt="Warranty Policy"
            />
          </div>

          <div className="relative z-20 text-center px-6 w-full max-w-none flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/90 text-[12px] md:text-[14px] uppercase tracking-[0.6em] mb-6 font-bold"
            >
              Product Protection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-[clamp(3.5rem,10vw,8rem)] font-bold leading-none tracking-tight"
            >
              Warranty Policy
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
                6-Month Limited Manufacturing Warranty covering defects in materials and workmanship.
              </h2>
              <div className="h-[2px] w-[80px] bg-[#6B4A2D] mb-8" />
              <p className="text-[#8B7E6F] text-[18px] leading-relaxed max-w-4xl font-medium">
                We stand behind the quality of our products. This warranty ensures that your Kangpack is protected against manufacturing defects from the date of delivery.
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

              {/* Warranty Coverage */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      1. Limited Warranty Coverage
                    </h3>

                    <p className="text-[#5A544E] text-[18px]">
                      Kangpack products are covered under a <span className="font-bold text-[#6B4A2D]">6-Month Limited Manufacturing Warranty</span> from the date of delivery.
                    </p>

                    <div className="bg-[#F9F7F4] rounded-2xl p-6">
                      <h4 className="text-xl font-bold text-[#6B4A2D] mb-4">This covers:</h4>
                      <ul className="space-y-3">
                        {["Stitching defects", "Zipper malfunction", "Structural manufacturing faults"].map((item, i) => (
                          <li key={i} className="text-[#5A544E] text-[17px] flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Warranty Exclusions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                      <XCircle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      2. Warranty Exclusions
                    </h3>

                    <p className="text-[#5A544E] text-[18px]">
                      Warranty does <span className="font-bold text-red-600">NOT</span> cover:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Normal wear and tear", "Accidental damage", "Water damage", "Burns or cuts", "Unauthorized modification", "Damage due to misuse"].map((item, i) => (
                        <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-[#5A544E] text-[16px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Radiation Shield Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 border-b border-black/5 md:px-[8%] lg:px-[12%]"
              >
                <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-[24px] font-bold text-amber-900 tracking-tight mb-3">
                        3. Radiation Shield Disclaimer
                      </h3>
                      <p className="text-amber-800 text-[17px] leading-relaxed">
                        The radiation shield variant is designed to reduce EMF exposure. However:
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 ml-16">
                    <li className="text-amber-800 text-[17px] flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2.5 flex-shrink-0" />
                      <span>It is <span className="font-bold">not a certified medical device</span></span>
                    </li>
                    <li className="text-amber-800 text-[17px] flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2.5 flex-shrink-0" />
                      <span>It does <span className="font-bold">not guarantee complete elimination</span> of electromagnetic radiation</span>
                    </li>
                    <li className="text-amber-800 text-[17px] flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-amber-700 rounded-full mt-2.5 flex-shrink-0" />
                      <span><span className="font-bold">No health claims</span> are implied</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Warranty Claim Process */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500">
                      <Mail className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <h3 className="text-[24px] font-bold text-[#6B4A2D] tracking-tight">
                      4. Warranty Claim Process
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { step: "1", title: "Contact Support", desc: "Email support@kangpack.in with your Order ID" },
                        { step: "2", title: "Provide Evidence", desc: "Include clear images of the defect" },
                        { step: "3", title: "Describe Issue", desc: "Provide a detailed description of the problem" },
                        { step: "4", title: "Await Review", desc: "Our team will review and respond within 48 hours" }
                      ].map((item, i) => (
                        <div key={i} className="bg-[#F9F7F4] rounded-2xl p-6 border border-[#6B4A2D]/5">
                          <div className="w-12 h-12 bg-[#6B4A2D] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                            {item.step}
                          </div>
                          <h4 className="text-xl font-bold text-[#6B4A2D] mb-2">{item.title}</h4>
                          <p className="text-[#5A544E] text-[16px]">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="text-[#6B4A2D] font-bold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Resolution Options
                      </h4>
                      <p className="text-[#5A544E] text-[16px] mb-3">
                        If approved, we may:
                      </p>
                      <ul className="space-y-2">
                        {["Repair the product", "Replace the product", "Offer store credit"].map((item, i) => (
                          <li key={i} className="text-[#5A544E] text-[16px] flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[#5A544E] text-[15px] mt-4 italic">
                        Decision shall be at the sole discretion of Pannovationz.
                      </p>
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

export default WarrantyPolicy;
