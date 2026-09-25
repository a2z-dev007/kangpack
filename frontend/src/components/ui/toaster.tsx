"use client";

import React from "react";
import { GooeyToaster, type GooeyToasterProps } from "goey-toast";
import "goey-toast/styles.css";
import { useTheme } from "next-themes";
import { toast } from "@/lib/toast";

export interface ToasterProps extends GooeyToasterProps {
  className?: string;
}

/**
 * Reusable Toaster Component using goey-toast
 * Features organic blob morph animations, spring physics, swipe-to-dismiss, and theme support.
 */
export const Toaster: React.FC<ToasterProps> = ({
  position = "top-center",
  closeButton = true,
  richColors = true,
  preset = "bouncy",
  bounce = 0.5,
  spring = true,
  swipeToDismiss = true,
  closeOnEscape = true,
  duration = 4000,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <GooeyToaster
      position={position}
      theme={theme === "dark" ? "dark" : "light"}
      closeButton={closeButton}
      richColors={richColors}
      preset={preset}
      bounce={bounce}
      spring={spring}
      swipeToDismiss={swipeToDismiss}
      closeOnEscape={closeOnEscape}
      duration={duration}
      {...props}
    />
  );
};

export { toast };
export default Toaster;
