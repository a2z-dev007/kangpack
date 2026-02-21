"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import Navbar from "@/components/home/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import { ASSETS } from "@/constants/assets";
import ScrollSection, {
  ParallaxImage,
} from "@/components/common/ScrollSection";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cart/cartSlice";
import { toast } from "sonner";

// Custom Product Card Component matching the new aesthetic
const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product: product as any, quantity: 1 }));
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
    >
      <Link
        href={ROUTES.PRODUCT_DETAIL(product.slug)}
        className="flex-grow flex flex-col"
      >
        {/* Image Container */}
        <div className="aspect-[16/11] relative overflow-hidden bg-brand-beige/20">
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white rounded-full">
                Low Stock
              </span>
            </div>
          )}

          <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                No Image
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white text-brand-brown px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              View Details <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-brand-brown/40 uppercase tracking-widest line-clamp-1">
              {product.category?.name || "Accessories"}
            </span>
            <div className="flex flex-col items-end">
              <span className="text-brand-brown font-bold text-lg">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-brand-brown mb-2 group-hover:text-brand-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-brand-brown/60 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
            {product.description || "Experience premium quality and design."}
          </p>

          <div className="pt-4 border-t border-brand-brown/5 flex items-center justify-between mt-auto">
            <div className="flex gap-1 text-[#D4CEC4]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full hover:bg-brand-beige transition-colors text-brand-brown z-20 relative"
              disabled={product.stock === 0}
              title="Add to Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function ProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "all"],
    queryFn: () => productsApi.getProducts({ page: 1, limit: 12 }),
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-beige">
      <Navbar solid />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-brand-brown/30 z-10" />
          <ParallaxImage
            src={ASSETS.TICKERS.MAIN2}
            className="w-full h-full object-cover"
            alt="Our Products"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 pt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border border-white/20"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold tracking-widest text-white uppercase">
                Shop Collection
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6"
            >
              All Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/90 text-lg md:text-xl max-w-2xl font-light"
            >
              Explore our complete lineup of premium gear designed for the
              modern creator.
            </motion.p>
          </div>
        </div>

        <ScrollSection className="py-24 px-6 md:px-12 relative z-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#D4CEC4]/10 to-transparent -z-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="max-w-[1400px] mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-[500px] animate-pulse relative overflow-hidden"
                  >
                    <div className="h-2/3 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {data?.data && data.data.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {data.data.map((product: any, index: number) => (
                      <ProductCard
                        key={product.id || product._id || index}
                        product={product}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/50 rounded-3xl border border-[#6B4A2D]/5">
                    <div className="w-20 h-20 bg-[#6B4A2D]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#6B4A2D]/20">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-brown">
                      No products found.
                    </h3>
                    <p className="text-brand-brown/60 mt-2 max-w-xs mx-auto">
                      We couldn&apos;t find any products in our collection right
                      now. Please check back later.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-8 px-8 py-3 bg-[#6B4A2D] text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#5A3E25] transition-colors"
                    >
                      Refresh Page
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollSection>
      </main>
    </div>
  );
}
