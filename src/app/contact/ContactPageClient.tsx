"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
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
    // In production, this would send to an API endpoint
    console.log("Contact form:", formData);
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Nous sommes à votre écoute. N&apos;hésitez pas à nous contacter pour toute question.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-primary-dark mb-8">Nos coordonnées</h2>
              <div className="space-y-6">
                <a href={`tel:${siteConfig.phone}`} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-dark">Téléphone</p>
                    <p className="text-muted">{siteConfig.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MailIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-dark">Email</p>
                    <p className="text-muted">{siteConfig.email}</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-dark">Adresse</p>
                    <p className="text-muted">{siteConfig.address}</p>
                  </div>
                </div>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                    <WhatsAppIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-dark">WhatsApp</p>
                    <p className="text-green-600">Discutez avec nous</p>
                  </div>
                </a>
              </div>

              {/* Find an agent */}
              <div className="mt-12 bg-surface rounded-2xl p-8">
                <h3 className="text-lg font-bold text-primary-dark mb-3">Trouver un agent</h3>
                <p className="text-sm text-muted mb-4">
                  Nos agents FINAB sont disponibles dans plusieurs villes au Canada, en Afrique et en Haïti.
                </p>
                <Button href={siteConfig.whatsapp} external variant="accent" size="sm">
                  Contacter un agent
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-primary-dark mb-2">Message envoyé !</h3>
                  <p className="text-muted">Nous vous répondrons dans les plus brefs délais.</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="mt-6 text-accent-dark font-semibold hover:underline cursor-pointer"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-surface rounded-2xl p-8 md:p-12"
                >
                  <SectionHeading title="Envoyez-nous un message" center={false} />

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-primary-dark mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary-dark mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary-dark mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        placeholder="+1 (xxx) xxx-xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary-dark mb-2">
                        Sujet *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
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
                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
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
