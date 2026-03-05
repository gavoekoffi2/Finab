"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import Link from "next/link";

export default function DesktopStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[60] hidden md:block"
        >
          <div className="bg-dark/95 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-white font-bold text-sm tracking-tight">
                  FINAB <span className="text-primary-light">la solution</span>
                </Link>
                <span className="text-white/30">|</span>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors"
                >
                  <PhoneIcon className="w-3 h-3" />
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 text-xs transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <Link
                  href="/services"
                  className="px-4 py-1.5 rounded-lg bg-accent text-white font-semibold text-xs hover:bg-accent-light transition-colors"
                >
                  Demander un service
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-1.5 rounded-lg bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-colors"
                >
                  Parler à un conseiller
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
