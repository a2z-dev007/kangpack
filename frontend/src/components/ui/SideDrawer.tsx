"use client";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { CopyToClipboard } from "./CopyToClipboard";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  maxWidth?: string; // Default: sm:max-w-md
  icon?: ReactNode;
}

export function SideDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  maxWidth = "sm:max-w-md",
  icon,
}: SideDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className={cn(
          "rounded-l-[2rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col transition-all duration-300",
          maxWidth,
          className,
        )}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Header Area */}
          <SheetHeader className="p-5 sm:p-8 pb-3 sm:pb-4">
            <div className="flex items-center gap-3 mb-1 sm:mb-2 text-[#6B4A2D]">
              {icon && (
                <div className="p-2 sm:p-2.5 bg-amber-50 rounded-xl flex-shrink-0">
                  {icon}
                </div>
              )}
              <SheetTitle className="text-xl sm:text-2xl font-black tracking-tight truncate flex items-center gap-2">
                {title} <CopyToClipboard text={title} variant="minimal" />
              </SheetTitle>
            </div>
            {description && (
              <SheetDescription className="text-xs sm:text-sm text-slate-500 font-medium">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-2 sm:py-4">
            {children}
          </div>

          {/* Sticky Footer Area */}
          {footer && (
            <SheetFooter className="p-8 pt-4 border-t border-slate-50 flex-col sm:flex-col gap-3">
              {footer}
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
