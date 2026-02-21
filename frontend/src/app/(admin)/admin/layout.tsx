"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  FolderTree,
  Warehouse,
  FileText,
  Menu,
  X,
  Search,
  Bell,
  MessageSquare,
  Maximize2,
  ChevronDown,
  Globe,
  HelpCircle,
  ShieldCheck,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Layers,
  BarChart3,
  Image as ImageIcon,
} from "lucide-react";
import { useLogout } from "@/features/auth/queries";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ASSETS } from "@/assets";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { authApi } from "@/lib/auth";

const navigationGroups = [
  {
    title: "MAIN HOME",
    items: [
      {
        name: "Dashboard",
        href: ROUTES.ADMIN_DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "ALL PAGE",
    items: [
      {
        name: "Ecommerce",
        icon: ShoppingCart,
        children: [
          { name: "Products", href: ROUTES.ADMIN_PRODUCTS, icon: Package },
          { name: "Categories", href: "/admin/categories", icon: FolderTree },
          { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
        ],
      },
      { name: "Orders", href: ROUTES.ADMIN_ORDERS, icon: ShoppingCart },
      { name: "Customers", href: ROUTES.ADMIN_CUSTOMERS, icon: Users },
      { name: "Coupons", href: ROUTES.ADMIN_COUPONS, icon: Tag },
      // { name: "Gallery", href: "#", icon: ImageIcon },
      // { name: "Report", href: "#", icon: BarChart3 },
    ],
  },
  {
    title: "SETTING",
    items: [
      { name: "Settings", href: ROUTES.ADMIN_SETTINGS, icon: Settings },
      { name: "CMS Pages", href: "/admin/cms", icon: FileText },
    ],
  },
  // {
  //   title: "SUPPORT",
  //   items: [
  //     { name: "Help Center", href: "#", icon: HelpCircle },
  //     { name: "Privacy Policy", href: "#", icon: ShieldCheck },
  //   ],
  // },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser } = useAuth();
  const { mutate: logout } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Ecommerce"]);

  // Verify session on mount
  const {
    data: userData,
    isLoading: isVerifying,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isVerifying) {
      if (userData) {
        setUser(userData);
      } else if (isError) {
        setUser(null);
      }
    }
  }, [userData, isError, isVerifying, setUser]);

  useEffect(() => {
    if (!isVerifying) {
      if (!isAuthenticated) {
        window.location.href = ROUTES.LOGIN;
      } else if (user?.role !== "admin" && user?.role !== "staff") {
        window.location.href = ROUTES.HOME;
      }
    }
  }, [isAuthenticated, user, isVerifying]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  if (isVerifying) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-brand-beige">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4A2D]"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F0F5FA] dark:bg-slate-950 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] border-r bg-white dark:bg-slate-900 transition-transform lg:static lg:translate-x-0 shadow-sm flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[72px] items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
          <Link href={ROUTES.HOME}>
            <img
              src={"/assets/black-logo.svg"}
              alt="Logo"
              width={150}
              height={100}
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 p-4">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-4 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = "children" in item && item.children;
                  const isExpanded = expandedItems.includes(item.name);
                  const isActive = pathname === item.href;

                  return (
                    <div key={item.name} className="space-y-0.5">
                      {hasChildren ? (
                        <div className="space-y-0.5">
                          <Button
                            variant="ghost"
                            onClick={() => toggleExpand(item.name)}
                            className={cn(
                              "w-full justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 group px-4 h-11 transition-all duration-200",
                              isExpanded
                                ? "text-primary"
                                : "text-slate-600 dark:text-slate-400",
                            )}
                          >
                            <div className="flex items-center">
                              <Icon
                                className={cn(
                                  "mr-3 h-[18px] w-[18px] transition-colors",
                                  isExpanded
                                    ? "text-primary"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-primary",
                                )}
                              />
                              <span className="text-[14px] font-medium">
                                {item.name}
                              </span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isExpanded ? "rotate-180" : "",
                              )}
                            />
                          </Button>
                          {isExpanded && (
                            <div className="pl-11 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                              {(item.children as any[]).map((child) => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <Link key={child.name} href={child.href}>
                                    <div
                                      className={cn(
                                        "flex items-center py-2 text-[13px] font-medium transition-all duration-200",
                                        isChildActive
                                          ? "text-primary"
                                          : "text-slate-500 hover:text-primary dark:text-slate-500 dark:hover:text-primary",
                                      )}
                                    >
                                      {child.name}
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link href={item.href || "#"}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start px-4 h-11 group transition-all duration-200",
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm hover:bg-primary/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                            )}
                          >
                            <Icon
                              className={cn(
                                "mr-3 h-[18px] w-[18px] transition-colors",
                                isActive
                                  ? "text-primary"
                                  : "text-slate-400 dark:text-slate-500 group-hover:text-primary",
                              )}
                            />
                            <span className="text-[14px] font-medium">
                              {item.name}
                            </span>
                            {isActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                            )}
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sidebar Footer Card */}
          <div className="mt-auto pt-6 px-2">
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/10 text-center space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <HelpCircle className="w-16 h-16" />
              </div>
              <p className="text-[13px] font-semibold text-slate-900 dark:text-white relative z-10">
                Hi, how can we help?
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 relative z-10">
                Contact us if you have any assistance.
              </p>
              <Button
                size="sm"
                className="w-full h-9 rounded-xl text-[12px] relative z-10 font-bold"
              >
                Contact
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 py-6">
              <Facebook className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between bg-white dark:bg-slate-900 px-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 shadow-sm shadow-slate-100/50 dark:shadow-none">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex relative max-w-[400px] w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search items here..."
                className="pl-11 h-11 bg-[#F9FBFC] dark:bg-slate-950 border-none focus-visible:ring-1 focus-visible:ring-primary/20 text-[14px] rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 mr-2 border-r border-slate-100 dark:border-slate-800 pr-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Globe className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <MessageSquare className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 relative"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Maximize2 className="h-[18px] w-[18px]" />
              </Button>
            </div>

            <div className="flex items-center gap-3 pl-2 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-all duration-200">
              <div className="text-right hidden xl:block">
                <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-none capitalize">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                  {user?.role || "Administrator"}
                </p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-destructive transition-colors ml-1 rounded-xl"
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#F0F5FA] dark:bg-slate-950">
          <div className="container max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 min-h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
