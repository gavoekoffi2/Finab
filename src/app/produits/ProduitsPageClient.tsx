"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { productsCanada, productsAfrica } from "@/data/content";

export default function ProduitsPageClient() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Nos Produits & Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Des solutions adaptées à vos besoins, que vous soyez au Canada, en Afrique ou en Haïti
          </motion.p>
        </div>
      </section>

      {/* Canada Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Canada 🍁"
            title="Produits Canada"
            subtitle="Services financiers et professionnels pour le marché canadien"
          />

          <div className="space-y-16">
            {productsCanada.map((product, i) => (
              <motion.div
                key={product.id}
                id={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">{product.title}</h3>
                  <p className="text-muted leading-relaxed mb-6">{product.description}</p>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                        </span>
                        <span className="text-dark/70">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Button href="/services" variant="primary">Demander ce service</Button>
                    <Button href="/contact" variant="outline">Parler à un conseiller</Button>
                  </div>
                </div>
                <div className={`bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 flex items-center justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <div className="text-8xl opacity-20">
                    {i === 0 ? "📊" : i === 1 ? "📋" : "🎓"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Africa/Haiti Products */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Afrique & Haïti 🌍"
            title="Produits Afrique & Haïti"
            subtitle="Solutions d'assurance et de finance adaptées aux réalités locales"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsAfrica.map((product, i) => (
              <AnimatedCard key={product.id} delay={i * 0.08}>
                <div className="p-8" id={product.id}>
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent-dark mb-6">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-dark mb-3">{product.title}</h3>
                  <p className="text-muted leading-relaxed mb-6">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3">
                    <Button href="/services" variant="primary" size="sm">Demander</Button>
                    <Button href="/contact" variant="ghost" size="sm">En savoir +</Button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
