
"use client"
import React from 'react';
import { motion } from 'framer-motion';

const SectionDivider: React.FC = () => {
    return (
        <div className="w-full flex items-center justify-center py-4 px-6 md:px-16 overflow-hidden">
            <div className="relative w-full flex items-center justify-center">
                {/* Left Line */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[1px] bg-brand-brown/10 flex-1 origin-right"
                />

                {/* Center Cross */}
                <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
                    className="px-4 text-brand-brown/30 text-sm font-light select-none z-10 bg-brand-beige"
                >
                    +
                </motion.div>

                {/* Right Line */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[1px] bg-brand-brown/10 flex-1 origin-left"
                />
            </div>
        </div>
    );
};

export default SectionDivider;
