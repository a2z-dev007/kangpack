"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Play } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import Link from "next/link";
import { useVideoModal } from "@/context/VideoModalContext";
import { ASSETS } from "@/constants/assets";

const Hero: React.FC = () => {
  const { openVideo } = useVideoModal();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Background parallax: subtle motion with scroll
  const bgY = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between overflow-hidden bg-black">
      {/* Background Video Layer */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <video
          src={ASSETS.VIDEOS.HERO}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Subtle Cinematic Overlay for High Contrast and Text Readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/35 to-black/80 pointer-events-none" />

      {/* Main Hero Content: Heading, Subheading & CTAs */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 max-w-5xl mx-auto pt-28 sm:pt-32 md:pt-36 pb-20 md:pb-28 pointer-events-none">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4 sm:mb-6 shadow-xl pointer-events-auto"
        >
          <span className="w-2 h-2 rounded-full bg-[#E6AF2E] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white">
            The Wearable Workstation
          </span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]"
        >
          Work Without{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6AF2E] via-[#F2D07A] to-white">
            Limits
          </span>
        </motion.h1>

        {/* Hero Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
        >
          Unleash mobile productivity anywhere. Precision engineered with built-in ergonomic support and integrated laptop workstation design.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full sm:w-auto pointer-events-auto"
        >
          <Link href="/products" className="w-full sm:w-auto">
            <PrimaryButton className="w-full sm:w-auto btn-premium py-3.5 px-8 text-xs sm:text-sm font-bold tracking-widest shadow-2xl">
              Explore Products
            </PrimaryButton>
          </Link>
          <button
            onClick={() => openVideo(ASSETS.VIDEOS.PRODUCT_MAIN)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-2xl group cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            See It in Action
          </button>
        </motion.div>
      </div>

      {/* Bottom Right Interface: Video Preview (Desktop Only) */}
      <div className="hidden md:flex absolute bottom-8 md:bottom-12 right-6 md:right-12 lg:right-16 z-30 pointer-events-none">
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 1 }}
              onClick={() => openVideo(ASSETS.VIDEOS.PRODUCT_MAIN)}
              className="flex flex-col items-center gap-3 group cursor-pointer pointer-events-auto"
            >
              <div className="relative w-44 md:w-52 lg:w-60 aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] group-hover:border-white/40 transition-all bg-black">
                <div className="absolute inset-0 bg-brand-brown/10 z-10 pointer-events-none mix-blend-overlay" />
                <video
                  src={ASSETS.VIDEOS.PRODUCT_MAIN}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-[0.75]"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center ring-1 ring-white/40 group-hover:scale-110 transition-transform group-hover:bg-white/25 shadow-lg">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#E6AF2E] rounded-full animate-pulse" />
                <p className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-[0.4em] opacity-80 group-hover:opacity-100 group-hover:tracking-[0.5em] transition-all duration-500 drop-shadow-md">
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
            onClick={() => openVideo(ASSETS.VIDEOS.PRODUCT_MAIN)}
            className="fixed bottom-8 right-8 z-50 cursor-pointer group"
          >
            {/* Main Circular Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_10px_40px_rgba(0,0,0,0.4)] group-hover:border-white/90 transition-all z-10 bg-black"
            >
              {/* Pulse Animation Rings */}
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
              <video
                src={ASSETS.VIDEOS.PRODUCT_MAIN}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover brightness-[0.8] group-hover:brightness-[0.95] transition-all"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center ring-2 ring-white/60 group-hover:bg-white/40 transition-all shadow-md">
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
