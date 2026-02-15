"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import api from "@/lib/api";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing verification token.");
        return;
      }

      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now log in.",
        );
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Failed to verify email. Link might be expired or invalid.",
        );
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto w-full text-center">
      {status === "verifying" && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-16 h-16 text-[#6B4A2D] animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-[#6B4A2D] mb-2">
            Verifying...
          </h2>
          <p className="text-[#8B7E6F]">
            Please wait while we verify your email address.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#6B4A2D] mb-4">
            Email Verified!
          </h2>
          <p className="text-[#8B7E6F] mb-8 text-lg">{message}</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-[#6B4A2D] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-[#6B4A2D]/20"
          >
            Login Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#6B4A2D] mb-4">
            Verification Failed
          </h2>
          <p className="text-[#8B7E6F] mb-8 text-lg">{message}</p>
          <Link
            href="/auth/register" // Maybe prompt to resend? Or just go back to home.
            className="text-[#6B4A2D] font-bold hover:underline"
          >
            Or create a new account
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar solid />

      <div className="flex-grow flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[#D4CEC4]/20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[95%] max-w-[800px] min-h-[50vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex relative z-10 items-center justify-center p-8 md:p-12"
        >
          <div className="bg-[#6B4A2D]/5 absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>

          <div className="relative z-10 w-full">
            <Suspense fallback={<div>Loading...</div>}>
              <VerifyEmailContent />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
