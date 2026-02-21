"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);

    try {
      // Call register API
      const response = await api.post("/auth/register", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      // Extract data from response
      // const data = response.data?.data || response.data;
      // const { user, accessToken, refreshToken } = data;

      // Store tokens -- DO NOT STORE for verification flow
      // if (accessToken) {
      //   localStorage.setItem("token", accessToken);
      //   localStorage.setItem("refreshToken", refreshToken);
      // }

      // Normalize user data -- DO NOT SET USER
      // const normalizedUser = {
      //   ...user,
      //   id: user._id || user.id,
      //   name:
      //     user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      // };

      // Update Zustand store
      // setUser(normalizedUser);

      // Show success message
      toast.success(
        "Account created! Please check your email to verify your account.",
      );

      // Wait a bit for toast to show, then redirect to login
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (error: any) {
      // Show error message
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar solid />

      <div className="flex-grow flex items-center justify-center p-6 relative mt-16">
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
                src={ASSETS.TICKERS.SIDE}
                alt="Register Visual"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#6B4A2D] via-[#6B4A2D]/50 to-transparent" />

            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                Join the Movement.
              </h2>
              <p className="opacity-80 text-lg font-light leading-relaxed">
                Create an account to start your journey with Kangpack. Unlock
                mobile productivity today.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative overflow-y-auto">
            <Link
              href="/"
              className="absolute top-4 left-6 text-[#6B4A2D]/60 hover:text-[#6B4A2D] flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="max-w-sm mx-auto w-full pt-12 md:pt-0">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#6B4A2D]  mt-2">
                  Create Account
                </h1>
                <p className="text-[#8B7E6F]">
                  Sign up for free to start shopping.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4A2D]/40" />
                      <input
                        type="text"
                        {...register("firstName")}
                        className={`w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 pl-10 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors text-sm ${errors.firstName ? "border-red-500 bg-red-50" : ""}`}
                        placeholder="John"
                        disabled={loading}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs pl-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      className={`w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors text-sm ${errors.lastName ? "border-red-500 bg-red-50" : ""}`}
                      placeholder="Doe"
                      disabled={loading}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs pl-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4A2D]/40" />
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 pl-10 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors text-sm ${errors.email ? "border-red-500 bg-red-50" : ""}`}
                      placeholder="you@example.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs pl-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4A2D]/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 pl-10 pr-12 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors text-sm ${errors.password ? "border-red-500 bg-red-50" : ""}`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B4A2D]/40 hover:text-[#6B4A2D]/60 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs pl-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6B4A2D]/60 uppercase tracking-widest pl-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4A2D]/40" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={`w-full bg-[#f8f6f4] border border-[#6B4A2D]/10 rounded-xl px-4 py-3 pl-10 pr-12 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors text-sm ${errors.confirmPassword ? "border-red-500 bg-red-50" : ""}`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B4A2D]/40 hover:text-[#6B4A2D]/60 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs pl-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6B4A2D] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#6B4A2D]/20 mt-4"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

              <div className="mt-4 text-center pb-8 lg:pb-0">
                <p className="text-[#8B7E6F] text-[13px]">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-bold text-[#6B4A2D] hover:underline"
                  >
                    Sign in
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
