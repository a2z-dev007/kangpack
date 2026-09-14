"use client";
import React from "react";
import { motion } from "framer-motion";
import PrimaryButton from "../common/PrimaryButton";
import { ASSETS } from "@/constants/assets";
import Link from "next/link";

const TechSpecs: React.FC = () => {
  const specs = [
    { label: "Product Weight", value: "1.8 kg (with harness)" },
    { label: "Laptop Compatibility", value: "Up to 16-inch laptops" },
    { label: "Material Composition", value: "Genuine leather, durable fabric" },
    { label: "Water Resistance", value: "Water-repellent exterior" },
    {
      label: "Safety Features",
      value: "Radiation-shield padding (specific models)",
    },
    { label: "Warranty", value: "1-year limited warranty" },
    { label: "Dimensions", value: "16.5\" x 12\" x 4.5\"" },
    { label: "Hardware", value: "Matte black steel" },
    { label: "Exterior", value: "Full-grain leather" },
    { label: "Frame", value: "Aluminum alloy" },
    { label: "Grip Pads", value: "Silicone anti-slip" },
    { label: "Cleaning", value: "Damp cloth", fullRow: true },
    { label: "Storage", value: "Cool & dry place" },
  ];

  return (
    <section className="bg-transparent py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
        {/* Left Column: Image & Intro */}
        <div className="flex-1 w-full lg:sticky lg:top-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-md mb-6 h-[260px] sm:h-[360px] md:h-[460px] lg:h-[520px] group"
          >
            <img
              src={ASSETS.TICKERS.FIRST}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              alt="Technical Details"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl leading-[1.35] text-[#6B4A2D] font-normal">
              <span className="font-bold">Designed for</span>{" "}
              <span className="text-[#8B7E6F]">work anywhere.</span> Built for{" "}
              <span className="font-bold">comfort</span>,{" "}
              <span className="font-bold">balance</span>, and{" "}
              <span className="font-bold">productivity</span>{" "}
              <span className="text-[#8B7E6F]">on the move.</span>
            </h3>
            <div className="mt-6">
              <Link href="/products">
                <PrimaryButton className="btn-premium">Shop Now</PrimaryButton>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Specifications */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="mb-8 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3"
            >
              <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full"></div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
                Technical Detail
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="heading-gradient">Technical </span>
              <span className="text-[#B8AFA1]">Specifications</span>
            </motion.h2>
          </div>

          <div className="w-full space-y-0 text-xs sm:text-sm md:text-base">
            {specs.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`flex ${s.fullRow ? "flex-col py-4" : "justify-between items-center py-3.5 sm:py-4"} border-b border-[#6B4A2D]/10 hover:bg-[#6B4A2D]/5 px-2 rounded-lg transition-colors`}
              >
                <span
                  className={`text-[#8B7E6F] font-normal ${s.fullRow ? "mb-1 text-left" : ""}`}
                >
                  {s.label}
                </span>
                <span
                  className={`text-[#6B4A2D] font-semibold transition-colors ${
                    s.fullRow
                      ? "text-left w-full block text-xs sm:text-sm tracking-wide"
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
