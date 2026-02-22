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
    offset: ["start start", "end start"],
  });

  // Text color animations - progressive color change synchronized with image reveals
  const frontColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3],
    ["rgba(26,26,26,0.2)", "rgba(26,26,26,0.2)", "#1a1a1a"],
  );

  const backColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.45, 0.6],
    ["rgba(26,26,26,0.2)", "rgba(26,26,26,0.2)", "rgba(26,26,26,0.2)", "#1a1a1a"],
  );

  const sidewaysColor = useTransform(
    scrollYProgress,
    [0, 0.6, 0.75, 0.85],
    ["rgba(26,26,26,0.2)", "rgba(26,26,26,0.2)", "rgba(26,26,26,0.2)", "#1a1a1a"],
  );

  // Image 1 (Front) - Starts CENTER, then moves LEFT when Image 2 appears
  const image1Opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.25],
    [0, 0, 1],
  );
  const image1Scale = useTransform(
    scrollYProgress,
    [0, 0.05, 0.25],
    [0.75, 0.75, 1],
  );
  const image1Y = useTransform(scrollYProgress, [0, 0.05, 0.25], [120, 120, 0]);
  const image1X = useTransform(scrollYProgress, [0.3, 0.5], [-120, -280]); // Desktop: Moves further LEFT
  const image1XMobile = useTransform(scrollYProgress, [0.3, 0.5], [-60, -180]); // Mobile: Less movement
  const image1RotateX = useTransform(scrollYProgress, [0.05, 0.25], [0, 0]);
  const image1RotateY = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.4],
    [0, 0, 30],
  ); // Tilts left
  const image1RotateYMobile = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.4],
    [0, 0, 15],
  ); // Mobile: Less tilt
  const image1RotateZ = useTransform(scrollYProgress, [0.25, 0.4], [0, 0]); // Rotates left

  // Image 2 (Back) - Appears CENTER-RIGHT, pushes Image 1 to the left
  const image2Opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, 1]);
  const image2Scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    [0.75, 0.85, 1],
  );
  const image2Y = useTransform(scrollYProgress, [0, 0.3, 0.5], [120, 120, 0]);
  const image2X = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.65],
    [100, 0, -180],
  ); // Desktop: Moves LEFT for image 3
  const image2XMobile = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.65],
    [50, 0, -100],
  ); // Mobile: Less movement
  const image2RotateX = useTransform(scrollYProgress, [0.3, 0.5], [0, 0]);
  const image2RotateY = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.65],
    [0, 20, 30],
  ); // Tilts left
  const image2RotateYMobile = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.65],
    [0, 10, 15],
  ); // Mobile: Less tilt
  const image2RotateZ = useTransform(scrollYProgress, [0.5, 0.65], [0, 0]); // Rotates left

  // Image 3 (Sideways) - Appears CENTER-RIGHT, pushes others aside
  const image3Opacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.75],
    [0, 0, 1],
  );
  const image3Scale = useTransform(
    scrollYProgress,
    [0, 0.55, 0.75],
    [0.75, 0.75, 1],
  );
  const image3Y = useTransform(scrollYProgress, [0, 0.55, 0.75], [120, 120, 0]);
  const image3X = useTransform(scrollYProgress, [0.55, 0.75], [120, 0]); // Desktop: Stays slightly right of center
  const image3XMobile = useTransform(scrollYProgress, [0.55, 0.75], [60, 0]); // Mobile: Less movement
  const image3RotateX = useTransform(scrollYProgress, [0.55, 0.75], [0, 0]);
  const image3RotateY = useTransform(scrollYProgress, [0.55, 0.75], [15, 25]); // Slight right tilt
  const image3RotateYMobile = useTransform(
    scrollYProgress,
    [0.55, 0.75],
    [8, 12],
  ); // Mobile: Less tilt
  const image3RotateZ = useTransform(scrollYProgress, [0.55, 0.75], [0, 0]); // Rotates right

  return (
    // Wrapper with extra height to create scroll distance for pinning effect
    // Increased to 400vh for longer hold time at the end
    <div ref={containerRef} className="relative bg-[#f5f2ee] text-[#1a1a1a]" style={{ height: "400vh" }}>
      {/* Sticky container that stays fixed while scrolling */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <section className="w-full py-20 md:py-32 lg:py-40 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8   flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#1a1a1a]/8 backdrop-blur-md border border-[#a67c52]/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg mb-4 sm:mb-6">
                <div className="w-1.5 h-1.5 bg-[#a67c52] rounded-full"></div>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[#1a1a1a]/70 uppercase">
                  Versatility
                </span>
              </div>

              {/* Animated Heading with Progressive Color Change */}
              <h2 className="text-[clamp(1.8rem,6vw,4rem)] md:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.1] mb-6 md:mb-8 xl:mb-12 tracking-tight font-bold px-4">
                <motion.span style={{ color: frontColor }}>Front. </motion.span>
                <motion.span style={{ color: backColor }}>Back. </motion.span>
                <motion.span style={{ color: sidewaysColor }}>
                  Sideways.
                </motion.span>
              </h2>

              {/* Description */}
              <p className="text-[#1a1a1a]/50 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4">
                One bag. Three ways to wear it.
              </p>
            </div>

            {/* Images Grid - Cinematic 3D Choreographed Animation */}
            <div
              className="relative flex items-center justify-center max-w-6xl mx-auto h-[220px] sm:h-[260px] md:h-[380px] xl:h-[500px] 2xl:h-[600px]"
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
                className="absolute left-1/2 -translate-x-1/2 w-[38%] sm:w-[35%] md:w-[420px] xl:w-[550px] 2xl:w-[650px] h-[65%] sm:h-[70%] md:h-[280px] xl:h-[400px] 2xl:h-[480px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-10 cursor-pointer will-change-transform"
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
                className="absolute left-1/2 -translate-x-1/2 w-[42%] sm:w-[38%] md:w-[440px] xl:w-[580px] 2xl:w-[680px] h-[75%] sm:h-[78%] md:h-[310px] xl:h-[440px] 2xl:h-[520px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-20 cursor-pointer will-change-transform"
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
                className="absolute left-1/2 -translate-x-1/2 w-[48%] sm:w-[45%] md:w-[460px] xl:w-[600px] 2xl:w-[700px] h-[85%] sm:h-[88%] md:h-[350px] xl:h-[500px] 2xl:h-[580px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-30 cursor-pointer will-change-transform"
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
