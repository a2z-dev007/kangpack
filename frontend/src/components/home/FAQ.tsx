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
    <section className="bg-transparent py-24 md:py-32 xl:py-48 2xl:py-60 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        {/* Left Header Section */}
        <div className="lg:w-[450px] lg:sticky lg:top-32 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-6">
            <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full"></div>
            <span className="text-[11px] font-medium tracking-wide brand-primary uppercase">
              Common Questions
            </span>
          </div>

          <h2 className="text-[clamp(1.8rem,6vw,4rem)] md:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[0.95] mb-8 xl:mb-12 tracking-tighter">
            <span className="heading-gradient font-bold">FAQ's</span>
            <br />
            <span className="text-[#B8AFA1] font-bold">Asked</span>
          </h2>
          <p className="light-text text-[16px] md:text-lg xl:text-xl leading-relaxed max-w-[400px] mb-10 lg:mb-0">
            Find quick answers to common questions about Kangpack usage, care,
            and support essentials.
          </p>
        </div>

        {/* Right FAQ List section */}
        <div className="w-full flex-grow">
          <div className="border-t border-[#6B4A2D]/10">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[#6B4A2D]/10">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 md:py-10 xl:py-12 2xl:py-14 text-left group transition-all"
                >
                  <div className="flex items-center gap-6 md:gap-24">
                    <span className="text-[12px] md:text-[16px] text-[#6B4A2D]/40 font-mono w-6 md:w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[15px] md:text-[20px] xl:text-[24px] 2xl:text-[28px] font-bold md:font-medium tracking-tight transition-colors duration-300 ${openIndex === i ? "text-[#6B4A2D]" : "text-[#6B4A2D]/80 group-hover:text-[#6B4A2D]"}`}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === i ? "btn-premium" : "text-[#6B4A2D] border border-black/5"}`}
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
                      <p className="pb-8 pl-12 md:pl-[120px] lg:pl-[136px] xl:pl-[160px] text-[#8B7E6F] leading-relaxed text-[15px] md:text-[18px] xl:text-[20px] max-w-4xl">
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
