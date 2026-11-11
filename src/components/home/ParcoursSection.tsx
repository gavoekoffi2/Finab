"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 4500;

const parcoursImages = [
  {
    src: "/images/photos/soutien-aux-enfants-b29685.jpg",
    title: "Soutien aux enfants",
    description: "Notre engagement pour l'avenir des enfants africains et haïtiens",
  },
  {
    src: "/images/photos/soutien-aux-enfants-254137.jpg",
    title: "Espoir et résilience",
    description: "Accompagner les communautés vers un avenir meilleur",
  },
  {
    src: "/images/photos/espoir-et-resilience-459175.jpg",
    title: "Éducation pour tous",
    description: "L'éducation financière comme clé du développement",
  },
  {
    src: "/images/photos/education-pour-tous-de93cc.jpg",
    title: "Solidarité communautaire",
    description: "Ensemble, nous construisons des ponts entre les continents",
  },
  {
    src: "/images/photos/solidarite-communautaire-7f8100.jpg",
    title: "Leadership africain",
    description: "Des leaders engagés pour le changement",
  },
  {
    src: "/images/photos/leadership-africain-625606.jpg",
    title: "Formation professionnelle",
    description: "Développer les compétences pour l'autonomie financière",
  },
  {
    src: "/images/photos/formation-professionnelle-242def.jpg",
    title: "Excellence professionnelle",
    description: "FINAB au service de votre réussite",
  },
  {
    src: "/images/photos/excellence-professionnelle-d9c6d9.jpg",
    title: "Accompagnement personnalisé",
    description: "Un suivi sur mesure pour chaque client",
  },
  {
    src: "/images/photos/accompagnement-personnalise-326b1a.jpg",
    title: "Sourire et confiance",
    description: "La satisfaction de nos clients, notre plus grande fierté",
  },
  {
    src: "/images/photos/sourire-et-confiance-cba7b3.jpg",
    title: "Villages et communautés",
    description: "Renforcer les communautés locales à travers la finance",
  },
  {
    src: "/images/photos/villages-et-communautes-7978b2.jpg",
    title: "Éducation des jeunes",
    description: "Investir dans la jeunesse pour un avenir durable",
  },
  {
    src: "/images/photos/education-des-jeunes-cb1ad9.jpg",
    title: "Familles unies",
    description: "Protéger les familles avec des solutions adaptées",
  },
  {
    src: "/images/photos/familles-unies-d58566.jpg",
    title: "Protection familiale",
    description: "L'assurance au service de la tranquillité d'esprit",
  },
  {
    src: "/images/photos/protection-familiale-1c7e00.jpg",
    title: "Réunions communautaires",
    description: "Partager les connaissances et les ressources",
  },
  {
    src: "/images/photos/reunions-communautaires-39c35b.jpg",
    title: "Santé pour tous",
    description: "Des solutions de santé accessibles à chacun",
  },
  {
    src: "/images/photos/sante-pour-tous-ae042a.jpg",
    title: "Croissance financière",
    description: "Épargner et investir pour un avenir solide",
  },
];

export default function ParcoursSection() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % parcoursImages.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + parcoursImages.length) % parcoursImages.length), []);

  // Lecture automatique seulement quand la section est visible (pause au survol)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (isHovered || !inView) return;
    const id = setInterval(next, DURATION);
    return () => clearInterval(id);
  }, [next, isHovered, inView, current]);

  // Garde la vignette active centrée dans la pellicule (sans faire défiler la page)
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[current] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: "smooth" });
  }, [current]);

  const item = parcoursImages[current];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-28 text-white md:py-36">
      <div className="film-grain" />
      <div className="breathe absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          badge="Notre Parcours"
          title="Le chemin de la réussite"
          subtitle="Revivez les moments forts de FINAB la solution à travers notre parcours en images"
          light
          highlight={["réussite"]}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 60 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.3, ease: EASE }}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.targetTouches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
              if (diff > 0) next();
              else prev();
            }
          }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-3 sm:aspect-[16/10] md:aspect-[21/9]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  quality={85}
                  className={`kenburns kenburns-${(current % 4) + 1} object-cover`}
                  style={{ ["--kb-duration" as string]: "7s" }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="vignette" />

            {/* Légende */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
                    {String(current + 1).padStart(2, "0")} / {String(parcoursImages.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-5xl">{item.title}</h3>
                  <p className="mt-2 max-w-lg text-sm text-white/70 md:text-lg">{item.description}</p>
                </motion.div>
              </AnimatePresence>

              <div className="hidden gap-3 md:flex">
                <button
                  onClick={prev}
                  className="glass flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-2xl transition-all hover:bg-white hover:text-ink"
                  aria-label="Précédent"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="glass flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-2xl transition-all hover:bg-white hover:text-ink"
                  aria-label="Suivant"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
              {inView && (
                <motion.div
                  key={`${current}-${isHovered}`}
                  initial={{ width: "0%" }}
                  animate={{ width: isHovered ? "0%" : "100%" }}
                  transition={{ duration: isHovered ? 0.2 : DURATION / 1000, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-primary-light to-accent"
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Pellicule */}
        <div
          ref={stripRef}
          className="no-scrollbar mt-6 flex gap-3 overflow-x-auto py-3"
          style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
        >
          {parcoursImages.map((slide, i) => (
            <button
              key={slide.src}
              onClick={() => setCurrent(i)}
              className={`relative h-20 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl transition-all duration-500 md:h-24 md:w-40 ${
                i === current ? "scale-105 ring-2 ring-primary-light ring-offset-2 ring-offset-ink" : "opacity-40 hover:opacity-80"
              }`}
              aria-label={`Image ${i + 1} : ${slide.title}`}
              aria-current={i === current}
            >
              <Image src={slide.src} alt="" fill sizes="160px" quality={50} className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
