"use client";
import { ASSETS } from "@/constants/assets";
import React from "react";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { ParallaxImage } from "@/components/common/ScrollSection";
import { Lens } from "../ui/lens";

const GalleryIntro: React.FC = () => {
  const images = [
    ASSETS.TICKERS.SECOND,
    ASSETS.TICKERS.MAIN2,
    ASSETS.TICKERS.SIDE,
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
    <section className="bg-transparent py-16 md:py-24 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg mb-6 border border-white/10">
            <div className="w-1.5 h-1.5 bg-[#a67c52] rounded-full shadow-[0_0_8px_#a67c52]"></div>
            <span className="text-[11px] font-medium tracking-wide text-[#a67c52] uppercase">
              Craftsmanship
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl leading-[1.2] tracking-tight font-bold">
            <span className="heading-gradient">Elegance in Every Detail</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-4">
          <div
            className="aspect-[16/9] md:aspect-[4/3] xl:aspect-[16/10] 2xl:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group border border-white/5 hover:border-[#a67c52]/30 transition-all duration-500 shadow-lg hover:shadow-[#a67c52]/5"
            onClick={() => openLightbox(images, 0)}
          >
            <Lens className="w-full h-full">
              <ParallaxImage
                src={ASSETS.TICKERS.SECOND}
                className="w-full h-full object-contain"
                alt="Bag Close-up"
              />
            </Lens>
          </div>
          <div
            className="aspect-[16/9] md:aspect-[4/3] xl:aspect-[16/10] 2xl:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group border border-white/5 hover:border-[#a67c52]/30 transition-all duration-500 shadow-lg hover:shadow-[#a67c52]/5"
            onClick={() => openLightbox(images, 1)}
          >
            <Lens className="w-full h-full">
              <ParallaxImage
                src={ASSETS.TICKERS.MAIN2}
                className="w-full h-full object-contain"
                alt="Harness Close-up"
              />
            </Lens>
          </div>
          <div
            className="aspect-[16/9] md:aspect-[4/3] xl:aspect-[16/10] 2xl:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group border border-white/5 hover:border-[#a67c52]/30 transition-all duration-500 shadow-lg hover:shadow-[#a67c52]/5"
            onClick={() => openLightbox(images, 2)}
          >
            <Lens className="w-full h-full">
              <ParallaxImage
                src={ASSETS.TICKERS.SIDE}
                className="w-full h-full object-cover"
                alt="Side Close-up"
              />
            </Lens>
          </div>
        </div>
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

export default GalleryIntro;
