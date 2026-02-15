import { LucideIcon } from "lucide-react";

export type BadgeVariant =
    | "brand"
    | "alternative"
    | "gray"
    | "danger"
    | "success"
    | "warning";

export type BadgeAppearance = "filled" | "outline";

export interface BadgeConfig {
    variant?: BadgeVariant;
    appearance?: BadgeAppearance;
    icon?: LucideIcon | null;
}