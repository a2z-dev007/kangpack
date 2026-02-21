"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";
import {
  Scale,
  ShieldCheck,
  UserCheck,
  Lock,
  Landmark,
  AlertCircle,
  FileText,
  Mail,
  HelpCircle,
} from "lucide-react";

const TermsConditionsPage = () => {
  const lastUpdated = "February 13, 2026";

  const legalSections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: <FileText className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "Welcome to Kangpack. These Terms and Conditions govern your use of our website and the purchase of our products. By accessing or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our website or purchase our products. We reserve the right to update or modify these terms at any time without prior notice.",
    },
    {
      id: "user-responsibilities",
      title: "2. User Responsibilities",
      icon: <UserCheck className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "As a user of our platform, you agree to provide accurate and complete information during your interactions with us. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must not use our services for any illegal or unauthorized purpose.",
    },
    {
      id: "account-registration",
      title: "3. Account Registration",
      icon: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "To access certain features of our platform, you may be required to register for an account. You agree to provide current and accurate information and to keep your account details updated. We reserve the right to suspend or terminate accounts that provide false information or engage in fraudulent activities.",
    },
    {
      id: "privacy-policy",
      title: "4. Privacy Policy Reference",
      icon: <Lock className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "Your use of our services is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data. By using our platform, you consent to the data practices described in our Privacy Policy. Please review it carefully to understand our commitment to your privacy.",
    },
    {
      id: "intellectual-property",
      title: "5. Intellectual Property",
      icon: <Landmark className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "All content on this website, including text, graphics, logos, images, and software, is the property of Kangpack and is protected by international copyright and trademark laws. You may not reproduce, distribute, or create derivative works from any part of our website without our express written permission.",
    },
    {
      id: "liability",
      title: "6. Limitation of Liability",
      icon: <AlertCircle className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "Kangpack shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or services. While we strive for excellence, we do not warrant that our website will be uninterrupted or error-free.",
    },
    {
      id: "termination",
      title: "7. Termination",
      icon: <Scale className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "We reserve the right to terminate or suspend your access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties.",
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      icon: <Scale className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which Kangpack operates. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in that region.",
    },
    {
      id: "contact",
      title: "9. Contact Information",
      icon: <Mail className="w-6 h-6 md:w-7 md:h-7" />,
      content:
        "If you have any questions or concerns about these Terms and Conditions, please contact us at support@kangpack.com. Our legal team is available to assist you with any clarifications regarding our policies and procedures.",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-brown/10 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Hero - Full Width & Centered Content */}
        <section className="relative h-[80vh] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <div className="absolute inset-0 z-0">
            <ParallaxImage
              src={ASSETS.TICKERS.MAIN}
              className="w-full h-full object-cover grayscale-[10%]"
              alt="Terms and Conditions background image"
            />
          </div>

          <div className="relative z-20 text-center px-6 w-full max-w-none flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/90 text-[12px] md:text-[14px] uppercase tracking-[0.6em] mb-6 font-bold"
            >
              Understanding Our
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-[clamp(3.5rem,10vw,8rem)] font-bold leading-none tracking-tight"
            >
              Terms & Conditions
            </motion.h1>
          </div>
        </section>

        {/* Introduction Section - Edge to Edge */}
        <section className="bg-brand-beige pt-20 pb-12 px-6 md:px-0">
          <div className="w-full max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:pl-[8%] lg:pl-[12%]"
            >
              <h2 className="text-xl md:text-2xl font-black text-[#6B4A2D] leading-[1.2] mb-6 max-w-5xl tracking-tight">
                In using this website you are deemed to have read and agreed to
                the following terms and conditions:
              </h2>
              <div className="h-[2px] w-[80px] bg-[#6B4A2D] mb-8" />
              <p className="text-[#8B7E6F] text-[18px] leading-relaxed max-w-4xl font-medium">
                The following terminology applies to these Terms and Conditions,
                Privacy Statement and Disclaimer Notice and any or all
                Agreements: "Customer", "You" and "Your" refers to you, the
                person accessing this website and accepting the Company’s terms
                and conditions. "The Company", "Ourselves", "We" and "Us",
                refers to our Company. "Party", "Parties", or "Us", refers to
                both the Customer and ourselves, or either the Customer or
                ourselves.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Detailed Sections - UPDATED SIZES */}
        <section className="bg-brand-beige pb-48">
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-0">
            <div className="relative border-t border-black/5">
              {/* Expansive dot pattern background */}
              <div
                className="absolute inset-x-0 inset-y-0 opacity-[0.03] pointer-events-none -z-10"
                style={{
                  backgroundImage:
                    "radial-gradient(#6B4A2D 1.5px, transparent 1.5px)",
                  backgroundSize: "64px 64px",
                }}
              />

              {legalSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="py-10 md:py-12 border-b border-black/5 last:border-0 md:px-[8%] lg:px-[12%] group"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
                    {/* Compact Icon Container */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl shadow-sm border border-[#6B4A2D]/10 flex items-center justify-center text-[#6B4A2D] group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 ease-out">
                        {section.icon}
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <h3 className="text-[20px] font-bold text-[#6B4A2D] tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                        {section.title}
                      </h3>
                      <p className="text-[#5A544E] text-[18px] leading-[1.7] max-w-5xl font-normal">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section - BRAND THEME LIGHT */}
        <section className="py-24 bg-brand-beige relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-[12%] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="text-[#6B4A2D]/60 text-[8px] font-bold uppercase tracking-[0.6em] flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#6B4A2D]" />
                Last Updated: {lastUpdated}
              </div>
              <h4 className="text-[#6B4A2D] text-2xl md:text-5xl font-black tracking-tight leading-[1.1]">
                Still need <br /> clarification?
              </h4>
              <p className="text-[#8B7E6F] text-[15px] md:text-[18px] max-w-md leading-relaxed font-medium">
                Our specialized legal desk is ready to assist with any specific
                compliance or policy queries.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <a
                href="mailto:support@kangpack.in"
                className="flex items-center justify-between gap-4 p-5 md:p-8 rounded-3xl bg-white border border-[#6B4A2D]/5 hover:border-[#6B4A2D]/20 shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)] hover:shadow-[0_10px_40px_-1px_rgba(107,74,45,0.08)] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-4 md:gap-14">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#F9F7F4] flex items-center justify-center text-[#6B4A2D] group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#6B4A2D]/50 text-[12px] md:text-[20px] font-bold uppercase tracking-[0.1em] mb-1">
                      Legal Support
                    </div>
                    <div className="text-[14px] md:text-[18px] font-bold text-[#6B4A2D] truncate">
                      support@kangpack.in
                    </div>
                  </div>
                </div>
                <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full border border-[#6B4A2D]/10 flex items-center justify-center group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <Scale className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </a>

              <Link
                href="/faqs"
                className="flex items-center justify-between gap-4 p-5 md:p-8 rounded-3xl bg-white border border-[#6B4A2D]/5 hover:border-[#6B4A2D]/20 shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)] hover:shadow-[0_10px_40px_-1px_rgba(107,74,45,0.08)] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-4 md:gap-14">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#6B4A2D] flex items-center justify-center text-white transition-all duration-500 flex-shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#6B4A2D]/50 text-[12px] md:text-[20px] font-bold uppercase tracking-[0.1em] mb-1">
                      Resource center
                    </div>
                    <div className="text-[14px] md:text-[18px] font-bold text-[#6B4A2D] truncate">
                      Help Center
                    </div>
                  </div>
                </div>
                <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full border border-[#6B4A2D]/10 flex items-center justify-center group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Helper components for the redesigned sections
const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default TermsConditionsPage;
