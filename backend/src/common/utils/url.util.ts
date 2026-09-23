import { env } from '../../config/env';

/**
 * Normalizes any image path/URL to a full Cloudflare R2 public URL.
 * Ensures all products, carts, orders, and emails serve images from R2_BUCKET.
 */
export function toFullImageUrl(imagePath?: string | null): string {
  if (!imagePath || typeof imagePath !== 'string') return '';
  
  let trimmed = imagePath.trim();
  if (!trimmed) return '';

  const r2Base = (
    env.R2_PUBLIC_URL ||
    'https://pub-790496524ba445de86653f81de23f738.r2.dev'
  ).replace(/\/$/, '');

  // If URL contains localhost references, rewrite to Cloudflare R2
  if (
    trimmed.includes('localhost:3000') ||
    trimmed.includes('127.0.0.1:3000') ||
    trimmed.includes('localhost:8000') ||
    trimmed.includes('127.0.0.1:8000')
  ) {
    trimmed = trimmed
      .replace(/http:\/\/localhost:3000\//g, `${r2Base}/`)
      .replace(/http:\/\/127.0.0.1:3000\//g, `${r2Base}/`)
      .replace(/http:\/\/localhost:8000\//g, `${r2Base}/`)
      .replace(/http:\/\/127.0.0.1:8000\//g, `${r2Base}/`);
    return trimmed;
  }

  // If already absolute URL (e.g. https://pub-xxxx.r2.dev or other full URL)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^\/+/, '');

  // Prepend R2 Public URL
  return `${r2Base}/${cleanPath}`;
}
