"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import { Eye, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { ROUTES } from "@/lib/constants";

import { useOrders } from "@/features/orders/queries";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { OrderDetailsModal } from "@/features/admin/components/OrderDetailsModal";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data, isLoading } = useOrders({ page: 1, limit: 10 });
  const orders = data?.data || [];

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
      case "confirmed":
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "shipped":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "processing":
      case "confirmed":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            My Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Fetching your order history...
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          My Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          View and track your order history.
        </p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="border-none shadow-md bg-white p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't placed any orders yet.
            </p>
            <Button asChild className="rounded-full px-8">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </Card>
        ) : (
          orders.map((order: any) => (
            <Card
              key={order._id}
              className="border-none shadow-md hover:shadow-lg transition-all bg-white overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div
                    className={`w-full h-1 md:w-1.5 md:h-auto ${
                      order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "shipped"
                          ? "bg-blue-500"
                          : "bg-orange-500"
                    }`}
                  />

                  <div className="flex-grow p-5 md:p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-none mb-2">
                          #{order.orderNumber}
                        </h3>
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="hidden xs:inline">Placed on</span>
                            {formatDateTime(order.createdAt)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span>
                            {order.items?.length || 0}{" "}
                            {order.items?.length === 1 ? "item" : "items"}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-bold tracking-tighter py-0"
                          >
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : "Online Payment"}
                          </Badge>
                        </div>
                      </div>

                      <Badge
                        className={`rounded-full px-3 py-1 text-xs gap-1.5 shadow-none border-0 shrink-0 ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize hidden sm:inline">
                          {order.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="h-px w-full bg-gray-100 md:hidden" />

                    <div className="flex items-end justify-between md:justify-end md:gap-8">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                          Total Amount
                        </p>
                        <p className="font-bold text-xl text-[#6B4A2D] leading-none">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full shadow-sm hover:bg-gray-50 border-gray-200"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <OrderDetailsModal
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        order={selectedOrder}
        isAdmin={false}
      />
    </div>
  );
}
