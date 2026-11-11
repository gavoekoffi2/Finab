"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/immersive/PageHero";
import ParallaxImage from "@/components/immersive/ParallaxImage";
import Reveal from "@/components/immersive/Reveal";
import SplitText from "@/components/immersive/SplitText";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { aboutContent, stats } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const team = [
  { src: "/images/photos/equipe-direction-7aeb02.jpg", label: "Équipe direction" },
  { src: "/images/photos/equipe-direction-ed46bb.jpg", label: "Conseil financier" },
  { src: "/images/photos/equipe-direction-90978c.jpg", label: "Service client" },
  { src: "/images/photos/equipe-direction-4b31d6.jpg", label: "Formation" },
];

export default function AProposPageClient() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="À propos de FINAB"
        highlight={["FINAB"]}
        subtitle="Notre histoire, notre mission et nos valeurs"
        image="/images/hero/hero-children-3.jpg"
        imageAlt="Communauté FINAB"
      />

      {/* Histoire & fondateur */}
      <section className="bg-cream py-28 md:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <span className="eyebrow mb-6 text-primary">Notre histoire</span>
            <SplitText
              text="Une vision née de la solidarité"
              highlight={["solidarité"]}
              className="text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-ink md:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.15}>
              <p className="mt-8 text-lg leading-relaxed text-muted">{aboutContent.history}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-10 rounded-3xl border-l-4 border-primary bg-white p-7 shadow-[0_20px_60px_-30px_rgba(5,13,9,0.3)]">
                <p className="eyebrow mb-2 text-muted">Fondateur & CEO</p>
                <p className="display-italic text-3xl text-primary">Abraham Koffi AKPOBI</p>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-6 -left-6 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_50px_100px_-40px_rgba(22,163,74,0.5)]">
              <ParallaxImage
                src="/images/team/abraham-akpobi.jpg"
                alt="Abraham Koffi AKPOBI - Fondateur et CEO de FINAB la solution"
                className="aspect-[4/5]"
                imageClassName="object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent p-8 text-white">
                <h3 className="text-2xl font-bold">Abraham Koffi AKPOBI</h3>
                <p className="font-medium text-primary-light">Fondateur & CEO</p>
                <p className="mt-2 text-sm text-white/65">
                  Visionnaire engagé pour la résurrection financière des communautés africaines et caribéennes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative overflow-hidden bg-ink py-28 text-white md:py-36">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/photos/communaute-finab-513ca3.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="film-grain" />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
          {[
            {
              title: "Notre Mission",
              text: aboutContent.mission,
              image: "/images/photos/equipe-finab-961ba3.jpg",
              icon: (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                </>
              ),
            },
            {
              title: "Notre Vision",
              text: aboutContent.vision,
              image: "/images/photos/equipe-finab-32742e.jpg",
              icon: (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </>
              ),
            },
          ].map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, delay: i * 0.15, ease: EASE }}
              className="glow-border group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-ink-3 p-10 md:p-12"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="50vw"
                  className="object-cover opacity-25 transition-all duration-[1.4s] group-hover:scale-110 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-3 via-ink-3/80 to-ink-3/30" />
              </div>
              <div className="relative flex h-full flex-col justify-end">
                <span className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary-light">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {card.icon}
                  </svg>
                </span>
                <h3 className="text-3xl font-bold tracking-[-0.02em] md:text-4xl">{card.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-white/70">{card.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-cream py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Nos valeurs"
            title="Ce qui nous guide"
            subtitle="Nos valeurs fondamentales définissent chacune de nos actions"
            highlight={["guide"]}
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {aboutContent.values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
                className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-35px_rgba(5,13,9,0.35)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:bg-ink hover:text-white"
              >
                <span className="pointer-events-none absolute -right-4 -top-10 font-display text-[10rem] italic leading-none text-primary/10 transition-colors duration-500 group-hover:text-primary/25">
                  {value.title[0]}
                </span>
                <span className="relative mb-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light font-display text-2xl text-white">
                  {value.title[0]}
                </span>
                <h3 className="relative text-xl font-bold">{value.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/65">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="bg-surface py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Notre équipe"
            title="Des professionnels engagés"
            subtitle="Une équipe multiculturelle au service de votre réussite"
            highlight={["engagés"]}
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {team.map((item, i) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.12, ease: EASE }}
                className={`group relative aspect-[3/4] overflow-hidden rounded-[1.75rem] ${i % 2 === 1 ? "md:mt-16" : ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover grayscale-[40%] transition-all duration-[1.2s] group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 font-semibold text-white">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="relative overflow-hidden bg-primary-dark py-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/photos/communaute-finab-canada-afrique-haiti-4037e9.jpg" alt="" fill sizes="100vw" className="slow-zoom object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-primary-dark/40" />
        <div className="film-grain" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              className="text-center"
              valueClassName="whitespace-nowrap font-display text-4xl font-semibold text-white md:text-6xl"
              labelClassName="mt-2 text-xs uppercase tracking-[0.2em] text-white/65"
            />
          ))}
        </div>
      </section>
    </>
  );
}
