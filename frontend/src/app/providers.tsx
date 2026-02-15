"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState } from "react";
import StoreProvider from "@/providers/StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {
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
            expand={false}
            closeButton
            toastOptions={{
              className: "font-sans",
              classNames: {
                toast: "rounded-[24px] border-none shadow-2xl px-6 py-4",
                title: "font-bold text-[14px]",
                description: "text-[12px] opacity-90",
                success: "bg-white !text-emerald-600 border border-emerald-50",
                error: "bg-white !text-red-500 border border-red-50",
                info: "bg-[#FFFBF6] !text-[#6B4A2D] border border-[#6B4A2D]/10",
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </StoreProvider>
  );
}
