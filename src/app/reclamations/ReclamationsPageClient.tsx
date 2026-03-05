"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
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
    console.log("Reclamation:", formData, files);
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-gradient-to-br from-dark via-primary-dark to-primary py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Réclamations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Nous prenons vos préoccupations au sérieux. Soumettez votre réclamation et nous la traiterons rapidement.
          </motion.p>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-sm text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-dark mb-2">Réclamation soumise</h3>
              <p className="text-muted mb-2">Votre réclamation a bien été enregistrée.</p>
              <p className="text-muted">Notre équipe vous contactera sous 48 heures ouvrables.</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", phone: "", policyNumber: "", category: "", description: "" });
                  setFiles(null);
                }}
                className="mt-6 text-primary font-semibold hover:underline cursor-pointer"
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
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="+1 (xxx) xxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">N° de police / Réf.</label>
                    <input
                      type="text"
                      value={formData.policyNumber}
                      onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Numéro de police ou référence"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Catégorie *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                  <label className="block text-sm font-semibold text-dark mb-2">Description détaillée *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Décrivez votre réclamation en détail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
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
                      <div className="mt-4 text-sm text-dark">
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
