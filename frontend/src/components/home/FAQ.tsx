"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What makes Kangpack different from regular backpacks?",
      a: "Kangpack is specifically designed as a wearable mobile workstation that lets you work hands-free anywhere, combining ergonomic balance, laptop protection, and instant access.",
    },
    {
      q: "Can I use Kangpack while walking or standing?",
      a: "Yes! The harness and support structure keep your laptop stable and secure while standing or moving.",
    },
    {
      q: "What laptops fit inside Kangpack?",
      a: "Kangpack comfortably accommodates laptops up to 16 inches, including MacBook Pro 16\", Dell XPS 15/16, and ThinkPad models.",
    },
    {
      q: "How does the weight distribution work?",
      a: "Our dual-point ergonomic harness distributes weight evenly across your shoulders, core, and hips, significantly reducing neck and back strain.",
    },
    {
      q: "Is it water-resistant?",
      a: "Yes, Kangpack features weather-treated full-grain leather and water-repellent ballistic fabrics with waterproof zippers.",
    },
    {
      q: "Does it protect my laptop?",
      a: "Yes, it features multi-layer shock-absorbing EVA foam padding and radiation shield technology.",
    },
    {
      q: "Is it suitable for travel and public spaces?",
      a: "Perfectly! It's TSA-compliant, compact, and ideal for trains, airports, cafes, and outdoor workspaces.",
    },
  ];

  return (
    <section className="bg-transparent py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Left Header Section */}
        <div className="lg:w-[400px] lg:sticky lg:top-24 w-full shrink-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3">
            <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full"></div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
              Common Questions
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <span className="heading-gradient font-bold">Frequently </span>
            <span className="text-[#B8AFA1] font-bold">Asked</span>
          </h2>
          <p className="light-text text-xs sm:text-sm md:text-base leading-relaxed max-w-sm mb-4 lg:mb-0">
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
                  className="w-full flex items-center justify-between py-4 sm:py-5 md:py-6 text-left group transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-6">
                    <span className="text-xs sm:text-sm text-[#6B4A2D]/40 font-mono w-5 sm:w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-sm sm:text-base md:text-lg font-bold tracking-tight transition-colors duration-200 ${
                        openIndex === i
                          ? "text-[#6B4A2D]"
                          : "text-[#6B4A2D]/80 group-hover:text-[#6B4A2D]"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        openIndex === i
                          ? "btn-premium shadow-sm"
                          : "text-[#6B4A2D] bg-[#6B4A2D]/5 group-hover:bg-[#6B4A2D]/10"
                      }`}
                    >
                      {openIndex === i ? (
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-90" />
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
                        duration: 0.35,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 sm:pb-6 pl-8 sm:pl-12 text-[#8B7E6F] leading-relaxed text-xs sm:text-sm md:text-base max-w-3xl">
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
