"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { ASSETS } from "@/constants/assets";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

import PrimaryButton from "@/components/common/PrimaryButton";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { ParallaxImage } from "@/components/common/ScrollSection";

const RealMoments: React.FC = () => {
  const images = [
    ASSETS.TICKERS.MAIN,
    ASSETS.TICKERS.MAIN2,
    ASSETS.TICKERS.FIRST,
    ASSETS.TICKERS.SECOND,
    ASSETS.TICKERS.SIDE,
    ASSETS.TICKERS.IMG_354A7767,
    ASSETS.TICKERS.IMG_354A7762,
    ASSETS.TICKERS.IMG_354A7756,
  ];

  const {
    isOpen,
    images: lightboxImages,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-6 ">
        {/* Header */}
        <div className="text-center flex flex-col items-center mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-8"
          >
            <Camera className="w-3.5 h-3.5 brand-primary" />
            <span className="text-[11px] font-medium tracking-wide brand-primary uppercase">
              Real Moments
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-6xl leading-[1.1] mb-6 tracking-tight font-bold"
          >
            <span className="heading-gradient">Designed for Real Life</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="light-text text-base md:text-lg xl:text-xl max-w-2xl mx-auto leading-relaxed mb-12 xl:mb-16 text-center"
          >
            Explore Kangpack in everyday moments — crafted for movement,
            comfort, and modern work.
          </motion.p>

          {/* Action Button */}
          <PrimaryButton className="btn-premium">Shop Now</PrimaryButton>
        </div>
      </div>

      {/* Swiper Slider - Outside of max-w-7xl to center based on screen width */}
      <div className="relative mt-12 w-full overflow-visible px-4">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="real-moments-swiper !overflow-visible"
        >
          {images.map((img, index) => (
            <SwiperSlide
              key={index}
              className="!flex justify-center items-center !w-[300px] md:!w-[450px] xl:!w-[400px] 2xl:!w-[550px] cursor-pointer"
              onClick={() => openLightbox(images, index)}
            >
              <div className="relative aspect-[4/5] xl:aspect-[3/4] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border-[8px] border-white mx-auto">
                <ParallaxImage
                  src={img}
                  alt={`Real Moment ${index + 1}`}
                  className="w-full h-full"
                />
                {/* Subtle radial overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Lightbox
        isOpen={isOpen}
        images={lightboxImages}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
      />
    </section>
  );
};

export default RealMoments;
