"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import {
  LayoutDashboard,
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { LogoutConfirmModal } from "../common/LogoutConfirmModal";

const navLinks = [
  { label: "Overview", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Profile", href: ROUTES.PROFILE, icon: User },
  { label: "Orders", href: ROUTES.ORDERS, icon: Package },
  { label: "Saved", href: ROUTES.ADDRESSES, icon: MapPin },
  { label: "Wishlist", href: ROUTES.WISHLIST, icon: Heart },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (href: string) => {
    if (href === ROUTES.PROFILE && pathname === ROUTES.PROFILE) return true;
    if (href !== ROUTES.PROFILE && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] lg:hidden pb-safe">
        <nav className="flex items-center justify-around h-16 px-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-gray-600",
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-xl transition-all",
                    active ? "bg-primary/10" : "bg-transparent",
                  )}
                >
                  <link.icon
                    className={cn("h-5 w-5", active && "fill-current")}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>
                <span className="text-[10px] font-semibold">{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-red-500 hover:text-red-600 active:scale-95 transition-all duration-200"
          >
            <div className="p-1.5 rounded-xl bg-red-50">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        </nav>
        {/* Safe area spacer for iOS home indicator if needed */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white" />
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
