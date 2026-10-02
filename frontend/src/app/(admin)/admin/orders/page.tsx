"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Eye,
  Package,
  Truck,
  MoreHorizontal,
  MapPin,
  Clock,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  ShoppingBag,
  Mail,
  Calendar,
  ArrowUpRight,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  ExternalLink,
  Hash,
} from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { OrderDetailsModal } from "@/features/admin/components/OrderDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAdminOrders, useUpdateOrderStatus, useUpdatePaymentStatus } from "@/features/admin/queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CopyToClipboard } from "@/components/ui/CopyToClipboard";

export default function AdminOrders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Helper to initialize state from URL
  const getInitialParam = (key: string, defaultVal: string) => {
    return searchParams.get(key) || defaultVal;
  };

  const [page, setPage] = useState(Number(getInitialParam("page", "1")) || 1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(getInitialParam("search", ""));
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  // Advanced Filter States
  const [activeFilters, setActiveFilters] = useState({
    status: getInitialParam("status", "all"),
    paymentStatus: getInitialParam("paymentStatus", "all"),
    paymentMethod: getInitialParam("paymentMethod", "all"),
    startDate: getInitialParam("startDate", ""),
    endDate: getInitialParam("endDate", ""),
    minAmount: getInitialParam("minAmount", ""),
    maxAmount: getInitialParam("maxAmount", ""),
  });

  const activeFilterCount = Object.entries(activeFilters).filter(
    ([k, v]) => k !== "status" && v !== "all" && v !== ""
  ).length;

  const [isFilterOpen, setFilterOpen] = useState(true);

  // Sync state to URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Page
    if (page > 1) params.set("page", page.toString());
    else params.delete("page");

    // Search
    if (search) params.set("search", search);
    else params.delete("search");

    // Active Filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [page, search, activeFilters, pathname, router, searchParams]);

  // Compatibility helpers
  const statusFilter = activeFilters.status;
  const setStatusFilter = (status: string) => {
    setActiveFilters((prev) => ({ ...prev, status }));
    setPage(1);
  };

  const { data, isLoading } = useAdminOrders({
    page,
    limit,
    search: search || undefined,
    status: activeFilters.status !== "all" ? activeFilters.status : undefined,
    paymentStatus:
      activeFilters.paymentStatus !== "all"
        ? activeFilters.paymentStatus
        : undefined,
    paymentMethod:
      activeFilters.paymentMethod !== "all"
        ? activeFilters.paymentMethod
        : undefined,
    startDate: activeFilters.startDate || undefined,
    endDate: activeFilters.endDate || undefined,
    minAmount: activeFilters.minAmount || undefined,
    maxAmount: activeFilters.maxAmount || undefined,
  });

  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: updatePaymentStatus } = useUpdatePaymentStatus();

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "confirmed":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "processing":
        return <Package className="h-3 w-3 mr-1" />;
      case "shipped":
        return <Truck className="h-3 w-3 mr-1" />;
      case "delivered":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "cancelled":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  const getPaymentStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "failed":
        return "bg-rose-50 text-rose-600 border-rose-100 text-rose-500";
      case "refunded":
        return "bg-purple-50 text-purple-600 border-purple-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.pages;
    const currentPage = page;
    const pageNumbers = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const openDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const resetFilters = () => {
    const defaultFilters = {
      status: "all",
      paymentStatus: "all",
      paymentMethod: "all",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    };
    setActiveFilters(defaultFilters);
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#6B4A2D]">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base md:text-lg">
            Manage your store's sales, status updates, and fulfillment cycle
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all",
                viewMode === "table"
                  ? "bg-[#6B4A2D] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <LayoutList className="h-4 w-4" />
              <span className="hidden sm:inline">Table View</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all",
                viewMode === "grid"
                  ? "bg-[#6B4A2D] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
          </div>

          <Button
            variant="outline"
            className="rounded-full shadow-sm bg-white border-slate-200 h-10 sm:h-11 px-3 sm:px-6 text-xs sm:text-sm font-bold text-slate-700"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
            <span>Export</span>
          </Button>
          <Button
            onClick={() => setFilterOpen((prev) => !prev)}
            className={cn(
              "rounded-full shadow-md border-none h-10 sm:h-11 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all",
              isFilterOpen || activeFilterCount > 0
                ? "bg-[#5A3E25] text-white"
                : "bg-[#6B4A2D] hover:bg-[#5A3E25] text-white"
            )}
          >
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-white text-[#6B4A2D] text-[10px] font-bold">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {(search || statusFilter !== "all" || activeFilterCount > 0) && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="rounded-full shadow-sm bg-white border-red-200 h-10 sm:h-11 px-3 sm:px-6 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all text-xs sm:text-sm font-bold"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Search & Status Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Search by order #, customer name, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 sm:pl-12 h-11 sm:h-12 rounded-2xl border-slate-200 bg-white shadow-xs text-xs sm:text-sm font-medium focus-visible:ring-[#6B4A2D] w-full"
            />
          </div>

          {/* Status Tabs Filter */}
          <div className="w-full xl:w-auto overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl min-w-max">
              {[
                "all",
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all whitespace-nowrap",
                    statusFilter === status
                      ? "bg-white text-[#6B4A2D] shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inline Advanced Filters */}
        {isFilterOpen && (
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 animate-in fade-in duration-200">
            {/* Payment Status */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-3 w-3" /> Payment Status
              </Label>
              <Select
                value={activeFilters.paymentStatus}
                onValueChange={(val) => {
                  setActiveFilters((prev) => ({ ...prev, paymentStatus: val }));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white font-medium text-xs sm:text-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed (Paid)</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <ArrowUpRight className="h-3 w-3" /> Payment Method
              </Label>
              <Select
                value={activeFilters.paymentMethod}
                onValueChange={(val) => {
                  setActiveFilters((prev) => ({ ...prev, paymentMethod: val }));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white font-medium text-xs sm:text-sm">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                  <SelectItem value="razorpay">Razorpay (Online)</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Date Range
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={activeFilters.startDate}
                  onChange={(e) => {
                    setActiveFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }));
                    setPage(1);
                  }}
                  className="h-11 rounded-2xl border-slate-200 bg-white font-medium text-xs px-2.5 sm:px-3"
                />
                <Input
                  type="date"
                  value={activeFilters.endDate}
                  onChange={(e) => {
                    setActiveFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }));
                    setPage(1);
                  }}
                  className="h-11 rounded-2xl border-slate-200 bg-white font-medium text-xs px-2.5 sm:px-3"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="h-3 w-3" /> Price Range (₹)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={activeFilters.minAmount}
                  onChange={(e) => {
                    setActiveFilters((prev) => ({
                      ...prev,
                      minAmount: e.target.value,
                    }));
                    setPage(1);
                  }}
                  className="h-11 rounded-2xl border-slate-200 bg-white font-medium text-xs px-3"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={activeFilters.maxAmount}
                  onChange={(e) => {
                    setActiveFilters((prev) => ({
                      ...prev,
                      maxAmount: e.target.value,
                    }));
                    setPage(1);
                  }}
                  className="h-11 rounded-2xl border-slate-200 bg-white font-medium text-xs px-3"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {isLoading ? (
          viewMode === "table" ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[320px] w-full rounded-3xl" />
              ))}
            </div>
          )
        ) : orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-1 text-sm">
              We couldn't find any orders matching your current search or filters.
            </p>
            <Button
              variant="outline"
              className="mt-5 rounded-full text-xs font-bold border-slate-200"
              onClick={resetFilters}
            >
              Clear all filters
            </Button>
          </div>
        ) : viewMode === "table" ? (
          /* Default Table View */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Order #</th>
                    <th className="py-4 px-5">Customer</th>
                    <th className="py-4 px-5">Date & Time</th>
                    <th className="py-4 px-5">Amount</th>
                    <th className="py-4 px-5">Payment</th>
                    <th className="py-4 px-5">Order Status</th>
                    <th className="py-4 px-5">Fulfillment</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.map((order: any) => (
                    <tr
                      key={order.id || order._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Order # */}
                      <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                            #{order.orderNumber}
                          </span>
                          <CopyToClipboard text={order.orderNumber} variant="minimal" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                          {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-100 shadow-xs">
                            <AvatarFallback className="bg-[#6B4A2D] text-white font-bold text-xs uppercase">
                              {(
                                order.user?.name ||
                                order.shippingAddress?.firstName ||
                                "G"
                              ).charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-xs sm:text-sm text-slate-800 truncate leading-tight">
                              {order.user?.name ||
                                `${order.shippingAddress?.firstName || ""} ${order.shippingAddress?.lastName || ""}`.trim() ||
                                "Guest Customer"}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate font-medium">
                              {order.email || order.user?.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-5 text-xs font-bold text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDateTime(order.createdAt)}</span>
                        </div>
                        {order.shippingAddress?.city && (
                          <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-black text-[#6B4A2D] text-base">
                          {formatPrice(order.totalAmount || order.total)}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border py-0 text-[10px] h-5 px-2 font-bold uppercase shadow-none",
                              getPaymentStatusStyles(order.paymentStatus)
                            )}
                          >
                            {order.paymentStatus || "pending"}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {order.paymentMethod === "cod" ? "COD" : "Online"}
                          </span>
                        </div>
                      </td>

                      {/* Order Status (With Quick Selector) */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) =>
                            updateStatus({ id: order.id || order._id, status: newStatus })
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "h-8 rounded-full border px-3 text-[11px] font-bold uppercase shadow-none transition-all w-32",
                              getStatusStyles(order.status)
                            )}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Fulfillment / Tracking */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {order.trackingNumber ? (
                          <div className="flex flex-col text-xs">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              <Truck className="h-3 w-3 text-indigo-500" />
                              {order.carrier || "Courier"}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500 font-bold">
                              {order.trackingNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 italic">
                            Unfulfilled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openDetailsModal(order)}
                            className="rounded-xl bg-[#6B4A2D] hover:bg-[#5A3E25] text-white shadow-xs h-8 px-3 text-xs font-bold border-none"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> Details
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 rounded-xl p-0 bg-white border-slate-200 shadow-xs"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-2xl p-2 min-w-[190px] shadow-2xl border-slate-200 bg-white"
                            >
                              <DropdownMenuLabel className="text-[10px] font-bold uppercase text-slate-400 px-3 py-2">
                                Change Status
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                              {[
                                "pending",
                                "confirmed",
                                "processing",
                                "shipped",
                                "delivered",
                                "cancelled",
                              ].map((st) => (
                                <DropdownMenuItem
                                  key={st}
                                  onClick={() =>
                                    updateStatus({ id: order.id || order._id, status: st })
                                  }
                                  className={cn(
                                    "capitalize rounded-xl px-3 py-2 cursor-pointer font-bold mb-1 last:mb-0 text-xs",
                                    order.status === st
                                      ? "opacity-40 pointer-events-none"
                                      : "hover:bg-slate-50"
                                  )}
                                >
                                  Mark as {st}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {orders.map((order: any) => (
              <Card
                key={order.id || order._id}
                className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white flex flex-col"
              >
                <div className="p-6 pb-2">
                  <div className="flex items-start justify-between mb-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">
                        Order #
                      </span>
                      <span className="font-black text-xl text-slate-900 leading-none">
                        {order.orderNumber}
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "rounded-full border px-3 py-1 text-[10px] font-bold uppercase shadow-none transition-none transform-none",
                        getStatusStyles(order.status)
                      )}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 flex-1 flex flex-col">
                  {/* Customer Info Card */}
                  <div className="space-y-5 mb-6 text-left">
                    <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-[#6B4A2D] text-white font-bold text-xs uppercase">
                          {(
                            order.user?.name ||
                            order.shippingAddress?.firstName ||
                            "G"
                          ).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-sm text-slate-800 truncate leading-tight">
                          {order.user?.name ||
                            `${order.shippingAddress?.firstName || ""} ${order.shippingAddress?.lastName || ""}`.trim() ||
                            "Guest User"}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="h-2.5 w-2.5" />
                          {order.email || order.user?.email || "No email"}
                        </span>
                      </div>
                    </div>

                    {/* Logistics Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> Date & Time
                        </span>
                        <p className="font-medium text-[10px] text-slate-700 leading-tight">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" /> Location
                        </span>
                        <p className="font-medium text-[10px] text-slate-700 truncate block">
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image and Metrics Section */}
                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 overflow-hidden">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative">
                        {order.items?.[0]?.image ? (
                          <img
                            src={order.items[0].image}
                            alt="Item"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-slate-100">
                            <ShoppingBag className="h-5 w-5 text-slate-300" />
                          </div>
                        )}
                        {order.items?.length > 1 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-white">
                            +{order.items.length - 1}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col overflow-hidden text-left">
                        <p className="text-[11px] font-bold text-slate-800 truncate max-w-full leading-tight mb-1">
                          {order.items?.[0]?.name || "Product Name"}
                        </p>

                        <div className="mt-2 text-left">
                          <span className="text-[9px] font-bold uppercase text-slate-400 mb-0.5 block">
                            Payment Status
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border py-0 text-[10px] h-5 px-2 font-bold uppercase shadow-none",
                              getPaymentStatusStyles(order.paymentStatus)
                            )}
                          >
                            {order.paymentStatus || "pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[9px] font-bold uppercase text-slate-400 mb-0.5 block">
                        Total Amount
                      </span>
                      <span className="text-xl font-black text-[#6B4A2D] leading-none">
                        {formatPrice(order.totalAmount || order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openDetailsModal(order)}
                    className="flex-1 rounded-2xl bg-[#6B4A2D] hover:bg-[#5A3E25] text-white shadow-sm transition-all h-11 font-bold text-xs border-none"
                  >
                    <Eye className="h-3.5 w-3.5 mr-2" />
                    View Full Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-11 h-11 rounded-2xl p-0 bg-white border-slate-200 shadow-sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl p-2 min-w-[200px] shadow-2xl border-slate-200 bg-white"
                    >
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase text-slate-400 px-3 py-2">
                        Update Order Status
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                      {[
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                      ].map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() =>
                            updateStatus({ id: order.id || order._id, status })
                          }
                          className={cn(
                            "capitalize rounded-xl px-3 py-2.5 cursor-pointer font-bold mb-1 last:mb-0 text-xs",
                            order.status === status
                              ? "opacity-30 pointer-events-none"
                              : "hover:bg-slate-50"
                          )}
                        >
                          Mark as {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {pagination && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-5 bg-white rounded-[2rem] border border-slate-200 shadow-sm gap-4">
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold text-slate-500">
                Showing{" "}
                <span className="text-slate-900 font-black">
                  {(page - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="text-slate-900 font-black">
                  {Math.min(page * limit, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="text-slate-900 font-black">
                  {pagination.total}
                </span>{" "}
                orders
              </p>

              {/* Rows Per Page Selector */}
              <div className="hidden md:flex items-center gap-1.5 ml-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Rows:</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(val) => {
                    setLimit(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-16 rounded-xl border-slate-200 text-xs font-bold bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 bg-white">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full w-9 h-9 p-0 border-slate-200 hover:bg-slate-50 text-slate-600"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>

              <div className="flex items-center gap-1.5">
                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === "..." ? (
                    <div
                      key={`ellipsis-${idx}`}
                      className="flex items-center justify-center w-8 h-9 text-slate-400 font-black tracking-widest text-xs"
                    >
                      ...
                    </div>
                  ) : (
                    <Button
                      key={`page-${pageNum}`}
                      variant={page === pageNum ? "default" : "outline"}
                      className={cn(
                        "rounded-full w-9 h-9 p-0 font-bold text-xs transition-all duration-200",
                        page === pageNum
                          ? "bg-[#6B4A2D] hover:bg-[#5A3E25] text-white border-none shadow-md scale-105"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600 hover:scale-105"
                      )}
                      onClick={() => setPage(pageNum as number)}
                    >
                      {pageNum}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                className="rounded-full w-9 h-9 p-0 border-slate-200 hover:bg-slate-50 text-slate-600"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.pages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
