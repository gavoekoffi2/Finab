"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navigation, siteConfig } from "@/data/content";
import { MenuIcon, XIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Premium top bar */}
      <div className={`text-white/90 text-sm py-2 hidden md:block transition-all duration-500 ${isScrolled ? "bg-dark/0 h-0 overflow-hidden opacity-0" : "bg-dark"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:text-primary-light transition-colors group">
              <PhoneIcon className="w-3.5 h-3.5 group-hover:animate-bounce" />
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-primary-light transition-colors">
              {siteConfig.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary-light transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href={siteConfig.recruitmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-light transition-colors"
            >
              Nos Recrutements
            </a>
          </div>
        </div>
      </div>

      {/* Main header - premium glass morphism */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-dark/80 backdrop-blur-2xl shadow-2xl shadow-dark/30 border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo with glow effect */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-3 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-500 blur-xl" />
              <div className="relative w-12 h-12 rounded-2xl bg-white shadow-md group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 overflow-hidden flex items-center justify-center p-1">
                <Image
                  src="/images/logo.png"
                  alt="FINAB la solution"
                  width={44}
                  height={44}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative">
                <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-white" : "text-dark"}`}>FINAB</span>
                <span className={`text-xs block -mt-0.5 transition-colors duration-300 ${isScrolled ? "text-primary-light" : "text-primary"}`}>la solution</span>
              </div>
            </Link>

            {/* Desktop Nav - Premium style with hover indicators */}
            <nav className="hidden lg:flex items-center gap-0.5 relative">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isScrolled
                        ? isActive
                          ? "text-primary-light"
                          : "text-white/70 hover:text-white"
                        : isActive
                          ? "text-primary"
                          : "text-dark/70 hover:text-primary"
                    }`}
                  >
                    {/* Hover background pill */}
                    {hoveredItem === item.href && (
                      <motion.div
                        layoutId="navHover"
                        className={`absolute inset-0 rounded-xl ${isScrolled ? "bg-white/10" : "bg-primary/5"}`}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                      />
                    )}
                    {/* Active underline */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-primary to-primary-light rounded-full"
                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold text-sm hover:from-accent-light hover:to-accent transition-all shadow-lg hover:shadow-xl hover:shadow-accent/25 hover:scale-105 active:scale-95 duration-300"
              >
                <span className="mr-2">Nous contacter</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-gray-100 text-dark"
                } ${isMobileOpen ? "bg-primary/10 text-primary" : ""}`}
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <XIcon />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <MenuIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Premium slide-in */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-dark/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen(false)}>
                  <Image src="/images/logo.png" alt="FINAB" width={36} height={36} className="rounded-xl" />
                  <span className="font-bold text-lg text-dark">FINAB</span>
                </Link>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Fermer">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-6 flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
                {navigation.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-dark/70 hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-surface">
                <div className="flex flex-col gap-3">
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-primary font-medium">
                    <PhoneIcon className="w-5 h-5" /> {siteConfig.phone}
                  </a>
                  <a
                    href={siteConfig.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 font-medium"
                  >
                    <WhatsAppIcon className="w-5 h-5" /> WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileOpen(false)}
                    className="mt-2 text-center px-5 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold hover:from-accent-light hover:to-accent transition-all shadow-lg"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
