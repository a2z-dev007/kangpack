"use client";
import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children"
> {
  children: React.ReactNode;
  iconClassName?: string;
  /** Background color of the main button */
  mainColor?: string;
  /** Color of the circle and hover background */
  circleColor?: string;
  /** Color of the text (initial) */
  textColor?: string;
  /** Color of the text on hover */
  hoverTextColor?: string;
  /** Custom icon component */
  icon?: React.ReactNode;
}

const circleVariants: Variants = {
  // We rely on CSS 'aspect-square h-full' for the initial width state.
  // Framer Motion will read the computed width from the DOM for the 'from' state.
  initial: {
    borderRadius: "9999px",
  },
  hover: {
    width: "calc(100% - 0.75rem)", // Full width minus button padding (p-1.5 * 2)
    borderRadius: "9999px",
  },
};

const textVariants: Variants = {
  initial: (colors) => ({ color: colors.initial }),
  hover: (colors) => ({ color: colors.hover }),
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  iconClassName,
  mainColor, // now used only if provided to override
  circleColor = "#F5F1E9",
  textColor = "#FFFFFF",
  hoverTextColor = "#6B4A2D",
  icon,
  ...props
}) => {
  return (
    <motion.button
      whileHover="hover"
      initial="initial"
      className={cn(
        "group relative flex items-center p-1.5 pr-8 rounded-full shadow-lg transition-all duration-300 w-fit overflow-hidden isolate",
        !mainColor && "bg-gradient-variant-2",
        className,
      )}
      style={mainColor ? { backgroundColor: mainColor } : {}}
      {...props}
    >
      {/* The Expanding Background of the Circle
                 Positioned absolutely relative to the button.
                 Matches padding: left-1.5 top-1.5 bottom-1.5
                 Initial size driven by aspect-square h-full (from CSS classes)
              */}
      <motion.div
        className="absolute left-1.5 top-1.5 bottom-1.5 z-0 aspect-square bg-white"
        style={{ backgroundColor: circleColor }}
        variants={circleVariants}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {/* The Icon Container */}
      <div
        className={cn(
          "relative z-10 w-10 h-10 md:w-11 md:h-11 flex-shrink-0 flex items-center justify-center",
          iconClassName,
        )}
      >
        <div className="relative z-10">
          {icon || (
            <ArrowRight
              className="w-5 h-5 md:w-6 md:h-6"
              style={{ color: mainColor || "#6B4A2D" }}
            />
          )}
        </div>
      </div>

      {/* The Text */}
      <motion.span
        className="relative z-10 ml-5 text-base md:text-lg font-semibold tracking-wide uppercase whitespace-nowrap"
        variants={textVariants}
        custom={{ initial: textColor, hover: hoverTextColor }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default PrimaryButton;
