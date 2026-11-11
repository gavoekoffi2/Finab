"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollWords from "@/components/immersive/ScrollWords";
import ParallaxImage from "@/components/immersive/ParallaxImage";
import Reveal from "@/components/immersive/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { stats } from "@/data/content";

export default function WelcomeSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-28 md:py-40">
      <div className="absolute right-0 top-0 h-[40rem] w-[40rem] -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          badge="Bienvenue"
          title="FINAB la solution"
          subtitle="Votre pont financier entre le Canada, l'Afrique et les Caraïbes"
          center={false}
        />

        <ScrollWords
          text="FINAB la solution est une entreprise innovante dédiée à fournir des services financiers accessibles et de qualité aux communautés africaines, caribéennes et canadiennes."
          className="max-w-5xl text-3xl font-semibold leading-[1.15] tracking-[-0.03em] text-ink md:text-5xl lg:text-[3.6rem]"
        />

        <div className="mt-20 grid items-center gap-16 md:mt-28 md:grid-cols-12">
          <div className="space-y-6 md:col-span-5">
            <Reveal>
              <p className="text-lg leading-relaxed text-muted">
                Fondée avec la vision de créer un pont entre les continents, nous accompagnons nos clients dans leur
                parcours financier — de l&apos;éducation à l&apos;investissement, en passant par l&apos;assurance et la
                fiscalité.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-muted">
                Que vous soyez au Canada, en Afrique ou en Haïti, FINAB vous offre un accompagnement personnalisé pour
                atteindre vos objectifs financiers et bâtir un avenir solide.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex items-center gap-4 pt-4">
                <span className="h-px w-12 bg-primary" />
                <span className="display-italic text-xl text-ink">La résurrection financière</span>
              </div>
            </Reveal>
          </div>

          <div className="relative md:col-span-7">
            <ParallaxImage
              src="/images/photos/equipe-africaine-professionnelle-travaillant-ensemble-4534d8.jpg"
              alt="Équipe africaine professionnelle travaillant ensemble"
              className="aspect-[4/3] rounded-[2rem] shadow-[0_50px_100px_-40px_rgba(5,13,9,0.6)]"
              sizes="(max-width: 768px) 100vw, 60vw"
            />

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mx-4 -mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 text-white shadow-2xl ring-1 ring-white/10 md:absolute md:-bottom-16 md:-left-16 md:mx-0 md:mt-0 md:w-[26rem]"
            >
              {stats.map((stat) => (
                <AnimatedCounter
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  className="bg-ink p-6"
                  valueClassName="font-display text-3xl font-semibold text-primary-light md:text-4xl"
                  labelClassName="mt-1 text-xs uppercase tracking-[0.15em] text-white/55"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
