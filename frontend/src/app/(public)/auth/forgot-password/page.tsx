"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import api from "@/lib/api";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link sent to your email");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
                alt="Forgot Password Visual"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#6B4A2D] to-transparent" />

            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                Recovery.
              </h2>
              <p className="opacity-80 text-lg font-light leading-relaxed">
                Don't worry, we'll help you get back into your account.
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

            <div className="max-w-sm mx-auto w-full">
              <div className="mb-10 mt-8 lg:mt-0">
                <h1 className="text-3xl font-bold text-[#6B4A2D] mb-2">
                  Forgot Password?
                </h1>
                <p className="text-[#8B7E6F]">
                  Enter your email to receive extraction instructions.
                </p>
              </div>

              {!submitted ? (
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#6B4A2D] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#6B4A2D]/20"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              ) : (
                <div className="bg-[#f8f6f4] p-6 rounded-2xl border border-[#6B4A2D]/10 text-center">
                  <div className="w-16 h-16 bg-[#6B4A2D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#6B4A2D]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#6B4A2D] mb-2">
                    Check your inbox
                  </h3>
                  <p className="text-[#8B7E6F] mb-6">
                    If an account exists for <strong>{email}</strong>, we've
                    sent instructions to reset your password.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#6B4A2D] font-bold text-sm uppercase tracking-wider hover:underline"
                  >
                    Try another email
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
