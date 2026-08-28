"use client";
import React, { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  iconClassName?: string;
  mainColor?: string;
  circleColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  icon?: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  iconClassName,
  mainColor = "#A67C52",
  circleColor = "#FFFFFF",
  textColor = "#FFFFFF",
  hoverTextColor = "#07080A",
  icon,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentColor = isHovered ? hoverTextColor : textColor;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer isolate border border-white/10",
        className,
      )}
      style={{
        backgroundColor: mainColor,
        ...style,
      }}
      {...props}
    >
      {/* Left to Right Hover Fill Overlay */}
      <span
        className="absolute inset-0 z-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
        style={{ backgroundColor: circleColor }}
      />

      {/* Button Text */}
      <span
        className="relative z-10 font-bold transition-colors duration-300 select-none"
        style={{ color: currentColor }}
      >
        {children}
      </span>

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1",
          iconClassName,
        )}
        style={{ color: currentColor }}
      >
        {icon || (
          <ArrowRight className="size-4 md:size-5 transition-colors duration-300" />
        )}
      </div>
    </motion.button>
  );
};

export default PrimaryButton;
