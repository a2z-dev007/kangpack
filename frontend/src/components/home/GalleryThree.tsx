"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ASSETS } from "@/constants/assets";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

const GalleryThree: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const images = [
    ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_1,
    ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_2,
    ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_3,
  ];

  const {
    isOpen,
    images: lightboxImages,
    currentIndex,
    openLightbox,
    closeLightbox,
    setIndex,
  } = useLightbox();

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll progress for the pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Text color animations - progressive color change synchronized with image reveals
  const frontColor = useTransform(
    scrollYProgress,
    [0, 0.05, 0.2],
    ["#b7ad9f", "#6B4A2D", "#6B4A2D"],
  );

  const backColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.45],
    ["#b7ad9f", "#b7ad9f", "#6B4A2D", "#6B4A2D"],
  );

  const sidewaysColor = useTransform(
    scrollYProgress,
    [0, 0.45, 0.55, 0.7],
    ["#b7ad9f", "#b7ad9f", "#6B4A2D", "#6B4A2D"],
  );

  // Image 1 (Front) - Starts CENTER, then moves LEFT when Image 2 & 3 appear
  const image1Opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.18],
    [0, 0, 1],
  );
  const image1Scale = useTransform(
    scrollYProgress,
    [0, 0.05, 0.18],
    [0.75, 0.75, 1],
  );
  const image1Y = useTransform(scrollYProgress, [0, 0.05, 0.18], [120, 120, 0]);
  const image1X = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [0, -140, -280],
  ); // Desktop: Moves further LEFT
  const image1XMobile = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [0, -70, -150],
  ); // Mobile: Less movement
  const image1RotateX = useTransform(scrollYProgress, [0.05, 0.25], [0, 0]);
  const image1RotateY = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [0, 18, 30],
  ); // Tilts left
  const image1RotateYMobile = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [0, 9, 15],
  ); // Mobile: Less tilt
  const image1RotateZ = useTransform(scrollYProgress, [0.25, 0.4], [0, 0]); // Rotates left

  // Image 2 (Back) - Appears CENTER-RIGHT, pushes Image 1 to the left
  const image2Opacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.4],
    [0, 0, 1],
  );
  const image2Scale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.4],
    [0.75, 0.85, 1],
  );
  const image2Y = useTransform(scrollYProgress, [0, 0.22, 0.4], [120, 120, 0]);
  const image2X = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [100, 0, -140],
  ); // Desktop: Moves LEFT for image 3
  const image2XMobile = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [50, 0, -70],
  ); // Mobile: Less movement
  const image2RotateX = useTransform(scrollYProgress, [0.3, 0.5], [0, 0]);
  const image2RotateY = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [0, 12, 25],
  ); // Tilts left
  const image2RotateYMobile = useTransform(
    scrollYProgress,
    [0.22, 0.45, 0.7],
    [0, 6, 12],
  ); // Mobile: Less tilt
  const image2RotateZ = useTransform(scrollYProgress, [0.5, 0.65], [0, 0]); // Rotates left

  // Image 3 (Sideways) - Appears CENTER-RIGHT, completes the composition
  const image3Opacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.65],
    [0, 0, 1],
  );
  const image3Scale = useTransform(
    scrollYProgress,
    [0, 0.45, 0.65],
    [0.75, 0.75, 1],
  );
  const image3Y = useTransform(scrollYProgress, [0, 0.45, 0.65], [120, 120, 0]);
  const image3X = useTransform(scrollYProgress, [0.45, 0.7], [120, 0]); // Desktop
  const image3XMobile = useTransform(scrollYProgress, [0.45, 0.7], [60, 0]); // Mobile
  const image3RotateX = useTransform(scrollYProgress, [0.55, 0.75], [0, 0]);
  const image3RotateY = useTransform(scrollYProgress, [0.45, 0.7], [15, 25]); // Slight right tilt
  const image3RotateYMobile = useTransform(
    scrollYProgress,
    [0.45, 0.7],
    [8, 12],
  ); // Mobile: Less tilt
  const image3RotateZ = useTransform(scrollYProgress, [0.55, 0.75], [0, 0]); // Rotates right

  return (
    // Wrapper with responsive height for smooth scroll-driven pinning
    <div ref={containerRef} className="relative h-[250vh] md:h-[300vh]">
      {/* Sticky container that stays fixed while scrolling */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <section className="w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3">
                <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full"></div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#6B4A2D] uppercase">
                  Versatility
                </span>
              </div>

              {/* Animated Heading with Progressive Color Change */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] mb-2 sm:mb-3 tracking-tight font-bold px-4">
                <motion.span style={{ color: frontColor }}>Front. </motion.span>
                <motion.span style={{ color: backColor }}>Back. </motion.span>
                <motion.span style={{ color: sidewaysColor }}>
                  Sideways.
                </motion.span>
              </h2>

              {/* Description */}
              <p className="text-[#8B7E6F] text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4">
                One bag. Three ways to wear it.
              </p>
            </div>

            {/* Images Grid - Cinematic 3D Choreographed Animation */}
            <div
              className="relative flex items-center justify-center max-w-6xl mx-auto h-[280px] sm:h-[320px] md:h-[450px] xl:h-[600px] 2xl:h-[700px]"
              style={{ perspective: "1500px" }}
            >
              {/* Image 1 - Front - Starts CENTER, moves LEFT when Image 2 appears */}
              <motion.div
                style={{
                  opacity: image1Opacity,
                  scale: image1Scale,
                  y: image1Y,
                  x: isMobile ? image1XMobile : image1X,
                  rotateX: image1RotateX,
                  rotateY: isMobile ? image1RotateYMobile : image1RotateY,
                  rotateZ: image1RotateZ,
                  transformStyle: "preserve-3d",
                }}
                className="absolute left-1/2 -translate-x-1/2 w-[45%] sm:w-[40%] md:w-[500px] xl:w-[650px] 2xl:w-[750px] h-[65%] sm:h-[70%] md:h-[340px] xl:h-[480px] 2xl:h-[550px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.15)] md:shadow-[0_25px_70px_rgba(0,0,0,0.2)] z-10 cursor-pointer will-change-transform"
                onClick={() => openLightbox(images, 0)}
              >
                <img
                  src={ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_1}
                  className="w-full h-full object-cover"
                  alt="Front carry"
                />
              </motion.div>

              {/* Image 2 - Back - Appears CENTER-RIGHT, pushes Image 1 left */}
              <motion.div
                style={{
                  opacity: image2Opacity,
                  scale: image2Scale,
                  y: image2Y,
                  x: isMobile ? image2XMobile : image2X,
                  rotateX: image2RotateX,
                  rotateY: isMobile ? image2RotateYMobile : image2RotateY,
                  rotateZ: image2RotateZ,
                  transformStyle: "preserve-3d",
                }}
                className="absolute left-1/2 -translate-x-1/2 w-[52%] sm:w-[48%] md:w-[520px] xl:w-[680px] 2xl:w-[780px] h-[75%] sm:h-[78%] md:h-[370px] xl:h-[520px] 2xl:h-[600px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.2)] md:shadow-[0_30px_80px_rgba(0,0,0,0.25)] z-20 cursor-pointer will-change-transform"
                onClick={() => openLightbox(images, 1)}
              >
                <img
                  src={ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_2}
                  className="w-full h-full object-cover"
                  alt="Back carry"
                />
              </motion.div>

              {/* Image 3 - Sideways - Appears CENTER-RIGHT, pushes others aside */}
              <motion.div
                style={{
                  opacity: image3Opacity,
                  scale: image3Scale,
                  y: image3Y,
                  x: isMobile ? image3XMobile : image3X,
                  rotateX: image3RotateX,
                  rotateY: isMobile ? image3RotateYMobile : image3RotateY,
                  rotateZ: image3RotateZ,
                  transformStyle: "preserve-3d",
                }}
                className="absolute left-1/2 -translate-x-1/2 w-[60%] sm:w-[55%] md:w-[540px] xl:w-[700px] 2xl:w-[800px] h-[85%] sm:h-[88%] md:h-[410px] xl:h-[580px] 2xl:h-[650px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:shadow-[0_35px_90px_rgba(0,0,0,0.3)] z-30 cursor-pointer will-change-transform"
                onClick={() => openLightbox(images, 2)}
              >
                <img
                  src={ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_3}
                  className="w-full h-full object-cover"
                  alt="Sideways carry"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <Lightbox
        isOpen={isOpen}
        images={lightboxImages}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={setIndex}
      />
    </div>
  );
};

export default GalleryThree;
