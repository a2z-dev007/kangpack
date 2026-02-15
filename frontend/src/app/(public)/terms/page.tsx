"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
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

const TermsPage = () => {
  const lastUpdated = "February 13, 2026";

  const legalSections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: <FileText className="w-5 h-5" />,
      content:
        "Welcome to Kangpack. These Terms and Conditions govern your use of our website and the purchase of our products. By accessing or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our website or purchase our products. We reserve the right to update or modify these terms at any time without prior notice.",
    },
    {
      id: "user-responsibilities",
      title: "2. User Responsibilities",
      icon: <UserCheck className="w-5 h-5" />,
      content:
        "As a user of our platform, you agree to provide accurate and complete information during your interactions with us. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must not use our services for any illegal or unauthorized purpose.",
    },
    {
      id: "account-registration",
      title: "3. Account Registration",
      icon: <ShieldCheck className="w-5 h-5" />,
      content:
        "To access certain features of our platform, you may be required to register for an account. You agree to provide current and accurate information and to keep your account details updated. We reserve the right to suspend or terminate accounts that provide false information or engage in fraudulent activities.",
    },
    {
      id: "privacy-policy",
      title: "4. Privacy Policy Reference",
      icon: <Lock className="w-5 h-5" />,
      content:
        "Your use of our services is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data. By using our platform, you consent to the data practices described in our Privacy Policy. Please review it carefully to understand our commitment to your privacy.",
    },
    {
      id: "intellectual-property",
      title: "5. Intellectual Property",
      icon: <Landmark className="w-5 h-5" />,
      content:
        "All content on this website, including text, graphics, logos, images, and software, is the property of Kangpack and is protected by international copyright and trademark laws. You may not reproduce, distribute, or create derivative works from any part of our website without our express written permission.",
    },
    {
      id: "liability",
      title: "6. Limitation of Liability",
      icon: <AlertCircle className="w-5 h-5" />,
      content:
        "Kangpack shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or services. While we strive for excellence, we do not warrant that our website will be uninterrupted or error-free.",
    },
    {
      id: "termination",
      title: "7. Termination",
      icon: <Scale className="w-5 h-5" />,
      content:
        "We reserve the right to terminate or suspend your access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties.",
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      icon: <Scale className="w-5 h-5" />,
      content:
        "These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which Kangpack operates. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in that region.",
    },
    {
      id: "contact",
      title: "9. Contact Information",
      icon: <Mail className="w-5 h-5" />,
      content:
        "If you have any questions or concerns about these Terms and Conditions, please contact us at support@kangpack.com. Our legal team is available to assist you with any clarifications regarding our policies and procedures.",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-brown/10">
      <Navbar />

      <main className="pt-40 md:pt-48 pb-24 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="relative mb-20 md:mb-24">
            <div className="absolute -top-12 right-0 text-sm font-bold text-brand-brown/30 tracking-widest uppercase">
              Last Updated: {lastUpdated}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-8"
            >
              <Scale className="w-3.5 h-3.5 brand-primary" />
              <span className="text-[11px] font-bold tracking-widest brand-primary uppercase">
                Legal Documentation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.5rem,6vw,4.5rem)] md:text-[4.5rem] xl:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1]"
            >
              <span className="heading-gradient">Terms & Conditions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-brown/60 text-lg md:text-xl max-w-2xl leading-relaxed font-medium"
            >
              Our conditions are designed to provide a secure, transparent, and
              exceptional experience for all Kangpack users across the globe.
            </motion.p>
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#F2EFE9]/50 backdrop-blur-xl rounded-[40px] p-8 md:p-16 border border-[#6B4A2D]/10 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle background texture */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#6B4A2D 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 space-y-16">
              {legalSections.map((section, index) => (
                <div key={section.id} className="group">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-brown border border-[#6B4A2D]/5 group-hover:scale-110 transition-transform duration-500">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-brand-brown tracking-tight">
                      {section.title}
                    </h2>
                  </div>

                  <div className="pl-0 md:pl-16">
                    <p className="text-[#8B7E6F] text-base md:text-lg leading-relaxed font-medium">
                      {section.content}
                    </p>

                    {index !== legalSections.length - 1 && (
                      <div className="mt-16 h-[1px] w-full bg-[#6B4A2D]/10" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-[1px] bg-brand-brown/20" />
            <p className="text-brand-brown/40 text-sm font-bold uppercase tracking-widest">
              Still have questions?
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <a
                href="mailto:support@kangpack.in"
                className="inline-flex items-center gap-3 text-[#6B4A2D] font-bold hover:underline group"
              >
                <div className="w-8 h-8 rounded-full bg-brand-brown/5 flex items-center justify-center group-hover:bg-brand-brown/10 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                Contact Legal Support
              </a>
              <Link
                href="/faqs"
                className="inline-flex items-center gap-3 text-[#6B4A2D] font-bold hover:underline group"
              >
                <div className="w-8 h-8 rounded-full bg-brand-brown/5 flex items-center justify-center group-hover:bg-brand-brown/10 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </div>
                Visit FAQ Center
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
