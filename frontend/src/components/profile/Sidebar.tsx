"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { LogoutConfirmModal } from "../common/LogoutConfirmModal";

const sidebarLinks = [
  { label: "Overview", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Profile Settings", href: ROUTES.PROFILE, icon: User },
  { label: "My Orders", href: ROUTES.ORDERS, icon: Package },
  { label: "Saved Addresses", href: ROUTES.ADDRESSES, icon: MapPin },
  { label: "Wishlist", href: ROUTES.WISHLIST, icon: Heart },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  // Helper to determine active state.
  // Specialized check for PROFILE since it's a parent path of others
  const isActive = (href: string) => {
    if (href === ROUTES.PROFILE && pathname === ROUTES.PROFILE) return true;
    if (href !== ROUTES.PROFILE && pathname.startsWith(href)) return true;
    return false;
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <aside className="w-full lg:w-72 space-y-6 hidden lg:block">
        <div className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm">
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 px-4 rounded-xl transition-all duration-300 relative overflow-hidden group",
                    isActive(link.href)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-md"
                      : "hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <link.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                      isActive(link.href)
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                  />
                  <span className="font-medium">{link.label}</span>

                  {/* Active Indicator for aesthetics (optional) */}
                  {isActive(link.href) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white/20 rounded-r-full" />
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="pt-4 mt-4 border-t border-dashed">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
