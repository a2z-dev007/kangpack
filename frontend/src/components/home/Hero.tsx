"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  ShieldCheck,
  ZoomIn,
  Play,
  CheckCircle2,
  X,
} from "lucide-react";
import newProductsData from "@/data/new-products.json";
import type { NewProduct, NewProductImages } from "@/types/newProduct";
import { ASSETS } from "@/constants/assets";
import PrimaryButton from "@/components/common/PrimaryButton";
import { Lens } from "@/components/ui/lens";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

const products = newProductsData.products as NewProduct[];

interface HeroSlide {
  id: string;
  shortName: string;
  name: string;
  brandTagline?: string;
  tagline: string;
  highlight?: string;
  category: string;
  accentColor: string;
  isNew: boolean;
  isFeatured: boolean;
  heroImage: string;
  secondaryImage?: string;
  thumbImage: string;
  posterBg: string;
  galleryImages: string[];
  features: string[];
  variants?: NewProduct["variants"];
}

/** Product shots first, poster last — deduped. */
const buildGalleryImages = (images: Record<string, string | undefined>): string[] => {
  const entries = Object.entries(images).filter(([, src]) => Boolean(src)) as [
    string,
    string,
  ][];
  const ordered = [
    ...entries.filter(([key]) => key !== "poster").map(([, src]) => src),
    ...entries.filter(([key]) => key === "poster").map(([, src]) => src),
  ];
  return [...new Set(ordered)];
};

const buildGalleryFromProduct = (images: NewProductImages): string[] => {
  const record: Record<string, string | undefined> = {
    poster: images.poster,
    main: images.main,
    front: images.front,
    back: images.back,
    model: images.model,
    front1: images.front1,
    front2: images.front2,
    front3: images.front3,
  };
  return buildGalleryImages(record);
};

const FLAGSHIP_GALLERY = buildGalleryImages({
  frontModel: ASSETS.NEW_PRODUCTS.FLAGSHIP.FRONT_MODEL,
  model: ASSETS.NEW_PRODUCTS.FLAGSHIP.MODEL,
  main: ASSETS.NEW_PRODUCTS.FLAGSHIP.MAIN,
  front: ASSETS.NEW_PRODUCTS.FLAGSHIP.FRONT,
  open: ASSETS.NEW_PRODUCTS.FLAGSHIP.OPEN,
  sideOpen: ASSETS.NEW_PRODUCTS.FLAGSHIP.SIDE_OPEN,
  sideModel: ASSETS.NEW_PRODUCTS.FLAGSHIP.SIDE_MODEL,
  back: ASSETS.NEW_PRODUCTS.FLAGSHIP.BACK,
  modelBack: ASSETS.NEW_PRODUCTS.FLAGSHIP.MODEL_BACK,
});

const FLAGSHIP_SLIDE: HeroSlide = {
  id: "flagship",
  shortName: "Flagship",
  name: "KangPack Flagship Series",
  brandTagline: "Carry Smart. Live Your Way.",
  tagline: "The ultimate wearable workstation — engineered for professionals on the move.",
  highlight: "Premium Build. Infinite Versatility.",
  category: "Flagship",
  accentColor: "#A67C52",
  isNew: true,
  isFeatured: true,
  heroImage: ASSETS.NEW_PRODUCTS.FLAGSHIP.FRONT_MODEL,
  secondaryImage: ASSETS.NEW_PRODUCTS.FLAGSHIP.OPEN,
  thumbImage: ASSETS.NEW_PRODUCTS.FLAGSHIP.MAIN,
  posterBg: ASSETS.NEW_PRODUCTS.FLAGSHIP.SIDE_MODEL,
  galleryImages: FLAGSHIP_GALLERY,
  features: ["Modular Storage System", "Ergonomic Weight Balance", "Lifetime Durability"],
};

const buildSlides = (): HeroSlide[] => {
  const fromJson: HeroSlide[] = products.map((product) => ({
    id: product.id,
    shortName: product.shortName,
    name: product.name,
    brandTagline: product.brandTagline,
    tagline: product.tagline,
    highlight: product.highlight,
    category: product.category,
    accentColor: product.accentColor,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    heroImage:
      product.images.model ??
      product.images.main ??
      product.images.front ??
      product.poster,
    secondaryImage:
      product.images.main ??
      product.images.front ??
      product.images.front1,
    thumbImage:
      product.images.main ??
      product.images.front ??
      product.poster,
    posterBg: product.poster,
    galleryImages: buildGalleryFromProduct(product.images),
    features: product.features.slice(0, 3).map((f) => f.label),
    variants: product.variants,
  }));

  const featured = fromJson.find((s) => s.isFeatured) ?? fromJson[0];
  const rest = fromJson.filter((s) => s.id !== featured.id);
  return [featured, FLAGSHIP_SLIDE, ...rest];
};

