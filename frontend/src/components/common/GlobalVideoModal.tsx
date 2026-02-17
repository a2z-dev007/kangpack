"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const GlobalVideoModal: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showStickyVideo, setShowStickyVideo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      // Show sticky button after hero (approx 300vh)
      // We'll use a slightly more conservative threshold to ensure it shows up when Hero starts exiting
      setShowStickyVideo(window.scrollY > window.innerHeight * 2.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* --- STICKY CIRCULAR VIDEO BUTTON --- */}
      <AnimatePresence>
        {showStickyVideo && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]"
          >
            {/* Multiple Pulse Rings */}
            <motion.div 
               animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
               className="absolute inset-0 rounded-full bg-[#a67c52]/40"
            />
            <motion.div 
               animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
               className="absolute inset-0 rounded-full bg-[#a67c52]/20"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              onClick={() => setIsVideoOpen(true)}
              className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#a67c52] via-[#8b6a4e] to-[#6b4a2d] rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(166,124,82,0.5)] border border-white/30 group overflow-hidden"
            >
              {/* Internal Glossy Shimmer */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              
              {/* Play Icon with Glow */}
              <div className="relative z-10 flex items-center justify-center">
                 <motion.div
                   whileHover={{ scale: 1.15 }}
                   className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                 >
                   <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
                 </motion.div>
              </div>

              {/* Text Label on Hover - Optional Premium Touch */}
              <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                 <span className="text-[6px] font-black text-white uppercase tracking-widest">Experience</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- VIDEO PLAYER MODAL (Portal) --- */}
      {createPortal(
        <AnimatePresence>
          {isVideoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10 pointer-events-auto"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVideoOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-[40px]"
              />

              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 z-10 bg-black"
              >
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xl transition-all border border-white/10 group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <video autoPlay controls className="w-full h-full object-cover">
                  <source
                    src="/assets/videos/product-video.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default GlobalVideoModal;
