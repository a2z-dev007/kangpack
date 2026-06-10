"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue
} from "framer-motion";
import { Maximize2, X, Sparkles, Compass, Eye } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import Link from "next/link";
import Lenis from "lenis";

// Dynamically import Canvas component to prevent SSR hydration errors
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#030303] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-8 h-8 rounded-full border border-t-[#a67c52] border-white/10 animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Initializing WebGL Pipeline...
        </span>
      </div>
    </div>
  )
});

// Scroll-driven text panel component with blur-to-sharp and tracking transformations
const ScrollTextPanel: React.FC<{
  progress: MotionValue<number>;
  range: [number, number];
  sub: string;
  title: string;
  desc: string;
}> = ({ progress, range, sub, title, desc }) => {
  const opacity = useTransform(
    progress,
    [range[0] - 0.04, range[0], range[1], range[1] + 0.04],
    [0, 1, 1, 0]
  );
  
  const y = useTransform(
    progress,
    [range[0] - 0.04, range[0], range[1], range[1] + 0.04],
    [40, 0, 0, -40]
  );

  const blur = useTransform(
    progress,
    [range[0] - 0.04, range[0], range[1], range[1] + 0.04],
    ["blur(15px)", "blur(0px)", "blur(0px)", "blur(15px)"]
  );

  const tracking = useTransform(
    progress,
    [range[0] - 0.04, range[0], range[1]],
    ["0.4em", "0.06em", "0.02em"]
  );

  return (
    <motion.div
      style={{ opacity, y, filter: blur }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] w-8 bg-[#a67c52]/40" />
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.6em] text-[#a67c52]/90">
          {sub}
        </span>
        <div className="h-[1px] w-8 bg-[#a67c52]/40" />
      </div>

      <motion.h2
        style={{ letterSpacing: tracking }}
        className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] uppercase max-w-4xl tracking-tighter"
      >
        {title}
      </motion.h2>

      <p className="text-[11px] md:text-sm lg:text-base text-white/40 font-light leading-relaxed max-w-2xl mt-6 px-6">
        {desc}
      </p>
    </motion.div>
  );
};

