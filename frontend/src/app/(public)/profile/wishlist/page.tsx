"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Trash2, Heart, ExternalLink } from "lucide-react";

export default function WishlistPage() {
  // Mock data
  const wishlistItems = [
    {
      id: "1",
      name: "Premium Noise Cancelling Headphones",
      price: 299.99,
      image: "/placeholder-headphones.jpg",
      inStock: true,
      category: "Electronics",
    },
    {
      id: "2",
      name: "Ergonomic Wireless Mouse",
      price: 49.99,
      image: "/placeholder-mouse.jpg",
      inStock: false,
      category: "Accessories",
    },
    {
      id: "3",
      name: "4K Ultra HD Monitor",
      price: 499.99,
      image: "/placeholder-screen.jpg",
      inStock: true,
      category: "Electronics",
    },
  ];

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
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            className="border-none shadow-md hover:shadow-xl transition-all group bg-white overflow-hidden flex flex-col h-full"
          >
            <div className="relative aspect-video bg-muted overflow-hidden">
              {/* Placeholder for real image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <Button variant="secondary" size="sm" className="rounded-full">
                  View Product
                </Button>
              </div>
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                <Heart className="h-12 w-12" />
              </div>
              {!item.inStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Out of Stock
                </div>
              )}
            </div>

            <CardContent className="p-5 flex-grow flex flex-col">
              <div className="mb-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {item.name}
              </h3>
              <p className="font-extrabold text-xl text-gray-900 mb-4">
                {formatPrice(item.price)}
              </p>

              <div className="mt-auto flex gap-2">
                <Button className="flex-1 rounded-lg" disabled={!item.inStock}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {wishlistItems.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground">
              Start browsing to add items to your wishlist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
