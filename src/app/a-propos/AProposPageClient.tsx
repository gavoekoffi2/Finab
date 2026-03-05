"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutContent, siteConfig, stats } from "@/data/content";

export default function AProposPageClient() {
  return (
    <>
      {/* Header with background image */}
      <section className="bg-gradient-to-br from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&h=600&fit=crop"
            alt="Communauté FINAB"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            À propos de FINAB
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Notre histoire, notre mission et nos valeurs
          </motion.p>
        </div>
      </section>

      {/* Founder / History */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary mb-4">
                Notre histoire
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Une vision née de la solidarité
              </h2>
              <p className="text-muted leading-relaxed mb-6">{aboutContent.history}</p>
              <div className="bg-surface rounded-2xl p-6 border-l-4 border-primary">
                <p className="font-semibold text-dark mb-1">Fondateur & CEO</p>
                <p className="text-xl font-bold text-primary">Abraham Koffi AKPOBI</p>
              </div>
            </motion.div>

            {/* Founder Photo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 group">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/team/abraham-akpobi.jpg"
                    alt="Abraham Koffi AKPOBI - Fondateur et CEO de FINAB la solution"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Overlay card at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/90 via-dark/60 to-transparent p-8">
                  <h3 className="text-2xl font-bold text-white">Abraham Koffi AKPOBI</h3>
                  <p className="text-primary-light font-medium">Fondateur & CEO</p>
                  <p className="text-white/60 text-sm mt-2">
                    Visionnaire engagé pour la résurrection financière des communautés africaines et caribéennes
                  </p>
                </div>
                {/* Decorative border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 group-hover:border-primary/40 transition-colors" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10 transition-transform duration-500 group-hover:scale-125">
                <Image
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop"
                  alt=""
                  fill
                  className="object-cover rounded-bl-3xl"
                />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4 relative">Notre Mission</h3>
              <p className="text-muted leading-relaxed relative">{aboutContent.mission}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-10 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10 transition-transform duration-500 group-hover:scale-125">
                <Image
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=400&fit=crop"
                  alt=""
                  fill
                  className="object-cover rounded-bl-3xl"
                />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4 relative">Notre Vision</h3>
              <p className="text-muted leading-relaxed relative">{aboutContent.vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Nos valeurs"
            title="Ce qui nous guide"
            subtitle="Nos valeurs fondamentales définissent chacune de nos actions"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutContent.values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-8 rounded-2xl bg-surface hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">{value.title[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-dark mb-3">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team image gallery section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Notre équipe"
            title="Des professionnels engagés"
            subtitle="Une équipe multiculturelle au service de votre réussite"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop", label: "Équipe direction" },
              { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop", label: "Conseil financier" },
              { src: "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?w=400&h=400&fit=crop", label: "Service client" },
              { src: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop", label: "Formation" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium text-sm">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=400&fit=crop"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
