
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#050505] text-white border-t border-white/5">
            <div className="px-6 md:px-12 py-24 flex flex-col md:flex-row justify-between gap-12 border-t border-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">K</div>
                        <span className="text-xl font-black tracking-tighter uppercase">Kangpack</span>
                    </div>
                    <p className="text-white/40 max-w-xs">Redefining mobile productivity for the modern professional.</p>
                    <p className="mt-8 text-sm text-white/20">© 2025. All rights reserved, Kangpack</p>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/80">Company</h5>
                        <ul className="space-y-4 text-white/40 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
                            <li><Link href="/faqs" className="hover:text-white transition-colors">FAQ's</Link></li>
                            <li><Link href="/auth/login" className="hover:text-white font-medium transition-colors">Log In</Link></li>
                            <li><Link href="/auth/register" className="hover:text-white font-medium transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/80">Legal</h5>
                        <ul className="space-y-4 text-white/40 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-sm w-full">
                    <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/80">Stay up to date</h5>
                    <p className="text-sm text-white/40 mb-4">Get the latest updates and exclusive discounts.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="jane@framer.com" className="flex-grow bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40" />
                        <button className="bg-white text-black px-6 py-2 rounded-lg font-bold text-xs uppercase hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105">Submit</button>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <a href="#" className="text-xs font-bold text-white/40 hover:text-white transition-colors">Legal</a>
                        <a href="#" className="text-xs font-bold text-white/40 hover:text-white transition-colors">Terms & Conditions</a>
                        <a href="#" className="text-xs font-bold text-white/40 hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-12 select-none overflow-hidden flex justify-center">
                <h1 className="font-black text-white/5 text-[clamp(4rem,20vw,20rem)] leading-none tracking-tighter text-center uppercase whitespace-nowrap">
                    KANGPACK
                </h1>
            </div>
        </footer>
    );
};

export default Footer;
