"use client";

import React, { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import Navbar from "@/components/home/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { formatPrice, formatDate, getImageUrl } from "@/lib/utils";
import { usePublicSettings } from "@/features/settings/queries";
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Award,
  Zap,
  Layout,
  Check,
  Package,
  Maximize2,
  X,
  ArrowRight,
  Edit3,
  Loader2,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cart/cartSlice";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { WishlistButton } from "@/components/common/WishlistButton";
import { ProductLightbox } from "@/components/common/ProductLightbox";
import { ZoomableImage } from "@/components/common/ZoomableImage";
import { ProductCard } from "@/components/common/ProductCard";
import { Product } from "@/types";

// --- Standardized Image Gallery Component ---
const ImageGallery = ({
  images,
  title,
  discountPercentage,
}: {
  images: string[];
  title: string;
  discountPercentage?: number;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validImages = images && images.length > 0 ? images : ["/assets/placeholder.jpg"];

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {/* Main Image Display with Hover Lens Zoom */}
        <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square max-h-[480px] lg:max-h-[520px] w-full bg-[#F5F2EC] rounded-2xl border border-[#6B4A2D]/10 overflow-hidden shadow-sm flex items-center justify-center group">
          <ZoomableImage
            src={validImages[selectedIndex]}
            alt={`${title} - View ${selectedIndex + 1}`}
            onOpenLightbox={() => setIsLightboxOpen(true)}
            zoomScale={1.9}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover"
          />

          {/* Badges on Main Image */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
            {discountPercentage && discountPercentage > 0 ? (
              <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                Save {discountPercentage}%
              </span>
            ) : null}
          </div>

          {/* Image Counter Badge */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium rounded-md shadow-sm pointer-events-none z-10">
              {selectedIndex + 1} / {validImages.length}
            </div>
          )}

          {/* Carousel Arrow Controls (Standard 36px buttons) */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev === 0 ? validImages.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#6B4A2D] shadow-md border border-[#6B4A2D]/10 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-10"
                aria-label="Previous image"
                type="button"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev === validImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#6B4A2D] shadow-md border border-[#6B4A2D]/10 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 z-10"
                aria-label="Next image"
                type="button"
              >
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Row (Standard 64px size) */}
        {validImages.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {validImages.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 bg-white cursor-pointer",
                  selectedIndex === idx
                    ? "border-[#6B4A2D] ring-2 ring-[#6B4A2D]/20 shadow-sm"
                    : "border-[#6B4A2D]/15 opacity-65 hover:opacity-100 hover:border-[#6B4A2D]/40"
                )}
                aria-label={`View image ${idx + 1}`}
                type="button"
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Fullscreen Lightbox with Zoom & Pan */}
      <ProductLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={validImages}
        initialIndex={selectedIndex}
        title={title}
      />
    </>
  );
};

// --- Standardized Quantity Selector ---
const QuantitySelector = ({
  quantity,
  setQuantity,
  max,
}: {
  quantity: number;
  setQuantity: (q: number) => void;
  max?: number;
}) => {
  const stockLimit = typeof max === "number" && max > 0 ? max : 99;
  const isMaxReached = quantity >= stockLimit;

  return (
    <div className="space-y-1">
      <div className="inline-flex items-center h-11 md:h-12 border border-[#6B4A2D]/20 rounded-xl bg-white p-1 shadow-sm">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B4A2D] hover:bg-[#F5F2EC] active:scale-95 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          disabled={quantity <= 1}
          type="button"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center font-bold text-sm md:text-base text-[#6B4A2D]">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(stockLimit, quantity + 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B4A2D] hover:bg-[#F5F2EC] active:scale-95 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          disabled={isMaxReached}
          type="button"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {isMaxReached && (
        <p className="text-[11px] font-semibold text-amber-700">
          {stockLimit === 1 ? "Only 1 available" : `Max ${stockLimit} available`}
        </p>
      )}
    </div>
  );
};

// --- Standardized Accordion Component ---
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
    <div className="border-b border-[#6B4A2D]/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group"
        type="button"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-[#6B4A2D]/70" />}
          <span className="text-sm md:text-base font-semibold text-[#6B4A2D] group-hover:text-[#3E2A1D] transition-colors">
            {title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#6B4A2D]/50 transition-transform duration-300",
            isOpen && "rotate-180 text-[#6B4A2D]"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-xs md:text-sm text-[#8B7E6F] leading-relaxed">
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
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, slug],
    queryFn: () => productsApi.getProduct(slug),
    enabled: !!slug,
  });

  const productId = product?.id || (product as any)?._id;

  // Fetch reviews & stats
  const { data: reviewsResponse, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await api.get(`/reviews?product=${productId}&limit=20`);
      return res.data;
    },
    enabled: !!productId,
  });

  const { data: reviewStatsResponse } = useQuery({
    queryKey: ["review-stats", productId],
    queryFn: async () => {
      const res = await api.get(`/reviews/product/${productId}/stats`);
      return res.data?.data;
    },
    enabled: !!productId,
  });

  const reviewsList = reviewsResponse?.data || [];
  const totalReviewsCount =
    reviewStatsResponse?.totalReviews ??
    (reviewsList.length || product?.ratings?.count || 0);
  const averageRating = reviewStatsResponse?.averageRating
    ? Number(reviewStatsResponse.averageRating).toFixed(1)
    : product?.ratings?.average
    ? Number(product.ratings.average).toFixed(1)
    : "5.0";

  // Review modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/product/${slug}`);
      return;
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast.error("Please provide both a review headline and comment");
      return;
    }
    try {
      setIsSubmittingReview(true);
      await api.post("/reviews", {
        productId,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
      });
      toast.success("Thank you! Your review has been submitted.");
      setIsReviewModalOpen(false);
      setReviewTitle("");
      setReviewComment("");
      refetchReviews();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Fetch related/featured products
  const { data: featuredProducts } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "featured"],
    queryFn: () => productsApi.getFeaturedProducts(),
  });

  const { data: storeSettings } = usePublicSettings();
  const freeShippingThreshold =
    storeSettings?.freeShippingThreshold ||
    storeSettings?.shipping?.freeShippingThreshold ||
    0;
  const freeShippingText =
    freeShippingThreshold > 0
      ? `Free standard shipping on orders over ${formatPrice(freeShippingThreshold)}.`
      : "Free standard shipping on all orders.";

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product: product as any, quantity }));
      toast.success(`Added ${quantity} × ${product.name} to cart`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center font-sans">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full border-3 border-[#6B4A2D]/20 border-t-[#6B4A2D] animate-spin mb-4" />
          <p className="text-[#6B4A2D] font-semibold text-xs tracking-wider uppercase">
            Loading Product Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-brand-beige flex flex-col items-center justify-center font-sans px-6 text-center">
        <Navbar solid />
        <div className="max-w-md py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#6B4A2D]/10 flex items-center justify-center text-[#6B4A2D]">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#6B4A2D] mb-3">
            Product Not Found
          </h1>
          <p className="text-[#8B7E6F] mb-8 text-sm leading-relaxed">
            The product you're looking for might have been moved or is currently unavailable.
          </p>
          <Link
            href="/products"
            className="btn-premium px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md inline-block"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount percentage if applicable
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  const galleryImages = (product.images || []).map((img: string) =>
    getImageUrl(img)
  );

  const relatedProducts = (featuredProducts || [])
    .filter((p: Product) => (p.id || (p as any)._id) !== (product.id || (product as any)._id))
    .slice(0, 4);

  return (
    <div className="min-h-screen font-sans bg-brand-beige text-[#3E2A1D] flex flex-col">
      <Navbar solid />

      <main className="flex-grow pt-20 md:pt-24 pb-24 md:pb-16">
        {/* Compact Breadcrumb Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1.5 text-xs text-[#8B7E6F] font-medium"
          >
            <Link
              href="/"
              className="hover:text-[#6B4A2D] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#8B7E6F]/40" />
            <Link
              href="/products"
              className="hover:text-[#6B4A2D] transition-colors"
            >
              Store
            </Link>
            {product.category?.name && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#8B7E6F]/40" />
                <Link
                  href={`/products?category=${product.category.slug || product.category.name}`}
                  className="hover:text-[#6B4A2D] transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-[#8B7E6F]/40" />
            <span className="text-[#6B4A2D] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Standard Above-The-Fold E-Commerce 2-Column Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Image Gallery (Sticky on desktop, standard max height) */}
            <div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-24">
              <ImageGallery
                images={galleryImages}
                title={product.name}
                discountPercentage={discountPercentage}
              />
            </div>

            {/* Right Column: Product Details & Purchase Box */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6">
              
              {/* Category, Stock Status & Quick Share */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-[#6B4A2D]/10 text-[#6B4A2D] text-[11px] font-bold uppercase tracking-wider rounded-md">
                    {product.category?.name || "Premium Bag"}
                  </span>
                  {product.stock > 5 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-medium rounded-md">
                      <Check className="w-3 h-3 text-emerald-600" />
                      In Stock
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 text-[11px] font-medium rounded-md">
                      Only {product.stock} Left
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200/60 text-[11px] font-medium rounded-md">
                      Sold Out
                    </span>
                  )}
                </div>

                <button
                  onClick={handleShare}
                  className="w-8 h-8 rounded-lg border border-[#6B4A2D]/15 hover:bg-white text-[#8B7E6F] hover:text-[#6B4A2D] flex items-center justify-center transition-colors"
                  title="Share product"
                  type="button"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Title (Standard size, clean typography) */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2A1D] tracking-tight leading-snug">
                  {product.name}
                </h1>
                
                {/* Rating & Reviews */}
                <a
                  href="#reviews"
                  className="inline-flex items-center gap-2.5 mt-2.5 hover:opacity-80 transition-opacity"
                >
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#3E2A1D]">
                    {averageRating}
                  </span>
                  <span className="text-xs text-[#8B7E6F] underline decoration-dotted">
                    ({totalReviewsCount} verified review{totalReviewsCount === 1 ? "" : "s"})
                  </span>
                </a>
              </div>

              {/* Price Display */}
              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-[#6B4A2D]/10 space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-[#6B4A2D]">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base sm:text-lg text-[#8B7E6F]/60 line-through font-normal">
                      {formatPrice(product.compareAtPrice!)}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      SAVE {discountPercentage}%
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8B7E6F]">
                  Taxes included. {freeShippingText}
                </p>
              </div>

              {/* Short Description */}
              {product.shortDescription ? (
                <p className="text-sm text-[#6B4A2D]/80 leading-relaxed">
                  {product.shortDescription}
                </p>
              ) : product.description ? (
                <p className="text-sm text-[#6B4A2D]/80 leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              ) : null}

              {/* Purchase Actions (Standard heights: h-11 / h-12) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    max={product.stock}
                  />

                  {/* Add to Cart Button (Standard 48px height) */}
                  <button
                    id="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-11 md:h-12 px-6 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 bg-[#6B4A2D] hover:bg-[#543820] text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </span>
                  </button>

                  {/* Wishlist Button (Standard 48px x 48px) */}
                  <WishlistButton
                    productId={product.id || (product as any)._id}
                    className="w-11 h-11 md:w-12 md:h-12 flex-shrink-0 border border-[#6B4A2D]/20 rounded-xl bg-white hover:bg-[#F5F2EC] text-[#6B4A2D] shadow-sm transition-all active:scale-95 flex items-center justify-center"
                    iconClassName="w-5 h-5"
                  />
                </div>

                {/* SKU & Stock Info */}
                {product.sku && (
                  <p className="text-[11px] text-[#8B7E6F]/70 font-mono">
                    SKU: {product.sku}
                  </p>
                )}
              </div>

              {/* Trust Micro-Strip (Standard 3-grid) */}
              <div className="grid grid-cols-3 gap-2.5 py-2">
                <div className="p-3 bg-white/50 rounded-xl border border-[#6B4A2D]/10 flex flex-col items-center text-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#6B4A2D]" />
                  <span className="text-[11px] font-bold text-[#6B4A2D] leading-tight">
                    Express Delivery
                  </span>
                  <span className="text-[10px] text-[#8B7E6F] hidden sm:block">
                    3-5 Days
                  </span>
                </div>
                <div className="p-3 bg-white/50 rounded-xl border border-[#6B4A2D]/10 flex flex-col items-center text-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#6B4A2D]" />
                  <span className="text-[11px] font-bold text-[#6B4A2D] leading-tight">
                    2-Year Warranty
                  </span>
                  <span className="text-[10px] text-[#8B7E6F] hidden sm:block">
                    Full Coverage
                  </span>
                </div>
                <div className="p-3 bg-white/50 rounded-xl border border-[#6B4A2D]/10 flex flex-col items-center text-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#6B4A2D]" />
                  <span className="text-[11px] font-bold text-[#6B4A2D] leading-tight">
                    30-Day Returns
                  </span>
                  <span className="text-[10px] text-[#8B7E6F] hidden sm:block">
                    Hassle-Free
                  </span>
                </div>
              </div>

              {/* Product Specifications & Details Accordions */}
              <div className="border-t border-[#6B4A2D]/10 pt-2 space-y-1">
                <AccordionItem title="Description & Highlights" defaultOpen icon={Award}>
                  <div className="space-y-3 font-normal">
                    {product.description ? (
                      <p className="whitespace-pre-line leading-relaxed">
                        {product.description}
                      </p>
                    ) : (
                      <p>
                        Engineered with premium water-resistant materials, ergonomically contoured straps, and high-efficiency organization compartments.
                      </p>
                    )}
                  </div>
                </AccordionItem>

                {product.specifications && product.specifications.length > 0 && (
                  <AccordionItem title="Technical Specifications" icon={Layout}>
                    <div className="grid grid-cols-2 gap-3 py-2">
                      {product.specifications.map((spec, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white/40 rounded-lg border border-[#6B4A2D]/5"
                        >
                          <span className="text-[10px] uppercase font-bold text-[#8B7E6F] block tracking-wider">
                            {spec.name}
                          </span>
                          <span className="text-xs font-semibold text-[#6B4A2D]">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                )}

                <AccordionItem title="Shipping & Returns" icon={Truck}>
                  <div className="space-y-2">
                    <p>
                      • <strong>Complimentary standard shipping</strong> {freeShippingThreshold > 0 ? `on all orders over ${formatPrice(freeShippingThreshold)}.` : 'on all orders.'}
                    </p>
                    <p>
                      • Orders are dispatched within 24 hours on business days with real-time tracking.
                    </p>
                    <p>
                      • Return within 30 days of delivery in pristine, original condition for a full refund.
                    </p>
                  </div>
                </AccordionItem>

                <AccordionItem title="Care Instructions" icon={ShieldCheck}>
                  <div className="space-y-1.5">
                    <p>• Spot clean with warm water and a mild non-abrasive detergent.</p>
                    <p>• Do not machine wash or dry clean.</p>
                    <p>• Air dry completely in shade before storing.</p>
                  </div>
                </AccordionItem>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Highlights Section (Compact, standard padding) */}
        <section className="mt-16 md:mt-24 py-12 md:py-16 bg-[#F5F2EC]/60 border-t border-[#6B4A2D]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6B4A2D]/60 block mb-2">
                Engineered for Daily Life
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3E2A1D] tracking-tight">
                Designed to Move With You
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Ergonomic Balance",
                  desc: "Custom contoured shoulder harness distributes weight evenly to minimize spinal fatigue during daily commutes.",
                  icon: Layout,
                },
                {
                  title: "Weatherproof Materials",
                  desc: "Premium abrasion-resistant fabric with water-repellent coating shields your equipment through all elements.",
                  icon: Award,
                },
                {
                  title: "Quick-Access Storage",
                  desc: "Dedicated padded laptop sleeve and magnetic quick-access pockets keep your essentials reachable in seconds.",
                  icon: Zap,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[#6B4A2D]/10 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 bg-[#6B4A2D]/10 rounded-xl flex items-center justify-center mb-5 text-[#6B4A2D]">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#3E2A1D] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8B7E6F] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="reviews" className="py-12 md:py-16 bg-white border-t border-[#6B4A2D]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Rating Summary Bar */}
              <div className="lg:col-span-4 p-6 bg-[#F9F7F4] rounded-2xl border border-[#6B4A2D]/10 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-[#3E2A1D] mb-1">
                    Customer Reviews
                  </h2>
                  <p className="text-xs text-[#8B7E6F]">
                    Verified ratings from real Kangpack owners
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-[#6B4A2D]">
                    {averageRating}
                  </span>
                  <div>
                    <div className="flex text-amber-500 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-[#8B7E6F] font-medium">
                      Based on {totalReviewsCount} verified review{totalReviewsCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2 pt-2 border-t border-[#6B4A2D]/10 text-xs">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviewStatsResponse ? (reviewStatsResponse as any)[`rating${stars}`] || 0 : (stars === 5 ? totalReviewsCount : 0);
                    const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : (stars === 5 ? 100 : 0);
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="w-7 text-[#8B7E6F] font-semibold">{stars} ★</span>
                        <div className="flex-1 h-2 bg-[#6B4A2D]/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[#8B7E6F] text-[11px] font-mono">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push(`/auth/login?redirect=/product/${slug}`);
                      } else {
                        setIsReviewModalOpen(true);
                      }
                    }}
                    className="w-full py-3 px-4 bg-[#6B4A2D] hover:bg-[#533922] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#6B4A2D]/20 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Review Testimonials */}
              <div className="lg:col-span-8 space-y-4">
                {reviewsList.length > 0 ? (
                  reviewsList.map((review: any, i: number) => (
                    <div
                      key={review.id || review._id || i}
                      className="p-5 rounded-2xl border border-[#6B4A2D]/10 bg-[#F9F7F4]/40 space-y-2.5 transition-all hover:bg-[#F9F7F4]/70"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#6B4A2D] text-white font-black text-xs flex items-center justify-center">
                            {(review.user?.firstName || review.user?.name || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#3E2A1D]">
                                {review.user?.firstName ? `${review.user.firstName} ${review.user.lastName || ""}` : (review.user?.name || "Verified Customer")}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified Buyer
                              </span>
                            </div>
                            <div className="flex text-amber-500 mt-0.5">
                              {[...Array(5)].map((_, starIndex) => (
                                <Star
                                  key={starIndex}
                                  className={`w-3 h-3 ${starIndex < (review.rating || 5) ? "fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#8B7E6F]">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="text-sm font-bold text-[#3E2A1D]">
                          {review.title}
                        </h4>
                      )}
                      <p className="text-xs sm:text-sm text-[#8B7E6F] leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 px-6 bg-[#F9F7F4]/40 rounded-2xl border border-dashed border-[#6B4A2D]/20 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                    </div>
                    <h3 className="text-base font-bold text-[#3E2A1D]">
                      No Customer Reviews Yet
                    </h3>
                    <p className="text-xs text-[#8B7E6F] max-w-sm mx-auto">
                      Be the first voyager to share feedback on this handcrafted gear.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push(`/auth/login?redirect=/product/${slug}`);
                        } else {
                          setIsReviewModalOpen(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B4A2D] hover:bg-[#533922] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Write the First Review
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Write a Review Modal */}
        <AnimatePresence>
          {isReviewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#6B4A2D]/10 shadow-2xl relative"
              >
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-black text-[#3E2A1D] uppercase tracking-tight mb-1">
                  Write a Review
                </h3>
                <p className="text-xs text-[#8B7E6F] mb-6">
                  Share your genuine experience with {product.name}
                </p>

                <form onSubmit={handleSubmitReview} className="space-y-5">
                  {/* Rating Selector */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3E2A1D] block mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${s <= reviewRating ? "fill-amber-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-[#6B4A2D] ml-2">
                        {reviewRating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3E2A1D] block mb-1.5">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Exceptional build quality & comfort"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#6B4A2D]"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3E2A1D] block mb-1.5">
                      Your Experience
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell other travelers about the materials, fit, storage, and how it holds up..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#6B4A2D]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      disabled={isSubmittingReview}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#6B4A2D] hover:bg-[#533922] text-white flex items-center gap-2 shadow-md shadow-[#6B4A2D]/20 disabled:opacity-70"
                    >
                      {isSubmittingReview ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* You May Also Like / Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 md:py-16 bg-[#F9F7F4] border-t border-[#6B4A2D]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B4A2D]/60 block mb-1">
                    Curated Collection
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3E2A1D]">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="text-xs sm:text-sm font-semibold text-[#6B4A2D] hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relProduct: Product, idx: number) => (
                  <ProductCard
                    key={relProduct.id || (relProduct as any)._id}
                    product={relProduct}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mobile Sticky Add to Cart Bar (Visible only on small viewports) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#6B4A2D]/15 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#3E2A1D] truncate">
              {product.name}
            </span>
            <span className="text-base font-black text-[#6B4A2D]">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="h-10 px-5 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center gap-2 bg-[#6B4A2D] hover:bg-[#543820] text-white shadow-md active:scale-95 transition-all flex-shrink-0 disabled:opacity-40"
            type="button"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock === 0 ? "Sold Out" : "Add"}</span>
          </button>
        </div>

      </main>
    </div>
  );
}
