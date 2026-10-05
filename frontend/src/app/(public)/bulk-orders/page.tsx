'use client';

import React, { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS } from '@/constants/assets';
import ScrollSection, { ParallaxImage } from '@/components/common/ScrollSection';
import SectionDivider from '@/components/common/SectionDivider';
import PrimaryButton from '@/components/common/PrimaryButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Package,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  PhoneCall,
  Mail,
  HelpCircle,
  Users,
  Award,
  Layers,
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

const PRODUCT_OPTIONS = [
  'Kangpack Flagship Smart Workstation',
  'Kangpack Dual-Side Reversible Edition',
  'Kangpack Greystone Executive Workstation',
  'Kangpack Trailblazer Edition',
  'Custom / Mixed Bulk Selection',
  'Corporate Gifting Package',
];

const QUANTITY_OPTIONS = [
  '10 - 25 units',
  '26 - 50 units',
  '51 - 100 units',
  '101 - 250 units',
  '250+ units',
  'Custom Quantity',
];

const TIMELINE_OPTIONS = [
  'Immediate (1 - 2 weeks)',
  'Within 30 days',
  'Within 60 - 90 days',
  'Flexible / Planning Ahead',
];

const BULK_FAQS = [
  {
    question: 'What is the minimum order quantity (MOQ) for bulk pricing?',
    answer:
      'Our tiered bulk corporate discounts start at an MOQ of 10 units. Higher volumes (50+, 100+, 250+) unlock deeper tier discounts and customized logistics.',
  },
  {
    question: 'Can we add our company logo and custom branding?',
    answer:
      'Yes! We offer precision laser-engraving, high-density hot stamping, and custom inner lining branding for corporate gifts and employee kits on qualifying orders.',
  },
  {
    question: 'Do you provide GST compliant B2B tax invoices?',
    answer:
      'Absolutely. All bulk purchases include full 18% GST invoices enabling your company to claim 100% input tax credit (ITC).',
  },
  {
    question: 'Can you ship directly to individual employee addresses?',
    answer:
      'Yes, for distributed teams and remote employees across India, we provide multi-location doorstep fulfillment directly to each recipient.',
  },
  {
    question: 'How fast can we receive a commercial quotation?',
    answer:
      'Our dedicated B2B commercial desk typically reviews inquiries and shares formal quotations with samples within 24 to 48 business hours.',
  },
];

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    productInterest: '',
    quantity: QUANTITY_OPTIONS[0],
    timeline: TIMELINE_OPTIONS[1],
    city: '',
    state: '',
    pincode: '',
    customizationRequired: false,
    estimatedBudget: '',
    message: '',
  });

  const [isCustomQuantity, setIsCustomQuantity] = useState(false);
  const [customQuantityValue, setCustomQuantityValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'quantityPreset') {
      if (value === 'Custom Quantity') {
        setIsCustomQuantity(true);
        setFormData((prev) => ({ ...prev, quantity: customQuantityValue || '' }));
      } else {
        setIsCustomQuantity(false);
        setFormData((prev) => ({ ...prev, quantity: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomQuantityValue(val);
    setFormData((prev) => ({ ...prev, quantity: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your contact person name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please provide a valid work or business email address.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      toast.error('Please provide a valid phone or WhatsApp number.');
      return;
    }

    if (!formData.productInterest.trim()) {
      toast.error('Please enter the product(s) of interest.');
      return;
    }

    const effectiveQuantity = isCustomQuantity ? customQuantityValue.trim() : formData.quantity.trim();
    if (!effectiveQuantity) {
      toast.error('Please specify the estimated quantity required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        quantity: effectiveQuantity,
      };
      const response = await api.post('/bulk-inquiries', payload);
      const data = response.data?.data || response.data;
      setSubmittedInquiry(data);
      toast.success(
        response.data?.message || 'Bulk order inquiry submitted successfully!'
      );
    } catch (error: any) {
      console.error('Bulk inquiry submission error:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to submit bulk order inquiry. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedInquiry(null);
    setIsCustomQuantity(false);
    setCustomQuantityValue('');
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      productInterest: '',
      quantity: QUANTITY_OPTIONS[0],
      timeline: TIMELINE_OPTIONS[1],
      city: '',
      state: '',
      pincode: '',
      customizationRequired: false,
      estimatedBudget: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9F7F4] text-[#6B4A2D]">
      <Navbar solid />

      <main className="flex-grow">
        {/* 1. Hero Section with Rich Background Patterns */}
        <div className="relative h-[58vh] min-h-[480px] overflow-hidden bg-[#533820]">
          {/* Background image with parallax */}
          <div className="absolute inset-0 opacity-20 mix-blend-luminosity z-0">
            <ParallaxImage
              src={ASSETS.ABOUT.FEATURE}
              className="w-full h-full object-cover"
              alt="Corporate Bulk Orders"
            />
          </div>

          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3E2716]/95 via-[#533820]/90 to-[#6B4A2D]/95 z-10" />

          {/* Geometric & Grid Background Patterns */}
          <div className="absolute inset-0 z-15 pointer-events-none">
            {/* Radial Dot Matrix Grid */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
                backgroundSize: '28px 28px',
              }}
            />

            {/* Architectural Abstract Line Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="hero-grid-pattern"
                  width="70"
                  height="70"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 70 0 L 0 0 0 70"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                  />
                  <circle cx="35" cy="35" r="1.5" fill="rgba(255, 255, 255, 0.3)" />
                </pattern>
                <linearGradient id="circle-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4CEC4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6B4A2D" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />

              {/* Decorative Geometric Rings */}
              <circle
                cx="12%"
                cy="30%"
                r="160"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="32"
                strokeDasharray="6 14"
              />
              <circle
                cx="88%"
                cy="70%"
                r="220"
                fill="none"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="48"
              />
              <circle
                cx="80%"
                cy="25%"
                r="110"
                fill="none"
                stroke="rgba(212, 206, 196, 0.15)"
                strokeWidth="2"
              />
              <circle
                cx="20%"
                cy="80%"
                r="90"
                fill="none"
                stroke="rgba(212, 206, 196, 0.12)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
              />
            </svg>

            {/* Ambient Lighting Accents */}
            <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#D4CEC4]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 text-white text-xs font-semibold uppercase tracking-widest shadow-sm"
            >
              <Building2 className="w-4 h-4 text-[#D4CEC4]" />
              <span>Commercial & Corporate Sales</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 max-w-4xl drop-shadow-sm"
            >
              Bulk & Corporate Orders
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/85 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed"
            >
              Empower your teams, elevate corporate gifting, and equip remote workforces with Kangpack's ergonomic mobile workstations.
            </motion.p>
          </div>
        </div>

        <SectionDivider />

        {/* 2. Value Props Grid */}
        <ScrollSection className="py-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#6B4A2D] mb-3">
              Why Partner with Kangpack for Bulk Purchases?
            </h2>
            <p className="text-[#8B7E6F] text-sm sm:text-base">
              Tailored commercial packages designed for fast-growing companies, co-working operators, and enterprise gifts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#6B4A2D]/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#6B4A2D]/10 flex items-center justify-center text-[#6B4A2D] mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-2">Volume-Tiered Discounts</h3>
              <p className="text-xs text-[#8B7E6F] leading-relaxed">
                Enjoy tiered pricing beginning from 10 units up to enterprise volumes with custom commercial terms.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#6B4A2D]/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#6B4A2D]/10 flex items-center justify-center text-[#6B4A2D] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-2">Bespoke Logo Branding</h3>
              <p className="text-xs text-[#8B7E6F] leading-relaxed">
                Custom laser embossing, corporate logo patches, and custom personalized welcome cards for employee onboarding.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#6B4A2D]/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#6B4A2D]/10 flex items-center justify-center text-[#6B4A2D] mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-2">Pan-India Multi-Drop</h3>
              <p className="text-xs text-[#8B7E6F] leading-relaxed">
                We handle bulk single-destination shipping as well as individual doorstep dispatches for remote teams.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#6B4A2D]/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#6B4A2D]/10 flex items-center justify-center text-[#6B4A2D] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-2">Dedicated Account Lead</h3>
              <p className="text-xs text-[#8B7E6F] leading-relaxed">
                One-on-one assistance from a dedicated corporate manager with instant GST billing and 1-year product warranty.
              </p>
            </div>
          </div>
        </ScrollSection>

        {/* 3. Inquiry Form Section */}
        <ScrollSection className="py-12 px-4 sm:px-6 md:px-12 lg:px-16 relative z-30">
          <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-[#6B4A2D]/10 overflow-hidden flex flex-col lg:flex-row">
            {/* Left Column: Commercial Info */}
            <div className="bg-[#6B4A2D] text-white p-8 sm:p-12 lg:w-5/12 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white/90 mb-4">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Kangpack Corporate Desk</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
                    Request a Custom Bulk Quotation
                  </h3>
                  <p className="text-white/80 text-sm mt-3 leading-relaxed">
                    Fill in your requirement details and our enterprise sales specialist will prepare a customized quotation within 24–48 hours.
                  </p>
                </div>

                <div className="space-y-5 border-t border-white/10 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#D4CEC4]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                        Direct Corporate Email
                      </p>
                      <a
                        href="mailto:support@kangpack.in"
                        className="text-white hover:text-[#D4CEC4] font-medium text-sm transition-colors"
                      >
                        support@kangpack.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5 text-[#D4CEC4]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                        B2B Hotline / WhatsApp
                      </p>
                      <a
                        href="tel:+919988776655"
                        className="text-white hover:text-[#D4CEC4] font-medium text-sm transition-colors"
                      >
                        +91 99887 76655
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#D4CEC4]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                        Business Hours
                      </p>
                      <p className="text-white text-sm font-medium">
                        Mon – Sat: 9:30 AM to 6:30 PM IST
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-300 shrink-0" />
                    <p className="text-xs text-white/90">
                      Trusted by 200+ innovative tech startups, design studios, and corporate consulting teams across India.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-[11px] text-white/50">
                Kangpack Commercial B2B Services · New Delhi, India
              </div>
            </div>

            {/* Right Column: Form or Success Card */}
            <div className="p-8 sm:p-12 lg:w-7/12 flex flex-col justify-center bg-white">
              <AnimatePresence mode="wait">
                {submittedInquiry ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 px-4 space-y-6"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase text-[#6B4A2D]">
                        Inquiry Received!
                      </h3>
                      <p className="text-sm text-[#8B7E6F] max-w-md mx-auto">
                        Thank you, <strong className="text-[#6B4A2D]">{submittedInquiry.name}</strong>. Your bulk order request for <strong className="text-[#6B4A2D]">{submittedInquiry.quantity}</strong> units has been registered.
                      </p>
                    </div>

                    <div className="bg-[#F9F7F4] p-5 rounded-2xl border border-[#6B4A2D]/15 text-left text-xs max-w-md mx-auto space-y-2">
                      <div className="flex justify-between border-b border-[#6B4A2D]/10 pb-1.5">
                        <span className="text-[#8B7E6F]">Product Interest:</span>
                        <span className="font-bold text-[#6B4A2D]">{submittedInquiry.productInterest}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#6B4A2D]/10 pb-1.5">
                        <span className="text-[#8B7E6F]">Expected Timeline:</span>
                        <span className="font-semibold">{submittedInquiry.timeline || 'Flexible'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8B7E6F]">Contact Email:</span>
                        <span className="font-semibold">{submittedInquiry.email}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handleResetForm}
                        className="bg-[#6B4A2D] hover:bg-[#5A3E26] text-white rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                      >
                        Submit Another Inquiry
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight text-[#6B4A2D]">
                        Inquiry Details
                      </h4>
                      <p className="text-xs text-[#8B7E6F] mt-1">
                        Please provide your company and order specs for an accurate quote.
                      </p>
                    </div>

                    {/* Row 1: Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          required
                          className="h-11 rounded-xl border-[#6B4A2D]/20 focus-visible:ring-[#6B4A2D]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Company / Organization
                        </label>
                        <Input
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="e.g. Acme Technologies"
                          className="h-11 rounded-xl border-[#6B4A2D]/20 focus-visible:ring-[#6B4A2D]"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Work Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="rahul@company.com"
                          required
                          className="h-11 rounded-xl border-[#6B4A2D]/20 focus-visible:ring-[#6B4A2D]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          required
                          className="h-11 rounded-xl border-[#6B4A2D]/20 focus-visible:ring-[#6B4A2D]"
                        />
                      </div>
                    </div>

                    {/* Row 3: Product Interest & Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Product of Interest <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="productInterest"
                          value={formData.productInterest}
                          onChange={handleChange}
                          placeholder="e.g. Smart Mobile Workstation, Greystone, or Custom"
                          required
                          className="h-11 rounded-xl border-[#6B4A2D]/20 focus-visible:ring-[#6B4A2D]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Estimated Quantity <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="quantityPreset"
                          value={isCustomQuantity ? 'Custom Quantity' : formData.quantity}
                          onChange={handleChange}
                          className="w-full h-11 px-3 bg-white rounded-xl border border-[#6B4A2D]/20 text-xs font-medium text-[#6B4A2D] focus:outline-none focus:ring-2 focus:ring-[#6B4A2D]"
                        >
                          {QUANTITY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {isCustomQuantity && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-1.5"
                          >
                            <Input
                              type="text"
                              name="customQuantity"
                              value={customQuantityValue}
                              onChange={handleCustomQuantityChange}
                              placeholder="Enter exact quantity (e.g. 75 units, 500+)"
                              required
                              className="h-10 rounded-xl border-[#6B4A2D]/30 focus-visible:ring-[#6B4A2D] text-xs bg-[#F9F7F4]"
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Timeline & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Target Delivery Timeline
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full h-11 px-3 bg-white rounded-xl border border-[#6B4A2D]/20 text-xs font-medium text-[#6B4A2D] focus:outline-none focus:ring-2 focus:ring-[#6B4A2D]"
                        >
                          {TIMELINE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                          Delivery City / State
                        </label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Bengaluru, Karnataka"
                          className="h-11 rounded-xl border-[#6B4A2D]/20 focus-visible:ring-[#6B4A2D]"
                        />
                      </div>
                    </div>

                    {/* Custom Branding Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-[#6B4A2D]/15 bg-[#F9F7F4] cursor-pointer hover:bg-[#F4EFEA] transition-colors">
                        <input
                          type="checkbox"
                          name="customizationRequired"
                          checked={formData.customizationRequired}
                          onChange={handleChange}
                          className="w-4 h-4 rounded text-[#6B4A2D] focus:ring-[#6B4A2D]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#6B4A2D]">
                            Request Custom Logo / Corporate Branding
                          </span>
                          <p className="text-[11px] text-[#8B7E6F]">
                            We offer custom engraving and branded welcome packaging for corporate clients.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Message / Special Instructions */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#6B4A2D]">
                        Specific Requirements / Questions
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Tell us about your team size, custom color preferences, or specific delivery locations..."
                        className="rounded-xl border-[#6B4A2D]/20 focus-visible:ring-[#6B4A2D] text-xs"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#6B4A2D] hover:bg-[#5A3E26] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Bulk Inquiry</span>
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollSection>

        {/* 4. Bulk Purchase FAQ Section */}
        <ScrollSection className="py-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#6B4A2D]/10 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#6B4A2D] mb-3">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Bulk Ordering Queries
            </h2>
          </div>

          <div className="space-y-4">
            {BULK_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#6B4A2D]/10 shadow-sm"
              >
                <h3 className="font-bold text-sm sm:text-base text-[#6B4A2D] mb-2 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#6B4A2D]/10 text-[#6B4A2D] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#8B7E6F] leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </ScrollSection>
      </main>
    </div>
  );
}
