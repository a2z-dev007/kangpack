"use client"
import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ children, className = "", id }) => {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={className}
        >
            {children}
        </motion.section>
    );
};

export const FadeInScale: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

export const ParallaxImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.img
                src={src}
                alt={alt}
                style={{ y: smoothY, scale }}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default ScrollSection;
