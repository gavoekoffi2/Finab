"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/content";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

const services = [
  {
    title: "Préparation du dossier médical",
    description: "Constitution complète de votre dossier médical selon les normes canadiennes, traduction certifiée et validation par nos spécialistes.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    image: "/images/photos/preparation-du-dossier-medical-f28f2d.jpg",
  },
  {
    title: "Orientation vers des spécialistes",
    description: "Mise en relation avec des spécialistes accrédités au Canada, sélectionnés selon votre pathologie et vos besoins spécifiques.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    image: "/images/photos/orientation-vers-des-specialistes-0431d2.jpg",
  },
  {
    title: "Logistique complète",
    description: "Prise en charge du voyage, hébergement et transport local. Nous gérons chaque détail pour que vous vous concentrez sur votre guérison.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    image: "/images/photos/logistique-complete-00b649.jpg",
  },
  {
    title: "Assurance privée internationale",
    description: "Couverture d'assurance complète adaptée aux soins médicaux internationaux, pour une prise en charge sans stress.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    image: "/images/photos/assurance-privee-internationale-9b4255.jpg",
  },
  {
    title: "Accompagnement administratif",
    description: "Gestion des visas médicaux, documents d'immigration et toutes les formalités administratives nécessaires.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    image: "/images/photos/accompagnement-administratif-1250d5.jpg",
  },
  {
    title: "Suivi post-traitement",
    description: "Accompagnement médical continu après votre retour, coordination avec vos médecins locaux et suivi à distance.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    image: "/images/photos/suivi-post-traitement-354f85.jpg",
  },
];

const parcours = [
  { step: 1, title: "Pré-qualification", description: "Évaluation initiale de votre dossier et de vos besoins médicaux" },
  { step: 2, title: "Analyse médicale préliminaire", description: "Revue détaillée de votre historique médical par nos experts" },
  { step: 3, title: "Plan de soins + estimation", description: "Élaboration d'un plan de traitement avec estimation des coûts" },
  { step: 4, title: "Logistique + assurance", description: "Organisation du voyage, hébergement et couverture d'assurance" },
  { step: 5, title: "Arrivée au Canada", description: "Accueil et prise en charge dès votre arrivée au Canada" },
  { step: 6, title: "Accompagnement", description: "Suivi continu pendant toute la durée de votre traitement" },
  { step: 7, title: "Suivi post-traitement", description: "Coordination du suivi médical après votre retour" },
];

const whyCanada = [
  { title: "Excellence médicale", description: "Système de santé reconnu mondialement pour sa qualité et son innovation", icon: "star" },
  { title: "Spécialistes qualifiés", description: "Accès à des médecins hautement qualifiés dans toutes les spécialités", icon: "user" },
  { title: "Équipements de pointe", description: "Technologies médicales les plus avancées et installations modernes", icon: "tech" },
  { title: "Processus sécurisés", description: "Protocoles rigoureux et normes de qualité les plus élevées", icon: "shield" },
];

const problems = [
  "Accès limité aux soins spécialisés en Afrique centrale et de l'Ouest",
  "Parcours international complexe et difficile à naviguer seul",
  "Risques administratifs et financiers majeurs sans accompagnement",
  "Manque de coordination professionnelle entre pays d'origine et Canada",
];

const partners = [
  "Cliniques privées",
  "Centres spécialisés",
  "Assureurs internationaux",
  "Laboratoires",
  "Services de transport médical",
];

