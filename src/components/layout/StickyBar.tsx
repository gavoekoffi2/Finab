"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { siteConfig } from "@/data/content";
import { PhoneIcon, WhatsAppIcon, MailIcon } from "@/components/ui/Icons";
import Link from "next/link";

// Barre d'actions rapides sur mobile (appeler, WhatsApp, demander un service, contact).
export default function StickyBar() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 400));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-3 bottom-3 z-40 md:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="glass-dark flex items-center justify-around gap-1 rounded-full px-3 py-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
            <a href={`tel:${siteConfig.phone}`} className="flex flex-col items-center gap-0.5 text-white/80">
              <PhoneIcon className="h-5 w-5" />
              <span className="text-[10px]">Appeler</span>
            </a>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 text-green-400"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="text-[10px]">WhatsApp</span>
            </a>
            <Link href="/services" className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-white">
              Demander un service
            </Link>
            <Link href="/contact" className="flex flex-col items-center gap-0.5 text-white/80">
              <MailIcon className="h-5 w-5" />
              <span className="text-[10px]">Contact</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
