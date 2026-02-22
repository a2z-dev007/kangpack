"use client";
import React from "react";
import { motion } from "framer-motion";
import side2 from "@/assets/side2.png";
import { Laptop, Briefcase, User, Zap, ArrowUpRight } from "lucide-react";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { ParallaxImage, FadeInScale } from "@/components/common/ScrollSection";

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
      icon: <Laptop className="w-5 h-5 text-white/80" />,
      title: "Hands free work",
      desc: "Work comfortably without needing a desk or table",
    },
    {
      icon: <Briefcase className="w-5 h-5 text-white/80" />,
      title: "Built for mobility",
      desc: "Designed for commuting, travel & public spaces",
    },
    {
      icon: <User className="w-5 h-5 text-white/80" />,
      title: "Ergonomic Design",
      desc: "Balanced support for stability, comfort & posture.",
    },
    {
      icon: <Zap className="w-5 h-5 text-white/80" />,
      title: "Instant Access",
      desc: "Open, work & move without setup or friction",
    },
  ];

  return (
    <section className="bg-[#0a0a0a] text-white py-16 md:py-24 px-6 md:px-16 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[60%] bg-white/5 rounded-full blur-[100px] transform -rotate-12"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:justify-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            className="w-full md:w-1/3 mb-8 md:mb-0"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
              <span className="text-[11px] font-medium tracking-wide text-white/80 uppercase">
                About Kangpack
              </span>
            </div>
          </motion.div>
          <div className="w-full ">
            <h2 className="text-3xl md:text-5xl leading-[1.2] tracking-tight font-bold">
              <motion.span
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
                className="inline-block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50"
              >
                We turn mobility into productivity, redefining how modern
                professionals work on the move.
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/40 block mt-4"
              >
                A wearable workstation designed for comfort, focus, and freedom
                anywhere.
              </motion.span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-center bg-white/5 border border-white/10 p-2 rounded-[24px]">
          {/* Feature List Column */}
          <div className="flex-1 flex flex-col gap-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-6 xl:p-4 rounded-2xl flex items-center gap-6 xl:gap-4 hover:bg-white/10 transition-all cursor-default group border border-white/5 shadow-sm"
              >
                <div className="w-12 h-12 xl:w-16 xl:h-16 bg-white/10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                  <div className="text-white">{f.icon}</div>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 text-lg xl:text-xl">
                    {f.title}
                  </h4>
                  <p className="text-white/40 text-[14px] xl:text-base font-medium leading-tight">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
            {/* More About Us Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-black p-7 xl:p-5 rounded-2xl flex items-center justify-between group transition-all mt-1 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-transparent hover:border-white/50 opacity-90 hover:opacity-100"
            >
              <span className="font-bold text-base tracking-wide uppercase">
                More about us
              </span>
              <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.button>
          </div>

          {/* Large Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="lg:w-[48%] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl relative cursor-pointer"
            onClick={() => openLightbox([side2.src], 0)}
          >
            <ParallaxImage
              src={side2.src}
              alt="Person using Kangpack"
              className="w-full h-full"
            />
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
