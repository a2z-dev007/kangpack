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
import { addToCart, setCartOpen } from "@/lib/store/features/cart/cartSlice";
import { Product } from "@/types";
import { WishlistButton } from "@/components/common/WishlistButton";


const ProductCard: React.FC<{
  product: Product;
  index: number;
}> = ({ product, index }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prodId = product.id || (product as any)._id;
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

  const tags: string[] = [];
  if (product.isNew) tags.push("New");
  if (product.isBestseller) tags.push("Best Seller");
  if (product.tags) tags.push(...product.tags.slice(0, 2));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <Link
        href={ROUTES.PRODUCT_DETAIL(product.slug || product.id)}
        className="flex-grow flex flex-col"
      >
        {/* Image Container with 4/5 aspect ratio matching old UI */}
        <div className="aspect-[4/5] relative overflow-hidden bg-brand-beige/20">
          <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-brand-brown rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white rounded-full shadow-sm">
                Low Stock
              </span>
            )}
          </div>

          {/* Wishlist Button Overlay */}
          <div className="absolute top-4 right-4 z-20">
            <WishlistButton
              productId={product.id || (product as any)._id}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out">
            <img
              src={product.images?.[0] || ASSETS.TICKERS.MAIN}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay Action */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-brand-brown px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        <div className="p-5 md:p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] md:text-xs font-bold text-brand-brown/40 uppercase tracking-widest line-clamp-1">
              {product.category?.name || "Collection"}
            </span>
            <span className="text-brand-brown font-bold text-lg md:text-xl whitespace-nowrap ml-4">
              {formatPrice(product.price)}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-brand-brown mb-2 group-hover:text-brand-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-brand-brown/60 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 flex-grow">
            {product.description
              ? product.description.slice(0, 100) + "..."
              : "Experience effortless mobile productivity designed for creators on the move."}
          </p>
          <div className="pt-4 border-t border-brand-brown/5 flex items-center justify-between mt-auto">
            <div className="flex gap-1 text-[#D4CEC4]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full hover:bg-brand-beige transition-colors text-brand-brown z-20 relative"
              disabled={product.stock === 0}
              aria-label="Add to cart"
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
      className="py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-brand-beige/30 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#D4CEC4]/10 to-transparent -z-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-10 md:mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3"
            >
              <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full"></div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#6B4A2D] uppercase">
                Collection
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2"
            >
              <span className="heading-gradient">Explore Our Products</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#8B7E6F] text-xs sm:text-sm md:text-base max-w-lg leading-relaxed"
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
              <PrimaryButton className="btn-premium">
                View All Products
              </PrimaryButton>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-[450px] animate-pulse"
              >
                <div className="h-2/3 bg-gray-100 rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id || (product as any)._id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-brand-brown/10 p-8">
            <div className="w-16 h-16 bg-[#6B4A2D]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#6B4A2D]/30">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-brown mb-2">No Products Available</h3>
            <p className="text-sm text-brand-brown/60 max-w-md mx-auto">
              Our products are currently being updated in the system. Please check back shortly.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center md:hidden"
        >
          <Link href="/products">
            <PrimaryButton>View All Products</PrimaryButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default OurProducts;
