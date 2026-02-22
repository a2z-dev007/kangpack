"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

/* =======================
   ICONS
======================= */
// ... (icons remain the same)
const IndianRupeeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="m6 13 8.5 8" />
    <path d="M6 13h3" />
    <path d="M9 13c6.667 0 6.667-10 0-10" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const PackageIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

const LoaderIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" x2="12" y1="2" y2="6" />
    <line x1="12" x2="12" y1="18" y2="22" />
    <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
    <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
    <line x1="2" x2="6" y1="12" y2="12" />
    <line x1="18" x2="22" y1="12" y2="12" />
    <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
    <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* =======================
   UTILS
======================= */
const getOrderStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; bg: string }> = {
    pending: { color: "text-warning", bg: "bg-warning/10" },
    processing: { color: "text-info", bg: "bg-info/10" },
    delivered: { color: "text-success", bg: "bg-success/10" },
    cancelled: { color: "text-error", bg: "bg-error/10" },
  };
  return statusMap[status] || statusMap.pending;
};

/* =======================
   PAGE
======================= */
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any>({ orders: [], users: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/dashboard");
      if (response.data.success) {
        setStats(response.data.data.stats);
        setActivity(response.data.data.activity);
      }
    } catch (error: any) {
      console.error("Dashboard calculation error:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(Math.ceil(stats?.orders?.totalRevenue || 0)),
      icon: IndianRupeeIcon,
      description: `${stats?.orders?.deliveredOrders || 0} completed orders`,
      trend: "+12.5%",
      iconBg: "bg-gradient-variant-2",
    },
    {
      title: "Total Orders",
      value: stats?.orders?.totalOrders || 0,
      icon: ShoppingCartIcon,
      description: `${stats?.orders?.pendingOrders || 0} pending`,
      trend: "+8.2%",
      iconBg: "bg-gradient-variant-2",
    },
    {
      title: "Products",
      value: stats?.products?.totalProducts || 0,
      icon: PackageIcon,
      description: `${stats?.products?.activeProducts || 0} active`,
      trend: "+3.1%",
      iconBg: "bg-gradient-variant-2",
    },
    {
      title: "Customers",
      value: stats?.users?.total || 0,
      icon: UsersIcon,
      description: `${stats?.users?.newThisMonth || 0} new this month`,
      trend: "+15.3%",
      iconBg: "bg-gradient-variant-2",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="max-w-10xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of your store performance
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`h-10 w-10 rounded-full ${stat.iconBg} flex items-center justify-center text-primary-foreground`}
                  >
                    <Icon />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {stat.description}
                  </span>
                  <span className="flex items-center gap-1 text-success font-medium">
                    <TrendingUpIcon />
                    {stat.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ALERT */}
        {(stats?.products?.lowStock || 0) > 0 && (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-5">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-variant-2 flex items-center justify-center text-primary-foreground flex-shrink-0">
                <AlertTriangleIcon />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  Low Stock Warning
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {stats?.products?.lowStock} products need restocking
                </p>
              </div>

              <button className="px-4 py-2 bg-gradient-variant-2 hover:opacity-90 text-primary-foreground text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                Fix Now
                <ArrowUpRightIcon />
              </button>
            </div>
          </div>
        )}

        {/* QUICK STATS */}
        <div className="grid gap-5 md:grid-cols-3">
          <QuickStat
            title="Processing Orders"
            value={stats?.orders?.processingOrders || 0}
            icon={LoaderIcon}
            color="blue"
          />
          <QuickStat
            title="Out of Stock"
            value={stats?.products?.outOfStockProducts || 0}
            icon={AlertTriangleIcon}
            color="red"
          />
          <QuickStat
            title="Active Users"
            value={stats?.users?.activeUsers || 0}
            icon={CheckCircleIcon}
            color="green"
          />
        </div>

        {/* ACTIVITY */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ORDERS */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-variant-2 flex items-center justify-center text-primary-foreground">
                  <ShoppingCartIcon />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Recent Orders
                </h3>
              </div>
              <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All
                <ArrowUpRightIcon />
              </button>
            </div>

            <div className="space-y-3">
              {activity.orders.map((order: any) => {
                const badgeConfig = getOrderStatusBadge(
                  order.status.toLowerCase(),
                );

                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders`}
                    className="block"
                  >
                    <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                            <ClockIcon />
                            {order.items.length} items
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-medium ${badgeConfig.color} ${badgeConfig.bg}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-base font-semibold text-foreground">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CUSTOMERS */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-variant-2 flex items-center justify-center text-primary-foreground">
                  <UsersIcon />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  New Customers
                </h3>
              </div>
              <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All
                <ArrowUpRightIcon />
              </button>
            </div>

            <div className="space-y-3">
              {activity.users.map((user: any) => (
                <Link
                  key={user.id}
                  href={`/admin/customers?id=${user.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================
   COMPONENTS
======================= */

function QuickStat({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: { bg: "bg-gradient-variant-2", text: "text-primary-foreground" },
    red: { bg: "bg-gradient-variant-2", text: "text-primary-foreground" },
    green: { bg: "bg-gradient-variant-2", text: "text-primary-foreground" },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div
          className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text}`}
        >
          <Icon />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-5 w-72 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
