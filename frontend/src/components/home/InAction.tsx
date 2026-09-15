"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Zap,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { ASSETS } from "@/constants/assets";
import { useVideoModal } from "@/context/VideoModalContext";

const InAction: React.FC = () => {
  const { openVideo } = useVideoModal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Play / pause when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(cur);
      setProgress((cur / dur) * 100);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const featurePills = [
    {
      icon: <Zap className="w-4 h-4 text-[#6B4A2D]" />,
      title: "3-Second Setup",
      desc: "Unfolds into a rigid laptop tray instantly on the go.",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#6B4A2D]" />,
      title: "Ergonomic Balance",
      desc: "Distributes weight evenly across chest and shoulders.",
    },
    {
      icon: <Compass className="w-4 h-4 text-[#6B4A2D]" />,
      title: "True Independence",
      desc: "Work comfortably standing, walking, or commuting.",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="bg-brand-beige py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col items-center relative overflow-hidden"
    >
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#D4CEC4]/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#B8AFA1]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 shadow-xs">
        <Play className="w-3 h-3 fill-[#6B4A2D] text-[#6B4A2D]" />
        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#6B4A2D] uppercase">
          In Action • Live Demo
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-3">
        <span className="heading-gradient">See It In Motion.</span>
      </h2>

      {/* Description */}
      <p className="light-text text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-center mb-10 sm:mb-12">
        Witness how Kangpack seamlessly turns any environment into a stable,
        hands-free mobile workstation.
      </p>

      {/* Main Showcase Layout */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 relative z-10">
        {/* Left Side Highlights (Desktop Only) */}
        <div className="hidden lg:flex flex-col gap-6 w-72">
          {featurePills.slice(0, 2).map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-[#6B4A2D]/30 transition-all hover:translate-y-[-2px]"
            >
              <div className="w-9 h-9 rounded-xl bg-[#D4CEC4]/60 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Center: The Vertical 9:16 Video Player Showcase */}
        <div className="relative flex flex-col items-center">
          {/* Ambient Glow behind the video */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#a67c52]/30 via-[#8b6a4e]/20 to-[#6b4a2d]/30 rounded-[44px] blur-2xl opacity-70 -z-10 pointer-events-none" />

          {/* Video Studio Bezel Frame */}
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => openVideo(ASSETS.VIDEOS.PRODUCT_MAIN)}
            className="relative w-[300px] sm:w-[350px] md:w-[390px] aspect-[9/16] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.25),0_0_0_8px_rgba(255,255,255,0.7)] group cursor-pointer bg-black"
          >
            {/* Native Video Element */}
            <video
              ref={videoRef}
              src={ASSETS.VIDEOS.PRODUCT_MAIN}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration);
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

            {/* Top Bar inside Video: Live Badge & Sound Toggle */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">
                  Real Product
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-md"
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
                aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/90" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </motion.button>
            </div>

            {/* Center Play / Pause Indicator on Hover */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white/35 transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-[#6B4A2D] text-[#6B4A2D] ml-0.5" />
                </div>
              </motion.div>
            </div>

            {/* Bottom Controls Bar inside Video */}
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              {/* Scrub Progress Bar */}
              <div className="w-full bg-white/25 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#E6AF2E] h-full transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Info & Expand Action */}
              <div className="flex items-center justify-between text-white text-xs pt-1">
                <span className="text-[11px] font-mono text-white/80">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 group-hover:bg-white/25 transition-colors">
                  <Maximize className="w-3 h-3" />
                  <span>Watch Theater</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Caption Below Player */}
          <p className="text-[11px] sm:text-xs text-gray-500 text-center mt-3 font-medium">
            Tap video or &quot;Watch Theater&quot; for full high-fidelity sound & controls
          </p>
        </div>

        {/* Right Side Highlights / Mobile Highlights */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-sm lg:w-72">
          {/* Third feature card on desktop */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-[#6B4A2D]/30 transition-all hover:translate-y-[-2px] mb-6"
            >
              <div className="w-9 h-9 rounded-xl bg-[#D4CEC4]/60 flex items-center justify-center mb-3">
                {featurePills[2].icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {featurePills[2].title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {featurePills[2].desc}
              </p>
            </motion.div>
          </div>

          {/* Mobile visible pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:hidden gap-3 w-full">
            {featurePills.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-xs rounded-xl p-3.5 border border-black/5 text-center flex flex-col items-center"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D4CEC4]/60 flex items-center justify-center mb-1.5">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 text-xs mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[10px] text-gray-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Theater Modal Launch Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gradient-to-br from-[#3D2C1D] to-[#1E150E] text-white rounded-2xl p-5 shadow-xl border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#E6AF2E]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#E6AF2E]">
                Theater Experience
              </span>
            </div>
            <h4 className="font-bold text-base text-white mb-2">
              Ready to see every detail?
            </h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Open in high-definition theater mode with full controls, crystal-clear audio, and Ambilight glow.
            </p>
            <button
              onClick={() => openVideo(ASSETS.VIDEOS.PRODUCT_MAIN)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#E6AF2E] text-gray-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-gray-900" />
              <span>Launch Theater Modal</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InAction;
