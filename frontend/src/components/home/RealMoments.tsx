"use client";
import React from "react";
import { Camera } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import PrimaryButton from "../common/PrimaryButton";
import { ASSETS } from "@/constants/assets";
import { motion } from "framer-motion";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import Link from "next/link";

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
    <section className="py-12 sm:py-14 md:py-16 lg:py-20 overflow-hidden bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center mb-8 sm:mb-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3"
          >
            <Camera className="w-3.5 h-3.5 brand-primary" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
              Real Moments
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
          >
            <span className="heading-gradient">Designed for Real Life</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="light-text text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-6 text-center"
          >
            Explore Kangpack in everyday moments — crafted for movement,
            comfort, and modern work.
          </motion.p>

          {/* Action Button */}
          <Link href="/products">
            <PrimaryButton className="btn-premium">Shop Now</PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Swiper Slider */}
      <div className="relative mt-6 sm:mt-8 w-full overflow-visible px-4">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 80,
            modifier: 2,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="real-moments-swiper !overflow-visible"
        >
          {images.map((img, index) => (
            <SwiperSlide
              key={index}
              className="!flex justify-center items-center !w-[250px] sm:!w-[320px] md:!w-[400px] cursor-pointer"
              onClick={() => openLightbox(images, index)}
            >
              <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl md:rounded-[36px] overflow-hidden shadow-xl border-[4px] sm:border-[6px] md:border-[8px] border-white mx-auto hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={img}
                  alt={`Real Moment ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
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
