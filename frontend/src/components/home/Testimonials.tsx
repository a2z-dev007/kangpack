"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface TestimonialItem {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  company?: string;
  content?: string;
  text?: string;
  rating?: number;
  image?: string;
  avatar?: string;
}

const fallbackTestimonials = [
  {
    name: "Eddie Brock",
    role: "CEO",
    company: "Royal Kingscope",
    text: "I use it every day — whether I'm commuting, waiting in line, or at a café. The ergonomic design actually makes my posture better!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Sarah Mitchell",
    role: "Designer",
    company: "Creative Studios",
    text: "The perfect companion for my daily commute. It's stylish, functional, and incredibly comfortable to wear all day long.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "James Chen",
    role: "Developer",
    company: "Tech Innovations",
    text: "I use it every day — whether I'm commuting, waiting in line, or at a café. The ergonomic design actually makes my posture better!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Maria Garcia",
    role: "Marketing Director",
    company: "Brand Solutions",
    text: "This bag has transformed how I work on the go. The organization is perfect and the quality is outstanding!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "David Kim",
    role: "Entrepreneur",
    company: "StartUp Ventures",
    text: "I use it every day — whether I'm commuting, waiting in line, or at a café. The ergonomic design actually makes my posture better!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    name: "Emily Watson",
    role: "Consultant",
    company: "Global Advisors",
    text: "The best investment I've made for my daily routine. Comfortable, practical, and looks professional in any setting.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=26",
  },
];

const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const { data: apiTestimonials } = useQuery<TestimonialItem[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await api.get("/testimonials");
      return data?.data || [];
    },
    staleTime: 60 * 1000, // 1 minute fresh
  });

  const testimonials = (
    apiTestimonials && apiTestimonials.length > 0 ? apiTestimonials : fallbackTestimonials
  ).map((t: any) => ({
    name: t.name,
    role: t.role,
    company: t.company || "",
    text: t.content || t.text || "",
    rating: t.rating ?? 5,
    avatar: t.image || t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=6B4A2D&color=fff`,
  }));

  // Duplicate testimonials for seamless marquee loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => (
    <motion.div
      className="flex-shrink-0 cursor-pointer w-[280px] sm:w-[320px] md:w-[420px] xl:w-[480px] 2xl:w-[550px] bg-[#EEEAE2] rounded-2xl p-6 md:p-8 xl:p-10 2xl:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-[3px] border-[#6B4A2D]/10 border-dashed transition-all duration-300"
      onHoverStart={() => setIsPaused(true)}
      onHoverEnd={() => setIsPaused(false)}
      whileHover={{
        scale: 1.03,
        y: -6,
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        borderColor: "rgba(107, 74, 45, 0.2)",
      }}
      transition={{ duration: 0.25 }}
    >
      {/* Header - Avatar and X Icon */}
      <div className="flex items-start justify-between mb-6 xl:mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-14 h-14 xl:w-16 xl:h-16 rounded-full object-cover ring-2 ring-white"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                testimonial.name
              )}&background=6B4A2D&color=fff`;
            }}
          />
        </div>

        {/* X Icon */}
        <div className="w-5 h-5 text-[#8B7E6F]/40 cursor-pointer">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-6 xl:mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 xl:w-4 xl:h-4 fill-[#D0BB74] text-[#D0BB74]"
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-[#63615E]/80 text-lg xl:text-xl leading-relaxed mb-6 xl:mb-8 line-clamp-4">
        {testimonial.text}
      </p>
      <div className="w-full h-[1px] bg-[#6B4A2D]/10 mb-4 xl:mb-3" />
      {/* Author Info */}
      <div>
        <h4 className="text-[#63615E] font-semibold text-base">
          {testimonial.name}{" "}
          <span className="text-[#8B7E6F]">• {testimonial.role}</span>
        </h4>
        {testimonial.company && (
          <p className="text-[#090909]/60 text-sm mt-1">{testimonial.company}</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-8 sm:mb-10 md:mb-12">
        {/* Header */}
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4CEC4]/70 px-3.5 py-1.5 rounded-full mb-3">
            <MessageSquare className="w-3 h-3 brand-primary" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest brand-primary uppercase">
              Testimonial
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <span className="heading-gradient">Trusted By </span>
            <span className="text-[#B8AFA1]">Experts.</span>
          </h2>

          {/* Description */}
          <p className="light-text text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Real stories from real clients. See how our designs have transformed
            daily routines and elevated mobile productivity.
          </p>
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-6">
        {/* First Row - Moving Right to Left */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={
              isPaused
                ? {}
                : {
                    x: [0, "-50%"],
                  }
            }
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            style={{ width: "max-content" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`row1-${index}`}
                testimonial={testimonial}
              />
            ))}
          </motion.div>
        </div>

        {/* Second Row - Moving Left to Right */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={
              isPaused
                ? {}
                : {
                    x: ["-50%", 0],
                  }
            }
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 70,
                ease: "linear",
              },
            }}
            style={{ width: "max-content" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`row2-${index}`}
                testimonial={testimonial}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
