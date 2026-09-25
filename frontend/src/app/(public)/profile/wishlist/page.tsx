"use client";

import { useEffect } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/common/ProductCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, loading, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading && wishlist.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64 mt-2" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          My Wishlist
        </h1>
        <p className="text-muted-foreground mt-1">
          Saved items you want to buy later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item, index) => (
          <ProductCard
            key={item.id || item._id}
            product={item}
            index={index}
          />
        ))}
      </div>

      {wishlist.length === 0 && !loading && (
        <div className="py-12 text-center border-2 border-dashed rounded-xl">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900">
            Your wishlist is empty
          </h3>
          <p className="text-muted-foreground mb-6">
            Start browsing to add items to your wishlist.
          </p>
          <Button asChild className="rounded-full px-8">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
