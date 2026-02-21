"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { Play, ArrowRight, ShieldCheck, Zap, Globe, Cpu, Smartphone, Briefcase, Maximize2, X } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import Link from "next/link";
import { Lens } from "@/components/ui/lens"
const SLIDES = [
  {
    id: "01",
    pretitle: "Work Without Limits",
    title1: "Work",
    title2: "Anywhere",
    highlight: "Portable Workstation",
    description: "The world's first truly wearable workstation, engineered for those who demand excellence in every environment.",
    image: "/assets/bag.png",
    bg: "/assets/hero-bg.png",
    accentColor: "text-[#a67c52]",
    features: ["Portable Design", "Ergonomic Support", "Modular Storage"],
    stats: [
      { label: "Deployment", value: "0.1s" },
      { label: "Waterproof", value: "100%" },
      { label: "Warranty", value: "LIFETIME" },
    ],
  },
  {
    id: "02",
    pretitle: "Technical Excellence",
    title1: "Engineered",
    title2: "Precision",
    highlight: "Military-Grade Durability",
    description: "Every stitch and seam is a testament to our commitment to durability and ergonomic perfection. Built to last a lifetime.",
    image: "/assets/bag.png",
    bg: "/assets/hero/Background-Image.png",
    accentColor: "text-[#8b6a4e]",
    features: ["Ballistic Nylon", "Reinforced Joints", "Tech Protection"],
    stats: [
      { label: "Stitch Count", value: "12k+" },
      { label: "Tensile", value: "800N" },
      { label: "Modular", value: "100%" },
    ],
  },
  {
    id: "03",
    pretitle: "Urban Versatility",
    title1: "Adaptive",
    title2: "Lifestyle",
    highlight: "Seamless Transition",
    description: "Seamlessly transition from the rugged outdoors to the city streets. The only bag you'll ever need for work and play.",
    image: "/assets/bag.png",
    bg: "/assets/tickers/main.jpeg",
    accentColor: "text-[#a67c52]",
    features: ["City-Ready", "Office Sleek", "Adventure Tough"],
    stats: [
      { label: "Weight", value: "1.2kg" },
      { label: "Adaptability", value: "Infinite" },
      { label: "Capacity", value: "35L" },
    ],
  },
];

