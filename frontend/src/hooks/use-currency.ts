"use client";

import { usePublicSettings } from "@/features/settings/queries";
import { useCallback } from "react";

export function useCurrency() {
  const { data: settings, isLoading } = usePublicSettings();

  const currency = settings?.currency || "INR";
  const currencySymbol =
    settings?.currency === "INR" && settings?.currencySymbol === "$"
      ? "₹"
      : settings?.currencySymbol || "₹";

  const format = useCallback(
    (amount: number | string) => {
      const num = Number(amount) || 0;
      if (currency === "INR" || currencySymbol === "₹") {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }).format(num);
      }
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 2,
        }).format(num);
      } catch {
        return `${currencySymbol}${num.toLocaleString("en-IN")}`;
      }
    },
    [currency, currencySymbol]
  );

  return {
    currency,
    currencySymbol,
    formatPrice: format,
    isLoading,
  };
}
