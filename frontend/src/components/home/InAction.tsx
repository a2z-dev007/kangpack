"use client";
import React from "react";
import { Play } from "lucide-react";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { motion } from "framer-motion";

const InAction: React.FC = () => {
  const {
    isOpen,
    images,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  return (
    <section className="bg-brand-beige py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col items-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3 text-center">
        <Play className="w-3 h-3 fill-[#6B4A2D] text-[#6B4A2D]" />
        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#6B4A2D] uppercase">
          In Action
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-3">
        <span className="heading-gradient">In Action.</span>
      </h2>

      {/* Description */}
      <p className="light-text text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed text-center mb-8 sm:mb-10 md:mb-12">
        See how Kangpack transforms any space into a hands-free mobile
        workspace.
      </p>

      <div className="w-full max-w-5xl">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-video rounded-2xl sm:rounded-3xl md:rounded-[36px] overflow-hidden shadow-xl group cursor-pointer"
          onClick={() =>
            openLightbox(
              ["https://picsum.photos/seed/action_video/1920/1080"],
              0,
            )
          }
        >
          <img
            src="https://picsum.photos/seed/action_video/1920/1080"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            alt="In Action"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:bg-white/40 transition-all"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-[#6B4A2D] text-[#6B4A2D] ml-0.5" />
              </div>
            </motion.div>
          </div>
        </motion.div>
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

export default InAction;
