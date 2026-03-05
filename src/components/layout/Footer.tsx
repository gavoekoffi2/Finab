"use client";

import Link from "next/link";
import { siteConfig, navigation } from "@/data/content";
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-accent/50 flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">FINAB</span>
                <span className="text-xs block text-white/60 -mt-0.5">la solution</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              La résurrection financière au service de votre avenir. Services financiers au Canada, en Afrique et en Haïti.
            </p>
            <div className="flex gap-3">
              {Object.entries(siteConfig.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent/30 transition-colors text-sm capitalize"
                  aria-label={platform}
                >
                  {platform[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Navigation</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/60 hover:text-accent transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.recruitmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-accent transition-colors text-sm"
                >
                  Nos Recrutements ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Nos Services</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Éducation financière</li>
              <li>Déclarations d&apos;impôts</li>
              <li>Formation & Recrutement</li>
              <li>Assurance Vie & Santé</li>
              <li>Micro-assurance</li>
              <li>Épargne & Investissement</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-white/60 hover:text-accent transition-colors text-sm">
                  <PhoneIcon className="w-5 h-5 text-accent flex-shrink-0" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-white/60 hover:text-accent transition-colors text-sm">
                  <MailIcon className="w-5 h-5 text-accent flex-shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <MapPinIcon className="w-5 h-5 text-accent flex-shrink-0" />
                {siteConfig.address}
              </li>
              <li>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-colors"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} FINAB la solution. Tous droits réservés.</p>
          <p>
            Fondée par <span className="text-accent/70">{siteConfig.ceo}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
