"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Mail, 
  ArrowRight, 
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { ASSETS } from "@/constants/assets";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
];

const shopLinks = [
  { label: "Smart Workstations", href: "/products" },
  { label: "Mobile Desks", href: "/products" },
  { label: "Ergonomic Gear", href: "/products" },
  { label: "All Products", href: "/products" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Journal", href: "/blog" },
];

const legalLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Warranty Policy", href: "/warranty-policy" },
  { label: "Refund & Cancellation", href: "/refund-cancellation" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing to Kangpack updates!");
    setEmail("");
  };

  return (
    <footer className="relative bg-[#F9F7F4] text-[#6B4A2D] border-t border-[#6B4A2D]/10 overflow-hidden font-sans">
      {/* 1. Value Props Strip (Compact E-commerce Trust Row) */}
      <div className="border-b border-[#6B4A2D]/10 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <Truck className="w-4 h-4 text-[#6B4A2D] shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">Free Delivery</p>
                <p className="text-[11px] text-[#8B7E6F] leading-tight hidden sm:block">On qualifying orders across India</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#6B4A2D] shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">1-Year Warranty</p>
                <p className="text-[11px] text-[#8B7E6F] leading-tight hidden sm:block">Guaranteed premium craftsmanship</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <Lock className="w-4 h-4 text-[#6B4A2D] shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">100% Secure Checkout</p>
                <p className="text-[11px] text-[#8B7E6F] leading-tight hidden sm:block">Razorpay, UPI & Cards</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#6B4A2D] shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">Hassle-Free Support</p>
                <p className="text-[11px] text-[#8B7E6F] leading-tight hidden sm:block">Dedicated assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid (Clean, Balanced, Compact) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand & Newsletter (5 Columns on Desktop) */}
          <div className="md:col-span-4 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src={ASSETS.LOGO}
                alt="Kangpack Logo"
                className="h-7 md:h-8 w-auto object-contain"
              />
            </Link>

            <p className="text-xs md:text-sm text-[#8B7E6F] leading-relaxed max-w-sm">
              Redefining mobile productivity with thoughtful design, ergonomic comfort, and premium craftsmanship.
            </p>

            {/* Compact Newsletter */}
            <div className="pt-1 max-w-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D] mb-2">
                Stay in the loop
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You're subscribed for updates & exclusive drops!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 bg-white px-3.5 py-2.5 rounded-xl border border-[#6B4A2D]/15 text-xs text-[#6B4A2D] placeholder-[#A39B8B] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors shadow-sm"
                  />
                  <button
                    type="submit"
                    className="h-[38px] px-3.5 bg-[#6B4A2D] hover:bg-[#5A3E26] text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-colors shadow-sm shrink-0"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Horizontal Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-white border border-[#6B4A2D]/10 flex items-center justify-center text-[#6B4A2D] hover:bg-[#6B4A2D] hover:text-white transition-all shadow-sm"
                >
                  <social.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column (2 Columns) */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D] mb-3">
              Shop
            </p>
            <ul className="space-y-2 text-xs md:text-[13px]">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-[#8B7E6F] hover:text-[#6B4A2D] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column (2 Columns) */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D] mb-3">
              Company
            </p>
            <ul className="space-y-2 text-xs md:text-[13px]">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-[#8B7E6F] hover:text-[#6B4A2D] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care / Legal Column (2 Columns) */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D] mb-3">
              Customer Care
            </p>
            <ul className="space-y-2 text-xs md:text-[13px]">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-[#8B7E6F] hover:text-[#6B4A2D] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Column (2 Columns) */}
          <div className="md:col-span-2 lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D] mb-3">
              Connect
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#6B4A2D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#A39B8B] tracking-wider leading-none mb-0.5">Email</p>
                  <a href="mailto:support@kangpack.in" className="text-[#6B4A2D] hover:underline font-semibold text-xs break-all">
                    support@kangpack.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#6B4A2D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#A39B8B] tracking-wider leading-none mb-0.5">Location</p>
                  <p className="text-[#8B7E6F] font-medium text-xs">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Compact Bottom Utility Bar */}
      <div className="border-t border-[#6B4A2D]/10 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[11px] text-[#A39B8B] font-medium">
              © {new Date().getFullYear()} Kangpack Workstations. All rights reserved.
            </p>

            <div className="flex items-center gap-3 text-[11px] text-[#8B7E6F]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                Secure Razorpay Checkout
              </span>
              <span>•</span>
              <span className="font-medium">Made with pride in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
