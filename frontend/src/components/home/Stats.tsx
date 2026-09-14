"use client";
import React from "react";
import SlotCounter from "react-slot-counter";
import { motion } from "framer-motion";

const Stats: React.FC = () => {
  const statsData = [
    {
      value: "3",
      suffix: "+",
      label: "Ways to Wear",
      description: "Backpack • Sling • Workstation",
    },
    {
      value: "95",
      suffix: "%",
      label: "Posture Stability",
      description: "Ergonomic weight balance",
    },
    {
      value: "200",
      suffix: "%",
      label: "Satisfied Clients",
      description: "With a great experience and results.",
    },
  ];

  return (
    <section className="bg-[#F8F5F1] py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Badge Column */}
          <div className="w-full lg:w-1/4 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full"
            >
              <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#6B4A2D]">
                Stats & Facts
              </span>
            </motion.div>
          </div>

          {/* Heading Column */}
          <div className="w-full lg:w-3/4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.2] text-left max-w-4xl"
            >
              <span className="heading-gradient">
                We engineer freedom for modern professionals where mobility
                meets real productivity.{" "}
              </span>
              <span className="text-[#B8AFA1]">
                Every detail is designed to remove friction, boost comfort, and
                keep you moving without slowing down.
              </span>
            </motion.h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`p-6 sm:p-7 rounded-2xl bg-white/60 border border-[#6B4A2D]/5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
                index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Number and Suffix */}
              <div className="text-5xl sm:text-6xl md:text-7xl font-black text-[#6B4A2D] leading-none mb-4 flex items-baseline tracking-tight">
                <SlotCounter
                  value={stat.value}
                  duration={2}
                  animateOnVisible={{
                    triggerOnce: true,
                    rootMargin: "0px 0px -50px 0px",
                  }}
                />
                <span className="ml-1 text-4xl sm:text-5xl text-[#A67C52]">{stat.suffix}</span>
              </div>

              {/* Divider Line */}
              <div className="w-full h-[1px] bg-[#6B4A2D]/10 mb-4" />

              {/* Label and Description */}
              <h4 className="text-lg sm:text-xl font-bold text-[#6B4A2D] mb-1 tracking-tight">
                {stat.label}
              </h4>
              <p className="text-xs sm:text-sm text-[#8B7E6F] font-medium leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
