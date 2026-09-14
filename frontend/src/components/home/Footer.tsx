import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-beige text-brand-brown">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 flex flex-col md:flex-row justify-between gap-10 md:gap-12 border-t border-brand-brown/10">
                <div className="max-w-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brand-brown rounded-lg flex items-center justify-center text-white font-bold">K</div>
                        <span className="text-xl font-black tracking-tight uppercase">Kangpack</span>
                    </div>
                    <p className="text-brand-brown/70 text-xs sm:text-sm leading-relaxed mb-6">Redefining mobile productivity for the modern professional.</p>
                    <p className="text-xs text-brand-brown/40">© 2026. All rights reserved, Kangpack</p>
                </div>

                <div className="grid grid-cols-2 gap-8 sm:gap-12">
                    <div>
                        <h5 className="font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6 text-[#6B4A2D]">Company</h5>
                        <ul className="space-y-3 text-brand-brown/70 text-xs sm:text-sm">
                            <li><Link href="/about" className="hover:text-brand-brown transition-colors">About Us</Link></li>
                            <li><Link href="/products" className="hover:text-brand-brown transition-colors">Products</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-brown transition-colors">Contact us</Link></li>
                            <li><Link href="/faqs" className="hover:text-brand-brown transition-colors">FAQ's</Link></li>
                            <li><Link href="/auth/login" className="hover:text-brand-brown transition-colors font-medium">Log In</Link></li>
                            <li><Link href="/auth/register" className="hover:text-brand-brown transition-colors font-medium">Sign Up</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6 text-[#6B4A2D]">Legal</h5>
                        <ul className="space-y-3 text-brand-brown/70 text-xs sm:text-sm">
                            <li><Link href="/terms" className="hover:text-brand-brown transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-brown transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/shipping" className="hover:text-brand-brown transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-sm w-full">
                    <h5 className="font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-3 text-[#6B4A2D]">Stay up to date</h5>
                    <p className="text-xs sm:text-sm text-brand-brown/70 mb-3 leading-relaxed">Get the latest updates, drops, and exclusive offers.</p>
                    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-grow bg-white px-3.5 py-2.5 rounded-xl border border-brand-brown/15 text-xs sm:text-sm focus:outline-none focus:border-brand-brown min-h-[44px]"
                        />
                        <button
                            type="submit"
                            className="btn-premium px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider min-h-[44px] hover:shadow-md transition-all shrink-0 cursor-pointer"
                        >
                            Subscribe
                        </button>
                    </form>
                    <div className="flex gap-4 mt-6 text-[10px] sm:text-xs font-bold text-brand-brown/40">
                        <Link href="/terms" className="hover:text-brand-brown transition-colors">Terms</Link>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-brand-brown transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="/contact" className="hover:text-brand-brown transition-colors">Support</Link>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-8 select-none overflow-hidden">
                <p className="text-[14vw] font-black text-brand-brown/5 leading-none tracking-tighter text-center uppercase whitespace-nowrap">
                    KANGPACK
                </p>
            </div>
        </footer>
    );
};

export default Footer;
