"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navigation, siteConfig } from "@/data/content";
import { MenuIcon, XIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

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
      {/* Top bar */}
      <div className="bg-dark text-white/90 text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
              <PhoneIcon className="w-3.5 h-3.5" />
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

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-primary-dark/95 backdrop-blur-lg shadow-lg shadow-primary-dark/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
                F
              </div>
              <div>
                <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-white" : "text-dark"}`}>FINAB</span>
                <span className={`text-xs block -mt-0.5 transition-colors duration-300 ${isScrolled ? "text-primary-light" : "text-primary"}`}>la solution</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isScrolled
                        ? isActive
                          ? "text-white bg-white/10"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                        : isActive
                          ? "text-primary bg-primary/5"
                          : "text-dark/70 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-light rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-all shadow-md hover:shadow-lg hover:shadow-accent/30"
              >
                Nous contacter
              </Link>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-dark"}`}
                aria-label="Menu"
              >
                {isMobileOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-[72px] left-0 right-0 z-40 bg-white/95 backdrop-blur-lg shadow-xl overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-dark/70 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-primary">
                  <PhoneIcon className="w-5 h-5" /> {siteConfig.phone}
                </a>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600"
                >
                  <WhatsAppIcon className="w-5 h-5" /> WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="mt-2 text-center px-5 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-all"
                >
                  Nous contacter
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
