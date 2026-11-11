"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollWords from "@/components/immersive/ScrollWords";
import { whyUs, aboutContent } from "@/data/content";
import { GlobeIcon, UsersIcon, ShieldIcon, AwardIcon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: GlobeIcon,
  users: UsersIcon,
  shield: ShieldIcon,
  award: AwardIcon,
};

const whyUsImages = [
  "/images/photos/pourquoi-choisir-finab-9711c4.jpg",
  "/images/photos/pourquoi-choisir-finab-4018e2.jpg",
  "/images/photos/pourquoi-choisir-finab-d43fda.jpg",
  "/images/photos/pourquoi-choisir-finab-5c53e5.jpg",
];

// Appel à l'action : la photo s'agrandit jusqu'à remplir tout l'écran pendant le défilement.
function ExpandingCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const inset = useTransform(scrollYProgress, [0, 0.55], [18, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [40, 0]);
  const clipPath = useTransform(
    [inset, radius],
    ([i, r]: number[]) => `inset(${i}% ${i * 1.3}% ${i}% ${i * 1.3}% round ${r}px)`
  );
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.35, 0.6], [60, 0]);

  return (
    <div ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
            <Image src="/images/hero/hero-children-1.jpg" alt="Enfants souriants – l'avenir que FINAB aide à bâtir" fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,13,9,0.55),transparent_70%)]" />
        </motion.div>

        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h3 className="text-5xl font-bold tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
            Prêt à <span className="display-italic text-gradient-brand pr-2">commencer</span> ?
          </h3>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/75">
            Trouvez un agent FINAB près de chez vous ou contactez-nous directement pour un accompagnement personnalisé.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="accent" size="lg">
              Trouver un agent
            </Button>
            <Button href="/services" variant="outline" size="lg" className="border-white/40 text-white backdrop-blur hover:border-white hover:bg-white hover:text-ink">
              Demander un service
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function WhyUsSection() {
  return (
    <section className="relative bg-ink text-white">
      <div className="relative overflow-hidden py-28 md:py-36">
        <div className="absolute inset-0 opacity-[0.07]">
          <Image src="/images/photos/pourquoi-choisir-finab-6a68c6.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="film-grain" />
        <div className="breathe absolute left-0 top-1/4 h-80 w-80 rounded-full bg-primary/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Pourquoi nous"
            title="Pourquoi travailler avec nous ?"
            subtitle="Des raisons concrètes de nous faire confiance"
            light
            highlight={["nous"]}
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => {
              const Icon = iconMap[item.icon] || GlobeIcon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 80, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.1, delay: i * 0.12, ease: EASE }}
                  style={{ transformPerspective: 1000 }}
                  className="glow-border group relative h-[420px] overflow-hidden rounded-[2rem] bg-ink-3"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    <Image
                      src={whyUsImages[i]}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover opacity-60 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                  </div>
                  <div className="relative flex h-full flex-col justify-between p-7">
                    <div className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary-light backdrop-blur transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-7 w-7" />
                      </span>
                      <span className="font-display text-4xl text-white/20">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-[-0.02em]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/65">{item.description}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-6 text-center">
        <span className="eyebrow mb-6 justify-center text-primary-light">Notre vision</span>
        <ScrollWords
          text={aboutContent.vision}
          className="mx-auto max-w-4xl text-2xl font-semibold leading-snug tracking-[-0.02em] text-white md:text-4xl"
        />
      </div>

      <ExpandingCta />
    </section>
  );
}
