"use client";
import React from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { ASSETS } from "@/constants/assets";

const WhyChoose: React.FC = () => {
  return (
    <section className="bg-[#F8F5F0] py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[60%] bg-[#E8E2DA] rounded-full blur-[100px] transform -rotate-12"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#E8E2DA] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3"
          >
            <Shield className="w-3 h-3 brand-primary" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
              Benefits
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
          >
            <span className="text-primary font-bold">Why Choose </span>
            <span className="heading-gradient font-bold px-1">Kangpack?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="light-text text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore a smarter way to work on the move. Kangpack blends comfort,
            mobility, and smart design to keep you productive anywhere.
          </motion.p>
        </div>

        {/* Bento Grid Layout - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* LEFT COLUMN */}
          <div className="md:col-span-6 flex flex-col gap-4 sm:gap-5">
            {/* Hands-Free Workstation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[220px] sm:h-[280px] md:h-[340px]"
            >
              <img
                src={ASSETS.BENEFITS.CARD_1ST}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                alt="Hands-Free Workstation"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 sm:p-7 md:p-8 flex flex-col justify-end">
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1 leading-tight">
                  Hands-Free Workstation
                </h3>
                <p className="text-white/75 text-xs sm:text-sm max-w-xs leading-relaxed">
                  Work comfortably without needing a desk, table or surface.
                </p>
              </div>
            </motion.div>

            {/* Bottom Row - 98% and Radiation Shield */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* 98% Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#E5E2DA] rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-[160px] sm:h-[180px] md:h-[200px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-brown leading-none">
                    98%
                  </h4>
                  <p className="text-brand-brown/50 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mt-1.5">
                    Satisfaction rate
                  </p>
                </div>
                <div className="flex -space-x-2 mt-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#E5E2DA] shadow-xs group-hover:-translate-y-1 transition-transform"
                      style={{ transitionDelay: `${i * 30}ms` }}
                      alt="user"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Radiation Shield Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="btn-premium rounded-2xl sm:rounded-3xl flex items-center justify-between shadow-md hover:shadow-xl relative overflow-hidden h-[160px] sm:h-[180px] md:h-[200px] group p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 border-none"
              >
                <div className="relative z-10 flex-shrink-0">
                  <h4 className="text-white text-left text-base sm:text-lg font-bold leading-tight">
                    Radiation
                    <span className="block opacity-75 font-normal text-xs mt-0.5">
                      Shield Protection
                    </span>
                  </h4>
                </div>

                <div className="relative z-10">
                  <img
                    src={ASSETS.BENEFITS.CARD_4TH}
                    className="w-16 sm:w-20 md:w-24 h-auto drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                    alt="Radiation Shield"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-6 flex flex-col gap-4 sm:gap-5">
            {/* Top Row - Ergonomic Support and 1.8 Kg */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* Ergonomic Support Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="sm:col-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[180px] sm:h-[180px] md:h-[200px]"
              >
                <img
                  src={ASSETS.BENEFITS.CARD_2ND}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  alt="Ergonomic Support"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 sm:p-6 flex flex-col justify-end">
                  <h3 className="text-white text-base sm:text-lg md:text-xl font-bold leading-tight">
                    Ergonomic Support
                  </h3>
                </div>
              </motion.div>

              {/* 1.8 Kg Card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="sm:col-span-1 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-[#E5E2DA] flex flex-col p-4 sm:p-5 h-[160px] sm:h-[180px] md:h-[200px]"
              >
                <div className="mb-2">
                  <h4 className="text-2xl sm:text-3xl font-bold text-brand-brown leading-none">
                    1.8 Kg
                  </h4>
                  <p className="text-brand-brown/50 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mt-1">
                    Leather build
                  </p>
                </div>
                <div className="flex items-center justify-center mt-auto">
                  <img
                    src={ASSETS.BENEFITS.CARD_3RD}
                    className="w-20 sm:w-24 h-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                    alt="Leather Bag"
                  />
                </div>
              </motion.div>
            </div>

            {/* Confident Commuting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[220px] sm:h-[280px] md:h-[340px]"
            >
              <img
                src={ASSETS.BENEFITS.CARD_5TH}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                alt="Confident Commuting"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-5 sm:p-7 md:p-8 flex flex-col justify-end">
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                  Confident Commuting
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
