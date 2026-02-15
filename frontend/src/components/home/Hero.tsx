"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import Link from "next/link";

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Mouse position tracking for bag interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Map mouse movement to subtle rotation and translation
  const bagRotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const bagRotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const bagMoveX = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const bagMoveY = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  // Scroll detection for floating video button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalize coordinates to -0.5 to 0.5
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Background parallax: moves faster than scroll
  const bgY = useTransform(scrollY, [0, 1000], [0, 400]);

  // Heading reveal: moves with scroll
  const textTranslateY = useTransform(scrollY, [0, 500], [0, -200]);
  const textScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Product bag: Stays more fixed (moves very slowly) - TRUE PARALLAX
  const bagParallax = useTransform(scrollY, [0, 1000], [0, 350]);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#1a1a1a]"
    >
      {/* Background Image Layer (Parallax) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src="/assets/hero-bg.png"
          alt="Nature background"
          className="w-full h-full object-cover brightness-[0.8] scale-110"
        />
        {/* Decorative Light Leak */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-brand-brown/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Grain/Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dlbv8effr/image/upload/v1635447101/noise_tzo7px.png")',
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 backdrop-blur-[0.5px]"></div>
      </motion.div>

      {/* Top Text: "A wearable workstation" (Centered above everything) */}
      <div className="absolute top-[25%] md:top-[18%] z-30 w-full text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
        >
          <div className="h-[1px] w-12 bg-white/30 mb-1" />
          <p className="text-white/80 text-xs md:text-sm lg:text-[1vw] font-bold uppercase tracking-[0.4em]">
            Precision Crafted
          </p>
          <p className="text-white text-base md:text-lg lg:text-[2vw] font-light tracking-tight italic">
            A wearable workstation
          </p>
        </motion.div>
      </div>

      {/* Monolithic Background Text: ANYWHERE */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.h1
          style={{
            y: textTranslateY,
            scale: textScale,
            opacity: textOpacity,
            textShadow: "0 20px 80px rgba(0,0,0,0.3)",
          }}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-[12vw] pb-[8rem] md:pb-[14rem] xl:pb-[2rem] 2xl:pb-[14rem] md:text-[18vw] lg:text-[14vw] xl:text-[8vw] 2xl:text-[14vw] font-black leading-none tracking-[-0.05em] select-none uppercase text-center relative pointer-events-auto flex items-center justify-center z-10"
        >
          <span className="absolute inset-0 text-white/10 blur-[1px] pointer-events-none flex items-center justify-center">
            ANYWHERE
          </span>
          {"WORK".split("").map((letter, i) => (
            <motion.span
              key={i}
              whileHover={{
                scale: 1.2,
                y: -20,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="relative inline-block transition-all duration-300 bg-clip-text text-transparent cursor-default px-[0.02em] py-12 bg-white/0"
              style={{
                WebkitTextStroke: "1px rgba(242, 239, 233, 0.4)",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.4))",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                (target.style as any).webkitTextStroke = "0px";
                target.style.backgroundImage = "var(--gradient-heading)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                (target.style as any).webkitTextStroke =
                  "1px rgba(242, 239, 233, 0.4)";
                target.style.backgroundImage =
                  "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.4))";
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* Main Product Container (Grounded Bag) with Parallax */}
      <div className="relative z-20 w-full max-w-7xl px-4 flex flex-col items-center md:mt-auto mt-64 xl:pt-[1rem] 2xl:pt-[10rem] perspective-[1200px] pointer-events-none">
        <motion.div
          style={{ y: bagParallax }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex flex-col md:flex-row justify-center items-center -translate-y-20 md:-translate-y-12"
        >
          {/* Wrapper for floating animation */}
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
            className="w-full flex justify-center"
          >
            {/* Inner image for mouse-driven tilt and shift */}
            <motion.div
              style={{
                rotateX: bagRotateX,
                rotateY: bagRotateY,
                x: bagMoveX,
                y: bagMoveY,
              }}
              className="relative w-[90%] md:w-[88%] lg:w-[93%] xl:w-[80%] 2xl:w-[98%] max-w-[900px] xl:max-w-[700px] 2xl:max-w-[900px]"
            >
              <img
                src="/assets/bag.png"
                alt="Kangpack Product"
                className="w-full h-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)] scale-105"
              />
              {/* Dynamic Shadow that follows the tilt */}
              <motion.div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-12 bg-black/40 blur-[40px] rounded-full -z-10"
                style={{
                  x: useTransform(springX, [-0.5, 0.5], [40, -40]),
                  scaleX: useTransform(springY, [-0.5, 0.5], [0.8, 1.2]),
                  opacity: useTransform(springY, [-0.5, 0.5], [0.3, 0.6]),
                }}
              />
            </motion.div>
          </motion.div>

          {/* Mobile Only: CTA Button (Stacked below bag) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex md:hidden flex-col items-center gap-6 mt-12 pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                Unveiling
              </span>
              <p className="text-white text-lg font-light italic tracking-tight">
                Work without limits
              </p>
            </div>
            <Link href="/products">
              <PrimaryButton className="btn-premium">Shop Now</PrimaryButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Interface Elements (Desktop Only) */}
      <div className="hidden md:flex absolute bottom-8 md:bottom-12 xl:bottom-8 2xl:bottom-12 left-0 right-0 z-40 px-6 md:px-12 lg:px-16 flex-row items-end justify-between pointer-events-none">
        {/* Left Side: Shop CTA */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-3 md:gap-4 pointer-events-auto mb-10 md:mb-0"
        >
          <p className="text-white text-sm md:text-base font-normal tracking-normal hidden md:block">
            Work without limits
          </p>
          <Link href="/products">
            <PrimaryButton className="btn-premium">Shop Now</PrimaryButton>
          </Link>
        </motion.div>

        {/* Right Side: Video Preview - Original Position */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 1 }}
              className="hidden md:flex flex-col items-center gap-3 group cursor-pointer pointer-events-auto"
            >
              <div className="relative w-44 md:w-52 lg:w-60 aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] group-hover:border-white/30 transition-all">
                <div className="absolute inset-0 bg-brand-brown/10 z-10 pointer-events-none mix-blend-overlay"></div>
                <img
                  src="https://picsum.photos/seed/kang-action/800/450"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-[0.6] sepia-[0.2]"
                  alt="Video thumbnail"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center ring-1 ring-white/30 group-hover:scale-110 transition-transform group-hover:bg-white/20">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="w-1 h-1 bg-white/40 rounded-full animate-pulse"></span>
                <p className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 group-hover:tracking-[0.5em] transition-all duration-500">
                  Experience Kangpack
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Circular Video Button - Appears on Scroll */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 right-8 z-50 cursor-pointer group"
          >
            {/* Main Circular Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_10px_40px_rgba(0,0,0,0.4)] group-hover:border-white/90 transition-all z-10"
            >
              {/* Pulse Animation Rings - Behind the button */}
              <div className="absolute inset-0 -z-10 pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-white/40"
                />
                <motion.div
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute inset-0 rounded-full bg-white/30"
                />
              </div>
              <img
                src="https://picsum.photos/seed/kang-action/500/300"
                className="w-full h-full object-cover brightness-[0.7] group-hover:brightness-[0.9] transition-all"
                alt="Video thumbnail"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ring-2 ring-white/50 group-hover:bg-white/30 transition-all">
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
