"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingBag, Maximize2 } from "lucide-react";
import Link from "next/link";
import { ASSETS } from "@/constants/assets";
import { ROUTES } from "@/lib/constants";
import { formatPrice, getImageUrl, cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart, setCartOpen } from "@/lib/store/features/cart/cartSlice";
import { Product } from "@/types";
import { WishlistButton } from "@/components/common/WishlistButton";
import { ProductLightbox } from "@/components/common/ProductLightbox";

export interface ProductCardProps {
  product: Product | any;
  index?: number;
  className?: string;
  imageAspectRatio?: string;
  showDescription?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  className,
  imageAspectRatio = "aspect-square",
  showDescription = true,
}) => {
  const dispatch = useAppDispatch();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Normalize product ID and images
  const prodId = product.id || product._id;
  const rawImages: any[] = product.images || [];
  const normalizedImages: string[] = rawImages
    .map((img: any) => (typeof img === "string" ? img : img?.url || ""))
    .filter(Boolean);

  const primaryImage = normalizedImages.length > 0 ? normalizedImages[0] : ASSETS.TICKERS.MAIN;
  const lightboxImages = (normalizedImages.length > 0 ? normalizedImages : [ASSETS.TICKERS.MAIN]).map((img) =>
    getImageUrl(img)
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(
        addToCart({
          product: { ...product, id: prodId },
          quantity: 1,
        })
      ).unwrap();
      toast.success(`Added ${product.name} to cart`);
      dispatch(setCartOpen(true));
    } catch {
      // Toast error is handled in thunk
    }
  };


  const detailUrl = ROUTES.PRODUCT_DETAIL(product.slug || prodId);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: index * 0.05 }}
        className={cn(
          "group relative bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-[#6B4A2D]/10",
          className
        )}
      >
        <Link href={detailUrl} className="flex-grow flex flex-col">
          {/* Image Container */}
          <div className={cn("relative overflow-hidden bg-brand-beige/20", imageAspectRatio)}>

            {/* Top Right Action Overlay (Quick Zoom & Wishlist) */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full text-[#6B4A2D] transition-all shadow-xs hover:scale-105 active:scale-95"
                title="Quick Zoom & Inspect"
                aria-label="Quick Zoom & Inspect"
                type="button"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <WishlistButton
                productId={prodId}
                className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-xs hover:scale-105 active:scale-95"
              />
            </div>

            {/* Product Image */}
            <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out">
              <img
                src={getImageUrl(primaryImage)}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hover View Details Pill */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white text-brand-brown px-5 py-2.5 rounded-full font-bold uppercase text-[11px] tracking-widest flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card Body Content */}
          <div className="p-4 sm:p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-brand-brown/50 uppercase tracking-widest line-clamp-1">
                {product.category?.name || "Collection"}
              </span>
              <span className="text-brand-brown font-bold text-base sm:text-lg whitespace-nowrap ml-3">
                {formatPrice(product.price)}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-brand-brown mb-1.5 group-hover:text-brand-accent transition-colors line-clamp-1">
              {product.name}
            </h3>

            {showDescription && (
              <p className="text-brand-brown/60 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 flex-grow">
                {product.shortDescription || product.description
                  ? (product.shortDescription || product.description).slice(0, 90) + "..."
                  : "Experience effortless mobile productivity designed for creators on the move."}
              </p>
            )}

            {/* Card Footer: Rating + Add to Cart */}
            <div className="pt-3 border-t border-brand-brown/5 flex flex-col gap-2.5 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-[#D4CEC4]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-2.5 px-4 rounded-xl font-bold uppercase tracking-wider text-[11px] sm:text-xs flex items-center justify-center gap-2 bg-[#6B4A2D] hover:bg-[#543820] text-white shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed z-20 relative"
                aria-label="Add to cart"
                title={product.stock === 0 ? "Sold Out" : "Add to Cart"}
                type="button"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.stock === 0 ? "Sold Out" : "Add to Cart"}</span>
              </button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick View Lightbox */}
      <ProductLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxImages}
        title={product.name}
      />
    </>
  );
};

export default ProductCard;
