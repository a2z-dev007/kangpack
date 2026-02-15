import React from "react";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

/* =======================
   TYPES
======================= */
export type BadgeVariant =
  | "brand"
  | "alternative"
  | "gray"
  | "danger"
  | "success"
  | "warning";

export type BadgeAppearance = "filled" | "outline";

export type BadgeSize = "xs" | "sm" | "md";

export type BadgeRounded = "sm" | "md" | "full";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  icon?: LucideIcon | null;
  rounded?: BadgeRounded;
  className?: string;
}

/* =======================
   STYLES
======================= */
const FILLED_VARIANTS: Record<BadgeVariant, string> = {
  brand: "bg-brand-softer text-fg-brand-strong",
  alternative: "bg-neutral-primary-soft text-heading",
  gray: "bg-neutral-secondary-medium text-heading",
  danger: "bg-danger-soft text-fg-danger-strong",
  success: "bg-success-soft text-fg-success-strong",
  warning: "bg-warning-soft text-fg-warning",
};

const OUTLINE_VARIANTS: Record<BadgeVariant, string> = {
  brand: "border border-brand text-fg-brand-strong",
  alternative: "border border-neutral-primary text-heading",
  gray: "border border-neutral-secondary text-heading",
  danger: "border border-danger text-fg-danger-strong",
  success: "border border-success text-fg-success-strong",
  warning: "border border-warning text-fg-warning",
};

const SIZES: Record<BadgeSize, string> = {
  xs: "text-xs px-1.5 py-0.5",
  sm: "text-sm px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
};

const ROUNDED: Record<BadgeRounded, string> = {
  sm: "rounded",
  md: "rounded-md",
  full: "rounded-full",
};

/* =======================
   COMPONENT
======================= */
const CustomBadge: React.FC<BadgeProps> = ({
  children,
  variant = "brand",
  appearance = "filled",
  size = "xs",
  rounded = "sm",
  icon: Icon,
  className,
}) => {
  const variantClasses =
    appearance === "outline"
      ? OUTLINE_VARIANTS[variant]
      : FILLED_VARIANTS[variant];

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium whitespace-nowrap",
        variantClasses,
        SIZES[size],
        ROUNDED[rounded],
        className
      )}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      {children}
    </span>
  );
};

export default CustomBadge;

// usage
{/* <Badge>Brand</Badge>

<Badge variant="danger">Danger</Badge>

<Badge variant="success" appearance="outline">
  Success
</Badge>

<Badge variant="warning" rounded="full">
  Warning
</Badge>

<Badge size="md" variant="gray">
  Gray
</Badge> */}
