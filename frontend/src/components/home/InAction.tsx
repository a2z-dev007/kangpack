"use client";
import React, { useRef } from "react";
import { Play } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const InAction: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={containerRef}
      className="bg-[#050505] text-white py-24 md:py-32 flex flex-col items-center overflow-hidden"
    >
      {/* Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg mb-6 text-center border border-white/5"
      >
        <Play className="w-3 h-3 text-white/80" />
        <span className="text-[11px] font-medium tracking-wide text-white/80 uppercase">
          In Action
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-7xl leading-[1.1] mb-6 tracking-tight text-center font-bold"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">In Action.</span>
      </motion.h2>

      {/* Description */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-white/40 text-base md:text-xl max-w-2xl mx-auto leading-relaxed text-center mb-16 xl:mb-24 px-6"
      >
        See how Kangpack transforms any space into a hands-free mobile
        workspace.
      </motion.p>

      <div className="w-full max-w-7xl px-4 md:px-12 perspective-[2000px]">
        <motion.div
          style={{
            scale: springScale,
            opacity: springOpacity,
            rotateX: springRotateX,
          }}
          className="relative aspect-video w-full rounded-[30px] md:rounded-[60px] overflow-hidden shadow-[0_50px_100px_rgba(255,255,255,0.05)] bg-black ring-1 ring-white/10"
        >
          {/* Video Element */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover transition-opacity duration-700"
          >
            <source src="/assets/videos/product-video.mp4" type="video/mp4" />
          </video>
          
          {/* Subtle Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default InAction;
