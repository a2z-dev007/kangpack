"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { ASSETS } from "@/constants/assets";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { ParallaxImage } from "@/components/common/ScrollSection";

const OfficeAnywhere: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // All images from the tickers folder
  const carouselImages = [
    ASSETS.TICKERS.MAIN,
    ASSETS.TICKERS.IMG_354A7762,
    ASSETS.TICKERS.IMG_354A7767,
    ASSETS.TICKERS.IMG_354A7756,
    ASSETS.TICKERS.IMG_354A7724,
    ASSETS.TICKERS.IMG_354A7751,
    ASSETS.TICKERS.MAIN2,
    ASSETS.TICKERS.FIRST,
    ASSETS.TICKERS.SECOND,
    ASSETS.TICKERS.SIDE,
  ];

  const {
    isOpen,
    images,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  useEffect(() => {
    const updateConstraints = () => {
      if (scrollContainerRef.current) {
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        const clientWidth = scrollContainerRef.current.clientWidth;
        setDragConstraints({
          left: -(scrollWidth - clientWidth),
          right: 0,
        });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Adjust based on card width + gap
      const newScrollPosition =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#f5f2ee] text-[#1a1a1a] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="inline-flex items-center gap-2 bg-[#1a1a1a]/8 backdrop-blur-md px-4 py-2 rounded-lg mb-6 border border-[#a67c52]/20"
          >
            <ImageIcon className="w-3 h-3 text-[#a67c52]" />
            <span className="text-[11px] font-medium tracking-wide text-[#1a1a1a]/70 uppercase">
              The Experience
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-6xl leading-[1.1] mb-6 tracking-tight font-bold"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] to-[#1a1a1a]/50">Your Office Anywhere</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="text-[#1a1a1a]/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Turn any space into productive workspace instantly, comfortably,
            effortlessly.
          </motion.p>
        </div>
      </div>

      {/* Carousel - Centered with draggable */}
      <div className="relative group">
        {/* Previous Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur-xl border border-[#a67c52]/20 hover:bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur-xl border border-[#a67c52]/20 hover:bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-[#1a1a1a]" />
        </button>

        <div
          ref={scrollContainerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <motion.div
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            dragMomentum={true}
            className="flex gap-4 md:gap-6 py-4 px-10"
            style={{
              width: "max-content",
            }}
          >
            {carouselImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[280px] md:w-[450px] xl:w-[550px] h-[350px] md:h-[450px] xl:h-[550px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 hover:shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition-shadow duration-300 cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => openLightbox(carouselImages, index)}
              >
                <ParallaxImage
                  src={image}
                  className="w-full h-full"
                  alt={`Office scene ${index + 1}`}
                />
              </motion.div>
            ))}
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

export default OfficeAnywhere;
