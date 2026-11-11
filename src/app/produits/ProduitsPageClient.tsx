"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import PageHero from "@/components/immersive/PageHero";
import ParallaxImage from "@/components/immersive/ParallaxImage";
import Reveal from "@/components/immersive/Reveal";
import { productsCanada, productsAfrica, productImages } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

function Check({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${light ? "bg-primary/25 text-primary-light" : "bg-primary/15 text-primary"}`}>
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </span>
  );
}

export default function ProduitsPageClient() {
  return (
    <>
      <PageHero
        eyebrow="Nos Produits"
        title="Nos Produits & Services"
        highlight={["Services"]}
        subtitle="Des solutions adaptées à vos besoins, que vous soyez au Canada, en Afrique ou en Haïti"
        image="/images/photos/micro-assurance-petits-entrepreneurs-africains-ed53a2.jpg"
        imageAlt="Épargne et croissance financière"
      />

      {/* Produits Canada */}
      <section className="bg-cream py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Canada 🍁"
            title="Produits Canada"
            subtitle="Services financiers et professionnels pour le marché canadien"
            highlight={["Canada"]}
          />

          <div className="space-y-28 md:space-y-40">
            {productsCanada.map((product, i) => {
              const img = productImages[product.id];
              const reversed = i % 2 === 1;
              return (
                <div key={product.id} id={product.id} className="grid scroll-mt-28 items-center gap-12 md:grid-cols-2 md:gap-20">
                  <div className={reversed ? "md:order-2" : ""}>
                    <Reveal>
                      <span className="font-display text-7xl font-light text-primary/25 md:text-8xl">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-ink md:text-5xl">{product.title}</h3>
                      <p className="mt-5 text-lg leading-relaxed text-muted">{product.description}</p>
                    </Reveal>
                    <ul className="mb-10 mt-8 space-y-3">
                      {product.features.map((f, k) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.1 + k * 0.08, ease: EASE }}
                          className="flex items-center gap-3 text-ink/75"
                        >
                          <Check />
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                    <Reveal delay={0.2} className="flex flex-wrap gap-3">
                      <Button href="/services" variant="primary">
                        Demander ce service
                      </Button>
                      <Button href="/contact" variant="outline">
                        Parler à un conseiller
                      </Button>
                    </Reveal>
                  </div>
                  {img && (
                    <ParallaxImage
                      src={img.src}
                      alt={img.alt}
                      className={`aspect-[4/5] rounded-[2rem] shadow-[0_50px_100px_-40px_rgba(5,13,9,0.55)] ${reversed ? "md:order-1" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produits Afrique & Haïti */}
      <section className="relative overflow-hidden bg-ink py-28 text-white md:py-36">
        <div className="film-grain" />
        <div className="breathe absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-accent/15 blur-[140px]" />
        <div className="breathe absolute -left-40 bottom-20 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Afrique & Haïti 🌍"
            title="Produits Afrique & Haïti"
            subtitle="Solutions d'assurance et de finance adaptées aux réalités locales"
            light
            highlight={["Haïti"]}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productsAfrica.map((product, i) => {
              const img = productImages[product.id];
              return (
                <motion.article
                  key={product.id}
                  id={product.id}
                  initial={{ opacity: 0, y: 70 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1, delay: (i % 3) * 0.12, ease: EASE }}
                  className="glow-border group flex scroll-mt-28 flex-col overflow-hidden rounded-[2rem] bg-ink-3"
                >
                  {img && (
                    <div className="relative h-60 overflow-hidden rounded-t-[2rem]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-3 to-transparent" />
                      <span className="absolute left-5 top-5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold">Afrique & Haïti</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-8">
                    <h3 className="text-2xl font-bold tracking-[-0.02em]">{product.title}</h3>
                    <p className="mt-3 leading-relaxed text-white/65">{product.description}</p>
                    <ul className="mb-8 mt-6 space-y-2.5">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-white/75">
                          <Check light />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-3">
                      <Button href="/services" variant="primary" size="sm">
                        Demander
                      </Button>
                      <Button href="/contact" variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        En savoir +
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
