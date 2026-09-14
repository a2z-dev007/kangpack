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

  // Map scroll progress to slide index (0, 1, 2)
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [0, 0, 1, 2],
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

  return (
    <div
      ref={containerRef}
      className="relative h-[180vh] md:h-[220vh] bg-brand-beige"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 h-full md:max-h-[750px] py-2 md:py-0">
          {/* Left Content Card */}
          <div className="relative h-auto min-h-[50%] md:h-[65%] lg:h-full bg-[#F2EFE9] shadow-xl rounded-2xl md:rounded-[36px] flex flex-col justify-between items-start overflow-hidden order-2 lg:order-1">
            {/* Dot Grid Background Pattern (Persistent) */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#6B4A2D 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 w-full h-full p-4 sm:p-6 md:p-10 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex-1 flex flex-col justify-center"
                >
                  <div className="w-full">
                    {/* Badge */}
                    <div className="flex items-center w-max gap-2 mb-3 md:mb-5 bg-[#D4CEC4]/70 px-3 py-1.5 rounded-full">
                      <div className="text-[#6B4A2D] scale-75 md:scale-90">
                        {slides[currentSlide].icon}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-bold tracking-widest brand-primary uppercase">
                        {slides[currentSlide].badge}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.05] mb-3 md:mb-5 tracking-tight font-black">
                      <span className="heading-gradient block">
                        {slides[currentSlide].title1}
                      </span>
                      <span className="text-[#B8AFA1] block">
                        {slides[currentSlide].title2}
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="light-text mb-4 md:mb-6 max-w-lg leading-relaxed text-xs sm:text-sm md:text-base opacity-85">
                      {slides[currentSlide].description}
                    </p>

                    {/* Feature Items - Grid on mobile for space */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 md:gap-4">
                      {slides[currentSlide].items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 md:gap-3 bg-white/50 backdrop-blur-sm border border-[#6B4A2D]/10 px-3 py-2 md:px-4 md:py-2.5 rounded-xl"
                        >
                          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-brand-brown transition-transform hover:scale-110 flex items-center justify-center">
                            <Check
                              className="w-2.5 h-2.5 text-white"
                              strokeWidth={4}
                            />
                          </div>
                          <span className="text-[10px] md:text-sm font-bold text-[#6B4A2D] uppercase tracking-wider">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer and Navigation Indicators (Persistent) */}
              <div className="relative z-10 w-full flex items-center justify-between  md:mt-auto md:pt-10">
                <Link href="/products">
                  <PrimaryButton className="btn-premium">
                    Shop Now
                  </PrimaryButton>
                </Link>

                <div className="flex gap-2">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "bg-brand-brown w-8" : "bg-[#D4CEC4] w-2.5"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="relative h-[200px] md:h-auto lg:h-full rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl bg-[#E8E2DA] order-1 lg:order-2 shrink-0 md:shrink">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 group"
              >
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title1}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />

                {/* Floating Image Badge - Smaller on Mobile */}
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 bg-white/20 backdrop-blur-xl border border-white/20 p-3 md:p-4 rounded-2xl shadow-2xl">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-brand-brown" />
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
