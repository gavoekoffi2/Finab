"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig, navigation } from "@/data/content";
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import SplitText from "@/components/immersive/SplitText";
import Reveal from "@/components/immersive/Reveal";
import Magnetic from "@/components/immersive/Magnetic";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const wordOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-white">
      <div className="film-grain" />
      <div className="breathe absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-[140px]" />
      <div className="breathe absolute -right-40 bottom-40 h-[26rem] w-[26rem] rounded-full bg-accent/15 blur-[140px]" />

      {/* Grand appel à l'action */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="eyebrow mb-8 text-primary-light">Votre prochaine étape</span>
          <SplitText
            text="Prêt à transformer votre avenir financier ?"
            highlight={["avenir", "financier"]}
            className="max-w-5xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] md:text-6xl lg:text-7xl"
          />
          <Reveal delay={0.2} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-lg text-white/55">
              Contactez-nous dès aujourd&apos;hui pour un accompagnement personnalisé.
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold transition-colors hover:bg-accent-light"
                >
                  Demander un service
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-4 font-semibold transition-colors hover:bg-green-500"
                >
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Colonnes */}
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <div className="mb-6 inline-flex rounded-2xl bg-white px-3 py-2 shadow-lg shadow-primary/20">
              <Image src="/images/logo-wide.png" alt="FINAB la solution" width={409} height={168} className="h-14 w-auto" />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              La résurrection financière au service de votre avenir. Services financiers au Canada, en Afrique et en Haïti.
            </p>
            <div className="flex gap-3">
              {Object.entries(siteConfig.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-sm capitalize text-white/60 transition-all hover:border-primary hover:bg-primary hover:text-white"
                  aria-label={platform}
                >
                  {platform[0].toUpperCase()}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary-light">Navigation</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-block text-sm text-white/55 transition-all hover:translate-x-1 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.recruitmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-white/55 transition-all hover:text-white"
                >
                  Nos Recrutements ↗
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary-light">Nos Services</h3>
            <ul className="space-y-3 text-sm text-white/55">
              <li className="transition-colors hover:text-white"><Link href="/produits#education-financiere">Éducation financière</Link></li>
              <li className="transition-colors hover:text-white"><Link href="/produits#declarations-impots">Déclarations d&apos;impôts</Link></li>
              <li className="transition-colors hover:text-white"><Link href="/produits#formation-recrutement">Formation & Recrutement</Link></li>
              <li className="transition-colors hover:text-white"><Link href="/produits#assurance-vie">Assurance Vie & Santé</Link></li>
              <li className="transition-colors hover:text-white"><Link href="/produits#micro-assurance">Micro-assurance</Link></li>
              <li className="transition-colors hover:text-white"><Link href="/produits#epargne-investissement">Épargne & Investissement</Link></li>
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary-light">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="group flex items-center gap-3 text-sm text-white/55 transition-colors hover:text-white">
                  <PhoneIcon className="h-5 w-5 flex-shrink-0 text-primary-light" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="group flex items-center gap-3 text-sm text-white/55 transition-colors hover:text-white">
                  <MailIcon className="h-5 w-5 flex-shrink-0 text-primary-light" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/55">
                <MapPinIcon className="h-5 w-5 flex-shrink-0 text-primary-light" />
                {siteConfig.address}
              </li>
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Signature géante */}
      <div className="relative select-none overflow-hidden" aria-hidden="true">
        <motion.p
          style={{ y: wordY, opacity: wordOpacity }}
          className="whitespace-nowrap text-center text-[23vw] font-black leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]"
        >
          FINAB
        </motion.p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 pb-24 text-sm text-white/35 md:flex-row md:pb-6">
          <p>&copy; {new Date().getFullYear()} FINAB la solution. Tous droits réservés.</p>
          <p>
            Designed by <span className="text-primary-light/70">Pro Digital Business</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
