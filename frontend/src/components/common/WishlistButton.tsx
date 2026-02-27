"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className,
  iconClassName,
  showText = false,
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const active = isInWishlist(productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      router.push(ROUTES.LOGIN);
      return;
    }

    try {
      if (active) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={cn(
        "flex items-center justify-center gap-2 transition-all duration-300",
        active 
          ? "text-red-500" 
          : "text-inherit",
        className
      )}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all duration-300",
          active && "fill-current scale-110",
          iconClassName
        )}
      />
      {showText && (
        <span className="text-sm font-bold uppercase tracking-widest">
          {active ? "Saved" : "Save for later"}
        </span>
      )}
    </button>
  );
};