export default function CoordinationMedicaleClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    pathology: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `*Demande de Coordination Médicale*\n\nNom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nPays: ${formData.country}\nPathologie: ${formData.pathology}\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/14383345252?text=${whatsappMessage}`, "_blank");
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero Section - Full width with medical theme */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/photos/hopital-moderne-au-canada-b7646d.jpg"
            alt="Hôpital moderne au Canada"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-dark/30" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-blue-500/20 backdrop-blur-sm text-blue-200 mb-6 border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Coordination Médicale Internationale
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              AFRIQUE <span className="text-blue-400">&rarr;</span> Canada
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light mb-4">
              Sécurité &bull; Conformité &bull; Excellence
            </p>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-2xl">
              Nous facilitons et sécurisons l&apos;accès aux soins spécialisés au Canada pour les patients provenant de la RDC, d&apos;Afrique centrale et d&apos;Afrique de l&apos;Ouest.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#demande"
                className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-600/25 hover:scale-105 active:scale-95"
              >
                Faire une demande
              </a>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-green-600 text-white font-semibold text-lg hover:bg-green-500 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <WhatsAppIcon className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Le Problème / Notre Solution */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-red-50 text-red-600 mb-4">
                Le problème
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-8">
                Des défis majeurs pour les patients africains
              </h2>
              <ul className="space-y-4">
                {problems.map((problem, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </span>
                    <span className="text-muted leading-relaxed">{problem}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 mb-4">
                Notre solution
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Un service complet de conciergerie médicale
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                Un service complet de conciergerie médicale internationale, conforme aux normes canadiennes. Nous prenons en charge chaque étape de votre parcours médical, de la pré-qualification au suivi post-traitement.
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/photos/equipe-medicale-professionnelle-7b3669.jpg"
                  alt="Équipe médicale professionnelle"
                  width={800}
                  height={500}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Services */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Nos services"
            title="Un accompagnement complet"
            subtitle="De la préparation du dossier au suivi post-traitement, nous sommes à vos côtés"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-blue-600/90 backdrop-blur-sm flex items-center justify-center text-white">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-dark mb-2">{service.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi le Canada */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/photos/canada-e6185d.jpg"
            alt="Canada"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <SectionHeading
            badge="Pourquoi le Canada"
            title="L'excellence médicale canadienne"
            subtitle="Le Canada offre un système de santé de classe mondiale"
            light
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyCanada.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                  {item.icon === "star" && (
                    <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  )}
                  {item.icon === "user" && (
                    <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                  {item.icon === "tech" && (
                    <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  )}
                  {item.icon === "shield" && (
                    <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours patient - Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Parcours patient"
            title="Votre parcours en 7 étapes"
            subtitle="Un processus structuré et sécurisé du début à la fin"
          />

          <div className="max-w-4xl mx-auto">
            {parcours.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/30">
                    {step.step}
                  </div>
                  {i < parcours.length - 1 && (
                    <div className="w-0.5 flex-1 bg-blue-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-lg font-bold text-dark mb-1">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires cibles */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Nos partenaires"
            title="Un réseau de confiance"
            subtitle="Nous collaborons avec les meilleurs acteurs du secteur médical"
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {partners.map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-dark">{partner}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de demande */}
      <section id="demande" className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/images/photos/coordination-medicale-internationale-580bf4.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-200 mb-4">
                  Contactez-nous
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Commencez votre parcours médical
                </h2>
                <p className="text-white/60 leading-relaxed mb-8">
                  Remplissez le formulaire ci-dessous et notre équipe vous contactera dans les 24h pour évaluer votre dossier et vous proposer un accompagnement personnalisé.
                </p>
                <div className="space-y-4">
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5 text-blue-300" />
                    </div>
                    {siteConfig.phone}
                  </a>
                  <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <WhatsAppIcon className="w-5 h-5 text-green-300" />
                    </div>
                    WhatsApp: {siteConfig.phone}
                  </a>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    {siteConfig.email}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Demande envoyée !</h3>
                    <p className="text-white/60 mb-6">Votre demande a été transmise via WhatsApp. Notre équipe vous contactera rapidement.</p>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", country: "", pathology: "", message: "" }); }}
                      className="text-blue-300 font-semibold hover:text-blue-200 cursor-pointer"
                    >
                      Envoyer une autre demande
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10"
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Formulaire de demande</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Nom complet *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Téléphone *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                          placeholder="+243 xxx xxx xxx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Pays d&apos;origine *</label>
                        <select
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                        >
                          <option value="" className="text-dark">Sélectionnez</option>
                          <option value="RDC" className="text-dark">RDC (Congo)</option>
                          <option value="Congo" className="text-dark">Congo Brazzaville</option>
                          <option value="Cameroun" className="text-dark">Cameroun</option>
                          <option value="Gabon" className="text-dark">Gabon</option>
                          <option value="Côte d'Ivoire" className="text-dark">Côte d&apos;Ivoire</option>
                          <option value="Sénégal" className="text-dark">Sénégal</option>
                          <option value="Togo" className="text-dark">Togo</option>
                          <option value="Bénin" className="text-dark">Bénin</option>
                          <option value="Guinée" className="text-dark">Guinée</option>
                          <option value="Mali" className="text-dark">Mali</option>
                          <option value="Burkina Faso" className="text-dark">Burkina Faso</option>
                          <option value="Autre" className="text-dark">Autre pays</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white/70 mb-1">Pathologie / Besoin médical *</label>
                      <input
                        type="text"
                        required
                        value={formData.pathology}
                        onChange={(e) => setFormData({ ...formData, pathology: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                        placeholder="Décrivez brièvement votre besoin médical"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-white/70 mb-1">Message complémentaire</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all resize-none"
                        placeholder="Informations supplémentaires..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      Envoyer ma demande via WhatsApp
                    </button>
                    <p className="text-white/40 text-xs text-center mt-3">
                      Votre demande sera envoyée directement via WhatsApp pour un traitement rapide
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
