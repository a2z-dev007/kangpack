import { BadgeConfig } from "@/components/custom/types/orderStatusBadgeType";
import { OrderStatus } from "@/lib/utils";
import {
    Clock,
    Loader2,
    Truck,
    CheckCircle,
    XCircle,
} from "lucide-react";


export const ORDER_STATUS_BADGE: Record<OrderStatus, BadgeConfig> = {
    pending: {
        variant: "warning",
        appearance: "outline",
        icon: Clock,
    },
    processing: {
        variant: "brand",
        icon: Loader2,
    },
    shipped: {
        variant: "alternative",
        icon: Truck,
    },
    delivered: {
        variant: "success",
        icon: CheckCircle,
    },
    cancelled: {
        variant: "danger",
        icon: XCircle,
    },
};
