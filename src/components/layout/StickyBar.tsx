"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/content";
import { PhoneIcon, WhatsAppIcon, MailIcon } from "@/components/ui/Icons";
import Link from "next/link";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-primary-dark/95 backdrop-blur-lg border-t border-white/10 py-2.5 px-4 md:hidden"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
        >
          <div className="flex items-center justify-around gap-1 pr-16">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex flex-col items-center gap-0.5 text-white/80 hover:text-accent transition-colors"
            >
              <PhoneIcon className="w-5 h-5" />
              <span className="text-[10px]">Appeler</span>
            </a>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 text-green-400 hover:text-green-300 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span className="text-[10px]">WhatsApp</span>
            </a>
            <Link
              href="/services"
              className="px-3 py-2 rounded-lg bg-accent text-primary-dark font-semibold text-xs"
            >
              Demander un service
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center gap-0.5 text-white/80 hover:text-accent transition-colors"
            >
              <MailIcon className="w-5 h-5" />
              <span className="text-[10px]">Contact</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
