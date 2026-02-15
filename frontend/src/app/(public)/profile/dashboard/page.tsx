"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import {
  Package,
  User,
  MapPin,
  Heart,
  ShoppingBag,
  ChevronRight,
  Zap,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Enhanced stats with trends (mock data)
  const stats = [
    {
      label: "Total Orders",
      value: "12",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+12% from last month",
    },
    {
      label: "Wishlist Items",
      value: "5",
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      trend: "+2 new items",
    },
    {
      label: "Saved Addresses",
      value: user?.addresses?.length || 2,
      icon: MapPin,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "Primary set",
    },
    {
      label: "Total Spent",
      value: "$1,294",
      icon: Wallet,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      trend: "+5% from last month",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back,{" "}
            <span className="text-primary">{user?.firstName || "Guest"}</span>!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full shadow-sm" asChild>
            <Link href={ROUTES.PRODUCTS}>Browse Products</Link>
          </Button>
          <Button className="rounded-full shadow-lg shadow-primary/20" asChild>
            <Link href={ROUTES.CART}>View Cart</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm group cursor-default"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">
                      {stat.value}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center mt-2 group-hover:text-primary transition-colors">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Recent Orders</CardTitle>
                <CardDescription>
                  Track and manage your latest purchases
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                asChild
              >
                <Link href={ROUTES.ORDERS}>
                  View All <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {/* Empty State Mockup - Replace with map over orders if available */}
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/10">
                <div className="p-4 rounded-full bg-white shadow-sm mb-4 text-primary">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  No recent orders
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                  You haven&apos;t placed any orders recently. Discover our
                  latest collection today!
                </p>
                <Button className="rounded-full shadow-lg h-10 px-6" asChild>
                  <Link href={ROUTES.PRODUCTS}>Start Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Promo */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="h-32 w-32 -rotate-12" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="inline-block p-2 rounded-lg bg-white/10 backdrop-blur-md mb-4">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Member</h3>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                You have earned 1,200 points this month. Redeem them for
                exclusive discounts.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-full border-white/20 hover:bg-white hover:text-gray-900 text-white shadow-lg bg-transparent"
              >
                View Rewards
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Link
                href={ROUTES.PROFILE}
                className="flex items-center p-3 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted-foreground/10"
              >
                <div className="p-2.5 rounded-lg bg-orange-100/50 text-orange-600 mr-3 group-hover:bg-orange-100 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Edit Profile
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={ROUTES.ADDRESSES}
                className="flex items-center p-3 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted-foreground/10"
              >
                <div className="p-2.5 rounded-lg bg-purple-100/50 text-purple-600 mr-3 group-hover:bg-purple-100 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Manage Addresses
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={ROUTES.WISHLIST}
                className="flex items-center p-3 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted-foreground/10"
              >
                <div className="p-2.5 rounded-lg bg-pink-100/50 text-pink-600 mr-3 group-hover:bg-pink-100 transition-colors">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  My Wishlist
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