const Hero: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [telemetryState, setTelemetryState] = useState("INITIALIZE");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Track scroll milestones to update status dashboard telemetry
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (activeHotspot !== null) {
      setTelemetryState("DETAIL_MACRO_FOCUS");
    } else if (latest < 0.05) {
      setTelemetryState("STANDBY_SILHOUETTE");
    } else if (latest < 0.25) {
      setTelemetryState("ORBITAL_REVEAL_ZOOM");
    } else if (latest < 0.5) {
      setTelemetryState("COMPARTMENT_OPEN");
    } else if (latest < 0.75) {
      setTelemetryState("STITCH_WEAVE_CLOSEUP");
    } else {
      setTelemetryState("DESCENT_PRE_EXIT");
    }
  });

  // Handle Lenis smooth scrolling inside Hero
  useEffect(() => {
    setMounted(true);

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Track fullscreen change events
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      lenis.destroy();
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const introOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.05], [0, -30]);
  const hotspotHudOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.5, 0.75, 0.8],
    [0, 1, 1, 0]
  );
  const indicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.12],
    [0.35, 0]
  );

  // Sidebar navigation click handler
  const scrollToPercent = (percent: number) => {
    if (typeof window !== "undefined") {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: scrollHeight * percent,
        behavior: "smooth"
      });
    }
  };

  return (
    <div ref={targetRef} className="relative h-[400vh] bg-[#030303]">
      <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-[#030303] text-white select-none">
        
        {/* --- FULLSCREEN WEBGL LAYER --- */}
        {mounted && (
          <HeroCanvas
            scrollProgress={scrollYProgress}
            activeHotspot={activeHotspot}
            setActiveHotspot={setActiveHotspot}
          />
        )}

        {/* --- TELEMETRY HUD BAR (TOP) --- */}
        <div className="absolute top-28 inset-x-0 z-30 px-6 md:px-12 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a67c52] animate-ping" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30">system status</span>
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white">{telemetryState}</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-white/30" />
              <span className="text-[9px] font-mono tracking-widest text-white/40">XYZ: 0.85 // 1.25 // 6.2</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#a67c52]" />
              <span className="text-[9px] font-black tracking-wider text-[#a67c52] uppercase">interactive 3d sandbox</span>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC TRANSITION TEXT PANELS --- */}
        {mounted && (
          <>
            {/* Introductory Frame */}
            <motion.div
              style={{ opacity: introOpacity, y: introY }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-20"
            >
              <motion.span 
                initial={{ opacity: 0, letterSpacing: "0.8em" }}
                animate={{ opacity: 0.6, letterSpacing: "0.5em" }}
                transition={{ duration: 1.5 }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-[#a67c52] mb-4"
              >
                engineered workstation
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.85] bg-gradient-to-b from-white via-white/80 to-white/10 bg-clip-text text-transparent"
              >
                KANGPACK
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.4, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="text-xs md:text-sm font-light tracking-[0.2em] uppercase text-white/50 mt-6"
              >
                Designed For Motion. Carry The Future.
              </motion.p>
            </motion.div>

            {/* Panel 1: Reveal & Zoom (Scroll 0.05 -> 0.28) */}
            <ScrollTextPanel
              progress={scrollYProgress}
              range={[0.08, 0.24]}
              sub="01 // ultimate layout"
              title="Carry The Future."
              desc="The world's first adaptive wearable workstation. Seamlessly built for digital nomads, elite tech creators, and modern executives who work without borders."
            />

            {/* Panel 2: Open Flap & Expand (Scroll 0.28 -> 0.52) */}
            <ScrollTextPanel
              progress={scrollYProgress}
              range={[0.32, 0.48]}
              sub="02 // organization"
              title="Minimal Outside. Powerful Inside."
              desc="Our MagSnap system slides open automatically on scroll to expose floating tech dividers, suspended shock-absorbing chambers, and modular charger pouches."
            />

            {/* Panel 3: Weave & Macro (Scroll 0.52 -> 0.76) */}
            <ScrollTextPanel
              progress={scrollYProgress}
              range={[0.56, 0.72]}
              sub="03 // materials"
              title="Designed For Motion."
              desc="Constructed using high-density M1 Ballistic fabric for extreme water resistance, stitching engineered to endure 800N tensile pressure, and YKK shield zippers."
            />

            {/* Panel 4: Smart Lifestyle (Scroll 0.76 -> 0.98) */}
            <ScrollTextPanel
              progress={scrollYProgress}
              range={[0.8, 0.94]}
              sub="04 // lifetime utility"
              title="The Smartest Way To Carry."
              desc="Experience ultimate luxury minimalism. Ergonomic back panels offset shoulder load by 35% for effortless travel. Backed by a full lifetime warranty."
            />
          </>
        )}

        {/* --- HOTSPOT INSTRUCTION HUD --- */}
        {mounted && (
          <motion.div
            style={{
              opacity: hotspotHudOpacity
            }}
            className="absolute top-40 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/40 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a67c52]" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/50">
              {activeHotspot !== null ? "closeup focus activated" : "click hotspots on 3D mesh to inspect specs"}
            </span>
          </motion.div>
        )}

        {/* --- SIDE NAVIGATION DOTS --- */}
        <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 z-30 flex-col gap-8 pointer-events-auto">
          {[
            { label: "00", percent: 0.0 },
            { label: "01", percent: 0.15 },
            { label: "02", percent: 0.4 },
            { label: "03", percent: 0.65 },
            { label: "04", percent: 0.88 }
          ].map((item, i) => {
            return (
              <button
                key={i}
                className="flex items-center gap-6 group text-left outline-none"
                onClick={() => scrollToPercent(item.percent)}
              >
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono tracking-widest text-white/20 group-hover:text-white/60 transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full border border-white/20 group-hover:border-[#a67c52] group-hover:bg-[#a67c52] transition-all duration-300" />
              </button>
            );
          })}
        </div>

        {/* --- BOTTOM INTERFACE BAR --- */}
        <div className="absolute inset-x-0 bottom-8 z-30 px-6 md:px-12 pointer-events-none">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-6">
            
            {/* System Status Specifications */}
            <div className="flex items-center gap-12 text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-normal mb-1">displacement</span>
                <span className="text-[#a67c52] font-black">35L EXPANDABLE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-normal mb-1">weight index</span>
                <span className="text-white">1.2KG METRIC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-normal mb-1">armor rating</span>
                <span className="text-white">IPX7 WATERPROOF</span>
              </div>
            </div>

            {/* Hotspot reset button or main buttons */}
            <div className="flex items-center gap-6 pointer-events-auto">
              {activeHotspot !== null ? (
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a67c52]/10 border border-[#a67c52]/30 hover:border-[#a67c52] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_20px_rgba(166,124,82,0.1)] hover:bg-[#a67c52] hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset Camera Angles
                </button>
              ) : (
                <Link href="/products">
                  <PrimaryButton
                    circleColor="#a67c52"
                    textColor="#ffffff"
                    hoverTextColor="#000000"
                    className="h-11 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl text-[10px] tracking-[0.2em] font-black uppercase px-6"
                  >
                    Explore Collection
                  </PrimaryButton>
                </Link>
              )}

              <div className="h-6 w-[1px] bg-white/10" />

              {/* Full screen toggle */}
              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#a67c52]/50 hover:bg-white/5 transition-all duration-300"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <X className="w-4 h-4 text-white/40" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white/40 hover:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- SCROLL MOUSE INDICATOR (CENTER BOTTOM) --- */}
        {mounted && (
          <motion.div
            style={{
              opacity: indicatorOpacity
            }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none"
          >
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">
              Scroll Storytelling
            </span>
            <div className="w-[18px] h-[30px] rounded-full border-2 border-white/20 flex justify-center p-1">
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-[3px] h-[6px] rounded-full bg-[#a67c52]"
              />
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Hero;
