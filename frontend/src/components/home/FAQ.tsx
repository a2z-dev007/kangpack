"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is Kangpack?",
      a: "Kangpack is a wearable workstation designed for professionals who work on the go.",
    },
    {
      q: "How does Kangpack work?",
      a: "It uses an ergonomic harness and a stable tray to provide a desk-like surface anywhere.",
    },
    {
      q: "What laptop sizes does it support?",
      a: "It supports laptops from 13 inches to 15.6 inches comfortably.",
    },
    {
      q: "Is it comfortable for long use?",
      a: "Yes, its ergonomic design distributes weight across your shoulders and back.",
    },
    {
      q: "Can I walk or stand while using it?",
      a: "Absolutely! It's designed for use while standing, walking, or sitting.",
    },
    {
      q: "Is Kangpack heavy?",
      a: "No, it weighs only 820g, which is lighter than many typical leather backpacks.",
    },
    {
      q: "Does it protect my laptop?",
      a: "Yes, it features padding and a radiation shield (on specific models).",
    },
    {
      q: "Is it suitable for travel and public spaces?",
      a: "Perfectly! It's ideal for trains, airports, and waiting lines.",
    },
  ];

  return (
    <section className="bg-[#f5f2ee] text-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Header Section */}
        <div className="lg:w-[450px] lg:sticky lg:top-32 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a]/8 backdrop-blur-md border border-[#a67c52]/20 px-4 py-2 rounded-lg mb-6">
            <div className="w-1.5 h-1.5 bg-[#a67c52] rounded-full"></div>
            <span className="text-[11px] font-medium tracking-wide text-[#1a1a1a]/70 uppercase">
              Common Questions
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl leading-[1.1] mb-6 tracking-tighter font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] to-[#1a1a1a]/50">FAQ's</span>
            <br />
            <span className="text-[#1a1a1a]/40">Asked</span>
          </h2>
          <p className="text-[#1a1a1a]/40 text-[16px] md:text-lg xl:text-xl leading-relaxed max-w-[400px] mb-10 lg:mb-0">
            Find quick answers to common questions about Kangpack usage, care,
            and support essentials.
          </p>
        </div>

        {/* Right FAQ List section */}
        <div className="w-full flex-grow">
          <div className="border-t border-[#a67c52]/20">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[#a67c52]/20">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 md:py-10 xl:py-12 2xl:py-14 text-left group transition-all"
                >
                  <div className="flex items-center gap-6 md:gap-24">
                    <span className="text-[12px] md:text-[16px] text-[#1a1a1a]/40 font-mono w-6 md:w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[15px] md:text-[20px] xl:text-[24px] 2xl:text-[28px] font-bold md:font-medium tracking-tight transition-colors duration-300 ${openIndex === i ? "text-[#1a1a1a]" : "text-[#1a1a1a]/60 group-hover:text-[#1a1a1a]"}`}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === i ? "bg-[#1a1a1a] text-white" : "text-[#1a1a1a]/60 border border-[#a67c52]/30"}`}
                    >
                      {openIndex === i ? (
                        <Minus className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <Plus className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-90" />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence mode="wait">
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 pl-12 md:pl-[120px] lg:pl-[136px] xl:pl-[160px] text-[#1a1a1a]/50 leading-relaxed text-[15px] md:text-[18px] xl:text-[20px] max-w-4xl">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
