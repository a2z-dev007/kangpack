"use client";

import Navbar from "@/components/home/Navbar";
import { ProfileSidebar } from "@/components/profile/Sidebar";
import { BottomNav } from "@/components/profile/BottomNav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
