"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface CopyToClipboardProps {
  text: string;
  label?: string;
  variant?: "default" | "minimal" | "inline";
  className?: string;
  showLabel?: boolean;
  successMessage?: string;
}

export function CopyToClipboard({
  text,
  label,
  variant = "default",
  className,
  showLabel = true,
  successMessage = "Copied to clipboard!",
}: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Minimal variant - just an icon button
  if (variant === "minimal") {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center justify-center rounded-lg p-1.5 transition-all hover:bg-slate-100 active:scale-95",
          isCopied && "bg-emerald-50 hover:bg-emerald-100",
          className,
        )}
        title={isCopied ? successMessage : "Copy to clipboard"}
      >
        {isCopied ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-slate-400" />
        )}
      </button>
    );
  }

  // Inline variant - text with copy icon
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 group cursor-pointer",
          className,
        )}
        onClick={handleCopy}
      >
        {showLabel && label && (
          <span className="text-xs font-bold text-slate-600">{label}</span>
        )}
        <span className="font-mono text-xs font-bold text-slate-900 select-all">
          {text}
        </span>
        {isCopied ? (
          <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        )}
      </div>
    );
  }

  // Default variant - full button
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn(
        "h-8 gap-2 rounded-xl border-slate-200 font-mono text-xs transition-all",
        isCopied && "border-emerald-200 bg-emerald-50 text-emerald-700",
        className,
      )}
    >
      <span className="font-bold">{text}</span>
      {isCopied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
