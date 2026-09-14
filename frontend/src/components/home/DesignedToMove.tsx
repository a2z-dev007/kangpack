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
    className={`inline-flex items-center justify-center w-[1.2em] h-[0.9em] rounded-xl sm:rounded-2xl overflow-hidden translate-y-[0.08em] border-[2px] sm:border-[3px] border-white shadow-md mx-1 sm:mx-2 ${className}`}
    style={{ transform: `translateY(0.08em) rotate(${rotate}deg)` }}
    whileHover={{
      y: [0, -6, 0, -4, 0],
      rotate: [rotate, rotate - 4, rotate + 4, rotate],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    }}
  >
    <img src={src} className="w-full h-full object-cover" alt="Detail" />
  </motion.div>
);

const DesignedToMove: React.FC = () => {
  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-20 bg-[#F9F7F4] overflow-hidden">
      {/* Hero Text Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-5">
          {/* Row 1 */}
          <div className="flex items-center flex-wrap justify-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
            <span className="heading-gradient">Designed to Move</span>
            <div className="inline-flex items-center ml-2 sm:ml-4 -space-x-3 sm:-space-x-4">
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
          <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#B8AFA1] leading-[1.15]">
            Built with Purpose,
          </div>

          {/* Row 3 */}
          <div className="flex items-center flex-wrap justify-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
            <InlineImage
              src={ASSETS.TICKERS.MAIN}
              rotate={-8}
              className="mr-2 sm:mr-3"
            />
            <span className="heading-gradient">Effortless Focus</span>
          </div>

          {/* Row 4 */}
          <div className="flex items-center flex-wrap justify-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
            <span className="text-[#B8AFA1]">Made for</span>
            <InlineImage
              src={ASSETS.TICKERS.MAIN2}
              rotate={8}
              className="mx-2 sm:mx-3"
            />
            <span className="heading-gradient">Real Life</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignedToMove;
