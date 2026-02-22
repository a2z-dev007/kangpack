"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { Check, ArrowRight, Briefcase, Zap, Shield } from "lucide-react";
import { ASSETS } from "@/constants/assets";
import PrimaryButton from "../common/PrimaryButton";
import Link from "next/link";
import { Lens } from "../ui/lens";

const slides = [
  {
    badge: "Why Kangpack",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    title1: "Wearable",
    title2: "Workstation",
    description:
      "A smarter way to work on the move. Kangpack combines comfort, mobility, and smart design for everyday productivity.",
    items: ["Hands Free Working", "Ergonomic Fit", "Quick Access Setup"],
    image: ASSETS.TICKERS.MAIN,
  },
  {
    badge: "Smart Feature",
    icon: <Zap className="w-3.5 h-3.5" />,
    title1: "Convertible",
    title2: "Work Tray",
    description:
      "Unfolds in seconds to create a stable workspace wherever you stand, ensuring productivity never stops.",
    items: [
      'Fits 13–16" Laptops',
      "Anti-Slip Grip Surface",
      "Adjustable Viewing Angle",
    ],
    image: ASSETS.TICKERS.IMG_354A7762,
  },
  {
    badge: "Build Quality",
    icon: <Shield className="w-3.5 h-3.5" />,
    title1: "Built To",
    title2: "Last",
    description:
      "Crafted with premium materials and refined finishes to endure the rigors of daily travel and professional use.",
    items: [
      "Precision Stitching",
      "Shape Retention Design",
      "Weather-Resistant Surface",
    ],
    image: ASSETS.TICKERS.IMG_354A7767,
  },
];

const WearableSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to slide index (0, 1, 2)
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [0, 0, 1, 2],
  );

  const [currentSlide, setCurrentSlide] = React.useState(0);

  useMotionValueEvent(activeIndex, "change", (v) => {
    const index = Math.round(v);
    setCurrentSlide((prev) => (prev !== index ? index : prev));
  });

  const nextSlide = () => {
    if (!containerRef.current) return;
    const nextIdx = (currentSlide + 1) % slides.length;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate the target scroll position based on where the slides are mapped
    // [0, 0.33, 0.66, 1] means:
    // Slide 0: 0% to 33%
    // Slide 1: 33% to 66%
    // Slide 2: 66% to 100%
    const targets = [0, 0.45, 0.8]; // Midpoints or starts of slide regions
    const targetScroll = containerTop + (containerHeight - viewportHeight) * targets[nextIdx];
    
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-[#0a0a0a] py-24 md:py-32 overflow-hidden"
    >
      {/* Background Pattern - Topographical / Technical */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Floating Decorative Elements */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute top-20 left-[10%] text-[15rem] font-black text-white/[0.02] select-none pointer-events-none leading-none"
      >
        0{currentSlide + 1}
      </motion.div>

      <div className="relative w-full flex items-center justify-center px-4 md:px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14 py-4 md:py-0">
          
          {/* Left Content Card */}
          <div className="relative h-auto min-h-[55%] md:h-[70%] lg:h-full bg-[#141414] shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-[30px] md:rounded-[50px] flex flex-col justify-between items-start overflow-hidden order-2 lg:order-1 border border-white/5">
            {/* Dot Grid Background Pattern (Persistent) */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 w-full h-full p-6 md:p-14 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col justify-center"
                >
                  <div className="w-full">
                    {/* Badge */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center w-max gap-3 mb-8 bg-white/5 px-5 py-2 rounded-full border border-white/10"
                    >
                      <div className="text-white/80">
                        {slides[currentSlide].icon}
                      </div>
                      <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">
                        {slides[currentSlide].badge}
                      </span>
                    </motion.div>

                    <h2 className="text-[clamp(1.8rem,6vw,4rem)] md:text-[3.5rem] xl:text-[4.5rem] leading-[1] mb-8 tracking-tighter">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 font-black block">
                        {slides[currentSlide].title1}
                      </span>
                      <span className="text-white/20 font-black block">
                        {slides[currentSlide].title2}
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="text-white/50 mb-10 md:mb-14 max-w-lg leading-relaxed text-[16px] md:text-lg">
                      {slides[currentSlide].description}
                    </p>

                    {/* Feature Items */}
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {slides[currentSlide].items.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl"
                        >
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                            <Check
                              className="w-2.5 h-2.5 text-white"
                              strokeWidth={4}
                            />
                          </div>
                          <span className="text-[11px] md:text-xs font-bold text-white/80 uppercase tracking-wider">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer and Navigation Indicators (Persistent) */}
              <div className="relative z-10 w-full flex items-center justify-between mt-12  md:mt-auto md:pt-10">
                <Link href="/products">
                  <PrimaryButton className="bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform" textColor="#000" circleColor="#000" hoverTextColor="#fff">
                    Shop Collection
                  </PrimaryButton>
                </Link>

                <div className="flex items-center gap-4">
                  <div className="flex gap-2.5">
                    {slides.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          width: i === currentSlide ? 32 : 10,
                          backgroundColor: i === currentSlide ? "#ffffff" : "rgba(255,255,255,0.2)"
                        }}
                        className="h-1.5 rounded-full transition-all duration-500"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-white/40 font-mono">
                    0{currentSlide + 1} / 0{slides.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="relative h-[250px] md:h-auto lg:h-full rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl bg-white/5 order-1 lg:order-2 shrink-0 md:shrink border border-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 group"
              >
                <Lens 
                  className="w-full h-full"
                  lensColor="#a67c52"
                  zoomFactor={1.8}
                >
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title1}
                    className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                  />
                </Lens>

                {/* Manual Navigation Button */}
                <motion.button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-6 right-6 z-20 bg-white/10 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-xl flex items-center justify-center group/btn"
                >
                  <ArrowRight className="w-5 h-5 text-white group-hover/btn:text-white/80 transition-colors" />
                </motion.button>
                
                {/* Product Status Label */}
                <div className="absolute top-8 left-8 z-20">
                   <div className="bg-black/20 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a67c52] animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white">Live Prototype v2.4</span>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WearableSection;
