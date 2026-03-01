"use client";
import React from "react";
import Navbar from "@/components/home/Navbar";
import { motion } from "framer-motion";
import { ASSETS } from "@/constants/assets";
import ScrollSection, {
  ParallaxImage,
} from "@/components/common/ScrollSection";
import PrimaryButton from "@/components/common/PrimaryButton";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dynamically import api to avoid SSR issues if any, or just use standard import
      const api = (await import("@/lib/api")).default;
      await api.post("/contact", formData);

      // Import toast dynamically or use if available in scope. Assuming sonner is available globally or imported.
      // Actually, I should add import { toast } from 'sonner' at the top.
      // But I can't easily add top-level imports in this specific tool call without replacing the whole file or using replace block wisely.
      // I will use a window alert fallback if toast is missing, but I should add the import in a separate step or assume it's there.
      // Wait, I can try to use the toast from sonner if I import it.

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      alert("Message sent successfully!"); // Fallback
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-beige">
      <Navbar solid />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-[#6B4A2D]/90 z-10" />
          <div className="absolute inset-0 opacity-40 mix-blend-overlay z-0">
            <ParallaxImage
              src={ASSETS.TICKERS.IMG_354A7762}
              className="w-full h-full object-cover"
              alt="Contact Us"
            />
          </div>
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 pt-20">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-lg md:text-xl max-w-2xl font-light"
            >
              Have a question or just want to say hello? We'd love to hear from
              you.
            </motion.p>
          </div>
        </div>

        <ScrollSection className="py-24 px-6 md:px-16  relative z-30">
          <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
            {/* Contact Info (Left) */}
            <div className="bg-[#6B4A2D] text-white p-6 md:p-12 lg:w-1/3 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="40"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 mt-1 text-white/80" />
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-60 mb-1">
                        Email
                      </p>
                      <p className="font-medium text-lg">
                        support@kangpack.in
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 mt-1 text-white/80" />
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-60 mb-1">
                        Phone
                      </p>
                      <p className="font-medium text-lg">+91 99887 76655</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 mt-1 text-white/80" />
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-60 mb-1">
                        Office
                      </p>
                      <p className="font-medium text-lg">
                        Connaught Place,
                        <br />
                        New Delhi, 110001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div className="flex gap-4">
                  {/* Social Icons placeholders */}
                  <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer">
                    <span className="font-bold">in</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer">
                    <span className="font-bold">X</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer">
                    <span className="font-bold">Ig</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (Right) */}
            <div className="p-6 md:p-12 lg:w-2/3 bg-white">
              <h3 className="text-2xl font-bold text-[#6B4A2D] mb-8">
                Send us a message
              </h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#6B4A2D]/60 pl-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-brand-beige/50 border border-[#6B4A2D]/10 rounded-xl px-4 py-3 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors"
                      placeholder="Rajesh"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#6B4A2D]/60 pl-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-brand-beige/50 border border-[#6B4A2D]/10 rounded-xl px-4 py-3 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors"
                      placeholder="Kumar"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#6B4A2D]/60 pl-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-brand-beige/50 border border-[#6B4A2D]/10 rounded-xl px-4 py-3 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors"
                      placeholder="rajesh@kumar.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#6B4A2D]/60 pl-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-brand-beige/50 border border-[#6B4A2D]/10 rounded-xl px-4 py-3 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors"
                      placeholder="+91 99887 76655"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6B4A2D]/60 pl-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-brand-beige/50 border border-[#6B4A2D]/10 rounded-xl px-4 py-3 text-[#6B4A2D] focus:outline-none focus:border-[#6B4A2D]/40 transition-colors resize-none"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-center md:justify-start">
                  <PrimaryButton className="w-fit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </ScrollSection>
      </main>
    </div>
  );
};

export default ContactPage;
