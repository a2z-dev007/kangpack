"use client";

import React, { useState, Suspense } from "react"; // Added Suspense
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";

// Create a component that uses useSearchParams
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password reset successfully!");

      // Redirect to login after short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. Link might be expired.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#6B4A2D] mb-4">Invalid Link</h1>
        <p className="text-[#8B7E6F] mb-6">
          The password reset link is invalid or missing.
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-[#6B4A2D] font-bold hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto w-full">
      <div className="mb-10 mt-8 lg:mt-0">
        <h1 className="text-3xl font-bold text-[#6B4A2D] mb-2">
          Reset Password
        </h1>
        <p className="text-[#8B7E6F]">Create a new strong password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
            New Password
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

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4A2D]/40" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 pl-12 pr-12 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B4A2D]/40 hover:text-[#6B4A2D]/60 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6B4A2D] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#6B4A2D]/20"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar solid />

      <div className="flex-grow flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[#D4CEC4]/20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[95%] max-w-[1200px] min-h-[60vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex relative z-10"
        >
          {/* Left Side - Visual */}
          <div className="hidden lg:block w-1/2 relative bg-[#6B4A2D]">
            <div className="absolute inset-0 opacity-60">
              <img
                src={ASSETS.TICKERS.MAIN}
                alt="Reset Password Visual"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#6B4A2D] to-transparent" />

            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                Secure Access.
              </h2>
              <p className="opacity-80 text-lg font-light leading-relaxed">
                Protecting your data is our top priority.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
            <Link
              href="/auth/login"
              className="absolute top-8 left-8 text-[#6B4A2D]/60 hover:text-[#6B4A2D] flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>

            <Suspense fallback={<div>Loading...</div>}>
              <ResetPasswordContent />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
