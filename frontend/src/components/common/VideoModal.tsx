"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  Sparkles,
} from "lucide-react";
import { useVideoModal } from "@/context/VideoModalContext";

export const VideoModal: React.FC = () => {
  const { isOpen, videoSrc, closeVideo } = useVideoModal();
  const [mounted, setMounted] = useState(false);

  // Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [showCenterIcon, setShowCenterIcon] = useState<"play" | "pause" | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Autoplay and reset on open
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay with sound might be blocked, fallback to muted play
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true));
          }
        });
    }
  }, [isOpen, videoSrc]);

  // Auto-hide controls after inactivity
  const showControlsTemporarily = useCallback(() => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 2800);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowCenterIcon("play");
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowCenterIcon("pause");
      setIsControlsVisible(true);
    }
    setTimeout(() => setShowCenterIcon(null), 600);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      videoRef.current.volume = 1;
      setVolume(1);
    }
  }, [isMuted, volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          closeVideo();
          break;
        case " ":
        case "k":
        case "K":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, togglePlay, toggleMute, closeVideo, duration]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none overflow-hidden"
          onMouseMove={showControlsTemporarily}
        >
          {/* Backdrop with Ambilight Blur */}
          <div
            onClick={closeVideo}
            className="absolute inset-0 bg-black/85 backdrop-blur-2xl transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-[440px] max-h-[92vh] sm:max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Title and Close Button */}
            <div className="w-full flex items-center justify-between px-2 sm:px-3 mb-2.5 sm:mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-[#E6AF2E]" />
                  <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-white uppercase">
                    Kangpack In Action
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={closeVideo}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-colors shadow-lg cursor-pointer"
                aria-label="Close video modal"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Video Frame Card */}
            <div className="relative w-full aspect-[9/16] max-h-[76vh] sm:max-h-[78vh] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-black shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_80px_rgba(230,175,46,0.15)] border border-white/20 group">
              {/* Diffuse Ambient Video Glow behind main viewport */}
              <video
                src={videoSrc}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-40 pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Main Video Element */}
              <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                loop
                className="w-full h-full object-cover cursor-pointer"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Center Flash Feedback for Play/Pause */}
              <AnimatePresence>
                {showCenterIcon && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 1 }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white shadow-2xl">
                      {showCenterIcon === "play" ? (
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1 text-white" />
                      ) : (
                        <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dark subtle gradient at the bottom for controls readability */}
              <div
                className={`absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 z-10 ${
                  isControlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Interactive Player Controls */}
              <div
                className={`absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col gap-2.5 z-20 transition-all duration-300 ${
                  isControlsVisible || !isPlaying
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                {/* Timeline Scrubber */}
                <div className="w-full flex items-center gap-2 group/scrub">
                  <div className="relative flex-1 flex items-center h-4 cursor-pointer">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 rounded-full appearance-none bg-white/20 accent-[#E6AF2E] cursor-pointer hover:h-2 transition-all focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, #E6AF2E ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.25) ${(currentTime / (duration || 1)) * 100}%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Control Bar */}
                <div className="flex items-center justify-between text-white text-xs">
                  {/* Left Controls: Play/Pause, Replay, Time */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={handleReplay}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none hidden sm:inline-flex"
                      title="Restart"
                    >
                      <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 hover:text-white" />
                    </button>

                    <span className="text-[11px] sm:text-xs font-mono text-white/90">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls: Volume, Fullscreen */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Volume toggle & slider */}
                    <div className="flex items-center gap-1.5 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-red-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-12 sm:w-16 h-1 rounded-full appearance-none bg-white/30 accent-white cursor-pointer focus:outline-none"
                      />
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
                      aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-4 h-4 text-white" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Keyboard shortcuts hint */}
            <p className="mt-3 text-[10px] sm:text-[11px] text-white/50 text-center tracking-wide">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/70">Space</kbd> to play/pause • <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/70">M</kbd> to mute • <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/70">Esc</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VideoModal;
