"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Trash2, Heart, ExternalLink } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
  const { wishlist, loading, fetchWishlist, removeFromWishlist } = useWishlist();

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <Card
            key={item.id || item._id}
            className="border-none shadow-md hover:shadow-xl transition-all group bg-white overflow-hidden flex flex-col h-full"
          >
            <div className="relative aspect-square bg-muted overflow-hidden">
              <Link href={`/product/${item.slug}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <Button variant="secondary" size="sm" className="rounded-full">
                    View Product
                  </Button>
                </div>
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                    <Heart className="h-12 w-12" />
                  </div>
                )}
              </Link>
              {item.stock <= 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  Out of Stock
                </div>
              )}
            </div>

            <CardContent className="p-5 flex-grow flex flex-col">
              <div className="mb-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                  {(item.category as any)?.name || item.category || "General"}
                </span>
              </div>
              <Link href={`/product/${item.slug}`}>
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>
              <p className="font-extrabold text-xl text-gray-900 mb-4">
                {formatPrice(item.price)}
              </p>

              <div className="mt-auto flex gap-2">
                <Button 
                  className="flex-1 rounded-lg" 
                  disabled={item.stock <= 0}
                  asChild
                >
                  <Link href={`/product/${item.slug}`} className="flex items-center gap-1">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Details
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFromWishlist(item.id || item._id!)}
                  className="rounded-lg text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {wishlist.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Start browsing to add items to your wishlist.
            </p>
            <Button asChild rounded-full px-8>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
