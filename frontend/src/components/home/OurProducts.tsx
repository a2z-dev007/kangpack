"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ASSETS } from "@/constants/assets";
import PrimaryButton from "@/components/common/PrimaryButton";
import { ParallaxImage } from "@/components/common/ScrollSection";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cart/cartSlice";
import { Product } from "@/types";

const ProductCard: React.FC<{
  product: Product;
  index: number;
}> = ({ product, index }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product: product as any, quantity: 1 }));
    toast.success(`Added ${product.name} to cart`);
  };

  const tags = [];
  if (product.isNew) tags.push("New");
  if (product.isBestseller) tags.push("Best Seller");
  if (product.tags) tags.push(...product.tags.slice(0, 2));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md ring-1 ring-[#a67c52]/10 hover:ring-[#a67c52]/30 transition-all duration-500 flex flex-col h-full"
    >
      <Link
        href={ROUTES.PRODUCT_DETAIL(product.slug)}
        className="flex-grow flex flex-col"
      >
        {/* Image Container */}
        <div className="aspect-[4/5] relative overflow-hidden bg-[#f0ece6]">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90 rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white rounded-full">
                Low Stock
              </span>
            )}
          </div>

          <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
            <ParallaxImage
              src={product.images?.[0] || ASSETS.TICKERS.MAIN}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay Action */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 backdrop-blur-xl border border-[#a67c52]/20 text-[#1a1a1a] px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        <div className="p-5 md:p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] md:text-xs font-bold text-[#1a1a1a]/40 uppercase tracking-widest line-clamp-1">
              {product.category?.name || "Collection"}
            </span>
            <span className="text-[#1a1a1a] font-bold text-lg md:text-xl whitespace-nowrap ml-4">
              {formatPrice(product.price)}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]/90 mb-2 group-hover:text-[#1a1a1a] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[#1a1a1a]/50 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 flex-grow">
            {product.description?.slice(0, 100) + "..."}
          </p>
          <div className="pt-4 border-t border-[#a67c52]/10 flex items-center justify-between mt-auto">
            <div className="flex gap-1 text-[#a67c52]/40">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full hover:bg-[#1a1a1a]/10 transition-colors text-[#1a1a1a]/60 z-20 relative"
              disabled={product.stock === 0}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const OurProducts: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "featured"],
    queryFn: () => productsApi.getProducts({ page: 1, limit: 8 }),
  });

  const products = data?.data || [];

  return (
    <section
      id="products"
      className="py-16 md:py-24 bg-[#f5f2ee] text-[#1a1a1a] relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#a67c52]/5 to-transparent -z-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[#1a1a1a]/8 backdrop-blur-md border border-[#a67c52]/20 px-4 py-2 rounded-lg mb-6"
            >
              <div className="w-1.5 h-1.5 bg-[#a67c52] rounded-full"></div>
              <span className="text-[11px] font-medium tracking-wide text-[#1a1a1a]/70 uppercase">
                Collection
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] to-[#1a1a1a]/50"
            >
              Explore Our <span className="text-[#1a1a1a]/40">Products.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#1a1a1a]/50 text-base md:text-lg max-w-lg"
            >
              Thoughtfully designed gear to elevate your workflow, wherever life
              takes you.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/products" className="hidden md:flex">
              <PrimaryButton className="bg-[#1a1a1a] text-white font-semibold hover:scale-105 transition-transform" textColor="#fff" circleColor="#fff" hoverTextColor="#000">
                View All Products
              </PrimaryButton>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse ring-1 ring-[#a67c52]/10">
                <div className="h-2/3 bg-[#f0ece6] rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-white/5 rounded w-1/4"></div>
                  <div className="h-8 bg-white/5 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center md:hidden"
        >
          <Link href="/products">
            <PrimaryButton className="bg-[#1a1a1a] text-white font-semibold hover:scale-105 transition-transform" textColor="#fff" circleColor="#fff" hoverTextColor="#000">View All Products</PrimaryButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default OurProducts;
