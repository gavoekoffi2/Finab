"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { stats } from "@/data/content";

export default function WelcomeSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Bienvenue"
          title="FINAB la solution"
          subtitle="Votre pont financier entre le Canada, l'Afrique et les Caraïbes"
        />

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-muted leading-relaxed mb-6">
              FINAB la solution est une entreprise innovante dédiée à fournir des services financiers
              accessibles et de qualité aux communautés africaines, caribéennes et canadiennes.
            </p>
            <p className="text-lg text-muted leading-relaxed mb-6">
              Fondée avec la vision de créer un pont entre les continents, nous accompagnons nos
              clients dans leur parcours financier — de l&apos;éducation à l&apos;investissement, en
              passant par l&apos;assurance et la fiscalité.
            </p>
            <p className="text-lg text-muted leading-relaxed">
              Que vous soyez au Canada, en Afrique ou en Haïti, FINAB vous offre un accompagnement
              personnalisé pour atteindre vos objectifs financiers et bâtir un avenir solide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group mb-6">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/generated/equipe-africaine-professionnelle-travaillant-ensemble-4534d8.jpg"
                  alt="Équipe africaine professionnelle travaillant ensemble"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent" />
            </div>

            {/* Stats grid overlay */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-surface rounded-2xl p-5 text-center hover:shadow-md transition-all"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
