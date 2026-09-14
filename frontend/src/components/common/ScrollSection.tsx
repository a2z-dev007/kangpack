"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ children, className = "", id }) => {
    return (
        <section id={id} className={className}>
            {children}
        </section>
    );
};

export const FadeInScale: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

export const ParallaxImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
        </div>
    );
};

export default ScrollSection;
