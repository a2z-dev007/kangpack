"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileText, Mail, Globe, Shield } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { ASSETS } from "@/constants/assets";
import { ParallaxImage } from "@/components/common/ScrollSection";

const TermsAndConditions: React.FC = () => {
  const lastUpdated = "12-02-2025";

  const sections = [
    {
      title: "1. Introduction",
      content: `Welcome to www.kangpack.in, operated by Pannovationz ("Company", "we", "our", "us"). By accessing or using this website and purchasing our products, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website.`,
    },
    {
      title: "2. Products & Services",
      content: `Kangpack offers innovative laptop bags and wearable workstation products, including variants with and without radiation shielding technology. All product descriptions, specifications, images, and pricing are subject to change without prior notice.`,
      list: [
        "Modify or discontinue any product",
        "Limit quantities",
        "Refuse service to anyone at our discretion",
      ],
    },
    {
      title: "3. Orders & Payments",
      content: `All prices are listed in INR (₹) unless otherwise specified. Orders are confirmed only after successful payment. We reserve the right to cancel or refuse any order due to pricing errors, stock issues, or suspected fraudulent activity. In case of cancellation from our side, the full amount will be refunded.`,
    },
    {
      title: "4. Shipping & Delivery",
      content: `Shipping timelines are estimates and may vary due to logistics, weather, or unforeseen circumstances. Pannovationz is not liable for delays caused by third-party courier services. Risk of loss passes to the customer upon delivery.`,
    },
    {
      title: "5. Returns & Refunds",
      content: `Returns are accepted only if the product is damaged during transit, defective, or incorrect. Customers must notify us within 48 hours of delivery at support@kangpack.in with images and order details. Refunds, if approved, will be processed within 7–10 business days. We reserve the right to reject returns that do not meet eligibility criteria.`,
    },
    {
      title: "6. Radiation Shield Disclaimer",
      content: `The radiation shield variant of Kangpack is designed to reduce exposure to electromagnetic radiation emitted by electronic devices. However:`,
      list: [
        "It is not a medical device",
        "It does not guarantee complete elimination of EMF exposure",
        "It should not be considered a substitute for professional medical advice",
      ],
    },
    {
      title: "7. Intellectual Property",
      content: `All content on this website — including logos, product names, images, text, designs, and graphics — is the property of Pannovationz and protected under applicable intellectual property laws. Unauthorized use is strictly prohibited.`,
    },
    {
      title: "8. Limitation of Liability",
      content: `Pannovationz shall not be liable for indirect or consequential damages, loss of data or business interruption, or any misuse of the product. Our maximum liability shall not exceed the amount paid for the product.`,
    },
    {
      title: "9. Governing Law",
      content: `These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.`,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-brown/10 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Hero - Full Width & Centered Content */}
        <section className="relative h-[50vh] min-h-[400px] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <div className="absolute inset-0 z-0">
            <ParallaxImage
              src={ASSETS.TICKERS.MAIN2}
              className="w-full h-full object-cover grayscale-[10%]"
              alt="Terms and Conditions background"
            />
          </div>

          <div className="relative z-20 text-center px-6 w-full max-w-none flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/90 text-[12px] md:text-[14px] uppercase tracking-[0.6em] mb-6 font-bold"
            >
              Legal Document
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
                Welcome to www.kangpack.in, operated by Pannovationz. Please read these terms carefully before using our services.
              </h2>
              <div className="h-[2px] w-[80px] bg-[#6B4A2D] mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#6B4A2D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-[#6B4A2D]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B4A2D] font-bold mb-1">Website</p>
                    <p className="text-sm text-[#8B7E6F]">www.kangpack.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#6B4A2D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#6B4A2D]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B4A2D] font-bold mb-1">Company</p>
                    <p className="text-sm text-[#8B7E6F]">Pannovationz</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#6B4A2D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#6B4A2D]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B4A2D] font-bold mb-1">Effective Date</p>
                    <p className="text-sm text-[#8B7E6F]">{lastUpdated}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Detailed Sections - CONSISTENT WITH PRIVACY POLICY */}
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

              {sections.map((section, index) => (
                <motion.div
                  key={index}
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
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <h3 className="text-[20px] font-bold text-[#6B4A2D] tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                        {section.title}
                      </h3>
                      <p className="text-[#5A544E] text-[18px] leading-[1.7] max-w-5xl font-normal">
                        {section.content}
                      </p>
                      {section.list && (
                        <ul className="space-y-2 mt-4">
                          {section.list.map((item, i) => (
                            <li key={i} className="text-[#5A544E] text-[17px] flex items-start gap-3">
                              <span className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full mt-2.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 md:py-12 md:px-[8%] lg:px-[12%] group"
              >
                <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-14">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#6B4A2D] text-white transition-all duration-500 flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-[20px] font-bold text-[#6B4A2D] tracking-tight">
                      10. Contact Information
                    </h3>
                    <p className="text-[#5A544E] text-[18px] leading-[1.7] max-w-5xl font-normal mb-4">
                      For questions regarding these Terms, contact us at:
                    </p>
                    <div className="bg-[#F9F7F4] rounded-2xl p-6 space-y-2 max-w-2xl">
                      <p className="text-[#6B4A2D] font-medium">
                        📧 <a href="mailto:support@kangpack.in" className="hover:underline">support@kangpack.in</a>
                      </p>
                      <p className="text-[#6B4A2D] font-medium">
                        🏢 Company Name: Pannovationz
                      </p>
                      <p className="text-[#6B4A2D] font-medium">
                        🌐 Website: <a href="https://www.kangpack.in" className="hover:underline">www.kangpack.in</a>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsAndConditions;
