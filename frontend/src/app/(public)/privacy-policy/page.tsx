"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";
import {
  ShieldCheck,
  Eye,
  Lock,
  Database,
  Globe,
  Cookie,
  Bell,
  UserCheck,
  Mail,
  HelpCircle,
} from "lucide-react";

const PrivacyPolicyPage = () => {
  const lastUpdated = "February 13, 2026";

  const privacySections = [
    {
      id: "info-collection",
      title: "1. Information Collection",
      icon: <Eye className="w-6 h-6" />,
      content:
        "We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, shipping address, and payment information. We also automatically collect certain technical data when you browse our website.",
    },
    {
      id: "use-of-data",
      title: "2. How We Use Information",
      icon: <UserCheck className="w-6 h-6" />,
      content:
        "Your information is used to process transactions, manage your account, improve our services, and send you important updates or marketing communications (which you can opt-out of at any time). We use data analytics to better understand how our platform is used and to enhance your shopping experience.",
    },
    {
      id: "data-protection",
      title: "3. Data Security",
      icon: <Lock className="w-6 h-6" />,
      content:
        "We implement industry-standard security measures to protect your personal data from unauthorized access, loss, or alteration. This includes SSL encryption for sensitive data and regular security audits. However, please note that no method of transmission over the internet is 100% secure.",
    },
    {
      id: "cookies",
      title: "4. Cookies & Tracking",
      icon: <Cookie className="w-6 h-6" />,
      content:
        "Our website uses cookies and similar tracking technologies to track activity and store certain information. Cookies help us remember your preferences and provide a personalized experience. You can manage your cookie settings through your browser at any time.",
    },
    {
      id: "third-parties",
      title: "5. Third-Party Sharing",
      icon: <Globe className="w-6 h-6" />,
      content:
        "We do not sell your personal data. We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, provided they agree to keep this information confidential and comply with data protection laws.",
    },
    {
      id: "data-retention",
      title: "6. Data Retention",
      icon: <Database className="w-6 h-6" />,
      content:
        "We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements.",
    },
    {
      id: "user-rights",
      title: "7. Your Rights",
      icon: <ShieldCheck className="w-6 h-6" />,
      content:
        "You have the right to access, update, or delete the personal information we have on you. Whenever made possible, you can perform these actions directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.",
    },
    {
      id: "policy-updates",
      title: "8. Policy Updates",
      icon: <Bell className="w-6 h-6" />,
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes.",
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
              src={ASSETS.TICKERS.MAIN2}
              className="w-full h-full object-cover grayscale-[10%]"
              alt="Privacy Policy background image"
            />
          </div>

          <div className="relative z-20 text-center px-6 w-full max-w-none flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/90 text-[12px] md:text-[14px] uppercase tracking-[0.6em] mb-6 font-bold"
            >
              Protecting Your Data
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-[clamp(3.5rem,10vw,8rem)] font-bold leading-none tracking-tight"
            >
              Privacy Policy
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
                Your privacy is important to us. This policy outlines how we
                handle your personal information to ensure transparency and
                trust.
              </h2>
              <div className="h-[2px] w-[80px] bg-[#6B4A2D] mb-8" />
              <p className="text-[#8B7E6F] text-[18px] leading-relaxed max-w-4xl font-medium">
                At Kangpack, we respect your privacy and are committed to
                protecting the personal data we hold about you. This Privacy
                Policy explains exactly what information we collect, how we use
                it, and the choices you have regarding your data. By using our
                website, you agree to the collection and use of information in
                accordance with this policy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Detailed Sections - CONSISTENT WITH T&C */}
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

              {privacySections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="py-10 md:py-12 border-b border-black/5 last:border-0 md:px-[8%] lg:px-[12%] group"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                    {/* Circular Icon Container */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                          index % 2 === 1
                            ? "bg-[#6B4A2D] text-white"
                            : "bg-[#F9F7F4] text-[#6B4A2D] border border-[#6B4A2D]/10 group-hover:bg-[#6B4A2D] group-hover:text-white shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)]"
                        }`}
                      >
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
              <h4 className="text-[#6B4A2D] text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
                Need more <br /> privacy info?
              </h4>
              <p className="text-[#8B7E6F] text-[18px] max-w-md leading-relaxed font-medium">
                Our data protection officer is ready to assist with any specific
                privacy related concerns.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <a
                href="mailto:privacy@kangpack.in"
                className="flex items-center justify-between gap-8 p-8 rounded-3xl bg-white border border-[#6B4A2D]/5 hover:border-[#6B4A2D]/20 shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)] hover:shadow-[0_10px_40px_-1px_rgba(107,74,45,0.08)] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-10 md:gap-14">
                  <div className="w-14 h-14 rounded-full bg-[#F9F7F4] flex items-center justify-center text-[#6B4A2D] group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[#6B4A2D]/50 text-[20px] font-bold uppercase tracking-[0.1em] mb-1">
                      Privacy Support
                    </div>
                    <div className="text-[18px] font-bold text-[#6B4A2D]">
                      privacy@kangpack.in
                    </div>
                  </div>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full border border-[#6B4A2D]/10 flex items-center justify-center group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>

              <Link
                href="/faqs"
                className="flex items-center justify-between gap-8 p-8 rounded-3xl bg-white border border-[#6B4A2D]/5 hover:border-[#6B4A2D]/20 shadow-[0_4px_20px_-1px_rgba(107,74,45,0.05)] hover:shadow-[0_10px_40px_-1px_rgba(107,74,45,0.08)] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-10 md:gap-14">
                  <div className="w-14 h-14 rounded-full bg-[#6B4A2D] flex items-center justify-center text-white transition-all duration-500 flex-shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[#6B4A2D]/50 text-[20px] font-bold uppercase tracking-[0.1em] mb-1">
                      Resource center
                    </div>
                    <div className="text-[18px] font-bold text-[#6B4A2D]">
                      Help Center
                    </div>
                  </div>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full border border-[#6B4A2D]/10 flex items-center justify-center group-hover:bg-[#6B4A2D] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Helper component for the arrow icon
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

export default PrivacyPolicyPage;
