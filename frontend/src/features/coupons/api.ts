import api from "@/lib/api";

export interface PublicCoupon {
  _id: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount" | "fixed" | string;
  value: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  expiresAt?: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  discount: number;
  code?: string;
  message?: string;
}

export const couponsApi = {
  /** Public: returns all currently active/available coupons */
  getPublicCoupons: async (): Promise<PublicCoupon[]> => {
    const res = await api.get("/coupons/public");
    return res.data?.data ?? [];
  },

  /** Validate a coupon code against an order value */
  validateCoupon: async (
    code: string,
    orderValue: number,
  ): Promise<ValidateCouponResponse> => {
    const res = await api.post("/coupons/validate", { code, orderValue });
    const d = res.data?.data ?? {};
    return { ...d, code: d.code ?? code };
  },
};
