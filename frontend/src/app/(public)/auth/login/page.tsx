"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // Call login API
      const response = await api.post("/auth/login", { email, password });

      // Extract data from response - Handle both potential response structures
      const data = response.data?.data || response.data;
      const { user, accessToken, refreshToken } = data;

      // Store tokens
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        throw new Error("No access token received");
      }

      // Normalize user data
      const normalizedUser = {
        ...user,
        id: user.id,
        name:
          user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      };

      // Update Zustand store
      setUser(normalizedUser);

      // Merge cart if guest had items
      try {
        await api.post("/carts/merge");
      } catch (mergeError) {
        console.error("Failed to merge cart:", mergeError);
      }

      // Show success message
      toast.success("Welcome back!");

      // Wait a bit for toast to show, then redirect
      setTimeout(() => {
        if (user.role === "admin" || user.role === "staff") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 500);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      if (message.includes("verify your email")) {
        toast.error(message, {
          action: {
            label: "Resend Link",
            onClick: async () => {
              try {
                await api.post("/auth/resend-verification", { email });
                toast.success("Verification email resent!");
              } catch (err) {
                toast.error("Failed to resend. Please try again later.");
              }
            },
          },
          duration: 6000,
        });
      } else {
        toast.error(message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar solid />{" "}
      {/* Ensure solid navbar sits on top if needed, or relative */}
      <div className="flex-grow flex items-center justify-center p-6  mt-16 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[#D4CEC4]/20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[95%] max-w-[1600px] min-h-[80vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex relative z-10"
        >
          {/* Left Side - Visual */}
          <div className="hidden lg:block w-1/2 relative bg-[#6B4A2D]">
            <div className="absolute inset-0 opacity-60">
              <img
                src={ASSETS.TICKERS.MAIN}
                alt="Login Visual"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#6B4A2D] to-transparent" />

            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                Welcome Back.
              </h2>
              <p className="opacity-80 text-lg font-light leading-relaxed">
                Sign in to access your orders, saved items, and exclusive
                offers.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
            <Link
              href="/"
              className="absolute top-4 left-6 text-[#6B4A2D]/60 hover:text-[#6B4A2D] flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="max-w-sm mx-auto w-full">
              <div className="mb-10 mt-8 lg:mt-0">
                <h1 className="text-3xl font-bold text-[#6B4A2D] ">
                  Sign In
                </h1>
                <p className="text-[#8B7E6F]">Please enter your details.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4A2D]/40" />
                    <input
                      type="email"
                      className="w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 pl-12 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4A2D]/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 pl-12 pr-12 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B4A2D]/40 hover:text-[#6B4A2D]/60 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-[#6B4A2D]/80 hover:text-[#6B4A2D]">
                    <input
                      type="checkbox"
                      className="rounded border-[#6B4A2D]/20 text-[#6B4A2D] focus:ring-[#6B4A2D]"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="font-bold text-[#6B4A2D] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6B4A2D] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#6B4A2D]/20"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-[#8B7E6F]">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-bold text-[#6B4A2D] hover:underline"
                  >
                    Sign up 
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
