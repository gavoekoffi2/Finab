"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { whyUs } from "@/data/content";
import { GlobeIcon, UsersIcon, ShieldIcon, AwardIcon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: GlobeIcon,
  users: UsersIcon,
  shield: ShieldIcon,
  award: AwardIcon,
};

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Pourquoi nous"
          title="Pourquoi travailler avec nous ?"
          subtitle="Des raisons concrètes de nous faire confiance"
          light
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {whyUs.map((item, i) => {
            const Icon = iconMap[item.icon] || GlobeIcon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light mx-auto mb-6">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Find an agent CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-accent/20 to-accent-dark/20 rounded-3xl p-12 border border-accent/20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h3>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Trouvez un agent FINAB près de chez vous ou contactez-nous directement pour un accompagnement personnalisé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="accent" size="lg">
              Trouver un agent
            </Button>
            <Button href="/services" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              Demander un service
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
