"use client";

import React, { useState } from "react";
import { Check, X, Briefcase, Tag } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart, setCartOpen } from "@/lib/store/features/cart/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api";
import { QUERY_KEYS } from "@/lib/constants";
import { toast } from "@/lib/toast";
import { Product } from "@/types";

// Fallback catalog plans if API returns empty array during initial setup
const fallbackProducts: Partial<Product>[] = [
  {
    id: "flagship-fallback",
    name: "Radiation Shield Edition",
    slug: "kangpack-flagship-edition",
    price: 14999,
    compareAtPrice: 17999,
    shortDescription:
      "Built-in shielding for added peace of mind during extended laptop use.",
    tags: ["Most Popular"],
    isBestseller: true,
  },
  {
    id: "classic-fallback",
    name: "Standard Edition",
    slug: "kangpack-classic",
    price: 12999,
    compareAtPrice: 14999,
    shortDescription:
      "All essential features for mobile productivity without radiation shielding.",
    tags: ["Classic"],
  },
];

const getProductFeatures = (productName: string, description?: string) => {
  const isShield =
    productName.toLowerCase().includes("shield") ||
    productName.toLowerCase().includes("flagship") ||
    (description && description.toLowerCase().includes("shield"));

  return [
    { name: "Hands-Free Workstation Design", included: true },
    { name: "Ergonomic Harness System", included: true },
    { name: "Premium Leather Build", included: true },
    { name: "Lightweight & Portable", included: true },
    { name: "Laptop Radiation Shield Layer", included: !!isShield },
    { name: "Weather-Resistant Finish", included: true },
  ];
};

const Pricing: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "pricing-plans"],
    queryFn: () => productsApi.getProducts({ page: 1, limit: 10 }),
  });

  const rawProducts = data?.data || [];
  
  // Use API products if available, otherwise fallback to default catalog plans
  const displayProducts: Partial<Product>[] =
    rawProducts.length > 0 ? rawProducts.slice(0, 2) : fallbackProducts;

  // Set default active product if not selected
  const activeProductId =
    selectedProductId || displayProducts[0]?.id || displayProducts[0]?._id || "";

  const handleBuyNow = async (product: Partial<Product>) => {
    // Construct valid Product object for store dispatch
    const fullProduct: Product = {
      id: product.id || (product as any)._id || "temp-id",
      _id: (product as any)._id || product.id,
      name: product.name || "Kangpack Edition",
      slug: product.slug || "kangpack",
      price: product.price || 12999,
      compareAtPrice: product.compareAtPrice,
      description: product.description || product.shortDescription || "",
      shortDescription: product.shortDescription,
      images: product.images && product.images.length > 0 ? product.images : ["/assets/tickers/main.jpeg"],
      category: product.category || { id: "cat-1", name: "Workstation", slug: "workstation", isActive: true },
      sku: product.sku || `KP-${product.slug || "EDITION"}`,
      stock: product.stock ?? 10,
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? true,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    };

    try {
      await dispatch(
        addToCart({
          product: fullProduct,
          quantity: 1,
        })
      ).unwrap();
      toast.success(`Added ${fullProduct.name} to cart`);
      dispatch(setCartOpen(true));
    } catch {
      toast.error(`Could not add ${fullProduct.name} to cart`);
    }
  };

  return (
    <section className="bg-transparent py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center flex flex-col items-center mb-8 sm:mb-10 md:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3">
            <Briefcase className="w-3.5 h-3.5 brand-primary" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
              Variants & Edition
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <span className="heading-gradient">Choose Your Edition</span>
          </h2>

          <p className="light-text text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Pick the variant that fits your workflow and lifestyle. Dynamic pricing synced with our live catalog.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-[#F9F7F4] rounded-3xl p-8 border border-[#6B4A2D]/10 h-[500px] animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-6 bg-[#6B4A2D]/10 rounded w-1/3"></div>
                  <div className="h-10 bg-[#6B4A2D]/10 rounded w-2/3"></div>
                  <div className="h-12 bg-[#6B4A2D]/10 rounded w-1/2"></div>
                  <div className="space-y-2 pt-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-4 bg-[#6B4A2D]/10 rounded w-3/4"></div>
                    ))}
                  </div>
                </div>
                <div className="h-12 bg-[#6B4A2D]/15 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {displayProducts.map((product) => {
              const productId = product.id || (product as any)._id || product.slug || "";
              const isActive = activeProductId === productId;
              const features = getProductFeatures(
                product.name || "",
                product.description || product.shortDescription
              );

              const tag =
                product.isBestseller || product.tags?.includes("Most Popular")
                  ? "Most Popular"
                  : product.compareAtPrice && product.compareAtPrice > (product.price || 0)
                  ? "Special Discount"
                  : product.tags?.[0];

              const hasDiscount =
                product.compareAtPrice && product.compareAtPrice > (product.price || 0);

              return (
                <div
                  key={productId}
                  onClick={() => setSelectedProductId(productId)}
                  className={`relative cursor-pointer transition-all duration-300 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 shadow-xs flex flex-col h-full ${
                    isActive
                      ? "bg-[#EAE5DC] border-[#6B4A2D]/30 shadow-md scale-[1.01]"
                      : "bg-[#F9F7F4] border-[#6B4A2D]/10 hover:border-[#6B4A2D]/25 hover:shadow-md"
                  }`}
                >
                  {tag && (
                    <div className="absolute -top-3 left-6 sm:left-8">
                      <span className="btn-premium text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md border-none flex items-center gap-1.5">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-[#2D241E]">
                    {product.name}
                  </h3>

                  <div className="mb-4 sm:mb-6 flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6B4A2D]">
                      ₹{(product.price || 0).toLocaleString("en-IN")}
                    </span>

                    {hasDiscount && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl text-[#8B7E6F] line-through opacity-70">
                          ₹{product.compareAtPrice!.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Save ₹{(product.compareAtPrice! - (product.price || 0)).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-[#8B7E6F] text-xs sm:text-sm leading-relaxed mb-6">
                    {product.shortDescription ||
                      product.description ||
                      "Designed for seamless mobility and desktop ergonomics."}
                  </p>

                  <div className="space-y-4 xl:space-y-2 2xl:space-y-4 mb-12 xl:mb-6">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div
                          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${
                            feature.included
                              ? "bg-[#6B4A2D]/10"
                              : "bg-[#6B4A2D]/5"
                          }`}
                        >
                          {feature.included ? (
                            <Check
                              className="w-3 h-3 text-[#6B4A2D]"
                              strokeWidth={3}
                            />
                          ) : (
                            <X
                              className="w-3 h-3 text-[#8B7E6F]/40"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm tracking-wide ${
                            feature.included
                              ? "text-[#6B4A2D] font-medium"
                              : "text-[#8B7E6F]/50"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <PrimaryButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(product);
                    }}
                    className="mt-auto btn-premium"
                  >
                    Buy Now
                  </PrimaryButton>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Background Decorative Shapes */}
      <div className="absolute -left-20 top-20 w-[400px] h-[400px] bg-[#EAE5DC]/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute -right-20 bottom-20 w-[400px] h-[400px] bg-[#EAE5DC]/30 rounded-full blur-[100px] -z-10" />
    </section>
  );
};

export default Pricing;
