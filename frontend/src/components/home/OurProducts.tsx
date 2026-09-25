"use client";
import React from "react";
import { ShoppingBag } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { ParallaxImage } from "@/components/common/ScrollSection";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { ProductCard } from "@/components/common/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";


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
