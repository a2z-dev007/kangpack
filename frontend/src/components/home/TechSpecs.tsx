"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ASSETS } from "@/constants/assets";
import PrimaryButton from "@/components/common/PrimaryButton";
import { ParallaxImage } from "@/components/common/ScrollSection";

const TechSpecs: React.FC = () => {
  const specs = [
    { label: "Tray Size (Unfolded)", value: '16" × 11" × 0.5"' },
    { label: "Tray Size (Folded)", value: '11" × 8" × 2"' },
    { label: "Weight", value: "820 g (1.8 lbs)" },
    { label: "Load Capacity", value: "Up to 3.6 kg" },
    { label: "Laptop Fit", value: '13" – 15.6"' },
    { label: "Chest Fit", value: '32" – 48"', fullRow: true },
    { label: "Exterior", value: "Full-grain leather" },
    { label: "Frame", value: "Aluminum alloy" },
    { label: "Adjustability", value: "Fully adjustable" },
    { label: "Exterior", value: "Full-grain leather" },
    { label: "Frame", value: "Aluminum alloy" },
    { label: "Grip Pads", value: "Silicone anti-slip" },
    { label: "Cleaning", value: "Damp cloth", fullRow: true },
    { label: "Storage", value: "Cool & dry place" },
  ];

  return (
    <section className="bg-[#0a0a0a] text-white py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Image & Intro */}
        <div className="flex-1 w-full lg:sticky lg:top-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(255,255,255,0.05)] ring-1 ring-white/10 mb-10 h-[500px] md:h-[600px] group"
          >
            <ParallaxImage
              src={ASSETS.TICKERS.FIRST}
              className="w-full h-full"
              alt="Technical Details"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="max-w-lg"
          >
            <h3 className="text-2xl md:text-3xl leading-[1.3] text-white font-normal">
              <span className="font-bold">Designed for</span>{" "}
              <span className="text-white/40">work anywhere.</span> Built for{" "}
              <span className="font-bold">comfort</span>,{" "}
              <span className="font-bold">balance</span>, and{" "}
              <span className="font-bold">productivity</span>{" "}
              <span className="text-white/40">on the move.</span>
            </h3>
            <div className="mt-8">
              <PrimaryButton className="bg-white text-black font-semibold hover:scale-105 transition-transform" textColor="#000" circleColor="#000" hoverTextColor="#fff">Buy Now</PrimaryButton>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Specifications */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="mb-12 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/5 px-4 py-2 rounded-lg mb-6"
            >
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
              <span className="text-[11px] font-medium tracking-wide text-white/80 uppercase">
                Technical Detail
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="text-4xl md:text-6xl leading-[1] tracking-tight flex flex-col font-bold"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Technical</span>
              <span className="text-white/40">Specifications</span>
            </motion.h2>
          </div>

          <div className="w-full space-y-0 text-[16px] md:text-[18px] xl:text-[20px]">
            {specs.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.05 }}
                className={`flex ${s.fullRow ? "flex-col py-6" : "justify-between items-center py-5"} border-b border-white/10`}
              >
                <span
                  className={`text-white/40 font-normal ${s.fullRow ? "mb-4 text-left" : ""}`}
                >
                  {s.label}
                </span>
                <span
                  className={`text-white font-medium transition-colors ${
                    s.fullRow
                      ? "text-center w-full block text-base md:text-lg tracking-wide"
                      : "text-right ml-4"
                  }`}
                >
                  {s.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSpecs;
