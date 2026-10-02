/**
 * Syncs the auth token to a cookie so Next.js middleware (server-side) can read it.
 * localStorage is client-only; cookies are sent with every request including SSR.
 */

export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
}

export function setRedirectCookie(path: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `redirect_after_login=${encodeURIComponent(path)}; path=/; max-age=600; SameSite=Lax`;
}

export function getAndClearRedirectCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)redirect_after_login=([^;]+)/);
  if (!match) return null;
  const val = decodeURIComponent(match[1]);
  document.cookie = 'redirect_after_login=; path=/; max-age=0; SameSite=Lax';
  return val;
}
