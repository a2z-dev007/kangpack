"use client";

import React, { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import Navbar from "@/components/home/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  Minus,
  Plus,
  Heart,
  Share2,
  Award,
  Zap,
  Layout,
} from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cart/cartSlice";
import { toast } from "sonner";
import ScrollSection from "@/components/common/ScrollSection";
import { cn } from "@/lib/utils";
import { WishlistButton } from "@/components/common/WishlistButton";

// --- Components ---

const ImageGallery = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-6">
      <motion.div
        className="aspect-[4/5] md:aspect-square bg-[#E8E2DA] rounded-[40px] overflow-hidden relative group shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {images && images.length > 0 ? (
          <motion.img
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={images[selectedIndex]}
            alt={`${title} - View ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}

        {/* Image Navigation Hints (Desktop) */}
        {images && images.length > 1 && (
          <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                );
              }}
              className="w-12 h-12 bg-white/20 hover:bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center pointer-events-auto transition-all duration-300 shadow-xl border border-white/30 text-brand-brown"
            >
              <ChevronDown className="w-6 h-6 rotate-90" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                );
              }}
              className="w-12 h-12 bg-white/20 hover:bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center pointer-events-auto transition-all duration-300 shadow-xl border border-white/30 text-brand-brown"
            >
              <ChevronDown className="w-6 h-6 -rotate-90" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Thumbnails */}
      {images && images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide px-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative w-24 aspect-square rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-500 border-2",
                selectedIndex === idx
                  ? "border-[#6B4A2D] scale-105 shadow-xl"
                  : "border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0",
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const QuantitySelector = ({
  quantity,
  setQuantity,
  max,
}: {
  quantity: number;
  setQuantity: (q: number) => void;
  max: number;
}) => {
  return (
    <div className="flex items-center border-2 border-[#6B4A2D]/10 rounded-2xl p-1 bg-white/50 backdrop-blur-sm group-hover:border-[#6B4A2D]/30 transition-colors">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-brand-premium hover:text-white text-[#6B4A2D] transition-all duration-300 shadow-sm"
        disabled={quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-14 text-center font-black text-xl text-[#6B4A2D]">
        {quantity}
      </span>
      <button
        onClick={() => setQuantity(Math.min(max, quantity + 1))}
        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-brand-premium hover:text-white text-[#6B4A2D] transition-all duration-300 shadow-sm"
        disabled={quantity >= max}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

const AccordionItem = ({
  title,
  children,
  icon: Icon,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  icon?: any;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#6B4A2D]/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-[#6B4A2D]/60" />}
          <span className="text-lg font-bold text-[#6B4A2D] group-hover:text-[#6B4A2D]/80 transition-colors">
            {title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-[#6B4A2D]/40 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[#8B7E6F] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page Component ---

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  // Fetch actual product data
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, slug],
    queryFn: () => productsApi.getProduct(slug),
    enabled: !!slug,
  });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product: product as any, quantity }));
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border-4 border-[#6B4A2D]/20 border-t-[#6B4A2D] animate-spin mb-8" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#6B4A2D] font-bold tracking-[0.3em] uppercase text-xs"
          >
            Curating Excellence...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-brand-beige flex flex-col items-center justify-center font-sans px-6 text-center">
        <Navbar solid />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <h1 className="text-5xl font-black text-[#6B4A2D] mb-6 uppercase tracking-tighter">
            Not Found
          </h1>
          <p className="text-[#8B7E6F] mb-12 text-lg font-light leading-relaxed">
            The masterpiece you're looking for has moved beyond our current
            reach. Perhaps another edition awaits?
          </p>
          <Link
            href="/products"
            className="btn-premium px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl inline-block"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-brand-beige">
      <Navbar solid />

      <main className="flex-grow">
        <div className="relative h-[45vh] md:h-[55vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3E2A1D]/90 via-[#6B4A2D]/80 to-brand-beige z-10" />
          <ScrollSection className="h-full">
            <div className="absolute inset-0 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
              <img
                src={product.images[0]}
                alt="Hero Background"
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </ScrollSection>

          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border border-white/20"
            >
              <Award className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                Premium Selection
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter"
            >
              <span className="opacity-50">LATEST</span> EDITION
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-sm md:text-base mt-6 tracking-widest uppercase font-medium"
            >
              Crafted for the modern nomad
            </motion.p>
          </div>
        </div>

        <div className="w-full relative z-30">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
              {/* Left Column: Images (Responsive Sticky) */}
              <div className="lg:col-span-7 relative">
                <div className="lg:sticky lg:top-32 space-y-8">
                  {/* Breadcrumbs - Moved inside for better local context */}
                  <nav className="flex items-center gap-2 text-[10px] md:text-xs text-[#8B7E6F] mb-4 uppercase tracking-[0.2em] font-bold">
                    <a
                      href="/"
                      className="hover:text-[#6B4A2D] transition-colors"
                    >
                      Home
                    </a>
                    <span className="opacity-30">/</span>
                    <a
                      href="/products"
                      className="hover:text-[#6B4A2D] transition-colors"
                    >
                      Store
                    </a>
                    <span className="opacity-30">/</span>
                    <span className="text-[#6B4A2D]">{product.name}</span>
                  </nav>

                  <ImageGallery
                    images={product.images || []}
                    title={product.name}
                  />
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="lg:col-span-5 flex flex-col h-full">
                <div className="space-y-12">
                  {/* Header Info */}
                  <div className="border-b border-[#6B4A2D]/10 pb-12">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 mb-8"
                    >
                      <span className="px-4 py-1.5 bg-brand-premium text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg">
                        {product.category?.name || "Accessories"}
                      </span>
                      {product.stock < 5 && product.stock > 0 && (
                        <span className="px-4 py-1.5 bg-red-100/50 text-red-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg">
                          Limited Stock: {product.stock}
                        </span>
                      )}
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-[#6B4A2D] tracking-tighter mb-8 leading-[0.95] uppercase">
                      {product.name.split(" ").map((word, i) => (
                        <span key={i} className={i === 0 ? "" : "opacity-40"}>
                          {word}{" "}
                        </span>
                      ))}
                    </h1>

                    <div className="flex items-center gap-4 md:gap-8 mb-8">
                      <span className="text-2xl md:text-4xl font-bold heading-gradient">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-lg md:text-2xl text-[#8B7E6F]/40 line-through font-light">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    <p className="text-[#8B7E6F] text-xl leading-relaxed font-light">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions Area - More tactile */}
                  <div className="space-y-10 group/actions">
                    <div className="flex flex-col sm:flex-row gap-8 items-end">
                      <div className="space-y-4 w-full sm:w-auto">
                        <span className="text-[10px] font-bold text-[#6B4A2D]/40 uppercase tracking-[0.3em]">
                          Select Quantity
                        </span>
                        <QuantitySelector
                          quantity={quantity}
                          setQuantity={setQuantity}
                          max={product.stock}
                        />
                      </div>
                      <div className="flex-grow w-full">
                        <div className="flex gap-4">
                          <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-grow btn-premium h-[64px] rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                          >
                            <ShoppingBag className="w-5 h-5" />
                            {product.stock === 0
                              ? "Unavailable"
                              : "Add to cart"}
                          </button>
                          <WishlistButton 
                            productId={product.id || (product as any)._id} 
                            className="w-[64px] h-[64px] flex-shrink-0 border-2 border-[#6B4A2D]/10 rounded-2xl flex items-center justify-center text-[#6B4A2D] hover:bg-white hover:shadow-xl transition-all active:scale-90"
                            iconClassName="w-6 h-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Trust Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#6B4A2D]/5 flex flex-col items-center text-center gap-3">
                        <Truck className="w-6 h-6 text-brand-premium" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B4A2D]">
                          Priority Shipping
                        </span>
                      </div>
                      <div className="p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#6B4A2D]/5 flex flex-col items-center text-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-brand-premium" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B4A2D]">
                          Lifetime Warranty
                        </span>
                      </div>
                      <div className="p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#6B4A2D]/5 flex flex-col items-center text-center gap-3">
                        <RefreshCw className="w-6 h-6 text-brand-premium" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B4A2D]">
                          30 Day Trial
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AccordionItem title="Description" defaultOpen icon={Award}>
                      <div className="space-y-4">
                        {product.shortDescription && (
                          <p className="font-medium text-[#6B4A2D] leading-relaxed">
                            {product.shortDescription}
                          </p>
                        )}
                        <p className="font-light leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </AccordionItem>

                    {product.specifications &&
                      product.specifications.length > 0 && (
                        <AccordionItem
                          title="Technical Blueprint"
                          icon={Layout}
                        >
                          <div className="grid grid-cols-2 gap-y-8 gap-x-12 py-6">
                            {product.specifications.map((spec, idx) => (
                              <div
                                key={idx}
                                className="space-y-2 border-l border-[#6B4A2D]/10 pl-4"
                              >
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B7E6F]/60 font-black">
                                  {spec.name}
                                </span>
                                <p className="text-sm font-bold text-[#6B4A2D]">
                                  {spec.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionItem>
                      )}

                    <AccordionItem title="Global Logistics" icon={Truck}>
                      <p className="font-light leading-relaxed">
                        We offer Complimentary Express Shipping worldwide. Your
                        Kangpack is tracked from our workshop to your door,
                        arriving in premium eco-conscious packaging within 3-5
                        business days.
                      </p>
                    </AccordionItem>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-24 px-6 md:px-12 bg-[#F9F7F4]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-[#6B4A2D] mb-6 tracking-tighter uppercase">
                <span className="opacity-40 block text-sm tracking-[0.4em] mb-4">
                  Engineering
                </span>
                Why you'll love it
              </h2>
              <div className="w-20 h-1 bg-brand-premium mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Ergonomic Design",
                  desc: "Reduces strain on your back and shoulders with our patented weight-distribution technology.",
                  icon: Layout,
                },
                {
                  title: "Premium Materials",
                  desc: "Crafted from high-grade, water-resistant ballistic nylon for ultimate durability.",
                  icon: Award,
                },
                {
                  title: "Instant Access",
                  desc: "Deploy your workstation in seconds with our quick-release mechanism.",
                  icon: Zap,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white/40 backdrop-blur-md p-10 rounded-[30px] border border-[#6B4A2D]/5 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-brand-premium rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#6B4A2D] mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#8B7E6F] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-32 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-[#6B4A2D] tracking-tighter uppercase mb-6">
                Client Verdict
              </h2>
              <div className="flex items-center gap-4 bg-brand-beige/30 px-6 py-3 rounded-2xl border border-brand-brown/5">
                <div className="flex text-amber-600 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="font-black text-2xl text-brand-brown">
                  4.9/5
                </span>
                <span className="text-[#8B7E6F] font-bold text-sm tracking-widest uppercase">
                  (120 Reviews)
                </span>
              </div>
            </div>

            <p className="text-brand-brown/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Our community of modern professionals worldwide rely on Kangpack
              for their daily portability. Join the thousands who have already
              upgraded their mobility.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
