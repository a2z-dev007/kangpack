"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import { useProfile } from "@/hooks/use-profile";
import { useOrders } from "@/features/orders/queries";
import { OrderDetailsModal } from "@/features/admin/components/OrderDetailsModal";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cart/cartSlice";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { formatPrice, formatDate, getImageUrl } from "@/lib/utils";
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
  AlertCircle,
  Truck,
  ExternalLink,
  Eye,
  Repeat,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "@/lib/toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const { wishlist, fetchWishlist } = useWishlist();
  const { fetchProfile } = useProfile();
  const dispatch = useAppDispatch();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isReorderingId, setIsReorderingId] = useState<string | null>(null);

  const { data: ordersResponse, isLoading: isLoadingOrders } = useOrders({
    page: 1,
    limit: 10,
  });

  const orders = ordersResponse?.data || [];
  const ordersCount = ordersResponse?.pagination?.total || orders.length;

  useEffect(() => {
    fetchWishlist();
    fetchProfile();
  }, [fetchWishlist, fetchProfile]);

  const totalSpent = useMemo(() => {
    return orders.reduce(
      (sum: number, o: any) => sum + (o.totalAmount || o.total || 0),
      0
    );
  }, [orders]);

  const activeShipment = useMemo(() => {
    return orders.find(
      (o: any) =>
        o.status === "shipped" ||
        o.status === "confirmed" ||
        o.status === "processing"
    );
  }, [orders]);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    try {
      setIsResendingVerification(true);
      await api.post("/auth/resend-verification", { email: user.email });
      toast.success("Verification link sent! Please check your inbox.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to resend verification email"
      );
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleBuyAgain = async (order: any) => {
    if (!order.items || order.items.length === 0) return;
    try {
      const orderId = order.id || order._id;
      setIsReorderingId(orderId);
      for (const item of order.items) {
        if (item.product) {
          await dispatch(
            addToCart({
              product: item.product,
              quantity: item.quantity || 1,
            })
          ).unwrap();
        }
      }
      toast.success("Items added to your bag!");
    } catch {
      toast.error("Could not re-order some items");
    } finally {
      setIsReorderingId(null);
    }
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-bold uppercase text-[10px]">
            Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-none font-bold uppercase text-[10px]">
            Shipped
          </Badge>
        );
      case "confirmed":
      case "processing":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-bold uppercase text-[10px]">
            {status}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-none font-bold uppercase text-[10px]">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-bold uppercase text-[10px]">
            {status || "Pending"}
          </Badge>
        );
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: ordersCount.toString(),
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "All time purchases",
    },
    {
      label: "Total Spent",
      value: formatPrice(totalSpent),
      icon: Wallet,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "Cumulative spend",
    },
    {
      label: "Wishlist Items",
      value: wishlist.length.toString(),
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      trend: "Saved items",
    },
    {
      label: "Account Status",
      value: user?.isEmailVerified ? "Verified" : "Active",
      icon: ShieldCheck,
      color: user?.isEmailVerified ? "text-violet-500" : "text-amber-500",
      bg: user?.isEmailVerified ? "bg-violet-500/10" : "bg-amber-500/10",
      trend: user?.isEmailVerified ? "Identity verified" : "Action required",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Email Verification Alert Banner */}
      {user && !user.isEmailVerified && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                Email Verification Recommended
              </h4>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed max-w-xl">
                Your email (<strong className="font-bold">{user.email}</strong>) is not verified. Verify your email to secure your account and receive real-time dispatch updates.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleResendVerification}
            disabled={isResendingVerification}
            className="bg-[#6B4A2D] hover:bg-[#533922] text-white rounded-2xl text-xs font-bold uppercase tracking-wider px-5 h-11 shrink-0 shadow-md shadow-[#6B4A2D]/20"
          >
            {isResendingVerification ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Sending Link...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Link
              </>
            )}
          </Button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome back,{" "}
            <span className="text-[#6B4A2D]">
              {user?.firstName || user?.name || "Traveler"}
            </span>
            !
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track active deliveries, view order histories, and manage your account.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="rounded-full shadow-sm w-full sm:w-auto text-xs sm:text-sm border-[#6B4A2D]/20 text-[#6B4A2D] hover:bg-[#6B4A2D]/5"
            asChild
          >
            <Link href={ROUTES.PRODUCTS}>Browse Catalog</Link>
          </Button>
          <Button
            className="rounded-full shadow-lg shadow-[#6B4A2D]/20 bg-[#6B4A2D] hover:bg-[#533922] text-white w-full sm:w-auto text-xs sm:text-sm font-bold"
            asChild
          >
            <Link href={ROUTES.CART}>View Bag</Link>
          </Button>
        </div>
      </div>

      {/* Hero Widget: Active Shipment Stepper */}
      {activeShipment && (
        <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 shadow-md rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-indigo-100/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-600/20">
                  <Truck className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                      Active Shipment
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Order #{activeShipment.orderNumber}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openOrderDetails(activeShipment)}
                  className="rounded-xl text-xs font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Track & Details
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-5 space-y-6">
            {/* Tracking Milestones */}
            <div className="grid grid-cols-4 gap-2 relative">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-tight">
                  Confirmed
                </p>
              </div>
              <div className="text-center space-y-2">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center shadow-md ${
                    activeShipment.status === "processing" ||
                    activeShipment.status === "shipped" ||
                    activeShipment.status === "delivered"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-tight">
                  Packed
                </p>
              </div>
              <div className="text-center space-y-2">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center shadow-md ${
                    activeShipment.status === "shipped" ||
                    activeShipment.status === "delivered"
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <p className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-tight">
                  Dispatched
                </p>
              </div>
              <div className="text-center space-y-2">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center shadow-md ${
                    activeShipment.status === "delivered"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-tight">
                  Delivered
                </p>
              </div>
            </div>

            {/* Carrier & AWB Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-indigo-100/70 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">
                    Carrier:{" "}
                  </span>
                  <span>{activeShipment.carrier || "Standard Courier Logistics"}</span>
                </div>
              </div>
              {activeShipment.trackingNumber ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">AWB:</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {activeShipment.trackingNumber}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 italic">
                  AWB tracking number assigned upon pickup
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                      {stat.value}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center mt-2 group-hover:text-[#6B4A2D] transition-colors">
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
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-black text-slate-900">
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  Your latest purchases and tracking history
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6B4A2D] hover:text-[#533922] font-bold text-xs uppercase tracking-wider shrink-0"
                asChild
              >
                <Link
                  href={ROUTES.ORDERS}
                  className="flex items-center whitespace-nowrap"
                >
                  View All ({ordersCount}) <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingOrders ? (
                <div className="py-12 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#6B4A2D]" />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/10">
                  <div className="p-4 rounded-full bg-white shadow-sm mb-4 text-[#6B4A2D]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    No orders yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                    Explore our collection of handcrafted gear and place your first order.
                  </p>
                  <Button
                    className="rounded-full shadow-lg bg-[#6B4A2D] hover:bg-[#533922] text-white h-10 px-6 font-bold"
                    asChild
                  >
                    <Link href={ROUTES.PRODUCTS}>Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order: any) => (
                    <div
                      key={order.id || order._id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-white hover:border-[#6B4A2D]/20 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(
                              order.items?.[0]?.image ||
                                order.items?.[0]?.product?.images?.[0]
                            )}
                            alt={order.orderNumber}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-black text-sm text-[#6B4A2D]">
                              #{order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-xs text-slate-500">
                            Placed on {formatDate(order.createdAt)} • {order.items?.length || 1} item{order.items?.length > 1 ? "s" : ""}
                          </p>
                          <p className="text-xs font-black text-slate-900 mt-1">
                            {formatPrice(order.totalAmount || order.total)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                          className="h-9 px-3 rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isReorderingId === (order.id || order._id)}
                          onClick={() => handleBuyAgain(order)}
                          className="h-9 px-3 rounded-xl text-xs font-bold border-[#6B4A2D]/30 text-[#6B4A2D] hover:bg-[#6B4A2D]/5"
                        >
                          {isReorderingId === (order.id || order._id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          ) : (
                            <Repeat className="w-3.5 h-3.5 mr-1" />
                          )}
                          Buy Again
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Promo */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative rounded-[2rem]">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="h-32 w-32 -rotate-12" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="inline-block p-2 rounded-lg bg-white/10 backdrop-blur-md mb-4">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Artisan Guarantee</h3>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Every Kangpack bag is crafted with full-grain leather and heavy-duty canvas, built for a lifetime of journeys.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-full border-white/20 hover:bg-white hover:text-gray-900 text-white shadow-lg bg-transparent"
                asChild
              >
                <Link href={ROUTES.PRODUCTS}>Explore Workshop</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-lg font-black text-slate-900">
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Link
                href={ROUTES.ORDERS}
                className="flex items-center p-3 rounded-2xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted-foreground/10"
              >
                <div className="p-2.5 rounded-xl bg-blue-100/60 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  Track All Orders
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={ROUTES.PROFILE}
                className="flex items-center p-3 rounded-2xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted-foreground/10"
              >
                <div className="p-2.5 rounded-xl bg-orange-100/50 text-orange-600 mr-3 group-hover:bg-orange-100 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  Account Settings
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={ROUTES.ADDRESSES}
                className="flex items-center p-3 rounded-2xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted-foreground/10"
              >
                <div className="p-2.5 rounded-xl bg-purple-100/50 text-purple-600 mr-3 group-hover:bg-purple-100 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  Saved Addresses
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={ROUTES.WISHLIST}
                className="flex items-center p-3 rounded-2xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-muted-foreground/10"
              >
                <div className="p-2.5 rounded-xl bg-pink-100/50 text-pink-600 mr-3 group-hover:bg-pink-100 transition-colors">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  My Wishlist
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          isAdmin={false}
        />
      )}
    </div>
  );
}
