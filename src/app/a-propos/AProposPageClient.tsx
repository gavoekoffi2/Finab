"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutContent, siteConfig, stats } from "@/data/content";

export default function AProposPageClient() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
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

      {/* History */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-accent/15 text-accent-dark mb-4">
                Notre histoire
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">
                Une vision née de la solidarité
              </h2>
              <p className="text-muted leading-relaxed mb-6">{aboutContent.history}</p>
              <div className="bg-surface rounded-2xl p-6 border-l-4 border-accent">
                <p className="font-semibold text-primary-dark mb-1">Fondateur & CEO</p>
                <p className="text-xl font-bold text-accent-dark">{siteConfig.ceo}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-8xl mb-4 opacity-30">🏢</div>
                <p className="text-muted text-sm">Siège à {siteConfig.address}</p>
              </div>
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
              className="bg-white rounded-3xl p-10 shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-6">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-primary-dark mb-4">Notre Mission</h3>
              <p className="text-muted leading-relaxed">{aboutContent.mission}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-10 shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl mb-6">
                🔭
              </div>
              <h3 className="text-2xl font-bold text-primary-dark mb-4">Notre Vision</h3>
              <p className="text-muted leading-relaxed">{aboutContent.vision}</p>
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">{value.title[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-primary-dark mb-3">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-6">
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
