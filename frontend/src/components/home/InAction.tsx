"use client";
import React from "react";
import { Play } from "lucide-react";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

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
    <section className="bg-brand-beige py-16 md:py-24 flex flex-col items-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-6 text-center">
        <Play className="w-3 h-3 brand-primary" />
        <span className="text-[11px] font-medium tracking-wide brand-primary uppercase">
          In Action
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-6xl leading-[1.1] mb-6 tracking-tight text-center font-bold">
        <span className="heading-gradient">In Action.</span>
      </h2>

      {/* Description */}
      <p className="light-text text-base md:text-lg xl:text-xl max-w-2xl mx-auto leading-relaxed text-center mb-16 xl:mb-24 px-6">
        See how Kangpack transforms any space into a hands-free mobile
        workspace.
      </p>

      <div className="w-full max-w-7xl px-4 md:px-12">
        <div
          className="relative aspect-video xl:h-[520px] xl:w-auto xl:mx-auto rounded-[50px] overflow-hidden shadow-2xl group cursor-pointer"
          onClick={() =>
            openLightbox(
              ["https://picsum.photos/seed/action_video/1920/1080"],
              0,
            )
          }
        >
          <img
            src="https://picsum.photos/seed/action_video/1920/1080"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt="In Action"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Play className="w-6 h-6 fill-brand-brown text-brand-brown" />
              </div>
            </div>
          </div>
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

export default InAction;
