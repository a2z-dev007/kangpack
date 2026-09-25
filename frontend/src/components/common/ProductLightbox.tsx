"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export const ProductLightbox: React.FC<ProductLightboxProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title = "Product Image",
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initialIndex when modal opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(3.5, Number((prev + 0.5).toFixed(1))));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(1, Number((prev - 0.5).toFixed(1)));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev, zoomIn, zoomOut, resetZoom]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setScale((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
    } else {
      // Zoom out
      setScale((prev) => {
        const next = Math.max(1, Number((prev - 0.25).toFixed(2)));
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Double click to toggle zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.2);
      // Center zoom around click point
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      setPosition({ x: -offsetX * 0.8, y: -offsetY * 0.8 });
    }
  };

  // Mouse dragging for panning when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    const maxOffset = (scale - 1) * 350;
    const newX = Math.max(-maxOffset, Math.min(maxOffset, e.clientX - dragStartRef.current.x));
    const newY = Math.max(-maxOffset, Math.min(maxOffset, e.clientY - dragStartRef.current.y));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !mounted) return null;

  const currentImage = images[currentIndex] || "";

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[99999] backdrop-blur-2xl flex flex-col justify-between select-none"
        style={{ backgroundColor: "rgba(14, 12, 10, 0.96)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) {
            onClose();
          }
        }}
      >
        {/* Top Header & Toolbar */}
        <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-white/80 font-medium text-xs sm:text-sm truncate max-w-[200px] sm:max-w-md">
              {title}
            </span>
            {images.length > 1 && (
              <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>

          {/* Floating Zoom & Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10">
              <button
                onClick={zoomOut}
                disabled={scale <= 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out (-)"
                type="button"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-mono text-white/90 w-12 text-center font-bold">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={zoomIn}
                disabled={scale >= 3.5}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In (+)"
                type="button"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {scale > 1 && (
                <button
                  onClick={resetZoom}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1 border-l border-white/10 pl-1"
                  title="Reset Zoom (0)"
                  type="button"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-all duration-200 border border-white/10 ml-2 shadow-sm"
              title="Close (Esc)"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Viewport & Image Canvas */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={cn(
            "relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6",
            scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
          )}
        >
          {/* Main Image Container */}
          <div
            onDoubleClick={handleDoubleClick}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
            }}
            className="relative max-w-full max-h-full flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={`${title} - View ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                draggable={false}
                className="max-h-[75vh] max-w-[90vw] sm:max-w-[85vw] object-contain rounded-xl shadow-2xl pointer-events-none"
              />
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && scale === 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/90 text-white hover:text-[#3E2A1D] backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl active:scale-90"
                aria-label="Previous image"
                type="button"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/90 text-white hover:text-[#3E2A1D] backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl active:scale-90"
                aria-label="Next image"
                type="button"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Helper Hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[11px] text-white/60 pointer-events-none hidden sm:block">
            {scale > 1
              ? "Drag to pan • Double-click or scroll to reset"
              : "Double-click or scroll to zoom • Click to close"}
          </div>
        </div>

        {/* Bottom Thumbnails Strip */}
        {images.length > 1 && (
          <div className="relative z-20 px-4 py-3 bg-black/40 backdrop-blur-md border-t border-white/10 flex justify-center">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto max-w-full pb-1 scrollbar-thin px-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    resetZoom();
                  }}
                  className={cn(
                    "relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer p-0.5 bg-black/20",
                    currentIndex === idx
                      ? "border-white ring-2 ring-white/30 scale-105"
                      : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/50"
                  )}
                  type="button"
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
