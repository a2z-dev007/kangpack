import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent px-2 sm:px-4 pb-4">
      <div className="bg-[#F9F7F4] border-[1px] border-[#6B4A2D]/10 rounded-[30px] md:rounded-[40px] overflow-hidden">
        <div className="px-6 md:px-16 pt-12 md:pt-20 pb-0">
          {/* Top Row: Logo & Support */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
            <img
              src="/assets/black-logo.svg"
              alt="Kangpack Logo"
              className="h-6 md:h-7"
            />
            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-[#8B7E6F] text-[10px] uppercase font-bold tracking-widest">
                Support
              </span>
              <a
                href="mailto:support@kangpack.in"
                className="text-[#6B4A2D] text-[14px] font-bold hover:underline transition-all"
              >
                support@kangpack.in
              </a>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-12 md:mb-20 border-b border-[#6B4A2D]/5 pb-8">
            <p className="text-[#8B7E6F] text-[14px] md:text-[16px] max-w-sm leading-relaxed">
              Redefining mobile productivity with thoughtful design and premium
              craftsmanship.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-12 md:gap-x-12 mb-20 md:mb-32">
            {/* Company Column */}
            <div className="lg:col-span-3">
              <h5 className="text-[#6B4A2D] font-bold text-[13px] uppercase tracking-[0.2em] mb-8">
                Company
              </h5>
              <ul className="space-y-4 text-[#8B7E6F] text-[14px]">
                <li>
                  <a
                    href="/about"
                    className="hover:text-[#6B4A2D] transition-colors font-medium"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="hover:text-[#6B4A2D] transition-colors font-medium"
                  >
                    Shop All
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-[#6B4A2D] transition-colors font-medium"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-[#6B4A2D] transition-colors font-medium"
                  >
                    Journal
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="lg:col-span-3">
              <h5 className="text-[#6B4A2D] font-bold text-[13px] uppercase tracking-[0.2em] mb-8">
                Legal
              </h5>
              <ul className="space-y-4 text-[#8B7E6F] text-[14px]">
                <li>
                  <a
                    href="/terms-and-conditions"
                    className="hover:text-[#6B4A2D] transition-colors font-medium"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="hover:text-[#6B4A2D] transition-colors font-medium"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/shipping-and-returns"
                    className="hover:text-[#6B4A2D] transition-colors font-medium"
                  >
                    Shipping & Returns
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-6 border-t lg:border-t-0 border-[#6B4A2D]/5 pt-12 lg:pt-0">
              <h5 className="text-[#6B4A2D] font-bold text-[13px] uppercase tracking-[0.2em] mb-8">
                Newsletter
              </h5>
              <p className="text-[#8B7E6F] text-[14px] mb-8 max-w-md leading-relaxed">
                Join our community for early access to new drops and exclusive
                editorial content.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow bg-[#EAE5DC]/50 focus:bg-[#EAE5DC] px-6 py-4 rounded-2xl sm:rounded-r-none sm:rounded-l-2xl outline-none text-[#6B4A2D] placeholder-[#A39B8B] transition-all border border-transparent focus:border-[#6B4A2D]/10"
                />
                <button className="btn-premium px-8 py-4 rounded-2xl sm:rounded-l-none sm:rounded-r-2xl font-bold text-[14px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 border-none">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Utility Row */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-12 pb-12 border-t border-[#6B4A2D]/5 pt-12">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p className="text-[#A39B8B] text-[12px] font-medium tracking-wide">
                © 2026 KANGPACK™ IND.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="#"
                  className="text-[#8B7E6F] hover:text-[#6B4A2D] transition-colors text-[12px] font-medium uppercase tracking-tighter"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-[#8B7E6F] hover:text-[#6B4A2D] transition-colors text-[12px] font-medium uppercase tracking-tighter"
                >
                  Twitter (X)
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[#6B4A2D] text-[11px] font-bold uppercase tracking-[0.2em]">
                Operational World Wide
              </p>
            </div>
          </div>
        </div>

        {/* Massive Branding Background Text - Responsive Hero UI */}
        <div className="relative select-none pointer-events-none flex justify-center items-end overflow-hidden h-[22vw] sm:h-[18vw] lg:h-[15vw] pt-10">
          <h1 className="w-full text-[20vw] sm:text-[22vw] lg:text-[17vw] font-black text-center leading-none tracking-tighter uppercase whitespace-nowrap heading-gradient opacity-[0.06] translate-y-[4vw]">
            KANGPACK
          </h1>
          {/* Bottom color match for seamless look */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F4] via-transparent to-transparent z-10" />
        </div>
      </div>
    </footer>
  );
};
