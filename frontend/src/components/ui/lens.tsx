"use client"

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react"
import { AnimatePresence, motion, useMotionTemplate } from "framer-motion"

interface Position {
  x: number
  y: number
}

interface LensProps {
  children: React.ReactNode
  zoomFactor?: number
  lensSize?: number
  position?: Position
  defaultPosition?: Position
  isStatic?: boolean
  duration?: number
  lensColor?: string
  ariaLabel?: string
  /** Custom class name for the container */
  className?: string
}

export function Lens({
  children,
  zoomFactor = 1.3,
  lensSize = 170,
  isStatic = false,
  position = { x: 0, y: 0 },
  defaultPosition,
  duration = 0.2,
  lensColor = "black",
  ariaLabel = "Zoom Area",
  className,
}: LensProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState<Position>(position)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentPosition = useMemo(() => {
    if (isStatic) return position
    if (defaultPosition && !isHovering) return defaultPosition
    return mousePosition
  }, [isStatic, position, defaultPosition, isHovering, mousePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const maskImage = useMotionTemplate`radial-gradient(circle ${
    lensSize / 2
  }px at ${currentPosition.x}px ${
    currentPosition.y
  }px, ${lensColor} 100%, transparent 100%)`

  const LensContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
        transformOrigin: `${currentPosition.x}px ${currentPosition.y}px`,
        zIndex: 50,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoomFactor})`,
          transformOrigin: `${currentPosition.x}px ${currentPosition.y}px`,
        }}
      >
        {children}
      </div>
    </motion.div>
  )

  return (
    <div
      ref={containerRef}
      className={`relative z-20 overflow-hidden rounded-2xl cursor-none ${className || ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      role="region"
      aria-label={ariaLabel}
    >
      {children}
      {mounted && (
        <AnimatePresence>
          {(isHovering || isStatic || defaultPosition) && LensContent}
        </AnimatePresence>
      )}
    </div>
  )
}
