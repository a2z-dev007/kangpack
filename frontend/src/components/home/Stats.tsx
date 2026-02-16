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
    <section className="bg-[#F8F5F1] py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12 md:mb-16">
          {/* Badge Column */}
          <div className="w-full lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="w-2.5 h-2.5 bg-brand-premium rounded-[2px]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B4A2D]/60 mt-0.5">
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
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.2] tracking-tight text-left max-w-4xl"
            >
              <span className="heading-gradient underline decoration-primary/20 underline-offset-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={`group ${index === 2 ? "md:col-span-1" : ""}`}
            >
              {/* Number and Suffix */}
              <div className="text-6xl md:text-7xl lg:text-8xl font-black text-[#6B4A2D] leading-none mb-6 flex items-baseline">
                <SlotCounter
                  value={stat.value}
                  duration={2}
                  animateOnVisible={{
                    triggerOnce: true,
                    rootMargin: "0px 0px -100px 0px",
                  }}
                />
                <span className="ml-1">{stat.suffix}</span>
              </div>

              {/* Divider Line */}
              <div className="w-full h-[1px] bg-[#6B4A2D]/10 mb-6" />

              {/* Label and Description */}
              <h4 className="text-lg md:text-xl font-bold text-[#6B4A2D] mb-2 tracking-tight">
                {stat.label}
              </h4>
              <p className="text-sm md:text-base text-[#B8AFA1] font-medium leading-relaxed max-w-sm">
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
