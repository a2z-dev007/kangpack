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
  Tag,
  Mail,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { OrderDetailsModal } from "@/features/admin/components/OrderDetailsModal";
import { ORDER_STATUS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAdminOrders, useUpdateOrderStatus } from "@/features/admin/queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  const [search, setSearch] = useState(getInitialParam("search", ""));
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  // Advanced Filter States
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: getInitialParam("status", "all"),
    paymentStatus: getInitialParam("paymentStatus", "all"),
    paymentMethod: getInitialParam("paymentMethod", "all"),
    startDate: getInitialParam("startDate", ""),
    endDate: getInitialParam("endDate", ""),
    minAmount: getInitialParam("minAmount", ""),
    maxAmount: getInitialParam("maxAmount", ""),
  });

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
    // Use replace to update URL without adding history entry for every keystroke
    // But push is generally better for filters/pagination if not typing
    // Here we use replace to persist state on reload
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [page, search, activeFilters, pathname, router, searchParams]);

  const [pendingFilters, setPendingFilters] = useState(activeFilters);

  // Sync pending filters when drawer opens
  useEffect(() => {
    if (isFilterOpen) {
      setPendingFilters(activeFilters);
    }
  }, [isFilterOpen, activeFilters]);

  // Compatibility helpers
  const statusFilter = activeFilters.status;
  const setStatusFilter = (status: string) => {
    setActiveFilters((prev) => ({ ...prev, status }));
    setPage(1);
  };

  const { data, isLoading } = useAdminOrders({
    page,
    limit: 12,
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

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
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

  const applyFilters = () => {
    setActiveFilters(pendingFilters);
    setFilterOpen(false);
    setPage(1);
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
    setPendingFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#6B4A2D]">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage your store's sales and fulfillment cycle
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-full shadow-sm bg-white border-slate-200 h-11 px-6"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setFilterOpen(true)}
            className="rounded-full bg-[#6B4A2D] hover:bg-[#5A3E25] shadow-md border-none h-11 px-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>

          {(search ||
            Object.values(activeFilters).some(
              (val) => val !== "all" && val !== "",
            )) && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="rounded-full shadow-sm bg-white border-red-200 h-11 px-6 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Search & Status Filters */}
      <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by order #, email, or customer name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-inner text-lg focus-visible:ring-[#6B4A2D]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl h-fit self-center">
            {[
              "all",
              "pending",
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
                  "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                  statusFilter === status
                    ? "bg-white text-[#6B4A2D] shadow-sm transform-none"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[320px] w-full rounded-3xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border rounded-3xl p-20 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              No orders found
            </h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              We couldn't find any orders matching your current filters.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-full"
              onClick={resetFilters}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {orders.map((order: any) => (
              <Card
                key={order._id}
                className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white flex flex-col"
              >
                <div className="p-6 pb-2">
                  <div className="flex items-start justify-between mb-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">
                        Order #
                      </span>
                      <span className="font-black text-xl text-slate-900 leading-none">
                        {order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "rounded-full border px-3 py-1 text-[10px] font-bold uppercase shadow-none transition-none transform-none",
                        getStatusStyles(order.status),
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
                            `${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}` ||
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
                      {/* Small product thumbnail */}
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
                              "rounded-full border py-0 text-[10px] h-5 px-2 font-bold uppercase shadow-none transition-none transform-none",
                              getPaymentStatusStyles(order.paymentStatus),
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
                        {formatCurrency(order.totalAmount || order.total)}
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
                        className="w-11 h-11 rounded-2xl p-0 bg-white border-slate-200 shadow-sm transition-none"
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
                            "capitalize rounded-xl px-3 py-2.5 cursor-pointer font-bold mb-1 last:mb-0 text-xs transition-none",
                            order.status === status
                              ? "opacity-30 pointer-events-none"
                              : "hover:bg-slate-50",
                          )}
                        >
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full mr-3",
                              getStatusStyles(status).split(" ")[0],
                            )}
                          />
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

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm gap-4">
            <p className="text-sm font-medium text-slate-500">
              Showing{" "}
              <span className="text-slate-800 font-bold">
                {(page - 1) * (pagination.limit || 12) + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-800 font-bold">
                {Math.min(page * (pagination.limit || 12), pagination.total)}
              </span>{" "}
              of{" "}
              <span className="text-slate-800 font-bold">
                {pagination.total}
              </span>{" "}
              orders
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full w-10 h-10 p-0 border-slate-200 hover:bg-slate-50 text-slate-600"
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
                      className="flex items-center justify-center w-8 h-10 text-slate-400 font-black tracking-widest"
                    >
                      ...
                    </div>
                  ) : (
                    <Button
                      key={`page-${pageNum}`}
                      variant={page === pageNum ? "default" : "outline"}
                      className={cn(
                        "rounded-full w-10 h-10 p-0 font-bold text-sm transition-all duration-200",
                        page === pageNum
                          ? "bg-[#6B4A2D] hover:bg-[#5A3E25] text-white border-none shadow-md scale-110"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600 hover:scale-105",
                      )}
                      onClick={() => setPage(pageNum as number)}
                    >
                      {pageNum}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                className="rounded-full w-10 h-10 p-0 border-slate-200 hover:bg-slate-50 text-slate-600"
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

      {/* Advanced Filter Drawer */}
      <SideDrawer
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        title="Advanced Filters"
        description="Refine your order list with detailed criteria."
        icon={<Filter className="h-6 w-6" />}
        footer={
          <>
            <Button
              onClick={applyFilters}
              className="w-full h-14 rounded-2xl bg-[#6B4A2D] hover:bg-[#5A3E25] font-black text-lg shadow-xl"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full h-12 rounded-2xl border-slate-200 text-slate-500 font-bold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Everything
            </Button>
          </>
        }
      >
        <div className="space-y-8">
          {/* Order Status */}
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Package className="h-3 w-3" /> Order Status
            </Label>
            <Select
              value={pendingFilters.status}
              onValueChange={(val) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  status: val,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold">
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl">
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <CreditCard className="h-3 w-3" /> Payment Status
            </Label>
            <Select
              value={pendingFilters.paymentStatus}
              onValueChange={(val) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  paymentStatus: val,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold">
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
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <ArrowUpRight className="h-3 w-3" /> Payment Method
            </Label>
            <Select
              value={pendingFilters.paymentMethod}
              onValueChange={(val) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  paymentMethod: val,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold">
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
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Date Range
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={pendingFilters.startDate}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-xs"
              />
              <Input
                type="date"
                value={pendingFilters.endDate}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-xs"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <ShoppingBag className="h-3 w-3" /> Price Range (₹)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Min"
                type="number"
                value={pendingFilters.minAmount}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    minAmount: e.target.value,
                  }))
                }
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold"
              />
              <Input
                placeholder="Max"
                type="number"
                value={pendingFilters.maxAmount}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    maxAmount: e.target.value,
                  }))
                }
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold"
              />
            </div>
          </div>
        </div>
      </SideDrawer>

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