const Hero: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive active slide from scroll progress using useMotionValueEvent
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const slideIndex = Math.min(
      Math.floor(latest * SLIDES.length),
      SLIDES.length - 1
    );
    const clampedIndex = Math.max(0, slideIndex);
    
    // Functional update to avoid dependencies and redundant renders
    setActiveSlide((prev) => (prev !== clampedIndex ? clampedIndex : prev));
  });

  // Mouse tracking for the pinned content
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [5, -5]);
  const rotateY = useTransform(springX, [0, 1], [-5, 5]);
  const moveX = useTransform(springX, [0, 1], [-40, 40]);
  const moveY = useTransform(springY, [0, 1], [-40, 40]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  const slide = SLIDES[activeSlide] || SLIDES[0];

  const toggleFullscreen = () => {
    // Fullscreen the entire document to preserve scroll-driven animations
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={targetRef} className="relative h-[300vh] bg-[#0a0a0a]">
      <section
        onMouseMove={handleMouseMove}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-white selection:bg-[#a67c52]/30"
      >
        {/* --- BACKGROUND LAYER --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${activeSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2)_0%,transparent_100%)] z-10" />
            <img
              src={slide.bg}
              alt="Slide Background"
              className="w-full h-full object-cover opacity-50 scale-110 brightness-[0.5] grayscale-[0.1]"
            />
            
            {/* Animated Light Leaks */}
            <motion.div 
              style={{ x: moveX, y: moveY, opacity: 0.5 }}
              className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#a67c52]/20 blur-[180px] rounded-full mix-blend-screen"
            />
            
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-20" />
          </motion.div>
        </AnimatePresence>

        {/* --- TOP HEADER VIDEO BUTTON --- */}
        <div className="hidden absolute md:bottom-12 md:right-12 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            onClick={() => setIsVideoOpen(true)}
            className="flex flex-col items-center gap-2 md:gap-4 group cursor-pointer"
          >
            <div className="relative w-28 md:w-52 lg:w-64 aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] group-hover:border-white/20 transition-all duration-700">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent z-10 transition-colors duration-500" />
              <img
                src="https://picsum.photos/seed/kang-action/800/450"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] brightness-[0.7]"
                alt="Video thumbnail"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center ring-1 ring-white/30 group-hover:scale-110 transition-transform group-hover:bg-white/20 duration-500">
                  <Play className="w-3 h-3 md:w-6 md:h-6 text-white fill-white ml-0.5 md:ml-1" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full animate-pulse" />
              <p className="text-[7px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.3em] md:tracking-[0.5em] group-hover:text-white group-hover:tracking-[0.4em] md:group-hover:tracking-[0.6em] transition-all duration-700">
                Experience Kangpack
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- CONTENT LAYER --- */}
        <div className="relative z-30 container mx-auto px-6 h-full flex flex-col items-center pt-20 md:pt-2 lg:pt-2">
          <div className="flex-grow flex flex-col items-center justify-center w-full relative">
          
          {/* Pre-title Reveal */}
          <div className="overflow-hidden mb-4 md:mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`pre-${activeSlide}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div className="h-[1px] w-10 bg-[#a67c52]/50" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.6em] text-[#a67c52]/80">
                  {slide.pretitle}
                </span>
                <div className="h-[1px] w-10 bg-[#a67c52]/50" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Titles & Hero Text */}
          <div className="relative text-center mb-1 md:mb-3 lg:mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${activeSlide}`}
                className="flex flex-col items-center"
              >
                <motion.h1 
                  className="text-[18vw] md:text-[clamp(8rem,12vh+3vw,12rem)] font-black leading-[0.8] tracking-tighter uppercase mb-2 md:mb-4 opacity-[0.012] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap z-0 pointer-events-none"
                >
                  KANGPACK
                </motion.h1>
                <h2 className="text-5xl md:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tighter md:tracking-tight mb-1 md:mb-2 lg:mb-4 leading-[0.9] md:leading-[1] z-10 flex flex-col">
                  <span className="block overflow-hidden">
                    <motion.span 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="block italic font-light text-white/95"
                    >
                      {slide.title1}
                    </motion.span>
                  </span>
                  <span className="block overflow-hidden relative">
                    <motion.span 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="block bg-gradient-to-r from-white via-[#a67c52] to-white/60 bg-clip-text text-transparent px-2"
                    >
                      {slide.title2}
                    </motion.span>
                  </span>
                </h2>
                
                {/* Highlight text */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-3 md:mb-4 lg:mb-6 px-4 py-1.5 rounded-full bg-[#a67c52]/10 border border-[#a67c52]/20 backdrop-blur-md"
                >
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#a67c52]">
                    {slide.highlight}
                  </span>
                </motion.div>

                <motion.p 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ delay: 0.4 }}
                   className="text-[10px] md:text-[clamp(0.9rem,2vh,1.1rem)] text-white/40 max-w-2xl mx-auto font-light leading-relaxed tracking-wide px-10 md:px-6"
                >
                  {slide.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- PRODUCT SHOWCASE --- */}
          <div className="relative w-full max-w-5xl aspect-[16/8] max-h-[25vh] md:max-h-[35vh] mt-[-1rem] md:mt-[-2rem] lg:mt-[-3rem] z-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={`product-${activeSlide}`}
                style={{ 
                  rotateX,
                  rotateY,
                  filter: "drop-shadow(0 60px 100px rgba(0,0,0,0.9))"
                }}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0, y: -50 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex items-center justify-center relative perspective-[2000px] mt-4 md:mt-0"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#a67c52]/10 blur-[130px] rounded-full" />
                <img
                    src={slide.image}
                    alt="Kangpack Prototype"
                    className="w-[85%] md:w-[min(70%,55vh)] h-auto object-contain z-10 mt-12 scale-100 md:scale-105 transition-transform duration-700"
                  />
                
                
                {/* Floating Feature Tags */}
                <div className="absolute inset-0 z-20 hidden lg:block pointer-events-none">
                  {slide.features.map((feature, i) => (
                    <motion.div
                      key={`${activeSlide}-${i}`}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      style={{ 
                        top: `${30 + i * 20}%`, 
                        left: i % 2 === 0 ? '5%' : 'auto',
                        right: i % 2 !== 0 ? '5%' : 'auto'
                      }}
                      className="absolute flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#a67c52] shadow-[0_0_10px_rgba(166,124,82,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </div>

        {/* --- BOTTOM INTERFACE --- */}
        <div className="absolute inset-x-0 bottom-4 md:bottom-8 z-50 px-4 md:px-8 container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 border-t border-white/5 pt-3 md:pt-6">
            
            {/* Stats */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`stats-${activeSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-3 gap-6 md:gap-14 xl:gap-20"
              >
                {slide.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-0 group">
                    <span className="text-[10px] md:text-[clamp(0.9rem,2.5vh,1.3rem)] font-black text-[#a67c52] tracking-tighter">{stat.value}</span>
                    <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-white/20 group-hover:text-white/40 transition-colors whitespace-nowrap">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

             {/* CTA Group */}
            <div className="flex items-center gap-4 md:gap-8 mt-2 md:mt-4 lg:mt-6">
              <Link href="/products">
                <PrimaryButton 
                  circleColor="#a67c52"
                  textColor="#ffffff"
                  hoverTextColor="#000000"
                  className="h-12 md:h-12 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl text-[10px] md:text-xs xl:text-sm"
                >
                  Explore Collection
                </PrimaryButton>
              </Link>
              
              <div className="h-8 md:h-12 w-[1px] bg-white/10" />
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={toggleFullscreen}
                className="flex flex-col items-center gap-1 md:gap-2 group cursor-pointer"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#a67c52]/50 group-hover:bg-[#a67c52]/10 transition-all">
                   <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-white/40 group-hover:text-[#a67c52]" />
                </div>
                <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-all">Full</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* --- GLOBAL DOT NAV --- */}
        <div className="hidden xl:flex fixed left-12 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 md:gap-6 lg:gap-10">
           {SLIDES.map((_, i) => (
             <div 
               key={i} 
               className="flex items-center gap-6 group cursor-pointer"
               onClick={() => {
                 const windowHeight = window.innerHeight;
                 window.scrollTo({ top: i * windowHeight * 1.5, behavior: 'smooth' });
               }}
             >
                <span className={`text-[10px] font-black transition-all ${activeSlide === i ? 'text-[#a67c52] scale-150' : 'text-white/20 group-hover:text-white/40'}`}>
                  0{i + 1}
                </span>
                <div className={`h-[1px] md:h-[2px] transition-all duration-700 ${activeSlide === i ? 'w-8 md:w-12 bg-[#a67c52]' : 'w-2 md:w-4 bg-white/10 group-hover:w-8 group-hover:bg-white/20'}`} />
             </div>
           ))}
        </div>
      </section>

      {/* Scroll indicator - Bottom Center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4 opacity-20">
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Scroll Experience</span>
        <motion.div 
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[2px] h-12 bg-[#a67c52]" 
        />
      </div>
    </div>
  );
};

export default Hero;