const SLIDES = buildSlides();
const AUTO_PLAY_MS = 7000;

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxProductName, setLightboxProductName] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
  const {
    isOpen: isLightboxOpen,
    images: lightboxImages,
    currentIndex: lightboxIndex,
    openLightbox,
    closeLightbox,
    setIndex: setLightboxIndex,
  } = useLightbox();

  const slide = SLIDES[activeIndex] ?? SLIDES[0];

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);
  const rotateX = useTransform(springY, [0, 1], [4, -4]);
  const parallaxX = useTransform(springX, [0, 1], [-12, 12]);
  const parallaxY = useTransform(springY, [0, 1], [-8, 8]);

  const goTo = useCallback((index: number, dir?: number) => {
    setProgress(0);
    setDirection(dir ?? (index > activeIndex ? 1 : -1));
    setActiveIndex((index + SLIDES.length) % SLIDES.length);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  const openProductGallery = useCallback(
    (targetSlide: HeroSlide, startSrc?: string) => {
      const gallery =
        targetSlide.galleryImages.length > 0
          ? targetSlide.galleryImages
          : [targetSlide.heroImage];
      const src = startSrc ?? targetSlide.heroImage;
      const startIndex = Math.max(0, gallery.indexOf(src));
      setLightboxProductName(targetSlide.name);
      openLightbox(gallery, startIndex);
      setIsPaused(true);
      setProgress(0);
    },
    [openLightbox],
  );

  const handleCloseLightbox = useCallback(() => {
    closeLightbox();
    setIsPaused(false);
    setProgress(0);
  }, [closeLightbox]);

  useEffect(() => {
    if (reduceMotion || isPaused || isLightboxOpen || isVideoModalOpen) return;

    const tick = 50;
    const id = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + tick / AUTO_PLAY_MS;
        if (next >= 1) {
          goTo(activeIndex + 1, 1);
          return 0;
        }
        return next;
      });
    }, tick);

    return () => window.clearInterval(id);
  }, [activeIndex, goTo, isPaused, isLightboxOpen, isVideoModalOpen, reduceMotion]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    onTap: () => openProductGallery(slide),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 40,
  });

  const handleStageMove = (e: React.MouseEvent) => {
    if (!stageRef.current || reduceMotion || isMobile) return;
    const rect = stageRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleStageLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const productMotionStyle =
    !reduceMotion && !isMobile
      ? { rotateX, rotateY, x: parallaxX, y: parallaxY }
      : undefined;

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
      scale: 0.96,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      scale: 1.02,
    }),
  };

  return (
    <section
      className="relative min-h-screen lg:h-screen w-full overflow-hidden bg-[#07080A] text-white pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setProgress(0);
      }}
      aria-label="Hero showcase"
    >
      {/* ── Ambient Background Lighting & Image Blur ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`hero-bg-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          {/* Faded Background Image */}
          <Image
            src={slide.posterBg}
            alt=""
            fill
            priority={activeIndex === 0}
            className="object-cover object-center opacity-20 saturate-[0.7] blur-md scale-105"
            sizes="100vw"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07080A]/85 via-[#07080A]/92 to-[#07080A]" />
          <div
            className="absolute -top-40 right-0 h-[650px] w-[650px] rounded-full opacity-25 blur-[130px] transition-colors duration-1000"
            style={{ backgroundColor: slide.accentColor }}
          />
          <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-sky-900/20 blur-[140px]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 w-full flex-1 flex flex-col justify-center">
        
        {/* ── Top Bar: Social Proof & Model Selector ── */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
          {/* Trust Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 backdrop-blur-md self-start sm:self-auto"
          >
            <div className="flex items-center text-amber-400">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase text-white/90">
              4.9/5 Rated by 2,500+ Professionals
            </span>
          </motion.div>

          {/* Minimal Product Selector Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs font-medium text-white/40 mr-2 hidden md:inline">Series:</span>
            {SLIDES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                  activeIndex === index
                    ? "bg-white text-black shadow-md"
                    : "bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white border border-white/10",
                )}
              >
                {item.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Hero Grid Layout (Content Left, Product Stage Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14 py-2 my-auto">
          
          {/* LEFT COLUMN: Essential Value Proposition & CTAs */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`copy-${slide.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Category & Badge */}
                <div className="flex items-center gap-2.5">
                  <span
                    className="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                    style={{ backgroundColor: slide.accentColor }}
                  >
                    {slide.category} Edition
                  </span>
                  {slide.isNew && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      <Sparkles className="size-3" />
                      2026 Model
                    </span>
                  )}
                </div>

                {/* Main Headline */}
                <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06]">
                  {slide.name}
                </h1>

                {/* Tagline / Essential Info */}
                <p className="text-pretty text-sm font-normal leading-relaxed text-white/70 sm:text-base md:text-lg max-w-xl">
                  {slide.tagline}
                </p>

                {/* 3 Vital Feature Highlights */}
                <div className="pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                    Core Specifications
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {slide.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-[#C4A882]" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons Group */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link href="/products" className="cursor-pointer">
                    <PrimaryButton
                      mainColor={slide.accentColor}
                      circleColor="#FFFFFF"
                      textColor="#FFFFFF"
                      hoverTextColor="#000000"
                      className="w-full justify-center sm:w-auto px-8 py-3.5 cursor-pointer"
                    >
                      Shop Collection
                    </PrimaryButton>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.14] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <div className="flex size-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110">
                      <Play className="size-3 fill-black ml-0.5" />
                    </div>
                    <span>Watch Demo</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Premium Interactive Product Showcase */}
          <div className="lg:col-span-6 mt-6 lg:mt-0 relative flex flex-col items-center justify-center">
            <div
              ref={stageRef}
              onMouseMove={handleStageMove}
              onMouseLeave={handleStageLeave}
              className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] flex items-center justify-center"
            >
              {/* Radial Accent Glow Behind Product */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`glow-${slide.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="pointer-events-none absolute inset-4 rounded-full blur-3xl opacity-40"
                  style={{ backgroundColor: slide.accentColor }}
                  aria-hidden
                />
              </AnimatePresence>

              {/* Product Lens Stage */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`hero-${slide.id}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  style={productMotionStyle}
                  className="relative z-10 w-full h-full flex items-center justify-center [perspective:1200px]"
                  {...swipeHandlers}
                >
                  <Lens
                    className="relative h-full w-full cursor-pointer flex items-center justify-center"
                    lensColor={slide.accentColor}
                    zoomFactor={isMobile ? 1.4 : 1.75}
                    lensSize={isMobile ? 130 : 180}
                  >
                    <button
                      type="button"
                      data-hero-gallery-trigger
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductGallery(slide);
                      }}
                      aria-label={`View ${slide.name} full gallery`}
                      className="group relative z-10 h-full w-full cursor-zoom-in flex items-center justify-center focus:outline-none"
                    >
                      <motion.div
                        animate={
                          reduceMotion ? undefined : { y: [0, -8, 0] }
                        }
                        transition={
                          reduceMotion
                            ? undefined
                            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
                        }
                        className="relative w-full h-full p-2"
                      >
                        <Image
                          src={slide.heroImage}
                          alt={slide.name}
                          fill
                          priority={activeIndex === 0}
                          className="object-contain object-center drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        />
                      </motion.div>

                      {/* Zoom Indicator */}
                      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase text-white/90 backdrop-blur-md opacity-90 transition-opacity group-hover:opacity-100 shadow-lg whitespace-nowrap">
                        <ZoomIn className="size-3.5 text-[#C4A882]" />
                        Hover to Zoom &bull; Click for Gallery
                      </span>
                    </button>
                  </Lens>
                </motion.div>
              </AnimatePresence>

              {/* Floating Highlight Card */}
              {slide.highlight && (
                <div className="absolute top-2 left-2 z-20 hidden sm:block max-w-[190px] rounded-xl border border-white/15 bg-black/60 p-2.5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#C4A882]">
                    <ShieldCheck className="size-3.5" />
                    <span>Featured Spec</span>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-white/90 leading-snug">
                    {slide.highlight}
                  </p>
                </div>
              )}

              {/* Stage Navigation Arrows */}
              <div className="absolute inset-y-0 -inset-x-3 z-30 flex items-center justify-between pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous product"
                  className="pointer-events-auto flex size-9 sm:size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95 shadow-lg"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next product"
                  className="pointer-events-auto flex size-9 sm:size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95 shadow-lg"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>

              {/* Slide Counter Indicator */}
              <div className="absolute bottom-1 right-2 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-mono font-bold text-white/60 backdrop-blur-md">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="text-white/20">/</span>
                <span>{String(SLIDES.length).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full origin-left rounded-full transition-all duration-75 ease-linear"
                style={{
                  backgroundColor: slide.accentColor,
                  transform: `scaleX(${progress})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox Gallery Modal ── */}
      <Lightbox
        images={lightboxImages}
        isOpen={isLightboxOpen}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onIndexChange={setLightboxIndex}
        altText={lightboxProductName || slide.name}
      />

      {/* ── Demo Video Modal Overlay ── */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black z-10"
            >
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                aria-label="Close Video"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-all border border-white/20 cursor-pointer"
              >
                <X className="size-5" />
              </button>
              <video autoPlay controls className="w-full h-full object-cover">
                <source src="/assets/videos/product-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
