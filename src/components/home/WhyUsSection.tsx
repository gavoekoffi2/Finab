"use client";

import Image from "next/image";
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

const whyUsImages = [
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
];

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-[0.07]">
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=800&fit=crop"
          alt=""
          fill
          className="object-cover"
        />
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
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 text-center group"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={whyUsImages[i]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-navy/20" />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center text-primary-light border border-primary/30">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-accent/20 to-accent-dark/20 rounded-3xl p-12 border border-accent/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=400&fit=crop"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="relative">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
