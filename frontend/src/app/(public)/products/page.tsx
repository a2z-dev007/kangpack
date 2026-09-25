"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import { categoriesApi } from "@/features/categories/api";
import Navbar from "@/components/home/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import {
  ShoppingBag,
  ArrowRight,
  Star,
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { ASSETS } from "@/constants/assets";
import ScrollSection, {
  ParallaxImage,
} from "@/components/common/ScrollSection";
import { ProductCard } from "@/components/common/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync category with URL params
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const [sortField, sortOrder] = useMemo(() => {
    const [field, order] = sortBy.split("_");
    return [field, order as "asc" | "desc"];
  }, [sortBy]);

  // Fetch categories for filters
  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, "list"],
    queryFn: () => categoriesApi.getCategories({ limit: 50 }),
  });

  const categories = categoriesData?.data || [];

  // Fetch products with active filters
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      QUERY_KEYS.PRODUCTS,
      page,
      limit,
      debouncedSearch,
      selectedCategory,
      sortField,
      sortOrder,
    ],
    queryFn: () =>
      productsApi.getProducts({
        page,
        limit,
        search: debouncedSearch || undefined,
        category: selectedCategory || undefined,
        sort: sortField,
        order: sortOrder,
      } as any),
  });

  const products = data?.data || [];
  const rawPagination = data?.pagination;
  const pagination = {
    page: rawPagination?.page ?? 1,
    limit: rawPagination?.limit ?? 12,
    total: rawPagination?.total ?? 0,
    totalPages: rawPagination?.totalPages ?? rawPagination?.pages ?? 1,
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    if (slug) {
      router.push(`/products?category=${slug}`, { scroll: false });
    } else {
      router.push(`/products`, { scroll: false });
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSortBy("createdAt_desc");
    setPage(1);
    router.push(`/products`, { scroll: false });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-beige">
      <Navbar solid />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[45vh] min-h-[380px] overflow-hidden">
          <div className="absolute inset-0 bg-brand-brown/40 z-10" />
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
              className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm mb-4 border border-white/20"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold tracking-widest text-white uppercase">
                Artisan Handcrafted
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4"
            >
              Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl font-light"
            >
              Explore handcrafted leather goods and rugged backpacks engineered for modern journeys.
            </motion.p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="sticky top-20 z-30 bg-brand-beige/95 backdrop-blur-md border-b border-[#6B4A2D]/10 py-4 px-6 md:px-12 shadow-sm">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E6F]" />
              <Input
                type="text"
                placeholder="Search products by name or feature..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-9 bg-white border-[#6B4A2D]/20 h-11 rounded-2xl text-xs sm:text-sm focus-visible:ring-[#6B4A2D]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7E6F] hover:text-[#6B4A2D]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills & Sort */}
            <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-md scrollbar-none">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === ""
                      ? "bg-[#6B4A2D] text-white shadow-sm"
                      : "bg-white text-[#6B4A2D] border border-[#6B4A2D]/20 hover:border-[#6B4A2D]"
                  }`}
                >
                  All
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat.id || cat._id}
                    onClick={() =>
                      handleCategorySelect(
                        selectedCategory === (cat.slug || cat.id)
                          ? ""
                          : cat.slug || cat.id
                      )
                    }
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === (cat.slug || cat.id)
                        ? "bg-[#6B4A2D] text-white shadow-sm"
                        : "bg-white text-[#6B4A2D] border border-[#6B4A2D]/20 hover:border-[#6B4A2D]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B7E6F]" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white border border-[#6B4A2D]/20 rounded-xl px-3 py-1.5 text-xs font-bold text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D] h-9"
                >
                  <option value="createdAt_desc">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(debouncedSearch || selectedCategory) && (
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-6 flex items-center justify-between">
            <p className="text-xs font-bold text-[#8B7E6F]">
              Showing results for{" "}
              {debouncedSearch && (
                <span className="text-[#6B4A2D] font-black">
                  &ldquo;{debouncedSearch}&rdquo;{" "}
                </span>
              )}
              {selectedCategory && (
                <span>
                  in{" "}
                  <span className="text-[#6B4A2D] font-black uppercase">
                    {categories.find(
                      (c: any) => (c.slug || c.id) === selectedCategory
                    )?.name || selectedCategory}
                  </span>
                </span>
              )}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2.5 rounded-lg"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Products Grid */}
        <ScrollSection className="py-12 md:py-16 px-6 md:px-12 relative z-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-[460px] animate-pulse relative overflow-hidden"
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
                {products.length > 0 ? (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                      {products.map((product: any, index: number) => (
                        <ProductCard
                          key={product.id || product._id || index}
                          product={product}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#6B4A2D]/10">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1 || isFetching}
                          onClick={() => {
                            setPage((p) => Math.max(1, p - 1));
                            window.scrollTo({ top: 350, behavior: "smooth" });
                          }}
                          className="rounded-xl border-[#6B4A2D]/20 text-[#6B4A2D] hover:bg-[#6B4A2D]/5 h-10 px-4 text-xs font-bold"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <span className="px-4 py-2 text-xs font-bold text-[#8B7E6F]">
                          Page <strong className="text-[#6B4A2D]">{page}</strong> of{" "}
                          {pagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= pagination.totalPages || isFetching}
                          onClick={() => {
                            setPage((p) => Math.min(pagination.totalPages, p + 1));
                            window.scrollTo({ top: 350, behavior: "smooth" });
                          }}
                          className="rounded-xl border-[#6B4A2D]/20 text-[#6B4A2D] hover:bg-[#6B4A2D]/5 h-10 px-4 text-xs font-bold"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/50 rounded-3xl border border-[#6B4A2D]/5 max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-[#6B4A2D]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#6B4A2D]/20">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-[#6B4A2D]">
                      No products found
                    </h3>
                    <p className="text-brand-brown/60 mt-2 max-w-xs mx-auto text-xs sm:text-sm">
                      We couldn&apos;t find any products matching your search or filter criteria.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-8 px-8 py-3 bg-[#6B4A2D] text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#5A3E25] transition-colors shadow-md shadow-[#6B4A2D]/20"
                    >
                      Clear All Filters
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-beige flex items-center justify-center">
          <div className="text-sm font-bold text-[#6B4A2D]">Loading catalog...</div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
