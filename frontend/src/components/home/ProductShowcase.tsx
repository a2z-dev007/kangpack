"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  Repeat,
  Package,
  Layers,
  Zap,
  Grip,
  Backpack,
  Plane,
  Briefcase,
  BookOpen,
  Shield,
  Leaf,
  Star,
  Mountain,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import newProductsData from "@/data/new-products.json";
import type { FeatureIcon, NewProduct } from "@/types/newProduct";
import PrimaryButton from "@/components/common/PrimaryButton";
import { Lens } from "@/components/ui/lens";

import "swiper/css";

const products = newProductsData.products as NewProduct[];

const iconMap: Record<FeatureIcon, React.ReactNode> = {
  repeat: <Repeat className="w-4 h-4" />,
  package: <Package className="w-4 h-4" />,
  layers: <Layers className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  grip: <Grip className="w-4 h-4" />,
  backpack: <Backpack className="w-4 h-4" />,
  plane: <Plane className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  bookOpen: <BookOpen className="w-4 h-4" />,
  shield: <Shield className="w-4 h-4" />,
  leaf: <Leaf className="w-4 h-4" />,
  star: <Star className="w-4 h-4" />,
  mountain: <Mountain className="w-4 h-4" />,
};

const formatImageLabel = (key: string) =>
  key
    .replace(/([A-Z0-9])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const buildGallery = (product: NewProduct) => {
  const entries = Object.entries(product.images).map(([key, src]) => ({
    key,
    src,
    label: formatImageLabel(key),
    isPoster: key === "poster",
  }));
  return [
    ...entries.filter((e) => !e.isPoster),
    ...entries.filter((e) => e.isPoster),
  ];
};

const ProductShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const activeProduct = products[activeIndex];

  const galleryImages = useMemo(
    () => buildGallery(activeProduct),
    [activeProduct],
  );

  const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0];
  const isPoster = selectedImage?.isPoster ?? false;

  useEffect(() => {
    setSelectedImageIndex(0);
    requestAnimationFrame(() => swiperRef.current?.slideTo(0, 0));
  }, [activeIndex]);

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
    swiperRef.current?.slideTo(index);
  };

  const handlePrev = () => {
    const next = Math.max(0, selectedImageIndex - 1);
    handleSelectImage(next);
  };

  const handleNext = () => {
    const next = Math.min(galleryImages.length - 1, selectedImageIndex + 1);
    handleSelectImage(next);
  };

  return (
    <section
      id="new-products"
      className="py-16 md:py-24 bg-[#F9F7F2] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6B4A2D]" />
            <span className="text-[11px] font-medium tracking-wide text-[#6B4A2D] uppercase">
              New Arrivals
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 heading-gradient"
          >
            Discover Our <span>Latest.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#6B5D4F] text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Premium carry gear — explore every angle before you choose yours.
          </motion.p>
        </div>

        {/* Product tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8 md:mb-10">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeIndex === index
                  ? "text-white shadow-md"
                  : "text-[#6B4A2D] bg-white/70 hover:bg-white border border-[#D4CEC4]/70"
              }`}
              style={
                activeIndex === index
                  ? { backgroundColor: product.accentColor }
                  : undefined
              }
            >
              {product.shortName}
              {product.isFeatured && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-white" />
              )}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[28px] md:rounded-[32px] shadow-xl shadow-[#6B4A2D]/8 overflow-hidden border border-[#D4CEC4]/40"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* ── Left: image stage + carousel (stacked, no overlap) ── */}
              <div
                className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#D4CEC4]/40"
                style={{
                  background: `linear-gradient(180deg, ${activeProduct.accentColor}12 0%, #F5F1E9 40%, #F5F1E9 100%)`,
                }}
              >
                {/* Feature image — fixed height, centered, fully visible */}
                <div className="relative px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                  {/* Meta badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#6B4A2D] shadow-sm border border-[#D4CEC4]/40">
                        {selectedImage.label}
                      </span>
                      {activeProduct.featuredVariant && isPoster && (
                        <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#6B4A2D] shadow-sm border border-[#D4CEC4]/40">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {activeProduct.featuredVariant}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-[#8B7E6F] tabular-nums">
                      {selectedImageIndex + 1} / {galleryImages.length}
                    </span>
                  </div>

                  {/* Image viewport */}
                  <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] lg:h-[400px] rounded-2xl bg-white/60 border border-[#D4CEC4]/30 overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeProduct.id}-${selectedImage.key}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full flex items-center justify-center p-3 sm:p-5"
                      >
                        <Lens
                          className="w-full h-full flex items-center justify-center !rounded-xl !cursor-crosshair"
                          lensColor="white"
                          lensSize={120}
                          zoomFactor={1.75}
                        >
                          <img
                            src={selectedImage.src}
                            alt={`${activeProduct.name} — ${selectedImage.label}`}
                            className="block max-w-full max-h-full w-auto h-auto object-contain select-none"
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                            }}
                            draggable={false}
                          />
                        </Lens>
                      </motion.div>
                    </AnimatePresence>

                    {/* Prev / next on main image */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrev}
                          disabled={selectedImageIndex === 0}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 shadow-md border border-[#D4CEC4]/50 flex items-center justify-center text-[#6B4A2D] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-opacity"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={selectedImageIndex === galleryImages.length - 1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 shadow-md border border-[#D4CEC4]/50 flex items-center justify-center text-[#6B4A2D] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-opacity"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <p className="text-center text-[10px] text-[#A39B8B] mt-2 hidden sm:block">
                    Hover to zoom · Click a thumbnail below
                  </p>
                </div>

                {/* Horizontal carousel — own row, never overlaps image */}
                <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6 bg-white/50">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B4A2D] mb-3">
                    Gallery
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => swiperRef.current?.slidePrev()}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#D4CEC4]/60 shadow-sm flex items-center justify-center text-[#6B4A2D] hover:bg-[#F5F1E9] cursor-pointer transition-colors"
                      aria-label="Scroll gallery left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex-1 min-w-0 overflow-hidden">
                      <Swiper
                        key={activeProduct.id}
                        onSwiper={(swiper) => {
                          swiperRef.current = swiper;
                        }}
                        slidesPerView="auto"
                        spaceBetween={10}
                        watchOverflow
                        className="product-showcase-thumbs w-full"
                        style={{ width: "100%" }}
                      >
                        {galleryImages.map(({ key, src, label }, index) => {
                          const isActive = selectedImageIndex === index;
                          return (
                            <SwiperSlide
                              key={key}
                              style={{ width: 76, height: 76, flexShrink: 0 }}
                            >
                              <button
                                type="button"
                                onClick={() => handleSelectImage(index)}
                                aria-label={`View ${label}`}
                                aria-pressed={isActive}
                                className={`relative w-[76px] h-[76px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                                  isActive
                                    ? "border-[#6B4A2D] shadow-md scale-[1.02]"
                                    : "border-transparent opacity-70 hover:opacity-100 hover:border-[#D4CEC4]"
                                }`}
                                style={
                                  isActive
                                    ? { borderColor: activeProduct.accentColor }
                                    : undefined
                                }
                              >
                                <Image
                                  src={src}
                                  alt={`${activeProduct.name} ${label}`}
                                  width={76}
                                  height={76}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </div>

                    <button
                      type="button"
                      onClick={() => swiperRef.current?.slideNext()}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#D4CEC4]/60 shadow-sm flex items-center justify-center text-[#6B4A2D] hover:bg-[#F5F1E9] cursor-pointer transition-colors"
                      aria-label="Scroll gallery right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Right: product details ── */}
              <div className="flex flex-col p-6 sm:p-8 lg:p-9 xl:p-10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: activeProduct.accentColor }}
                  >
                    {activeProduct.category}
                  </span>
                  {activeProduct.isNew && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D4CEC4] text-[#6B4A2D]">
                      New
                    </span>
                  )}
                </div>

                {activeProduct.brandTagline && (
                  <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#A39B8B] mb-1.5">
                    {activeProduct.brandTagline}
                  </p>
                )}

                <h3 className="text-xl sm:text-2xl lg:text-[1.75rem] xl:text-3xl font-black text-[#2D2418] tracking-tight leading-[1.15] mb-2">
                  {activeProduct.name}
                </h3>

                <p className="text-[#6B4A2D] font-medium text-sm sm:text-base mb-3 leading-snug">
                  {activeProduct.tagline}
                </p>

                {activeProduct.highlight && (
                  <span
                    className="inline-block text-xs font-bold text-white px-3 py-1 rounded-md mb-4 w-fit"
                    style={{ backgroundColor: activeProduct.accentColor }}
                  >
                    {activeProduct.highlight}
                  </span>
                )}

                <p className="text-[#6B5D4F] text-sm leading-relaxed mb-5 line-clamp-3 lg:line-clamp-none">
                  {activeProduct.description}
                </p>

                <div className="mb-5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B4A2D] mb-3">
                    Key Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeProduct.features.map((feature) => (
                      <li
                        key={feature.label}
                        className="flex items-center gap-2.5 text-[13px] text-[#4A4035] leading-snug"
                      >
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: activeProduct.accentColor }}
                        >
                          {iconMap[feature.icon]}
                        </span>
                        {feature.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {activeProduct.variants && activeProduct.variants.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B4A2D] mb-2.5">
                      Color Variants
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProduct.variants.map((variant) => (
                        <div
                          key={variant.name}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium ${
                            variant.featured
                              ? "border-[#6B4A2D] bg-[#F5F1E9]"
                              : "border-[#D4CEC4] bg-white"
                          }`}
                        >
                          <div className="flex -space-x-0.5">
                            {variant.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          {variant.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-2">
                  <Link href="/products" className="inline-block cursor-pointer">
                    <PrimaryButton className="btn-premium">
                      Explore Collection
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            </div>

            {activeProduct.trustBadges && activeProduct.trustBadges.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[#D4CEC4]/40 bg-[#FAF8F5]">
                {activeProduct.trustBadges.map((badge, i) => (
                  <div
                    key={badge.title}
                    className={`flex items-center gap-3 px-4 py-4 md:py-5 ${
                      i % 2 === 0 ? "border-r border-[#D4CEC4]/30" : ""
                    } ${i < 2 ? "border-b md:border-b-0 border-[#D4CEC4]/30" : ""} ${
                      i < activeProduct.trustBadges!.length - 1
                        ? "md:border-r md:border-[#D4CEC4]/30"
                        : ""
                    }`}
                  >
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: activeProduct.accentColor }}
                    >
                      {iconMap[badge.icon]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#2D2418] truncate">
                        {badge.title}
                      </p>
                      <p className="text-[10px] text-[#8B7E6F] truncate">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Product switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 md:mt-10">
          {products.map((product, index) => (
            <motion.button
              key={product.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              onClick={() => setActiveIndex(index)}
              className={`group text-left rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                activeIndex === index
                  ? "ring-2 ring-offset-2 shadow-lg"
                  : "hover:shadow-md border border-[#D4CEC4]/50"
              }`}
              style={
                activeIndex === index
                  ? ({ ringColor: product.accentColor } as React.CSSProperties)
                  : undefined
              }
            >
              <div className="relative aspect-[2/1] bg-[#EBE5DC] flex items-center justify-center p-3">
                <Image
                  src={
                    product.images.main ??
                    product.images.front ??
                    product.poster
                  }
                  alt={product.name}
                  width={200}
                  height={120}
                  className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2418]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white/75 text-[9px] font-bold uppercase tracking-widest">
                    {product.category}
                  </p>
                  <h4 className="text-white font-bold text-sm">{product.shortName}</h4>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
