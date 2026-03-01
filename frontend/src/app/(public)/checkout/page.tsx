"use client";

import api from "@/lib/api";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setStep,
  setShippingAddress,
  setPaymentMethod,
  resetCheckout,
  setProcessing,
} from "@/lib/store/features/checkout/checkoutSlice";
import { clearCart } from "@/lib/store/features/cart/cartSlice";
import Navbar from "@/components/home/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Truck,
  User,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import Lottie from "react-lottie";
import Confetti from "react-confetti-boom";
import successLottie from "@/assets/lottie/success-tick.json";

// --- Sub-components ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, name: "Information", icon: User },
    { id: 2, name: "Shipping", icon: Truck },
    { id: 3, name: "Payment", icon: CreditCard },
  ];

  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-8 mb-16">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-[#6B4A2D] text-white shadow-lg"
                  : "bg-white text-[#6B4A2D]/40 border-2 border-[#6B4A2D]/10"
              }`}
            >
              <step.icon size={18} className="md:size-5" />
            </div>
            <span
              className={`text-[9px] md:text-xs font-bold uppercase tracking-widest mt-3 whitespace-nowrap transition-colors ${
                currentStep >= step.id ? "text-[#6B4A2D]" : "text-[#6B4A2D]/40"
              }`}
            >
              {step.name}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`h-[2px] w-6 sm:w-12 md:w-16 transition-colors duration-500 -mt-6 ${
                currentStep > step.id ? "bg-[#6B4A2D]" : "bg-[#6B4A2D]/10"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- Checkout Main Page ---

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentStep, shippingAddress, paymentMethod, isProcessing, error } =
    useAppSelector((state) => state.checkout);
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate totals based on backend logic
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% Tax
  const shipping = cartItems.length > 0 ? 10 : 0; // Standard Shipping
  const total = subtotal + tax + shipping;

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    items: [] as any[],
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "razorpay" | "cod"
  >("razorpay");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (isAuthenticated && user && currentStep === 1) {
      const defaultAddress = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: defaultAddress?.phone || prev.phone,
        addressLine1: defaultAddress?.addressLine1 || prev.addressLine1,
        city: defaultAddress?.city || prev.city,
        state: defaultAddress?.state || prev.state,
        postalCode: defaultAddress?.postalCode || prev.postalCode,
        country: defaultAddress?.country || prev.country || "India",
      }));
    }
  }, [isAuthenticated, user, currentStep]);

  useEffect(() => {
    // If we are at the final step but there are items in the cart (new order started)
    // or if we just landed on checkout and it's in step 4 from a previous session
    if (currentStep === 4 && cartItems.length > 0) {
      dispatch(resetCheckout());
    }
  }, [cartItems.length, currentStep, dispatch]);

  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 4) {
      router.push("/");
    }
  }, [cartItems, currentStep, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation
    const requiredFields = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email Address" },
      { key: "phone", label: "Phone Number" },
      { key: "addressLine1", label: "Shipping Address" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "postalCode", label: "Pincode" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData]) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    dispatch(setShippingAddress(formData as any));
    dispatch(setStep(2));
  };

  const handleShippingSubmit = () => {
    dispatch(setStep(3));
  };

  const handlePaymentSubmit = async () => {
    dispatch(setProcessing(true));
    try {
      const orderData = {
        shippingAddress: {
          ...formData,
        },
        billingAddress: {
          ...formData,
        },
        paymentMethod: selectedPaymentMethod,
        shippingMethod: "Standard",
        email: formData.email,
        phone: formData.phone,
        createAccount,
        password: createAccount ? password : undefined,
      };

      const response = await api.post("/orders", orderData);
      const order = response.data.data;

      if (selectedPaymentMethod === "cod") {
        setOrderSummary({
          subtotal,
          tax,
          shipping,
          total,
          items: cartItems.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images?.[0],
          })),
        });
        dispatch(clearCart());
        dispatch(setStep(4));
        toast.success("Order placed successfully!");
      } else if (selectedPaymentMethod === "razorpay") {
        const res = await loadRazorpay();

        if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.totalAmount * 100,
          currency: order.currency || "INR",
          name: "Kangpack",
          description: "Premium Minimalist Gear",
          order_id: order.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await api.post(
                `/orders/${order.id}/verify-razorpay`,
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              );

              if (verifyRes.data.success) {
                setOrderSummary({
                  subtotal,
                  tax,
                  shipping,
                  total,
                  items: cartItems.map((item) => ({
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.images?.[0],
                  })),
                });
                dispatch(clearCart());
                dispatch(setStep(4));
                toast.success("Payment successful & order placed!");
              }
            } catch (err) {
              console.error("Verification failed:", err);
              toast.error(
                "Payment verification failed. Please contact support.",
              );
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#6B4A2D",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      dispatch(setProcessing(false));
    }
  };

  if (currentStep === 4) {
    const lottieOptions = {
      loop: false,
      autoplay: true,
      animationData: successLottie,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <div className="min-h-screen bg-brand-beige flex flex-col bg-[url('/assets/grid.svg')] bg-fixed overflow-hidden">
        <Navbar solid />
        <Confetti
          mode="fall"
          particleCount={120}
          colors={["#6B4A2D", "#A67C52", "#F5F5F0", "#10B981", "#FFD700"]}
        />

        <div className="flex-grow flex items-center justify-center p-4 md:p-8 pt-32 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="max-w-4xl w-full bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(107,74,45,0.2)] border border-[#6B4A2D]/5 flex flex-col relative overflow-hidden"
          >
            {/* Top Section: Celebration */}
            <div className="p-8 md:p-16 text-center border-b border-[#6B4A2D]/5">
              <div className="w-48 h-48 mx-auto -mt-10 mb-4 flex items-center justify-center">
                {isMounted && (
                  <Lottie
                    options={lottieOptions}
                    height={200}
                    width={200}
                    isClickToPauseDisabled={true}
                  />
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#6B4A2D] uppercase tracking-tighter mb-2">
                Order Confirmed!
              </h1>
              <p className="text-[#8B7E6F] mb-8 leading-relaxed text-lg max-w-md mx-auto">
                Thank you for your purchase. We've sent a confirmation email to{" "}
                <br />
                <span className="font-bold text-[#6B4A2D] break-all">
                  {formData.email}
                </span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  onClick={() => {
                    dispatch(resetCheckout());
                    router.push("/");
                  }}
                  className="bg-[#6B4A2D] hover:bg-[#5A3E26] text-white px-8 h-12 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#6B4A2D]/20 transition-all hover:scale-[1.05]"
                >
                  Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/profile/orders")}
                  className="border-2 border-[#6B4A2D]/10 hover:border-[#6B4A2D] text-[#6B4A2D] px-8 h-12 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
                >
                  View Orders
                </Button>
              </div>
            </div>

            {/* Horizontal Order Summary Area */}
            <div className="bg-[#FFFBF6]/50 p-6 md:p-10">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-black text-[#6B4A2D] uppercase tracking-tighter text-sm">
                  Order Summary
                </h3>
                <span className="text-[10px] font-bold text-[#6B4A2D]/40 uppercase tracking-widest">
                  {orderSummary.items.length}{" "}
                  {orderSummary.items.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Individual Items - Horizontal Scroll */}
              <div className="flex gap-4 overflow-x-auto pb-6 px-2 scrollbar-thin">
                {orderSummary.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-64 bg-white p-4 rounded-3xl border border-[#6B4A2D]/5 shadow-sm flex items-center gap-4 group transition-shadow hover:shadow-md"
                  >
                    <div className="w-16 h-16 bg-brand-beige rounded-xl overflow-hidden border border-[#6B4A2D]/5 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#6B4A2D] text-sm truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-[#6B4A2D]/40 uppercase">
                          Qty: {item.quantity}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#6B4A2D]/10" />
                        <span className="text-xs font-bold text-[#A67C52]">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="mt-6 pt-6 border-t border-[#6B4A2D]/5 flex flex-col md:flex-row justify-between items-center gap-8 px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#6B4A2D]/40 uppercase tracking-widest">
                      Payment Status
                    </p>
                    <p className="font-bold text-[#6B4A2D]">
                      Paid via {selectedPaymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black text-[#6B4A2D]/40 uppercase tracking-widest mb-1">
                    Total Paid
                  </p>
                  <p className="text-4xl font-black text-[#6B4A2D] uppercase tracking-tighter leading-none">
                    {formatPrice(orderSummary.total)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar solid />

      <div className="flex-grow pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() =>
                currentStep > 1
                  ? dispatch(setStep(currentStep - 1))
                  : router.back()
              }
              className="flex items-center gap-2 text-[#6B4A2D]/60 hover:text-[#6B4A2D] font-bold uppercase tracking-widest text-md mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl md:text-5xl font-black text-[#6B4A2D] uppercase tracking-tighter">
              Checkout
            </h1>
          </div>

          <StepIndicator currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Flow */}
            <div className="lg:col-span-7 xl:col-span-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="bg-[#fff] px-5 py-8 md:p-12 rounded-[32px] shadow-sm border border-[#6B4A2D]/5"
                  >
                    <h2 className="text-xl md:text-2xl font-black text-[#6B4A2D] uppercase tracking-tighter mb-8 flex items-center gap-3">
                      <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#6B4A2D]/5 flex items-center justify-center text-xs md:text-sm">
                        1
                      </span>
                      Your Information
                    </h2>
                    {!isAuthenticated && (
                      <div className="bg-[#6B4A2D]/5 p-6 rounded-2xl mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-[#6B4A2D]">
                              Checking out as a guest?
                            </p>
                            <p className="text-[10px] text-[#6B4A2D]/60 mt-2 uppercase tracking-widest font-medium leading-relaxed max-w-sm">
                              You are welcome to checkout as a guest. Please
                              note that{" "}
                              <span className="text-[#6B4A2D] font-bold">
                                order history and tracking
                              </span>{" "}
                              are only available to registered members.
                            </p>
                          </div>
                          <Link
                            href="/auth/login"
                            className="shrink-0 w-full sm:w-auto"
                          >
                            <Button
                              variant="outline"
                              className="w-full border-[#6B4A2D]/20 text-[#6B4A2D] hover:bg-[#6B4A2D] hover:text-white transition-all text-xs font-bold h-11"
                            >
                              Log In
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleInfoSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                            First Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                            placeholder="Rajesh"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                            Last Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                            placeholder="Kumar"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                          placeholder="rajesh@kumar.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                          placeholder="+91 99887 76655"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                          Shipping Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                          placeholder="Building Name, Flat No."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                            placeholder="Mumbai"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                            State <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                            placeholder="Maharashtra"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                            Country <span className="text-red-500">*</span>
                          </Label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                country: e.target.value,
                              })
                            }
                            className="flex h-14 w-full rounded-xl border border-[#6B4A2D]/10 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B4A2D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium text-[#6B4A2D]"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="United Arab Emirates">
                              United Arab Emirates
                            </option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                            Pincode <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] transition-all"
                            placeholder="400001"
                          />
                        </div>
                      </div>

                      {!isAuthenticated && (
                        <div className="p-6 bg-[#F9F7F4] rounded-2xl border border-[#6B4A2D]/10 space-y-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id="createAccount"
                              checked={createAccount}
                              onChange={(e) =>
                                setCreateAccount(e.target.checked)
                              }
                              className="w-5 h-5 rounded border-[#6B4A2D]/20 text-[#6B4A2D] focus:ring-[#6B4A2D]"
                            />
                            <Label
                              htmlFor="createAccount"
                              className="text-sm font-bold text-[#6B4A2D] cursor-pointer"
                            >
                              Create an account for faster checkout & order
                              tracking
                            </Label>
                          </div>

                          <AnimatePresence>
                            {createAccount && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-2 pt-2"
                              >
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">
                                  Set Account Password
                                </Label>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="h-14 rounded-xl border-[#6B4A2D]/10 focus:border-[#6B4A2D] pr-12"
                                    required={createAccount}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B4A2D]/40 hover:text-[#6B4A2D]/60 transition-colors"
                                  >
                                    {showPassword ? (
                                      <EyeOff size={18} />
                                    ) : (
                                      <Eye size={18} />
                                    )}
                                  </button>
                                </div>
                                <p className="text-[10px] text-[#6B4A2D]/40 font-medium">
                                  Your checkout details will be used to create
                                  your profile.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-[#6B4A2D] hover:bg-[#6B4A2D]/90 text-white h-14 rounded-2xl text-sm md:text-lg font-bold uppercase tracking-wider md:tracking-widest mt-8 group whitespace-normal px-4"
                      >
                        <span className="text-center">
                          Continue to Shipping
                        </span>
                        <ChevronRight className="group-hover:translate-x-1 transition-transform ml-2 shrink-0" />
                      </Button>
                    </form>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="bg-white px-5 py-8 md:p-12 rounded-[32px] shadow-sm border border-[#6B4A2D]/5"
                  >
                    <h2 className="text-2xl font-black text-[#6B4A2D] uppercase tracking-tighter mb-8 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#6B4A2D]/5 flex items-center justify-center text-sm">
                        2
                      </span>
                      Shipping Method
                    </h2>

                    <div className="space-y-4 mb-10">
                      <div className="p-6 rounded-2xl border-2 border-[#6B4A2D] bg-[#6B4A2D]/5 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border-4 border-[#6B4A2D] bg-white" />
                          <div>
                            <p className="font-bold text-[#6B4A2D]">
                              Standard Shipping
                            </p>
                            <p className="text-xs text-[#6B4A2D]/60">
                              3-5 business days
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-[#6B4A2D] uppercase text-xs">
                          Free
                        </span>
                      </div>
                      <div className="p-6 rounded-2xl border border-[#6B4A2D]/10 opacity-50 flex items-center justify-between cursor-not-allowed">
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border-2 border-[#6B4A2D]/20 bg-white" />
                          <div>
                            <p className="font-bold text-[#6B4A2D]/60">
                              Express Delivery
                            </p>
                            <p className="text-xs text-[#6B4A2D]/40">
                              Next day service
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#6B4A2D]/60 uppercase text-xs">
                          +$15.00
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleShippingSubmit}
                      className="w-full bg-[#6B4A2D] hover:bg-[#6B4A2D]/90 text-white h-14 rounded-2xl text-sm md:text-lg font-bold uppercase tracking-wider md:tracking-widest group whitespace-normal px-4"
                    >
                      <span className="text-center">Continue to Payment</span>
                      <ChevronRight className="group-hover:translate-x-1 transition-transform ml-2 shrink-0" />
                    </Button>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="bg-white px-5 py-8 md:p-12 rounded-[32px] shadow-sm border border-[#6B4A2D]/5"
                  >
                    <h2 className="text-2xl font-black text-[#6B4A2D] uppercase tracking-tighter mb-8 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#6B4A2D]/5 flex items-center justify-center text-sm">
                        3
                      </span>
                      Final Review & Payment
                    </h2>

                    {/* Order Review Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="p-6 bg-[#6B4A2D]/5 rounded-3xl border border-[#6B4A2D]/10 relative group hover:bg-[#6B4A2D]/10 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">Shipping Information</h4>
                          <button 
                            onClick={() => dispatch(setStep(1))}
                            className="text-[10px] font-bold text-[#6B4A2D] hover:underline uppercase tracking-widest"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm font-bold text-[#6B4A2D]">{formData.firstName} {formData.lastName}</p>
                        <p className="text-xs text-[#8B7E6F] mt-1 line-clamp-2">{formData.addressLine1}, {formData.city}</p>
                        <p className="text-xs text-[#8B7E6F]">{formData.state}, {formData.postalCode}</p>
                        <p className="text-xs text-[#8B7E6F] mt-2 font-bold">{formData.phone}</p>
                      </div>

                      <div className="p-6 bg-[#6B4A2D]/5 rounded-3xl border border-[#6B4A2D]/10 relative group hover:bg-[#6B4A2D]/10 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60">Shipping Method</h4>
                          <button 
                            onClick={() => dispatch(setStep(2))}
                            className="text-[10px] font-bold text-[#6B4A2D] hover:underline uppercase tracking-widest"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#6B4A2D] shadow-sm">
                            <Truck size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#6B4A2D]">Standard Shipping</p>
                            <p className="text-[10px] text-[#A67C52] font-medium uppercase tracking-widest">3-5 Business Days</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-[#6B4A2D]/5 rounded-3xl border border-[#6B4A2D]/10 mb-10">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6B4A2D]/60 mb-4">Select Payment Method</h4>
                      <div className="space-y-4">
                      <div
                        onClick={() => setSelectedPaymentMethod("razorpay")}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          selectedPaymentMethod === "razorpay"
                            ? "border-[#6B4A2D] bg-[#6B4A2D]/5"
                            : "border-[#6B4A2D]/10 hover:border-[#6B4A2D]/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                              selectedPaymentMethod === "razorpay"
                                ? "border-[#6B4A2D]"
                                : "border-[#6B4A2D]/20"
                            }`}
                          >
                            {selectedPaymentMethod === "razorpay" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#6B4A2D]" />
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <CreditCard
                              size={20}
                              className={
                                selectedPaymentMethod === "razorpay"
                                  ? "text-[#6B4A2D]"
                                  : "text-[#6B4A2D]/40"
                              }
                            />
                            <p
                              className={`font-bold ${
                                selectedPaymentMethod === "razorpay"
                                  ? "text-[#6B4A2D]"
                                  : "text-[#6B4A2D]/60"
                              }`}
                            >
                              Razorpay / UPI / Cards
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <img
                            src="https://razorpay.com/assets/razorpay-glyph.svg"
                            alt="Razorpay"
                            className="w-5 h-5"
                          />
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedPaymentMethod("cod")}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          selectedPaymentMethod === "cod"
                            ? "border-[#6B4A2D] bg-[#6B4A2D]/5"
                            : "border-[#6B4A2D]/10 hover:border-[#6B4A2D]/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                              selectedPaymentMethod === "cod"
                                ? "border-[#6B4A2D]"
                                : "border-[#6B4A2D]/20"
                            }`}
                          >
                            {selectedPaymentMethod === "cod" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#6B4A2D]" />
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <ShoppingBag
                              size={20}
                              className={
                                selectedPaymentMethod === "cod"
                                  ? "text-[#6B4A2D]"
                                  : "text-[#6B4A2D]/40"
                              }
                            />
                            <p
                              className={`font-bold ${
                                selectedPaymentMethod === "cod"
                                  ? "text-[#6B4A2D]"
                                  : "text-[#6B4A2D]/60"
                              }`}
                            >
                              Cash on Delivery
                            </p>
                          </div>
                        </div>
                        <Truck size={20} className="text-[#6B4A2D]/20" />
                      </div>
                    </div>
                  </div>

                    <div className="p-6 bg-[#6B4A2D]/5 rounded-2xl mb-10 border border-dashed border-[#6B4A2D]/30">
                      <p className="text-xs text-[#6B4A2D]/60 text-center uppercase tracking-widest mb-4">
                        You will be redirected to secure checkout
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <Truck size={24} className="text-[#6B4A2D]/30" />
                        <ArrowLeft className="text-[#6B4A2D]/30 rotate-180" />
                        <CreditCard size={32} className="text-[#6B4A2D]" />
                        <ArrowLeft className="text-[#6B4A2D]/30 rotate-180" />
                        <CheckCircle size={24} className="text-[#6B4A2D]/30" />
                      </div>
                    </div>

                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={isProcessing}
                      className="w-full bg-[#6B4A2D] hover:bg-[#6B4A2D]/90 text-white h-14 rounded-2xl text-sm md:text-lg font-bold uppercase tracking-wider md:tracking-widest group px-6 whitespace-normal"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 w-full">
                          <span className="text-center">Complete Purchase</span>
                          <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
              <div className="bg-[#FFF] border border-[#6B4A2D]/10 p-5 md:p-8 rounded-[32px] sticky top-32">
                <h2 className="text-lg font-black text-[#6B4A2D] uppercase tracking-tighter mb-6">
                  Order Summary
                </h2>

                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || ""}`}
                      className="flex gap-4"
                    >
                      <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 p-1 border border-[#6B4A2D]/5">
                        <img
                          src={item.product.images?.[0] || "/placeholder.png"}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-bold text-[#6B4A2D] text-sm md:text-md line-clamp-2 min-w-0">
                            {item.product.name}
                          </h4>
                          <span className="font-bold text-[#6B4A2D] text-sm md:text-md whitespace-nowrap shrink-0">
                            ₹
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] md:text-sm text-[#6B4A2D]/60 mt-1 uppercase tracking-widest font-bold">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-[#6B4A2D]/10 pt-6">
                  <div className="flex justify-between text-sm text-[#8B7E6F]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#6B4A2D]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8B7E6F]">
                    <span>Shipping</span>
                    <span className="font-bold text-[#6B4A2D]">
                      {formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8B7E6F]">
                    <span>Tax (10%)</span>
                    <span className="font-bold text-[#6B4A2D]">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-lg md:text-xl font-black text-[#6B4A2D] border-t border-[#6B4A2D]/10 pt-4 uppercase tracking-tighter gap-2">
                    <span className="shrink-0">Total</span>
                    <span className="truncate">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#6B4A2D]/5 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="text-[#6B4A2D] w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#6B4A2D]/70 font-medium leading-relaxed uppercase tracking-wider">
                      Secure Payment Gateway. Your data is protected with
                      256-bit SSL encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Support Next.js routing by exporting as default
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

function Header() {
  return (
    <header className="p-4 bg-white shadow">
      <h1>Checkout</h1>
    </header>
  );
}
