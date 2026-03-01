"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { useAddTracking, useUpdateOrderStatus } from "../queries";
import {
  Loader2,
  Package,
  Truck,
  User,
  MapPin,
  CreditCard,
  Clock,
  Phone,
  Mail,
  Hash,
  ShieldCheck,
  ExternalLink,
  History,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { CopyToClipboard } from "@/components/ui/CopyToClipboard";
import { cn } from "@/lib/utils";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: any;
  isAdmin?: boolean;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  isAdmin = true,
}: OrderDetailsModalProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      setTrackingNumber(order.trackingNumber || "");
      setCarrier(order.carrier || "");
    }
  }, [order, isOpen]);

  const { mutate: addTracking, isPending: isAddingTracking } = useAddTracking();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();

  const handleUpdateTracking = () => {
    if (!trackingNumber) return;
    addTracking({ id: order.id || order._id, trackingNumber, carrier });
  };

  if (!order) return null;

  return (
    <>
      <SideDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={order.orderNumber}
        description={`Placed on ${formatDateTime(order.createdAt)}`}
        icon={<Hash className="h-5 w-5 sm:h-6 sm:w-6" />}
        maxWidth="sm:max-w-[620px]"
      >
        <div className="space-y-6 sm:space-y-8 pb-10 px-0 sm:px-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Badge
              variant={order.status === "delivered" ? "default" : "secondary"}
              className="capitalize rounded-full px-4 py-1.5 font-bold text-[10px] sm:text-xs w-fit"
            >
              Order {order.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTimelineOpen(true)}
              className="h-9 rounded-2xl border-slate-200 text-slate-600 font-bold text-[10px] sm:text-xs hover:bg-slate-50 w-full sm:w-auto"
            >
              <History className="h-3.5 w-3.5 mr-2" />
              View Timeline
            </Button>
          </div>

          {/* Customer & Info Section */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Customer Info
              </h3>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#6B4A2D] flex-shrink-0 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-[#6B4A2D]/20">
                    {(
                      order.user?.name ||
                      order.shippingAddress?.firstName ||
                      "G"
                    ).charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <p className="font-black text-base sm:text-lg text-slate-900 leading-tight truncate">
                      {order.user?.name ||
                        `${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}` ||
                        "Guest Customer"}
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center justify-center sm:justify-start gap-2 group">
                        <Mail className="h-3.5 w-3.5 text-[#6B4A2D] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-bold text-slate-600 truncate break-all">
                          {order.email || order.user?.email}
                        </span>
                        <CopyToClipboard
                          text={order.email || order.user?.email}
                          variant="minimal"
                        />
                      </div>
                      {order.phone && (
                        <div className="flex items-center justify-center sm:justify-start gap-2 group">
                          <Phone className="h-3.5 w-3.5 text-[#6B4A2D] flex-shrink-0" />
                          <span className="text-[11px] sm:text-xs font-bold text-slate-600">
                            {order.phone}
                          </span>
                          <CopyToClipboard
                            text={order.phone}
                            variant="minimal"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Shipping Destination
                </h3>
                <div className="text-xs sm:text-sm border border-slate-100 rounded-2xl p-4 sm:p-5 bg-white shadow-sm leading-relaxed">
                  <p className="font-black text-slate-900 mb-2">
                    {order.shippingAddress?.firstName}{" "}
                    {order.shippingAddress?.lastName}
                  </p>
                  <div className="text-slate-600 font-medium space-y-0.5">
                    <p>
                      {order.shippingAddress?.addressLine1 ||
                        order.shippingAddress?.address}
                    </p>
                    {order.shippingAddress?.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}{" "}
                      {order.shippingAddress?.postalCode ||
                        order.shippingAddress?.zipCode}
                    </p>
                    <p className="uppercase tracking-widest font-black text-[10px] mt-2 text-[#6B4A2D] bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                      {order.shippingAddress?.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> Billing Profile
                </h3>
                <div className="text-xs sm:text-sm border border-slate-100 rounded-2xl p-4 sm:p-5 bg-slate-50/50 shadow-sm border-dashed leading-relaxed">
                  <p className="font-black text-slate-900 mb-2">
                    {order.billingAddress?.firstName}{" "}
                    {order.billingAddress?.lastName}
                  </p>
                  <div className="text-slate-500 font-medium space-y-0.5">
                    <p>
                      {order.billingAddress?.addressLine1 ||
                        order.billingAddress?.address}
                    </p>
                    {order.billingAddress?.addressLine2 && (
                      <p>{order.billingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.billingAddress?.city},{" "}
                      {order.billingAddress?.state}{" "}
                      {order.billingAddress?.postalCode ||
                        order.billingAddress?.zipCode}
                    </p>
                    <p className="uppercase tracking-widest font-black text-[10px] mt-2 text-slate-400">
                      {order.billingAddress?.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Package className="h-3.5 w-3.5" /> Manifest (
              {order.items?.length || 0} Items)
            </h3>
            <div className="border border-slate-100 rounded-2xl divide-y divide-slate-50 overflow-hidden shadow-sm">
              {order.items?.map((item: any) => (
                <div
                  key={item._id || item.product?._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50/50 transition-colors gap-4"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0 overflow-hidden shadow-inner">
                      <img
                        src={
                          item.image ||
                          item.product?.images?.[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="font-black text-slate-900 text-sm sm:text-base truncate">
                        {item.name || item.product?.name || "Deleted Product"}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1 sm:mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {item.sku && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            SKU: {item.sku}
                          </span>
                        )}
                        <span className="text-slate-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-[#6B4A2D] text-base sm:text-lg self-end sm:self-center">
                    {formatPrice(item.total || item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" /> Payment Intelligence
              </h3>
              <div className="rounded-2xl border border-slate-100 p-6 space-y-5 bg-slate-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Gateway
                  </span>
                  <Badge
                    variant="outline"
                    className="uppercase font-black text-[10px] border-slate-200 text-slate-700 bg-white"
                  >
                    {order.paymentMethod === "razorpay"
                      ? "Razorpay Online"
                      : order.paymentMethod || "Manual"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Status
                  </span>
                  <Badge
                    className={cn(
                      "uppercase font-black text-[10px] border-none",
                      order.paymentStatus === "completed" ||
                        order.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700",
                    )}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                {(order.razorpayOrderId || order.razorpayPaymentId) && (
                  <div className="pt-4 space-y-3 border-t border-slate-100 mt-2">
                    {order.razorpayOrderId && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                          Payment Order ID
                        </span>
                        <div className="flex items-center gap-2 group">
                          <span className="text-[11px] font-bold font-mono text-slate-600 break-all flex-1">
                            {order.razorpayOrderId}
                          </span>
                          <CopyToClipboard
                            text={order.razorpayOrderId}
                            variant="minimal"
                          />
                        </div>
                      </div>
                    )}
                    {order.razorpayPaymentId && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                          Payment ID
                        </span>
                        <div className="flex items-center gap-2 group">
                          <span className="text-[11px] font-bold font-mono text-slate-600 break-all flex-1">
                            {order.razorpayPaymentId}
                          </span>
                          <CopyToClipboard
                            text={order.razorpayPaymentId}
                            variant="minimal"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Financial Breakdown
              </h3>
              <div className="space-y-4 bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-500">
                    <span>Tax (Included)</span>
                    <span className="text-slate-900">
                      {formatPrice(order.taxAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-500">
                  <span>Logistic Fee</span>
                  <span className="text-slate-900">
                    {order.shippingAmount > 0
                      ? formatPrice(order.shippingAmount)
                      : "Complimentary"}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
                    <span>Promotional Save</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-200 mt-2 flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest pb-1">
                    Total Payable
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#6B4A2D] leading-none">
                    {formatPrice(order.totalAmount || order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment Section - Only for Admin */}
          {isAdmin && (
            <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Truck className="h-3.5 w-3.5" /> Fulfillment Pipeline
              </h3>

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Tracking Identifier
                    </label>
                    <div className="relative group">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#6B4A2D] transition-colors" />
                      <Input
                        placeholder="Enter tracking number..."
                        value={trackingNumber}
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-white font-black text-slate-900 focus-visible:ring-[#6B4A2D] transition-all"
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Logistics Partner
                    </label>
                    <div className="relative group">
                      <Truck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#6B4A2D] transition-colors" />
                      <Input
                        placeholder="e.g. BlueDart, FedEx"
                        value={carrier}
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-white font-black text-slate-900 focus-visible:ring-[#6B4A2D] transition-all"
                        onChange={(e) => setCarrier(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleUpdateTracking}
                  disabled={isAddingTracking || !trackingNumber}
                  className="w-full h-14 rounded-2xl bg-[#6B4A2D] hover:bg-[#5A3E25] text-white font-black text-base shadow-xl shadow-[#6B4A2D]/20 transition-all active:scale-[0.98]"
                >
                  {isAddingTracking ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Syncing Data...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-5 w-5 mr-3" />
                      Update Fulfillment Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {!isAdmin && order.trackingNumber && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 space-y-4 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-800 flex items-center gap-2">
                <Truck className="h-4 w-4" /> Logistics Real-time Data
              </h3>
              <div className="grid grid-cols-2 gap-8 pt-2">
                <div>
                  <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-1.5">
                    Carrier info
                  </p>
                  <p className="font-black text-indigo-900 text-lg">
                    {order.carrier || "Standard Shipping"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-1.5">
                    Reference #
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <p className="font-mono font-black text-indigo-900 text-lg bg-white/50 px-3 py-1 rounded-xl">
                      {order.trackingNumber}
                    </p>
                    <CopyToClipboard
                      text={order.trackingNumber}
                      variant="minimal"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SideDrawer>

      {/* Timeline Drawer */}
      <SideDrawer
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        title="Order Timeline"
        description={`Complete history for ${order.orderNumber}`}
        icon={<History className="h-6 w-6" />}
        maxWidth="sm:max-w-[500px]"
      >
        <div className="space-y-6 pb-10">
          {/* Timeline Header Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                Current Status
              </p>
              <p className="text-lg font-black text-slate-900 capitalize">
                {order.status}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                Last Updated
              </p>
              <p className="text-xs font-bold text-slate-600">
                {formatDateTime(order.updatedAt)}
              </p>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-1 relative">
            <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-slate-200" />

            {/* Order Placed */}
            <div className="relative flex gap-4 pb-6">
              <div className="relative z-10 flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className="font-black text-sm text-slate-900 mb-1">
                  Order Placed
                </h4>
                <p className="text-xs text-slate-500 font-bold mb-2">
                  {formatDateTime(order.createdAt)}
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-emerald-800">
                    Order successfully created and payment initiated
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {order.paymentStatus && (
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center shadow-lg",
                      order.paymentStatus === "completed" ||
                        order.paymentStatus === "paid"
                        ? "bg-emerald-500 shadow-emerald-500/30"
                        : "bg-amber-400 shadow-amber-400/30",
                    )}
                  >
                    {order.paymentStatus === "completed" ||
                    order.paymentStatus === "paid" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-black text-sm text-slate-900 mb-1">
                    Payment{" "}
                    {order.paymentStatus === "completed" ||
                    order.paymentStatus === "paid"
                      ? "Confirmed"
                      : "Pending"}
                  </h4>
                  <p className="text-xs text-slate-500 font-bold mb-2">
                    {formatDateTime(order.createdAt)}
                  </p>
                  <div
                    className={cn(
                      "border rounded-xl p-3",
                      order.paymentStatus === "completed" ||
                        order.paymentStatus === "paid"
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-amber-50 border-amber-100",
                    )}
                  >
                    <p
                      className={cn(
                        "text-xs font-bold",
                        order.paymentStatus === "completed" ||
                          order.paymentStatus === "paid"
                          ? "text-emerald-800"
                          : "text-amber-800",
                      )}
                    >
                      Payment via{" "}
                      {order.paymentMethod === "razorpay"
                        ? "Razorpay"
                        : order.paymentMethod || "COD"}
                      {order.paymentStatus === "completed" ||
                      order.paymentStatus === "paid"
                        ? " - Transaction successful"
                        : " - Awaiting confirmation"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Processing */}
            {(order.status === "processing" ||
              order.status === "shipped" ||
              order.status === "delivered") && (
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Package className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-black text-sm text-slate-900 mb-1">
                    Order Processing
                  </h4>
                  <p className="text-xs text-slate-500 font-bold mb-2">
                    {formatDateTime(order.updatedAt)}
                  </p>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-800">
                      Your order is being prepared for shipment
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipped */}
            {(order.status === "shipped" || order.status === "delivered") &&
              order.trackingNumber && (
                <div className="relative flex gap-4 pb-6">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <Truck className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="font-black text-sm text-slate-900 mb-1">
                      Order Shipped
                    </h4>
                    <p className="text-xs text-slate-500 font-bold mb-2">
                      {formatDateTime(order.updatedAt)}
                    </p>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-bold text-indigo-800">
                        Package is on the way
                      </p>
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2 pt-2 border-t border-indigo-100">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                            Tracking:
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-900 bg-white px-2 py-0.5 rounded flex-1">
                            {order.trackingNumber}
                          </span>
                          <CopyToClipboard
                            text={order.trackingNumber}
                            variant="minimal"
                          />
                        </div>
                      )}
                      {order.carrier && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                            Carrier:
                          </span>
                          <span className="text-xs font-bold text-indigo-900">
                            {order.carrier}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Delivered */}
            {order.status === "delivered" && (
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-black text-sm text-slate-900 mb-1">
                    Order Delivered
                  </h4>
                  <p className="text-xs text-slate-500 font-bold mb-2">
                    {formatDateTime(order.updatedAt)}
                  </p>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-emerald-800">
                      Package successfully delivered to customer
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled */}
            {order.status === "cancelled" && (
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <Circle className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-black text-sm text-slate-900 mb-1">
                    Order Cancelled
                  </h4>
                  <p className="text-xs text-slate-500 font-bold mb-2">
                    {formatDateTime(order.updatedAt)}
                  </p>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-800">
                      This order has been cancelled
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Order Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    {order.orderNumber}
                  </span>
                  <CopyToClipboard text={order.orderNumber} variant="minimal" />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">Total Amount</span>
                <span className="font-black text-[#6B4A2D]">
                  {formatPrice(order.totalAmount || order.total)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">Payment Method</span>
                <span className="font-bold text-slate-900 capitalize">
                  {order.paymentMethod === "razorpay"
                    ? "Razorpay"
                    : order.paymentMethod || "COD"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SideDrawer>
    </>
  );
}
