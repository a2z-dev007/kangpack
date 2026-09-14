"use client";
import React from "react";
import { motion } from "framer-motion";
import side2 from "@/assets/side2.png";
import { Laptop, Briefcase, User, Zap, ArrowUpRight } from "lucide-react";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import Link from "next/link";

const Features: React.FC = () => {
  const {
    isOpen,
    images,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  const features = [
    {
      icon: <Laptop className="w-5 h-5 text-brand-brown" />,
      title: "Hands free work",
      desc: "Work comfortably without needing a desk or table",
    },
    {
      icon: <Briefcase className="w-5 h-5 text-brand-brown" />,
      title: "Built for mobility",
      desc: "Designed for commuting, travel & public spaces",
    },
    {
      icon: <User className="w-5 h-5 text-brand-brown" />,
      title: "Ergonomic Design",
      desc: "Balanced support for stability, comfort & posture.",
    },
    {
      icon: <Zap className="w-5 h-5 text-brand-brown" />,
      title: "Instant Access",
      desc: "Open, work & move without setup or friction",
    },
  ];

  return (
    <section className="bg-brand-beige py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[60%] bg-[#E8E2DA] rounded-full blur-[100px] transform -rotate-12"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#E8E2DA] rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between mb-8 sm:mb-10 md:mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/4 shrink-0"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full"></div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
                About Kangpack
              </span>
            </div>
          </motion.div>
          <div className="w-full md:w-3/4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.2]">
              <motion.span
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-1.5 heading-gradient"
              >
                We turn mobility into productivity, redefining how modern
                professionals work on the move.
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-[#B8AFA1]"
              >
                A wearable workstation designed for comfort, focus, and freedom
                anywhere.
              </motion.span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch bg-[#EEEAE2] p-3 sm:p-4 rounded-[28px] shadow-sm">
          {/* Feature List Column */}
          <div className="flex-1 flex flex-col justify-between gap-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/60 backdrop-blur-sm p-4 sm:p-5 rounded-2xl flex items-center gap-4 hover:bg-white transition-all duration-300 cursor-default group border border-white/40 shadow-xs hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                  <div className="text-primary">{f.icon}</div>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-0.5 text-base sm:text-lg">
                    {f.title}
                  </h4>
                  <p className="text-primary/60 text-xs sm:text-sm font-medium leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
            {/* More About Us Button */}
            <Link href="/about" className="block mt-1">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="btn-premium p-4 sm:p-5 rounded-2xl flex items-center justify-between group transition-all shadow-md hover:shadow-lg border-none cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base tracking-wide uppercase">
                  More about us
                </span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.div>
            </Link>
          </div>

          {/* Large Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-[48%] min-h-[280px] sm:min-h-[380px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-md relative cursor-pointer group"
            onClick={() => openLightbox([side2.src], 0)}
          >
            <img
              src={side2.src}
              alt="Person using Kangpack"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
          </motion.div>
        </div>
      </div>

      <Lightbox
        isOpen={isOpen}
        images={images}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
      />
    </section>
  );
};

export default Features;
