"use client";

import { useState, useCallback } from "react";
import { toast } from "@/lib/toast";
import { formatPrice } from "@/lib/utils";
import { useValidateCoupon } from "@/features/coupons/queries";
import type { PublicCoupon } from "@/features/coupons/api";

export interface AppliedCoupon {
  code: string;
  discount: number;
  name?: string;
  type?: string;
  value?: number;
}

export function useCoupon(subtotal: number) {
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const { mutateAsync: validateCoupon, isPending: isApplyingCoupon } =
    useValidateCoupon();

  const handleApplyCoupon = useCallback(
    async (codeOverride?: string) => {
      const code = (codeOverride ?? couponInput).trim().toUpperCase();
      if (!code) {
        toast.error("Please enter a coupon code");
        return false;
      }
      try {
        const result = await validateCoupon({ code, orderValue: subtotal });
        if (result.valid) {
          setAppliedCoupon({
            code,
            discount: result.discount,
          });
          setCouponDiscount(result.discount);
          setCouponInput("");
          toast.success(
            `Coupon "${code}" applied! You saved ${formatPrice(result.discount)}`,
          );
          return true;
        } else {
          toast.error(result.message || "Invalid coupon code");
          return false;
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to apply coupon");
        return false;
      }
    },
    [couponInput, subtotal, validateCoupon],
  );

  /** One-tap apply directly from a PublicCoupon card */
  const handleApplyPublicCoupon = useCallback(
    async (coupon: PublicCoupon) => {
      return handleApplyCoupon(coupon.code);
    },
    [handleApplyCoupon],
  );

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput("");
    toast.info("Coupon removed");
  }, []);

  return {
    couponInput,
    setCouponInput,
    appliedCoupon,
    couponDiscount,
    isApplyingCoupon,
    handleApplyCoupon,
    handleApplyPublicCoupon,
    handleRemoveCoupon,
  };
}
