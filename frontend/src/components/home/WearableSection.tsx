"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Check, ArrowRight, Briefcase, Zap, Shield } from "lucide-react";
import { ASSETS } from "@/constants/assets";
import PrimaryButton from "../common/PrimaryButton";
import Link from "next/link";

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

  // Map scroll progress to slide index (0, 1, 2) with a hold buffer for the final slide
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 0.22, 0.28, 0.52, 0.58, 0.85, 1],
    [0, 0, 1, 1, 2, 2, 2],
  );

  // State-like derived value for AnimatePresence
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const handleValue = (v: number) => {
      const index = Math.min(2, Math.max(0, Math.round(v)));
      setCurrentSlide(index);
    };
    if ((activeIndex as any).on) {
      return (activeIndex as any).on("change", handleValue);
    }
    return activeIndex.onChange(handleValue);
  }, [activeIndex]);

  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const containerHeight = containerRef.current.clientHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;

    const midpoints = [0.1, 0.4, 0.75];
    const targetScroll = scrollTop + scrollableDistance * midpoints[index];

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[250vh] md:h-[300vh] bg-brand-beige"
    >
      {/* Sticky viewport container: covers 100% viewport height with top header clearance */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-0 pb-3 sm:pb-6 md:pb-12 px-3 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-8 h-full md:max-h-[750px]">
          {/* Top Image Card on Mobile / Right Image Card on Tablet & Desktop */}
          <div className="relative h-[44%] sm:h-[48%] md:h-full rounded-2xl md:rounded-[40px] overflow-hidden shadow-xl bg-[#E8E2DA] order-1 md:order-2 shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 group"
              >
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title1}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />

                {/* Floating Image Badge */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-10 md:right-10 z-20 bg-white/25 backdrop-blur-xl border border-white/30 p-2 sm:p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl">
                  <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-brand-brown" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left Content Card */}
          <div className="relative flex-1 md:h-full bg-[#F2EFE9] shadow-xl rounded-2xl md:rounded-[36px] flex flex-col justify-between items-start overflow-hidden order-2 md:order-1 min-h-0">
            {/* Dot Grid Background Pattern (Persistent) */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#6B4A2D 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 w-full h-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex-1 flex flex-col justify-between min-h-0 py-1"
                >
                  <div className="w-full flex flex-col gap-2 sm:gap-3">
                    {/* Badge */}
                    <div className="flex items-center w-max gap-2 bg-[#D4CEC4]/70 px-3 py-1 sm:py-1.5 rounded-full">
                      <div className="text-[#6B4A2D] scale-80 md:scale-90">
                        {slides[currentSlide].icon}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest brand-primary uppercase">
                        {slides[currentSlide].badge}
                      </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.08] tracking-tight font-black">
                      <span className="heading-gradient block">
                        {slides[currentSlide].title1}
                      </span>
                      <span className="text-[#B8AFA1] block">
                        {slides[currentSlide].title2}
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="light-text leading-relaxed text-xs sm:text-sm md:text-base opacity-85 max-w-lg">
                      {slides[currentSlide].description}
                    </p>

                    {/* Feature Items */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {slides[currentSlide].items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#6B4A2D]/10 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-xs"
                        >
                          <div className="w-4 h-4 rounded-full bg-brand-brown shrink-0 flex items-center justify-center">
                            <Check
                              className="w-2.5 h-2.5 text-white"
                              strokeWidth={3.5}
                            />
                          </div>
                          <span className="text-[10px] sm:text-xs md:text-sm font-bold text-[#6B4A2D] uppercase tracking-wider whitespace-nowrap">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              <div className="relative z-10 w-full flex items-center justify-between pt-3 sm:pt-4 md:pt-6 border-t border-[#6B4A2D]/10 md:border-t-0 shrink-0 mt-2">
                <Link href="/products">
                  <PrimaryButton className="btn-premium text-xs sm:text-sm px-4 py-2.5 md:px-6 md:py-3">
                    Shop Now
                  </PrimaryButton>
                </Link>

                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 cursor-pointer focus:outline-none ${
                        i === currentSlide
                          ? "bg-brand-brown w-6 sm:w-8"
                          : "bg-[#D4CEC4] w-2.5 hover:bg-[#b8afa1]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WearableSection;
