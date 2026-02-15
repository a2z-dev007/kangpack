"use client"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize, Grid3X3, Play, Pause } from "lucide-react"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"

interface LightboxProps {
    images: string[]
    isOpen: boolean
    currentIndex: number
    onClose: () => void
    onIndexChange: (index: number | ((prev: number) => number)) => void
    altText?: string
}

export function Lightbox({
    images,
    isOpen,
    currentIndex,
    onClose,
    onIndexChange,
    altText = "Image"
}: LightboxProps) {
    const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
    const [zoom, setZoom] = useState(1)
    const [showThumbnails, setShowThumbnails] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isSlideshow, setIsSlideshow] = useState(false)
    const slideshowRef = useRef<NodeJS.Timeout | null>(null)

    // Scroll active thumbnail into center view
    useEffect(() => {
        if (thumbnailRefs.current[currentIndex]) {
            thumbnailRefs.current[currentIndex]?.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            })
        }
    }, [currentIndex])

    const nextImage = () => {
        onIndexChange((currentIndex + 1) % images.length)
    }

    const prevImage = () => {
        onIndexChange((currentIndex - 1 + images.length) % images.length)
    }

    // Zoom functions
    const zoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 3))
    }

    const zoomOut = () => {
        setZoom(prev => Math.max(prev - 0.5, 0.5))
    }

    const resetZoom = () => {
        setZoom(1)
    }

    // Fullscreen functions
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
            setIsFullscreen(false)
        }
    }

    // Slideshow functions
    const toggleSlideshow = () => {
        if (isSlideshow) {
            if (slideshowRef.current) {
                clearInterval(slideshowRef.current)
                slideshowRef.current = null
            }
            setIsSlideshow(false)
        } else {
            setIsSlideshow(true)
            slideshowRef.current = setInterval(() => {
                onIndexChange((prev) => (prev + 1) % images.length)
            }, 3000) // Change image every 3 seconds
        }
    }

    // Cleanup slideshow on unmount or close
    useEffect(() => {
        return () => {
            if (slideshowRef.current) {
                clearInterval(slideshowRef.current)
            }
        }
    }, [])

    // Stop slideshow when lightbox closes
    useEffect(() => {
        if (!isOpen && isSlideshow) {
            setIsSlideshow(false)
            if (slideshowRef.current) {
                clearInterval(slideshowRef.current)
                slideshowRef.current = null
            }
        }
    }, [isOpen, isSlideshow])

    // Reset zoom when image changes
    useEffect(() => {
        setZoom(1)
    }, [currentIndex])

    // Swipe handlers for the main image area
    const mainImageHandlers = useSwipeable({
        onSwipedLeft: () => nextImage(),
        onSwipedRight: () => prevImage(),
        preventScrollOnSwipe: true,
        trackMouse: true,
        trackTouch: true,
        delta: 10,
    })

    // General swipe handlers for the entire lightbox
    const generalHandlers = useSwipeable({
        onSwipedLeft: () => nextImage(),
        onSwipedRight: () => prevImage(),
        preventScrollOnSwipe: true,
        trackMouse: false,
        trackTouch: true,
        delta: 20,
    })

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose()
                    break
                case 'ArrowLeft':
                    prevImage()
                    break
                case 'ArrowRight':
                    nextImage()
                    break
                case '+':
                case '=':
                    zoomIn()
                    break
                case '-':
                    zoomOut()
                    break
                case '0':
                    resetZoom()
                    break
                case 'f':
                case 'F':
                    toggleFullscreen()
                    break
                case 't':
                case 'T':
                    setShowThumbnails(!showThumbnails)
                    break
                case ' ':
                    e.preventDefault()
                    if (images.length > 1) toggleSlideshow()
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, currentIndex, images.length, showThumbnails])

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen || images.length === 0) return null

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            {...generalHandlers}
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
                {/* Control Bar */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
                    <button onClick={zoomOut} disabled={zoom <= 0.5} className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-full transition-colors" title="Zoom Out">
                        <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                    <button onClick={zoomIn} disabled={zoom >= 3} className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-full transition-colors" title="Zoom In">
                        <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="Toggle Fullscreen">
                        <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                    <button onClick={() => setShowThumbnails(!showThumbnails)} className={`p-2 rounded-full transition-colors ${showThumbnails ? 'bg-white/30' : 'bg-white/20'}`} title="Toggle Thumbnails">
                        <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                    {images.length > 1 && (
                        <button onClick={toggleSlideshow} className={`p-2 rounded-full transition-colors ${isSlideshow ? 'bg-white/30' : 'bg-white/20'}`} title={isSlideshow ? "Stop Slideshow" : "Start Slideshow"}>
                            {isSlideshow ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                        </button>
                    )}
                    <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="Close">
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                </div>

                {/* Navigation Arrows (desktop) */}
                {images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10">
                            <ChevronLeft className="w-7 h-7 text-white" />
                        </button>
                        <button onClick={nextImage} className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10">
                            <ChevronRight className="w-7 h-7 text-white" />
                        </button>
                    </>
                )}

                {/* Main Image Container */}
                <div className="relative w-full h-[60vh] sm:w-[85%] sm:h-[68vh] flex items-center justify-center">
                    <div
                        className="relative w-[85%] h-full rounded-[16px] overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x bg-gray-900/20"
                        {...mainImageHandlers}
                        style={{ touchAction: zoom > 1 ? 'pan-x pan-y' : 'pan-x' }}
                        onDoubleClick={zoom > 1 ? resetZoom : zoomIn}
                    >
                        <div
                            className="w-full h-full transition-transform duration-300 ease-out"
                            style={{
                                transform: `scale(${zoom})`,
                                cursor: zoom > 1 ? 'move' : 'grab'
                            }}
                        >
                            <Image
                                src={images[currentIndex]}
                                alt={`${altText} ${currentIndex + 1}`}
                                fill
                                className="select-none object-contain"
                                sizes="(max-width: 640px) 100vw, 85vw"
                                priority
                                draggable={false}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {images.length > 1 && (
                    <div className="flex md:hidden items-center justify-center gap-6 mt-4">
                        <button onClick={prevImage} className="p-3 bg-white/20 rounded-full"><ChevronLeft className="w-6 h-6 text-white" /></button>
                        <button onClick={nextImage} className="p-3 bg-white/20 rounded-full"><ChevronRight className="w-6 h-6 text-white" /></button>
                    </div>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && showThumbnails && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto p-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                ref={(el) => { (thumbnailRefs.current[index] = el) }}
                                onClick={() => onIndexChange(index)}
                                className={`relative w-16 h-12 flex-shrink-0 rounded border-2 transition-all ${index === currentIndex ? "border-white scale-110" : "border-transparent bg-black/40"}`}
                            >
                                <Image src={image} alt="" fill className="object-cover rounded" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Hook for easier management
export function useLightbox() {
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const openLightbox = (imageList: string[], startIndex: number = 0) => {
        setImages(imageList)
        setCurrentIndex(startIndex)
        setIsOpen(true)
    }

    const closeLightbox = () => {
        setIsOpen(false)
        setImages([])
        setCurrentIndex(0)
    }

    const setIndex = (index: number | ((prev: number) => number)) => {
        if (typeof index === 'function') {
            setCurrentIndex(prev => index(prev))
        } else {
            setCurrentIndex(index)
        }
    }

    return { isOpen, images, currentIndex, openLightbox, closeLightbox, setIndex }
}