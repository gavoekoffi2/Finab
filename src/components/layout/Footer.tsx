"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig, navigation } from "@/data/content";
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="bg-dark text-white relative overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      {/* CTA Banner */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-accent/15 to-accent-dark/10 rounded-2xl p-8 border border-accent/15"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">Prêt à transformer votre avenir financier ?</h3>
              <p className="text-white/50 text-sm">Contactez-nous dès aujourd&apos;hui pour un accompagnement personnalisé.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/services"
                className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-colors"
              >
                Demander un service
              </Link>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-500 transition-colors flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-primary/20 overflow-hidden flex items-center justify-center p-1">
                <Image
                  src="/images/logo.png"
                  alt="FINAB la solution"
                  width={52}
                  height={52}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white">FINAB</span>
                <span className="text-xs block text-primary-light font-medium -mt-0.5">la solution</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              La résurrection financière au service de votre avenir. Services financiers au Canada, en Afrique et en Haïti.
            </p>
            <div className="flex gap-3">
              {Object.entries(siteConfig.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all text-sm capitalize text-white/60 hover:text-white"
                  aria-label={platform}
                >
                  {platform[0].toUpperCase()}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-6">Navigation</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/50 hover:text-white hover:translate-x-1 transition-all text-sm inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.recruitmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-all text-sm inline-flex items-center gap-1"
                >
                  Nos Recrutements
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-6">Nos Services</h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="hover:text-white transition-colors"><Link href="/produits#education-financiere">Éducation financière</Link></li>
              <li className="hover:text-white transition-colors"><Link href="/produits#declarations-impots">Déclarations d&apos;impôts</Link></li>
              <li className="hover:text-white transition-colors"><Link href="/produits#formation-recrutement">Formation & Recrutement</Link></li>
              <li className="hover:text-white transition-colors"><Link href="/produits#assurance-vie">Assurance Vie & Santé</Link></li>
              <li className="hover:text-white transition-colors"><Link href="/produits#micro-assurance">Micro-assurance</Link></li>
              <li className="hover:text-white transition-colors"><Link href="/produits#epargne-investissement">Épargne & Investissement</Link></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary-light mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm group">
                  <PhoneIcon className="w-5 h-5 text-primary/70 group-hover:text-primary-light flex-shrink-0" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm group">
                  <MailIcon className="w-5 h-5 text-primary/70 group-hover:text-primary-light flex-shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <MapPinIcon className="w-5 h-5 text-primary/70 flex-shrink-0" />
                {siteConfig.address}
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
          <p>&copy; {new Date().getFullYear()} FINAB la solution. Tous droits réservés.</p>
          <p>
            Fondée par <span className="text-primary-light/60">{siteConfig.ceo}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
