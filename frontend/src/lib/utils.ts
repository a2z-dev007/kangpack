import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(price))
}

export function formatCurrency(amount: number | string) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${(value || 0).toLocaleString("en-IN")}`;
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(date));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const R2_PUBLIC_BASE = "https://pub-790496524ba445de86653f81de23f738.r2.dev";

export function getImageUrl(imagePath?: string | null): string {
  if (!imagePath || typeof imagePath !== "string") return "/placeholder.png";

  let trimmed = imagePath.trim();
  if (!trimmed) return "/placeholder.png";

  // Rewrite any leaked localhost URLs to the Cloudflare R2 public URL
  if (
    trimmed.includes("localhost:3000") ||
    trimmed.includes("127.0.0.1:3000") ||
    trimmed.includes("localhost:8000") ||
    trimmed.includes("127.0.0.1:8000")
  ) {
    trimmed = trimmed
      .replace(/http:\/\/localhost:3000\//g, `${R2_PUBLIC_BASE}/`)
      .replace(/http:\/\/127.0.0.1:3000\//g, `${R2_PUBLIC_BASE}/`)
      .replace(/http:\/\/localhost:8000\//g, `${R2_PUBLIC_BASE}/`)
      .replace(/http:\/\/127.0.0.1:8000\//g, `${R2_PUBLIC_BASE}/`);
    return trimmed;
  }

  // If already absolute URL or data URI
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^\/+/, "");

  // If it's a ticker asset, product, or upload, serve from Cloudflare R2
  if (cleanPath.startsWith("assets/tickers/") || cleanPath.startsWith("products/") || cleanPath.startsWith("uploads/")) {
    return `${R2_PUBLIC_BASE}/${cleanPath}`;
  }

  // Fallback for general frontend static assets
  const appBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://kangpack.in");
  return `${appBase.replace(/\/$/, "")}/${cleanPath}`;
}

