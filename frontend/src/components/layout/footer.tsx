"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Mail, 
  ArrowRight, 
  Globe,
  MapPin,
  Phone
} from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Shop All", href: "/products" },
    { label: "Contact", href: "/contact" },
    { label: "Journal", href: "/blog" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Shipping & Returns", href: "/shipping-and-returns" },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#F9F7F4] pt-20 overflow-hidden border-t border-[#6B4A2D]/10">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6B4A2D]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#EAE5DC]/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        {/* Top Row: Newsletter Focus */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20 md:mb-32">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/assets/black-logo.svg"
                alt="Kangpack Logo"
                className="h-8 md:h-10 mb-8"
              />
              <p className="text-[#6B4A2D]/80 text-[18px] md:text-[22px] leading-relaxed font-medium tracking-tight mb-8">
                Redefining mobile productivity with thoughtful design and premium craftsmanship.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map((i) => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F9F7F4] bg-[#EAE5DC] overflow-hidden shadow-sm">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                     </div>
                   ))}
                </div>
                <p className="text-[#8B7E6F] text-sm font-medium">
                  Joined by <span className="text-[#6B4A2D] font-bold">2,500+</span> professionals worldwide
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:max-w-md bg-white/40 backdrop-blur-md p-8 rounded-[30px] border border-white/60 shadow-sm"
          >
            <h5 className="text-[#6B4A2D] font-bold text-sm uppercase tracking-[0.2em] mb-4">
              Stay Informed
            </h5>
            <p className="text-[#8B7E6F] text-sm mb-6 leading-relaxed">
              Join our community for early access to new drops and exclusive editorial content.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/60 focus:bg-white px-6 py-4 rounded-2xl outline-none text-[#6B4A2D] placeholder-[#A39B8B] transition-all border border-transparent focus:border-[#6B4A2D]/20 pr-14 shadow-inner"
              />
              <button className="absolute right-2 top-2 bottom-2 aspect-square bg-[#6B4A2D] text-white rounded-xl flex items-center justify-center hover:bg-[#5A3E26] transition-colors shadow-md active:scale-95">
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8 mb-24 md:mb-32">
          {/* Navigation Columns */}
          <div className="lg:col-span-3">
            <h5 className="text-[#6B4A2D]/40 font-bold text-[11px] uppercase tracking-[0.3em] mb-10">
              Discovery
            </h5>
            <ul className="space-y-5">
              {footerNav.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="group flex items-center text-[#6B4A2D] text-[15px] font-semibold transition-all"
                  >
                    <span className="w-0 group-hover:w-4 h-[2px] bg-[#6B4A2D] mr-0 group-hover:mr-3 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h5 className="text-[#6B4A2D]/40 font-bold text-[11px] uppercase tracking-[0.3em] mb-10">
              Legal Care
            </h5>
            <ul className="space-y-5">
              {footerNav.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="group flex items-center text-[#6B4A2D] text-[15px] font-semibold transition-all"
                  >
                    <span className="w-0 group-hover:w-4 h-[2px] bg-[#6B4A2D] mr-0 group-hover:mr-3 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact/Support Column */}
          <div className="col-span-2 lg:col-span-4 lg:pl-12 border-l border-[#6B4A2D]/5">
            <h5 className="text-[#6B4A2D]/40 font-bold text-[11px] uppercase tracking-[0.3em] mb-10">
              Connect With Us
            </h5>
            <div className="space-y-8">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#6B4A2D] shadow-sm group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8B7E6F] tracking-widest mb-1">Email Support</p>
                  <a href="mailto:support@kangpack.in" className="text-[#6B4A2D] font-bold text-sm hover:underline">support@kangpack.in</a>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#6B4A2D] shadow-sm group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8B7E6F] tracking-widest mb-1">HQ Location</p>
                  <p className="text-[#6B4A2D] font-bold text-sm">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Column */}
          <div className="col-span-2 lg:col-span-2 flex flex-row lg:flex-col justify-between lg:justify-start gap-6 lg:items-end">
            <h5 className="hidden lg:block text-[#6B4A2D]/40 font-bold text-[11px] uppercase tracking-[0.3em] mb-10">
              Follow
            </h5>
            <div className="flex lg:flex-col gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#6B4A2D] shadow-sm border border-white hover:border-[#6B4A2D]/10 hover:shadow-md transition-all"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Utility Row */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-12 py-12 border-t border-[#6B4A2D]/10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <p className="text-[#A39B8B] text-[12px] font-bold tracking-[0.1em] uppercase">
              © 2026 KANGPACK
            </p>
            <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-full border border-white shadow-sm">
              <Globe size={14} className="text-[#6B4A2D]" />
              <span className="text-[#6B4A2D] text-[11px] font-bold uppercase tracking-wider">English (Global)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-3 h-3 block rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
              <span className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
            </div>
            <p className="text-[#6B4A2D] text-[12px] font-bold uppercase tracking-[0.2em] italic">
              Systems Operational Worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Massive Branding Background Text - Edge to Edge */}
      <div className="relative w-full h-[18vw] mt-[-5vw] pointer-events-none select-none">
        <h1 className="w-full text-[20vw] sm:text-[22vw] lg:text-[17vw] font-black text-center leading-none tracking-tighter uppercase whitespace-nowrap heading-gradient opacity-[0.06] translate-y-[4vw]">
            KANGPACK
          </h1>
      </div>
    </footer>
  );
};
