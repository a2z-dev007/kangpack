"use client";

import React from "react";
import { motion } from "framer-motion";
import { ASSETS } from "@/constants/assets";

const InlineImage = ({
  src,
  className = "",
  rotate = 0,
}: {
  src: string;
  className?: string;
  rotate?: number;
}) => (
  <motion.div
    className={`inline-flex items-center justify-center w-[1.3em] h-[1em] rounded-[24px] overflow-hidden translate-y-[0.1em] border-[4px] border-white shadow-lg mx-1 ${className}`}
    style={{ transform: `translateY(0.1em) rotate(${rotate}deg)` }}
    whileHover={{
      y: [0, -8, 0, -5, 0, -3, 0],
      rotate: [rotate, rotate - 5, rotate + 5, rotate - 3, rotate + 3, rotate],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    }}
  >
    <img src={src} className="w-full h-full object-cover" alt="Detail" />
  </motion.div>
);

const DesignedToMove: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F9F7F4] overflow-hidden">
      {/* Top Divider */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-[1px] w-full bg-[#6B4A2D]/10" />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#F9F7F4] px-4 text-[#6B4A2D]/30 text-xs font-light select-none"
          >
            +
          </motion.div>
        </div>
      </div>

      {/* Hero Text Content */}
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <div className="flex flex-col items-center gap-1 md:gap-4">
          {/* Row 1 */}
          <div className="flex items-center flex-wrap justify-center text-[clamp(1.8rem,6vw,4rem)] md:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-bold tracking-[-0.04em] leading-[1]">
            <span className="heading-gradient">Designed to Move</span>
            <div className="inline-flex items-center ml-6 -space-x-5">
              <InlineImage
                src={ASSETS.TICKERS.SIDE}
                className="z-30"
                rotate={-5}
              />
              <InlineImage
                src={ASSETS.TICKERS.FIRST}
                className="z-20"
                rotate={0}
              />
              <InlineImage
                src={ASSETS.TICKERS.SECOND}
                className="z-10"
                rotate={5}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="text-[clamp(1.8rem,6vw,4rem)] md:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-bold tracking-[-0.04em] text-[#B8AFA1] leading-[1]">
            Built with Purpose,
          </div>

          {/* Row 3 */}
          <div className="flex items-center flex-wrap justify-center text-[clamp(2.5rem,5vw,5.5rem)] xl:text-[4vw] 2xl:text-[5vw] font-bold tracking-[-0.04em] leading-[1]">
            <InlineImage
              src={ASSETS.TICKERS.MAIN}
              rotate={-8}
              className="mr-6 "
            />
            <span className="heading-gradient">Effortless Focus</span>
          </div>

          {/* Row 4 */}
          <div className="flex items-center flex-wrap justify-center text-[clamp(1.8rem,6vw,4rem)] md:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-bold tracking-[-0.04em] leading-[1]">
            <span className="text-[#B8AFA1]">Made for</span>
            <InlineImage
              src={ASSETS.TICKERS.MAIN2}
              rotate={8}
              className="mx-6"
            />
            <span className="heading-gradient">Real Life</span>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-[1px] w-full bg-[#6B4A2D]/10" />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#F9F7F4] px-4 text-[#6B4A2D]/30 text-xs font-light select-none"
          >
            +
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DesignedToMove;
