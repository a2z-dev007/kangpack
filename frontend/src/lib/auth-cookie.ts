/**
 * Syncs the auth token to a cookie so Next.js middleware (server-side) can read it.
 * localStorage is client-only; cookies are sent with every request including SSR.
 */

export function setAuthCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearAuthCookie() {
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
}
