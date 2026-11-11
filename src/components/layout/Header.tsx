"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { navigation, siteConfig } from "@/data/content";
import { PhoneIcon, WhatsAppIcon, MailIcon } from "@/components/ui/Icons";
import { getLenis } from "@/components/immersive/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setIsScrolled(y > 40);
    const goingDown = y > lastY.current;
    setIsHidden(goingDown && y > 700);
    lastY.current = y;
  });

  // Ferme le menu quand on change de page
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setIsMobileOpen(false);
  }

  useEffect(() => {
    const lenis = getLenis();
    if (isMobileOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: isHidden && !isMobileOpen ? "-120%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[60]"
      >
        {/* Fond dégradé quand on est tout en haut (lisibilité sur les images) */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-700 ${isScrolled ? "opacity-0" : "opacity-100"}`}
        />

        {/* Barre d'informations */}
        <div
          className={`relative hidden overflow-hidden text-xs text-white/70 transition-all duration-500 md:block ${isScrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
            <div className="flex items-center gap-6">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
                <PhoneIcon className="h-3.5 w-3.5" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-white">
                {siteConfig.email}
              </a>
            </div>
            <div className="flex items-center gap-5">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <a href={siteConfig.recruitmentUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                Nos Recrutements ↗
              </a>
            </div>
          </div>
        </div>

        {/* Barre principale : transparente puis capsule flottante en verre */}
        <div className={`relative mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? "mt-3 max-w-7xl px-3 md:px-4" : "max-w-7xl px-4 md:px-6"}`}>
          <div
            className={`flex items-center justify-between gap-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? "glass-dark h-16 rounded-full pl-3 pr-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]" : "h-20"
            }`}
          >
            <Link href="/" className="group relative flex shrink-0 items-center" aria-label="FINAB la solution – Accueil">
              <span className="absolute -inset-3 rounded-full bg-primary/0 blur-xl transition-all duration-500 group-hover:bg-primary/25" />
              <span
                className={`relative flex items-center rounded-2xl bg-white px-2.5 py-1 shadow-lg transition-all duration-500 group-hover:scale-[1.04] ${isScrolled ? "h-11" : "h-14"}`}
              >
                <Image
                  src="/images/logo-wide.png"
                  alt="FINAB la solution"
                  width={409}
                  height={168}
                  className="h-full w-auto object-contain"
                  priority
                />
              </span>
            </Link>

            <nav className="relative hidden items-center xl:flex" aria-label="Navigation principale">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {hoveredItem === item.href && (
                      <motion.span
                        layoutId="navHover"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-primary-light to-accent"
                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hidden h-11 w-11 items-center justify-center rounded-full bg-white/10 text-green-400 transition-colors hover:bg-green-500 hover:text-white 2xl:flex"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <Link
                href="/contact"
                className="group hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(220,38,38,0.8)] transition-all duration-500 hover:bg-accent-light md:inline-flex"
              >
                Nous contacter
                <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <button
                onClick={() => setIsMobileOpen((v) => !v)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 xl:hidden"
                aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMobileOpen}
              >
                <span className="relative block h-3 w-5">
                  <motion.span
                    className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current"
                    animate={isMobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] w-5 rounded-full bg-current"
                    animate={isMobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menu plein écran */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[55] overflow-y-auto bg-ink text-white xl:hidden"
          >
            <div className="film-grain" />
            <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />
            <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-accent/20 blur-[120px]" />

            <div className="relative flex min-h-full flex-col px-6 pb-10 pt-28">
              <nav className="flex flex-col" aria-label="Menu mobile">
                {navigation.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: EASE }}
                      className="border-b border-white/10"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="group flex items-baseline gap-4 py-3.5"
                      >
                        <span className="w-6 text-xs font-medium text-white/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span
                          className={`text-[1.75rem] font-semibold tracking-tight transition-all duration-500 group-hover:translate-x-2 sm:text-4xl ${
                            isActive ? "display-italic text-gradient-brand" : "text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
                className="mt-10 grid gap-4 text-sm"
              >
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-white/80">
                  <PhoneIcon className="h-5 w-5 text-primary-light" /> {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-white/80">
                  <MailIcon className="h-5 w-5 text-primary-light" /> {siteConfig.email}
                </a>
                <a href={siteConfig.recruitmentUrl} target="_blank" rel="noopener noreferrer" className="text-white/80">
                  Nos Recrutements ↗
                </a>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={siteConfig.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3.5 font-semibold"
                  >
                    <WhatsAppIcon className="h-5 w-5" /> WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center rounded-full bg-accent px-4 py-3.5 font-semibold"
                  >
                    Nous contacter
                  </Link>
                </div>
                <Link
                  href="/services"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center rounded-full border border-white/20 px-4 py-3.5 font-semibold"
                >
                  Demander un service
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
