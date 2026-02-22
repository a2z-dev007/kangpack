"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useAppSelector } from "@/lib/store/hooks";
import CartDrawer from "@/components/common/CartDrawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { LogoutConfirmModal } from "../common/LogoutConfirmModal";

interface NavbarProps {
  darkText?: boolean;
  solid?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ darkText = false, solid = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Add state

  const { isAuthenticated, user, logout } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Scroll track for background transparency
  useEffect(() => {
    const handleScroll = () => {
      // The Hero section is 300vh, so we only show the background 
      // when the user scrolls past the cinematic experience.
      const heroHeight = window.innerHeight * 2.8; 
      setScrolled(window.scrollY > heroHeight);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const navLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Products", href: "/products" },
    { name: "Kangpack Variants", href: "#variants" },
    { name: "FAQ's", href: "/faqs" },
    { name: "Contact Us", href: "/contact" },
  ];

  /*
   * Removing old handleLogout which did direct logout.
   * Now we will just trigger the modal.
   */
  // const handleLogout = () => { ... } // Removed

  const isDark = false;
  const isSolid = solid || scrolled;

  const textColorClass = "text-white";
  const textColorClassHover = "hover:text-white/80";
  const bgColorClass = isSolid
    ? "bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-sm py-4"
    : "bg-transparent py-10 shadow-none";

  // ... (lock scroll effect) ...
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 px-6 md:px-16 transition-all duration-300 flex justify-between items-center ${bgColorClass}`}
      >
        {/* ... (Logo) ... */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <span
                className={`${textColorClass} text-2xl font-black tracking-tighter uppercase flex items-center gap-1 transition-colors duration-300`}
              >
                <span>kang</span>
                <span
                  className="text-white/40 italic"
                >
                  _
                </span>
                <span>pack</span>
              </span>
              <div
                className="absolute -top-1 left-7 w-3 h-3 bg-white/20 rounded-full blur-[2px]"
              ></div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation Links (Center) */}
        <div
          className="hidden lg:flex gap-4 xl:gap-8 text-xs xl:text-sm font-bold uppercase tracking-widest text-white/90"
        >
          {navLinks.map((link, index) => (
            <Link key={link.name} href={link.href} passHref>
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.1,
                  ease: "easeOut",
                }}
                className={`${textColorClassHover} transition-all relative group`}
              >
                {link.name}
                <span
                  className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all group-hover:w-full duration-300"
                />
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Right Side Actions (Cart, Auth, Mobile Menu) */}
        <div className="flex items-center gap-6">
          {/* Cart Icon */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative ${textColorClass} hover:opacity-70 transition-opacity`}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={22} className="stroke-[2.5px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`flex items-center gap-2 ${textColorClass} font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:opacity-70 transition-opacity`}
                  >
                    <User size={18} />
                    <span>{user?.firstName || "Account"}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        user?.role === "admin"
                          ? "/admin/dashboard"
                          : "/dashboard"
                      }
                      className="cursor-pointer w-full"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutModal(true)} // Trigger modal
                    className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`${textColorClass} font-bold uppercase tracking-widest text-[11px] hover:opacity-70 transition-opacity`}
                >
                  Log In
                </Link>
                <Link href="/auth/register">
                  <Button
                    className={`rounded-full px-6 text-[11px] font-bold uppercase tracking-widest h-9 border-none btn-premium`}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:hidden"
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={textColorClass}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Content Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 w-full sm:w-[85%] sm:max-w-sm h-[100dvh] bg-[#141414] shadow-2xl flex flex-col z-[110] border-l border-white/5"
            >
              {/* Decorative Background Text - Fixed position to stay behind everything */}
              <div className="absolute top-1/2 -right-24 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                <span className="text-[120px] sm:text-[150px] font-black tracking-tighter text-white uppercase leading-none whitespace-nowrap vertical-text">
                  KANGPACK
                </span>
              </div>

              {/* Mobile Menu Header - Fixed at Top */}
              <div className="flex-shrink-0 flex justify-between items-center px-6 py-6 border-b border-white/5 relative z-20 bg-[#141414]/95 backdrop-blur-sm">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <span className="text-white text-xl font-black tracking-tighter uppercase">
                    kang<span className="text-white/40 italic">_</span>pack
                  </span>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
                <div className="flex flex-col min-h-full px-6 py-8">
                  {/* Navigation Links */}
                  <div className="flex flex-col gap-5 mb-12">
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 px-1">
                      Menu
                    </p>
                    {navLinks.map((link, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        key={link.name}
                      >
                        <Link
                          href={link.href}
                          className="group flex items-center gap-4 py-1"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-[10px] font-bold text-white/20 font-mono pt-1 w-6">
                            0{i + 1}
                          </span>
                          <span className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-white/80 transition-colors leading-none">
                            {link.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto space-y-8">
                    {/* Auth Section */}
                    <div className="space-y-4">
                      {!isAuthenticated ? (
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href="/auth/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              className="w-full h-12 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent text-xs font-bold uppercase tracking-widest rounded-xl"
                            >
                              Log In
                            </Button>
                          </Link>
                          <Link
                            href="/auth/register"
                            onClick={() => setIsOpen(false)}
                            className="w-full"
                          >
                            <Button className="w-full h-12 btn-premium text-xs font-bold uppercase tracking-widest rounded-xl border-none">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                              <User size={16} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-white text-xs font-bold uppercase tracking-wider truncate">
                                {user?.name || user?.firstName}
                              </span>
                              <span className="text-white/40 text-[10px] truncate">
                                {user?.email}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Link
                              href="/dashboard"
                              onClick={() => setIsOpen(false)}
                              className="w-full"
                            >
                              <Button className="w-full h-12 btn-premium text-xs font-bold uppercase tracking-widest rounded-xl border-none">
                                Dashboard
                              </Button>
                            </Link>
                            <Button
                              onClick={() => {
                                setIsOpen(false);
                                setShowLogoutModal(true);
                              }}
                              variant="ghost"
                              className="w-full h-12 text-white/70 hover:text-white hover:bg-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest rounded-xl border border-white/5"
                            >
                              Log Out
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Socials */}
                    <div className="flex justify-between items-end border-t border-white/10 pt-6">
                      <div className="flex gap-3">
                        {["IG", "TW", "FB"].map((social) => (
                          <motion.a
                            key={social}
                            whileHover={{ y: -2 }}
                            href="#"
                            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors border border-white/10 text-[10px] font-bold"
                          >
                            {social}
                          </motion.a>
                        ))}
                      </div>
                      <div className="text-right">
                        <span className="text-white/20 text-[9px] uppercase tracking-widest block">
                          © 2026
                        </span>
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                          KANGPACK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Logout Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Navbar;
