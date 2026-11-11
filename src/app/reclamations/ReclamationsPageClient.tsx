"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/immersive/PageHero";
import Button from "@/components/ui/Button";

const steps = [
  { number: "01", title: "Décrivez votre situation", description: "Remplissez le formulaire ci-dessous avec tous les détails pertinents." },
  { number: "02", title: "Joignez vos documents", description: "Ajoutez tout document utile (contrat, relevé, correspondance)." },
  { number: "03", title: "Soumettez votre réclamation", description: "Notre équipe reçoit votre demande et l'examine immédiatement." },
  { number: "04", title: "Réponse sous 48h", description: "Nous vous recontactons avec une solution ou des questions complémentaires." },
];

export default function ReclamationsPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    policyNumber: "",
    category: "",
    description: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `*Réclamation FINAB*\n\nNom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nN° Police: ${formData.policyNumber}\nCatégorie: ${formData.category}\nDescription: ${formData.description}`
    );
    window.open(`https://wa.me/14383345252?text=${whatsappMessage}`, "_blank");
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Réclamations"
        title="Réclamations"
        subtitle="Nous prenons vos préoccupations au sérieux. Soumettez votre réclamation et nous la traiterons rapidement."
        image="/images/photos/impots-au-canada-37955e.jpg"
        imageAlt="Traitement d'une réclamation"
      />

      {/* Process */}
      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28">
        <div className="film-grain" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="relative grid gap-10 md:grid-cols-4 md:gap-8">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px origin-left bg-gradient-to-r from-primary-light via-primary to-accent md:block"
            />
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center"
              >
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-ink-3 shadow-[0_0_40px_-5px_rgba(34,197,94,0.5)]">
                  <span className="font-display text-xl text-primary-light">{step.number}</span>
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-white/60">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[2rem] bg-gradient-to-br from-primary-dark to-primary p-12 text-center text-white shadow-2xl"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2">Réclamation soumise</h3>
              <p className="text-white/80 mb-2">Votre réclamation a bien été enregistrée.</p>
              <p className="text-white/80">Notre équipe vous contactera sous 48 heures ouvrables.</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", phone: "", policyNumber: "", category: "", description: "" });
                  setFiles(null);
                }}
                className="mt-6 font-semibold text-white underline-offset-4 hover:underline cursor-pointer"
              >
                Soumettre une autre réclamation
              </button>
            </motion.div>
          ) : (
            <>
              <SectionHeading title="Formulaire de réclamation" subtitle="Remplissez tous les champs obligatoires (*)" />

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 rounded-[2rem] bg-white p-8 shadow-[0_40px_100px_-50px_rgba(5,13,9,0.45)] ring-1 ring-black/5 md:p-12"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      placeholder="+1 (xxx) xxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">N° de police / Réf.</label>
                    <input
                      type="text"
                      value={formData.policyNumber}
                      onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                      placeholder="Numéro de police ou référence"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Catégorie *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  >
                    <option value="">Choisir une catégorie</option>
                    <option>Problème de service</option>
                    <option>Retard de traitement</option>
                    <option>Erreur de facturation</option>
                    <option>Qualité du service</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Description détaillée *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-cream focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 resize-none"
                    placeholder="Décrivez votre réclamation en détail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Documents justificatifs
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setFiles(e.target.files)}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📎</div>
                      <p className="text-sm text-muted">
                        <span className="font-semibold text-primary">Cliquez pour téléverser</span> ou glissez vos fichiers ici
                      </p>
                      <p className="text-xs text-muted mt-1">PDF, JPG, PNG, DOC (max 10 Mo par fichier)</p>
                    </label>
                    {files && files.length > 0 && (
                      <div className="mt-4 text-sm text-ink">
                        {Array.from(files).map((f) => (
                          <p key={f.name}>{f.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto">
                  Soumettre la réclamation
                </Button>
              </motion.form>
            </>
          )}
        </div>
      </section>
    </>
  );
}
