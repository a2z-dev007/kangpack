"use client";
import React, { useRef } from "react";
import { ASSETS } from "@/constants/assets";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    action: "Wear It",
    tagline: "Uncompromising Ergonomics",
    headline: "Slip it on.\nLike a second skin.",
    body: "The dual-harness suspension system distributes your laptop's weight across 8 anatomical anchor points. Zero strain. Total agility. Deploys in 15 seconds.",
    detail: "Breathable Leather Harness",
    metrics: "Weight Dist: 50/50",
    image: ASSETS.TICKERS.IMG_354A7767,
  },
  {
    number: "02",
    action: "Place Laptop",
    tagline: "Rigid Precision",
    headline: "Your workstation,\nlocked in flight.",
    body: "Our patent-pending carbon-core platform creates a rock-solid foundation. Magnetic anchor points ensure your laptop stays fixed even at 45° angles.",
    detail: 'Carbon-Core Platform',
    metrics: "Tilt Support: 45°",
    image: ASSETS.TICKERS.MAIN,
  },
  {
    number: "03",
    action: "Work Anywhere",
    tagline: "Limitless Productivity",
    headline: "Type, create, execute\n— from the edge.",
    body: "Eye-level screen positioning and 100% typing clearance. On a train, a mountain top, or a job site — you're not just working; you're dominating your environment.",
    detail: "Eye-Level Comfort",
    metrics: "Reach: Infinite",
    image: ASSETS.TICKERS.MAIN2,
  },
];

const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;

    const sections = gsap.utils.toArray(".how-it-works-slide");
    const totalWidth = trackRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollAmount = totalWidth - viewportWidth;

    // Horizontal Scroll Pinning
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        start: "top top",
        end: () => `+=${scrollAmount + viewportWidth}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update progress indicators manually for that high-end feel
          const progress = self.progress;
          steps.forEach((_, i) => {
            const start = i / steps.length;
            const end = (i + 1) / steps.length;
            const stepProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
            if (progressRefs.current[i]) {
                gsap.to(progressRefs.current[i], {
                  scaleX: stepProgress,
                  duration: 0.1,
                  ease: "none"
                });
            }
          });
        }
      },
    });

    mainTl.to(trackRef.current, {
      x: -scrollAmount,
      ease: "none",
    });

    // Staggered entrance for content in each slide
    sections.forEach((section: any, i) => {
      const texts = section.querySelectorAll(".how-slide-content > *");
      const img = section.querySelector(".how-slide-image");

      gsap.from(texts, {
        y: 50,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          containerAnimation: mainTl,
          start: "left center+=200",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(img, {
        scale: 1.2,
        clipPath: "inset(20% 20% 20% 20%)",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          containerAnimation: mainTl,
          start: "left center+=200",
          toggleActions: "play none none reverse",
        },
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-[#060606] selection:bg-[#a67c52]/30">
      
      {/* ── PERSISTENT UI OVERLAYS ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh] bg-[radial-gradient(circle_at_center,rgba(166,124,82,0.04)_0%,transparent_70%)]" />
      </div>

      {/* Global Header */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 md:px-20 pt-12 md:pt-16 flex items-start justify-between pointer-events-none">
        <div className="max-w-xl">
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#a67c52] block mb-3 opacity-60">
            Operational Guide
          </span>
          <h2 className="text-4xl md:text-6xl xl:text-8xl font-black tracking-tighter text-white leading-[0.85]">
            Master the <span className="text-white/20 italic">Unfold.</span>
          </h2>
        </div>

        {/* Progress System */}
        <div className="hidden md:flex items-center gap-10 mt-6">
          {steps.map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="h-[2px] w-14 md:w-20 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                <div
                  ref={(el) => { progressRefs.current[i] = el; }}
                  className="absolute inset-0 bg-[#a67c52] origin-left scale-x-0"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#a67c52]">
                PHASE 0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── THE TRACK ───────────────────────────────────── */}
      <div ref={trackRef} className="flex h-screen w-max items-center">
        {steps.map((step, i) => (
          <div
            key={i}
            className="how-it-works-slide relative w-screen h-screen flex items-center px-6 md:px-20 pt-20"
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-10 md:gap-24">
              
              {/* Content Side */}
              <div className="how-slide-content relative w-full md:w-[45%] z-10">
                <span className="absolute -top-16 -left-10 md:-top-32 md:-left-24 text-[clamp(12rem,35vw,28rem)] font-black text-[#a67c52]/[0.02] leading-none select-none pointer-events-none">
                  {step.number}
                </span>

                <div className="inline-flex items-center gap-4 mb-8">
                  <span className="w-10 h-px bg-[#a67c52]/40" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-[#a67c52] bg-[#a67c52]/5 px-3 py-1 rounded-full">{step.tagline}</span>
                </div>

                <h3 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter text-white leading-[1.0] mb-8">
                  {step.headline}
                </h3>

                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-xl mb-12 font-light">
                  {step.body}
                </p>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#a67c52]">Tech Spec</span>
                    <span className="text-white font-medium">{step.detail}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Analytics</span>
                    <span className="text-white font-medium">{step.metrics}</span>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative flex-1 w-full aspect-square md:aspect-auto md:h-[65vh]">
                <div className="how-slide-image relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
                  <img
                    src={step.image}
                    alt={step.action}
                    className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Floating Action Badge */}
                  <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 p-4 rounded-2xl">
                     <span className="w-10 h-10 rounded-full bg-[#a67c52] flex items-center justify-center text-black font-black text-sm">
                       {step.number}
                     </span>
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Manual {step.action}</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r-2 border-b-2 border-[#a67c52]/20 rounded-br-[4rem]" />
                <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-[#a67c52]/40" />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Global Scroll Hint */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20 z-30 pointer-events-none">
        <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white">Slide to Deploy</span>
        <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-[#a67c52] to-transparent overflow-hidden">
           <div className="w-full h-full bg-white translate-x-full animate-marquee" />
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
