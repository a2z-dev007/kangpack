import { useQuery, useMutation } from "@tanstack/react-query";
import { couponsApi } from "./api";

/** Fetch all currently active public coupons */
export const usePublicCoupons = () =>
  useQuery({
    queryKey: ["coupons", "public"],
    queryFn: couponsApi.getPublicCoupons,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

/** Validate / apply a coupon code */
export const useValidateCoupon = () =>
  useMutation({
    mutationFn: ({
      code,
      orderValue,
    }: {
      code: string;
      orderValue: number;
    }) => couponsApi.validateCoupon(code, orderValue),
  });
