"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
  Clock,
  Sparkles,
  Copy,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { usePublicCoupons } from "@/features/coupons/queries";
import type { PublicCoupon } from "@/features/coupons/api";
import type { AppliedCoupon } from "@/hooks/use-coupon";
import { toast } from "@/lib/toast";

interface CouponPickerProps {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  couponInput: string;
  isApplyingCoupon: boolean;
  onCouponInputChange: (val: string) => void;
  onApplyCoupon: (codeOverride?: string) => Promise<boolean>;
  onApplyPublicCoupon: (coupon: PublicCoupon) => Promise<boolean>;
  onRemoveCoupon: () => void;
  /** Compact mode for the Cart Drawer */
  compact?: boolean;
  /** Whether the coupon list should be expanded by default. Default is true. */
  defaultExpanded?: boolean;
}

function getCouponLabel(coupon: PublicCoupon): string {
  if (coupon.type === "percentage") return `${coupon.value}% OFF`;
  return formatPrice(coupon.value) + " OFF";
}

function getDaysLeft(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Expires today";
  if (days === 1) return "1 day left";
  if (days <= 7) return `${days} days left`;
  return null;
}

function CouponCard({
  coupon,
  subtotal,
  appliedCode,
  onApply,
  isApplying,
  compact,
}: {
  coupon: PublicCoupon;
  subtotal: number;
  appliedCode?: string;
  onApply: (coupon: PublicCoupon) => void;
  isApplying: boolean;
  compact?: boolean;
}) {
  const isApplied = appliedCode === coupon.code;
  const isEligible =
    !coupon.minimumOrderValue || subtotal >= coupon.minimumOrderValue;
  const daysLeft = getDaysLeft(coupon.expiresAt);
  const savings = coupon.type === "percentage"
    ? Math.min(
        (subtotal * coupon.value) / 100,
        coupon.maximumDiscountAmount ?? Infinity,
      )
    : coupon.value;

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code).then(() => {
      toast.success(`Code "${coupon.code}" copied!`);
    });
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-200 overflow-hidden",
        isApplied
          ? "border-emerald-400 bg-emerald-50"
          : isEligible
            ? "border-[#6B4A2D]/15 bg-white hover:border-[#6B4A2D]/30 hover:shadow-sm cursor-pointer"
            : "border-[#6B4A2D]/8 bg-[#FAF8F5]/60 opacity-60",
        compact ? "p-3" : "p-4",
      )}
      onClick={() => isEligible && !isApplied && onApply(coupon)}
    >
      {/* Dashed left border accent */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
          isApplied ? "bg-emerald-500" : "bg-[#6B4A2D]/20",
        )}
      />
      <div className={cn("pl-3", compact ? "space-y-1.5" : "space-y-2")}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Badge chip */}
            <span
              className={cn(
                "inline-flex items-center gap-1 font-black uppercase tracking-wider rounded-lg px-2 py-0.5 text-[11px]",
                isApplied
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-[#6B4A2D]/8 text-[#6B4A2D] border border-[#6B4A2D]/15",
              )}
            >
              <Tag className="w-3 h-3" />
              {coupon.code}
            </span>
            <span
              className={cn(
                "text-[11px] font-bold px-2 py-0.5 rounded-full",
                isApplied
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-[#6B4A2D] bg-[#6B4A2D]/5",
              )}
            >
              {getCouponLabel(coupon)}
            </span>
          </div>

          {/* Action */}
          {isApplied ? (
            <span className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold flex-shrink-0">
              <Check className="w-3.5 h-3.5" /> Applied
            </span>
          ) : (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-[#8B7E6F] hover:text-[#6B4A2D] hover:bg-[#6B4A2D]/8 transition-colors"
                title="Copy code"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {isEligible && (
                <Button
                  size="sm"
                  disabled={isApplying}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(coupon);
                  }}
                  className="h-7 px-3 text-[11px] font-bold rounded-lg bg-[#6B4A2D] hover:bg-[#543820] text-white"
                >
                  {isApplying ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Name / description */}
        {coupon.name && coupon.name !== coupon.code && (
          <p
            className={cn(
              "font-semibold text-[#6B4A2D] leading-snug",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {coupon.name}
          </p>
        )}

        {!compact && coupon.description && (
          <p className="text-xs text-[#8B7E6F] leading-relaxed">
            {coupon.description}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          {coupon.minimumOrderValue && coupon.minimumOrderValue > 0 ? (
            <span
              className={cn(
                "text-[11px] font-medium",
                isEligible ? "text-emerald-600" : "text-[#8B7E6F]",
              )}
            >
              {isEligible ? "✓" : ""} Min. {formatPrice(coupon.minimumOrderValue)}
            </span>
          ) : null}
          {isEligible && savings > 0 && (
            <span className="text-[11px] font-medium text-emerald-600">
              Save {formatPrice(Math.floor(savings))}
            </span>
          )}
          {coupon.maximumDiscountAmount && coupon.type === "percentage" && (
            <span className="text-[11px] text-[#8B7E6F]">
              Max {formatPrice(coupon.maximumDiscountAmount)}
            </span>
          )}
          {daysLeft && (
            <span className="text-[11px] text-amber-600 flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {daysLeft}
            </span>
          )}
          {!isEligible && coupon.minimumOrderValue && (
            <span className="text-[11px] text-rose-500 font-medium">
              Add {formatPrice(coupon.minimumOrderValue - subtotal)} more to use
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CouponPicker({
  subtotal,
  appliedCoupon,
  couponInput,
  isApplyingCoupon,
  onCouponInputChange,
  onApplyCoupon,
  onApplyPublicCoupon,
  onRemoveCoupon,
  compact = false,
  defaultExpanded = true,
}: CouponPickerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { data: coupons = [], isLoading } = usePublicCoupons();
  const appliedCouponCode = appliedCoupon?.code;

  const hasCoupons = coupons.length > 0;
  const eligibleCount = coupons.filter(
    (c) => !c.minimumOrderValue || subtotal >= c.minimumOrderValue,
  ).length;

  return (
    <div className="space-y-3">
      {/* Applied coupon pill */}
      {appliedCoupon ? (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-xs uppercase tracking-wider text-emerald-800 block truncate">
                {appliedCoupon.code}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Saving {formatPrice(appliedCoupon.discount)}
              </span>
            </div>
          </div>
          <button
            onClick={onRemoveCoupon}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {/* Manual input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onApplyCoupon();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-[#8B7E6F]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="coupon-input"
                type="text"
                placeholder="ENTER CODE"
                value={couponInput}
                onChange={(e) =>
                  onCouponInputChange(e.target.value.toUpperCase())
                }
                className={cn(
                  "w-full pl-9 pr-3 rounded-xl bg-[#FAF8F5] border border-[#6B4A2D]/15 text-xs font-bold text-[#6B4A2D] placeholder:text-[#8B7E6F]/50 uppercase tracking-wider focus:outline-none focus:border-[#6B4A2D] focus:bg-white transition-all",
                  compact ? "h-10" : "h-11",
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={isApplyingCoupon || !couponInput.trim()}
              className={cn(
                "rounded-xl bg-[#6B4A2D] hover:bg-[#543820] text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 disabled:opacity-40",
                compact ? "h-10 px-3" : "h-11 px-4",
              )}
            >
              {isApplyingCoupon ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </form>

          {/* Browse coupons toggle */}
          {(hasCoupons || isLoading) && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-[#6B4A2D]/10 bg-[#FAF8F5] hover:bg-white hover:border-[#6B4A2D]/20 transition-all text-left"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-[#6B4A2D]">
                <Gift className="w-3.5 h-3.5 text-[#6B4A2D]/70" />
                Browse Coupons
                {eligibleCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#6B4A2D] text-white text-[10px] font-black">
                    {eligibleCount}
                  </span>
                )}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#8B7E6F]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#8B7E6F]" />
              )}
            </button>
          )}

          {/* Coupon list */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "space-y-2 pt-1 overflow-y-auto",
                    compact
                      ? "max-h-[280px] pr-0.5"
                      : "max-h-[340px] pr-0.5",
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6 text-[#8B7E6F]">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span className="text-xs font-medium">
                        Loading coupons…
                      </span>
                    </div>
                  ) : coupons.length === 0 ? (
                    <p className="text-center text-xs text-[#8B7E6F] py-4">
                      No coupons available right now
                    </p>
                  ) : (
                    coupons.map((coupon) => (
                      <CouponCard
                        key={coupon._id}
                        coupon={coupon}
                        subtotal={subtotal}
                        appliedCode={appliedCouponCode}
                        onApply={onApplyPublicCoupon}
                        isApplying={isApplyingCoupon}
                        compact={compact}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
