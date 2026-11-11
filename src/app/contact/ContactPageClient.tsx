"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/immersive/PageHero";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/content";
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `*Nouveau message - FINAB Contact*\n\nNom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nSujet: ${formData.subject}\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/12635527737?text=${whatsappMessage}`, "_blank");
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contactez-nous"
        highlight={["Contactez-nous"]}
        subtitle="Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question."
        image="/images/photos/assurance-vie-famille-africaine-unie-7b2b1f.jpg"
        imageAlt="Des mains qui se tiennent – FINAB à votre écoute"
      />

      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div>
              <span className="eyebrow mb-8 text-primary">Nos coordonnées</span>
              <div className="space-y-6">
                <a href={`tel:${siteConfig.phone}`} className="flex items-start gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-white [&>svg]:transition-colors group-hover:[&>svg]:text-white">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">Téléphone</p>
                    <p className="text-muted">{siteConfig.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-white [&>svg]:transition-colors group-hover:[&>svg]:text-white">
                    <MailIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">Email</p>
                    <p className="text-muted">{siteConfig.email}</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">Adresse</p>
                    <p className="text-muted">{siteConfig.address}</p>
                  </div>
                </div>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-50 ring-1 ring-green-100 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:bg-green-500 group-hover:[&>svg]:text-white">
                    <WhatsAppIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">WhatsApp</p>
                    <p className="text-green-600">Discutez avec nous</p>
                  </div>
                </a>
              </div>

              {/* Find an agent */}
              <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-ink p-8 text-white"><div className="film-grain" /><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" /><div className="relative">
                <h3 className="text-2xl font-bold mb-3">Trouver un agent</h3>
                <p className="text-sm text-white/65 mb-6">
                  Nos agents FINAB sont disponibles dans plusieurs villes au Canada, en Afrique et en Haïti.
                </p>
                <Button href={siteConfig.whatsapp} external variant="accent" size="sm">
                  Contacter un agent
                </Button>
              </div></div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[2rem] bg-gradient-to-br from-primary-dark to-primary p-12 text-center text-white shadow-2xl"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold mb-2">Message envoyé !</h3>
                  <p className="text-white/75">Nous vous répondrons dans les plus brefs délais.</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="mt-6 font-semibold text-white underline-offset-4 hover:underline cursor-pointer"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="rounded-[2rem] bg-white p-8 shadow-[0_40px_100px_-50px_rgba(5,13,9,0.45)] ring-1 ring-black/5 md:p-12"
                >
                  <SectionHeading title="Envoyez-nous un message" center={false} />

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                        placeholder="+1 (xxx) xxx-xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Sujet *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                      >
                        <option value="">Choisir un sujet</option>
                        <option>Information générale</option>
                        <option>Éducation financière</option>
                        <option>Déclaration d&apos;impôts</option>
                        <option>Assurance</option>
                        <option>Formation & Recrutement</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-ink mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto">
                    Envoyer le message
                  </Button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
