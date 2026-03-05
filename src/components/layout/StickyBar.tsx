"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import Link from "next/link";

export default function StickyBar() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-primary-dark/95 backdrop-blur-lg border-t border-white/10 py-3 px-4 md:hidden"
    >
      <div className="flex items-center justify-around gap-2">
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex flex-col items-center gap-1 text-white/80 hover:text-accent transition-colors"
        >
          <PhoneIcon className="w-5 h-5" />
          <span className="text-[10px]">Appeler</span>
        </a>
        <a
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
          <span className="text-[10px]">WhatsApp</span>
        </a>
        <Link
          href="/services"
          className="px-4 py-2 rounded-lg bg-accent text-primary-dark font-semibold text-xs"
        >
          Demander un service
        </Link>
        <Link
          href="/contact"
          className="flex flex-col items-center gap-1 text-white/80 hover:text-accent transition-colors"
        >
          <MailIcon className="w-5 h-5" />
          <span className="text-[10px]">Contact</span>
        </Link>
      </div>
    </motion.div>
  );
}

function MailIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}
