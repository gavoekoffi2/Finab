"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { productsCanada, productsAfrica } from "@/data/content";
import { ArrowRightIcon } from "@/components/ui/Icons";

const canadaImages: Record<string, { src: string; alt: string }> = {
  "education-financiere": {
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop",
    alt: "Éducation financière - Apprentissage et formation",
  },
  "declarations-impots": {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop",
    alt: "Déclarations d'impôts - Consultation professionnelle",
  },
  "formation-recrutement": {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    alt: "Formation et recrutement - Équipe professionnelle",
  },
};

const africaImages: Record<string, { src: string; alt: string }> = {
  "assurance-vie": {
    src: "/images/assurance-vie.jpg",
    alt: "Assurance Vie - Famille africaine unie",
  },
  "assurance-sante": {
    src: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop",
    alt: "Assurance Santé - Soins médicaux de qualité",
  },
  "micro-assurance": {
    src: "https://images.unsplash.com/photo-1459257831348-f0cdd359235f?w=600&h=400&fit=crop",
    alt: "Micro-assurance - Petits entrepreneurs africains",
  },
  "assurance-voyage": {
    src: "/images/assurance-voyage.jpg",
    alt: "Assurance Voyage - Voyager en toute sérénité",
  },
  "epargne-investissement": {
    src: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&h=400&fit=crop",
    alt: "Épargne et investissement - Croissance financière",
  },
};

export default function ProductsPreview() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Produits Canada"
          title="Nos services au Canada"
          subtitle="Des solutions adaptées pour votre réussite financière au Canada"
        />

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {productsCanada.map((product, i) => {
            const img = canadaImages[product.id];
            return (
              <AnimatedCard key={product.id} delay={i * 0.1}>
                {img && (
                  <div className="relative h-48 overflow-hidden group">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-white backdrop-blur-sm">
                      Canada
                    </div>
                  </div>
                )}
                <div className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">{product.title}</h3>
                  <p className="text-muted leading-relaxed mb-6">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button href={`/produits#${product.id}`} variant="ghost" size="sm">
                    En savoir plus <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </AnimatedCard>
            );
          })}
        </div>

        <SectionHeading
          badge="Produits Afrique & Haïti"
          title="Nos services en Afrique et Haïti"
          subtitle="Des solutions d'assurance et de finance adaptées aux réalités locales"
        />

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {productsAfrica.map((product, i) => {
            const img = africaImages[product.id];
            return (
              <AnimatedCard key={product.id} delay={i * 0.08}>
                {img && (
                  <div className="relative h-36 overflow-hidden group">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/90 text-white backdrop-blur-sm">
                      Afrique & Haïti
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary-dark mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2">{product.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">{product.description}</p>
                  <Button href={`/produits#${product.id}`} variant="ghost" size="sm" className="text-xs">
                    Détails <ArrowRightIcon className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </AnimatedCard>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button href="/produits" variant="primary" size="lg">
            Voir tous nos produits
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
