"use client";
import React from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";

const WhyChoose: React.FC = () => {
  const images = [
    ASSETS.BENEFITS.CARD_1ST,
    ASSETS.BENEFITS.CARD_2ND,
    ASSETS.BENEFITS.CARD_3RD,
    ASSETS.BENEFITS.CARD_4TH,
    ASSETS.BENEFITS.CARD_5TH,
  ];

  return (
    <section className="bg-[#F8F5F0] py-24 md:py-32 xl:py-48 2xl:py-60 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[60%] bg-[#E8E2DA] rounded-full blur-[100px] transform -rotate-12"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#E8E2DA] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 xl:mb-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-6"
          >
            <Shield className="w-3 h-3 brand-primary" />
            <span className="text-[11px] font-medium tracking-wide brand-primary uppercase">
              Benefits
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-[clamp(1.8rem,5vw,3.5rem)] md:text-[3rem] xl:text-[3.5rem] 2xl:text-[4.5rem] leading-[1.1] mb-6 xl:mb-8 tracking-tight"
          >
            <span className="text-primary font-bold">Why Choose </span>
            <span className="heading-gradient font-bold px-1">Kangpack?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="light-text text-base md:text-lg xl:text-xl max-w-2xl mx-auto leading-relaxed px-4 xl:mb-12"
          >
            Explore a smarter way to work on the move. Kangpack blends comfort,
            mobility, and smart design to keep you productive anywhere.
          </motion.p>
        </div>

        {/* Bento Grid Layout - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 xl:gap-2">
          {/* LEFT COLUMN - Takes 6 columns on desktop, full width on mobile */}
          <div className="md:col-span-6 flex flex-col gap-4 sm:gap-5">
            {/* Hands-Free Workstation - Full width of left column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-lg h-[250px] sm:h-[280px] md:h-[350px] xl:h-[400px] 2xl:h-[450px]"
            >
              <ParallaxImage
                src={ASSETS.BENEFITS.CARD_1ST}
                className="w-full h-full"
                alt="Hands-Free Workstation"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 sm:p-8 md:p-10 xl:p-5 2xl:p-10 flex flex-col justify-end">
                <h3 className="text-white text-2xl sm:text-3xl md:text-[40px] xl:text-3xl 2xl:text-[40px] font-bold mb-2 sm:mb-1 leading-tight">
                  Hands-Free Workstation
                </h3>
                <p className="text-white/70 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-base max-w-xs">
                  Work comfortably without needing a desk, table or surface.
                </p>
              </div>
            </motion.div>

            {/* Bottom Row - 98% and Radiation Shield side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* 98% Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                className="bg-[#E5E2DA] rounded-[24px] sm:rounded-[32px] p-6 sm:p-6 md:p-8 xl:p-10 2xl:p-12 flex flex-col justify-between h-[180px] sm:h-[180px] md:h-[200px] xl:h-[250px] 2xl:h-[300px] shadow-sm group"
              >
                <div>
                  <h4 className="text-[36px] sm:text-[48px] md:text-[56px] xl:text-[44px] 2xl:text-[56px] font-black text-brand-brown leading-none">
                    98%
                  </h4>
                  <p className="text-brand-brown/40 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-widest mt-2">
                    Satisfaction rate
                  </p>
                </div>
                <div className="flex -space-x-2 sm:-space-x-3 mt-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 xl:w-8 xl:h-8 rounded-full border-2 border-[#E5E2DA] shadow-sm group-hover:translate-y-[-4px] transition-transform"
                      style={{ transitionDelay: `${i * 40}ms` }}
                      alt="user"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Radiation Shield Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                className="btn-premium rounded-[24px] sm:rounded-[32px] flex items-center justify-between shadow-lg relative overflow-hidden h-[180px] sm:h-[180px] md:h-[200px] xl:h-[250px] 2xl:h-[300px] group px-6 sm:px-4 md:px-6 py-4 sm:py-5 xl:px-8 xl:py-10 2xl:px-10 2xl:py-12 border-none"
              >
                {/* Text Section - Left Side */}
                <div className="relative z-10 flex-shrink-0">
                  <h4 className="text-white text-left text-[15px] sm:text-base md:text-[18px] lg:text-[20px] font-bold leading-tight ">
                    Radiation
                    <span className="block opacity-60 font-normal text-xs mt-1">
                      Shield Protection
                    </span>
                  </h4>
                </div>

                {/* Image Section - Right Side */}
                <div className="relative z-10">
                  <img
                    src={ASSETS.BENEFITS.CARD_4TH}
                    className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                    alt="Radiation Shield"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN - Takes 6 columns on desktop, full width on mobile */}
          <div className="md:col-span-6 flex flex-col gap-4 sm:gap-5">
            {/* Top Row - Ergonomic Support and 1.8 Kg side by side */}
            <div className="grid grid-cols-3 gap-4 sm:gap-5 h-[200px] sm:h-[180px] md:h-[280px] xl:h-[350px] 2xl:h-[400px]">
              {/* Ergonomic Support Card - Takes 2/3 of the width */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                className="col-span-2 relative rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-lg"
              >
                <ParallaxImage
                  src={ASSETS.BENEFITS.CARD_2ND}
                  className="w-full h-full"
                  alt="Ergonomic Support"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 sm:p-6 md:p-8 xl:p-2 2xl:p-8 flex flex-col justify-end">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl xl:text-2xl 2xl:text-2xl font-bold leading-tight">
                    Ergonomic Support
                  </h3>
                </div>
              </motion.div>

              {/* 1.8 Kg Card - Takes 1/3 of the width */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                className="col-span-1 relative rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-lg bg-[#E5E2DA] flex flex-col pl-4 sm:pl-5 md:pl-7 pt-4 sm:pt-5 md:pt-7"
              >
                <div className="mb-2 sm:mb-3 md:mb-4">
                  <h4 className="text-[28px] sm:text-[36px] md:text-[40px] xl:text-[32px] 2xl:text-[40px] font-bold text-brand-brown leading-none">
                    1.8 Kg
                  </h4>
                  <p className="text-brand-brown/40 text-[9px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest mt-1">
                    Leather build
                  </p>
                </div>
                <div className="flex items-center justify-center absolute bottom-0 left-0 right-0">
                  <img
                    src={ASSETS.BENEFITS.CARD_3RD}
                    className="w-full h-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                    alt="Leather Bag"
                  />
                </div>
              </motion.div>
            </div>

            {/* Confident Commuting - Full width of right column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-lg h-[250px] sm:h-[180px] md:h-[270px] xl:h-[300px] 2xl:h-[350px]"
            >
              <ParallaxImage
                src={ASSETS.BENEFITS.CARD_5TH}
                className="w-full h-full"
                alt="Confident Commuting"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 sm:p-8 md:p-10 xl:p-5 2xl:p-10 flex flex-col justify-end">
                <h3 className="text-white text-2xl sm:text-3xl md:text-[40px] xl:text-3xl 2xl:text-[40px] font-bold leading-tight">
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
