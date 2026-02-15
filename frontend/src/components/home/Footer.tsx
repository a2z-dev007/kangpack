
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-beige text-brand-brown">
            <div className="px-6 md:px-12 py-24 flex flex-col md:flex-row justify-between gap-12 border-t border-brand-brown/10">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-brand-brown rounded-lg flex items-center justify-center text-white font-bold">K</div>
                        <span className="text-xl font-black tracking-tighter uppercase">Kangpack</span>
                    </div>
                    <p className="text-brand-brown/60 max-w-xs">Redefining mobile productivity for the modern professional.</p>
                    <p className="mt-8 text-sm text-brand-brown/40">© 2025. All rights reserved, Kangpack</p>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Company</h5>
                        <ul className="space-y-4 text-brand-brown/60 text-sm">
                            <li><Link href="/about" className="hover:text-brand-brown">About Us</Link></li>
                            <li><Link href="#" className="hover:text-brand-brown">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-brown">Contact us</Link></li>
                            <li><Link href="/faqs" className="hover:text-brand-brown">FAQ's</Link></li>
                            <li><Link href="/auth/login" className="hover:text-brand-brown font-medium">Log In</Link></li>
                            <li><Link href="/auth/register" className="hover:text-brand-brown font-medium">Sign Up</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Legal</h5>
                        <ul className="space-y-4 text-brand-brown/60 text-sm">
                            <li><a href="#" className="hover:text-brand-brown">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-brand-brown">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-sm w-full">
                    <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Stay up to date</h5>
                    <p className="text-sm text-brand-brown/60 mb-4">Get the latest updates and exclusive discounts.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="jane@framer.com" className="flex-grow bg-white px-4 py-2 rounded-lg border border-brand-brown/10 focus:outline-none focus:border-brand-accent" />
                        <button className="bg-brand-brown text-white px-6 py-2 rounded-lg font-bold text-xs uppercase hover:bg-opacity-90 transition-all">Submit</button>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <a href="#" className="text-xs font-bold text-brand-brown/40 hover:text-brand-brown">Legal</a>
                        <a href="#" className="text-xs font-bold text-brand-brown/40 hover:text-brand-brown">Terms & Conditions</a>
                        <a href="#" className="text-xs font-bold text-brand-brown/40 hover:text-brand-brown">Privacy Policy</a>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-12 select-none overflow-hidden">
                <h1 className=" font-black text-brand-brown/5 leading-none tracking-tighter text-center uppercase whitespace-nowrap">
                    KANGPACK
                </h1>
            </div>
        </footer>
    );
};

export default Footer;
