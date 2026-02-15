import { OrderStatus } from "@/lib/utils";
import { BadgeConfig } from "./types/orderStatusBadgeType";




export type BadgeVariant =
    | "brand"
    | "alternative"
    | "gray"
    | "danger"
    | "success"
    | "warning";

export type BadgeAppearance = "filled" | "outline";

export interface StatusBadgeConfig {
    variant: BadgeVariant;
    appearance?: BadgeAppearance;
}

/* 🔥 Single source of truth */
export const ORDER_STATUS_BADGE: Record<OrderStatus, StatusBadgeConfig> = {
    pending: {
        variant: "warning",
        appearance: "outline",
    },
    processing: {
        variant: "brand",
        appearance: "filled",
    },
    shipped: {
        variant: "alternative",
        appearance: "filled",
    },
    delivered: {
        variant: "success",
        appearance: "filled",
    },
    cancelled: {
        variant: "danger",
        appearance: "filled",
    },
};

interface GetStatusBadgeOptions extends BadgeConfig {
    fallbackVariant?: BadgeVariant;
    fallbackAppearance?: BadgeAppearance;
}
export const getOrderStatusBadge = (
    status: OrderStatus,
    options?: GetStatusBadgeOptions
): Required<BadgeConfig> => {
    const base = ORDER_STATUS_BADGE[status] || {};

    return {
        variant:
            options?.variant ??
            base.variant ??
            options?.fallbackVariant ??
            "gray",

        appearance:
            options?.appearance ??
            base.appearance ??
            options?.fallbackAppearance ??
            "filled",

        icon:
            options?.icon ??
            base.icon ??
            null,
    };
};