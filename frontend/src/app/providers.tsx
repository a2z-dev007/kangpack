"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import StoreProvider from "@/providers/StoreProvider";
import { setAuthCookie } from "@/lib/auth-cookie";

export function Providers({ children }: { children: React.ReactNode }) {
  // Sync client-side auth token to cookies so Next.js server middleware is always aware of the session
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setAuthCookie(token);
    }
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster
            position="top-center"
            richColors
            closeButton
            preset="bouncy"
            bounce={0.5}
            duration={3500}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </StoreProvider>
  );
}
