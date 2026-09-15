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
    <section className="relative h-[100dvh] w-full flex flex-col items-center justify-between overflow-hidden bg-black">
      {/* Background Video Layer - Clean, Full Quality, No Overlays */}
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

      {/* Mobile Only: Bottom CTA */}
      <div className="flex md:hidden absolute bottom-8 inset-x-0 flex-col items-center gap-2 z-20 pointer-events-auto px-4">
        <p className="text-white text-xs font-medium tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Work without limits
        </p>
        <Link href="/products">
          <PrimaryButton className="btn-premium py-2.5 px-6 text-xs shadow-xl">
            Shop Now
          </PrimaryButton>
        </Link>
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
          <p className="text-white text-sm md:text-base font-medium tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hidden md:block">
            Work without limits
          </p>
          <Link href="/products">
            <PrimaryButton className="btn-premium shadow-xl">Shop Now</PrimaryButton>
          </Link>
        </motion.div>

        {/* Right Side: Video Preview */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 1 }}
              onClick={() => openVideo(ASSETS.VIDEOS.PRODUCT_MAIN)}
              className="hidden md:flex flex-col items-center gap-3 group cursor-pointer pointer-events-auto"
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
