"use client";

import React, { useState, useRef } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  zoomScale?: number;
  onOpenLightbox?: () => void;
  showExpandHint?: boolean;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className,
  imageClassName,
  zoomScale = 1.8,
  onOpenLightbox,
  showExpandHint = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOrigin({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      data-testid="zoomable-image-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onOpenLightbox}
      className={cn(
        "relative overflow-hidden cursor-zoom-in group select-none",
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        style={{
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transform: isHovered ? `scale(${zoomScale})` : "scale(1)",
          transition: isHovered
            ? "transform 0.15s ease-out"
            : "transform 0.3s cubic-bezier(0.2, 0, 0, 1)",
        }}
        className={cn(
          "w-full h-full object-cover pointer-events-none will-change-transform",
          imageClassName
        )}
      />

      {/* Expand & Zoom Hint Badge */}
      {showExpandHint && (
        <button
          data-testid="open-lightbox-button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLightbox?.();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/80 hover:bg-white backdrop-blur-md text-[#6B4A2D] shadow-sm border border-[#6B4A2D]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95"
          title="Click to expand lightbox"
          type="button"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
