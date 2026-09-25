"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import { ProfileSidebar } from "@/components/profile/Sidebar";
import { BottomNav } from "@/components/profile/BottomNav";
import { useAuth } from "@/hooks/use-auth";
import { authApi } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  // Verify the session with the backend on mount (not just localStorage)
  useEffect(() => {
    const verifySession = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        const user = await authApi.getCurrentUser();
        setUser(user);
      } catch {
        // Token is invalid/expired and refresh also failed — force login
        setUser(null);
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setIsVerifying(false);
    };

    verifySession();
  }, [pathname, router, setUser]);

  // Show loader while verifying session
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige/30">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B4A2D]" />
      </div>
    );
  }

  // Double-check after verification (shouldn't reach here if redirect fired, but safety net)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-beige/30 p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B4A2D] mb-4" />
        <p className="text-sm font-medium text-[#6B4A2D]">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-beige/30">
      <Navbar solid />

      {/* Background Decor Elements - Subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Added pb-24 for mobile bottom nav spacing */}
      <div className="pt-20 pb-24 md:pt-40 md:pb-16 flex-grow w-full">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Header Area (Optional: Breadcrumbs or Welcome could go here) */}

          <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 lg:px-12">
            {/* Sidebar (Hidden on mobile via CSS in component) */}
            <div className="flex-shrink-0">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-grow min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
}
