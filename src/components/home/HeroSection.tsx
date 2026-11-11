"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/content";
import { useIntroStore } from "@/lib/introStore";

const EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_DURATION = 7000;

// Chaque scène du « film » d'accueil : un grand plan en fond + la photo d'origine en carte flottante.
const heroScenes = [
  {
    bg: "/images/hero1.jpg",
    card: "/images/hero/hero-children-2.jpg",
    alt: "Enfants africains - Solidarité FINAB",
    headline: "Solidarité pour l'Afrique",
    sub: "FINAB accompagne les familles vers la résilience financière",
  },
  {
    bg: "/images/hero5.jpg",
    card: "/images/hero2.jpg",
    alt: "Koffi Abraham AKPOBI - Senior Vice President FINAB",
    headline: "Leadership et Excellence",
    sub: "Koffi Abraham AKPOBI - Votre partenaire de confiance",
  },
  {
    bg: "/images/hero/hero-children-3.jpg",
    card: "/images/hero3.jpg",
    alt: "Abraham AKPOBI - Convention des Champions",
    headline: "Convention des Champions",
    sub: "Des experts dédiés à votre réussite",
  },
  {
    bg: "/images/hero/hero-africa-1.jpg",
    card: "/images/hero4.jpg",
    alt: "Partenariat professionnel - FINAB Canada Afrique",
    headline: "Partenariat et Confiance",
    sub: "Du Canada à l'Afrique, de l'Afrique à Haïti",
  },
];

const phrases = [
  "Ensemble, changeons des vies",
  "L'espoir à travers l'éducation",
  "Bâtir un avenir meilleur",
  "La solidarité sans frontières",
  "Des communautés résilientes",
];

const heroStats = [
  { value: "5000+", label: "Clients" },
  { value: "3", label: "Continents" },
  { value: "98%", label: "Satisfaction" },
];

function RotatingPhrase({ play }: { play: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 3200);
    return () => clearInterval(id);
  }, [play]);

  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="inline-block whitespace-nowrap text-primary-light"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const introDone = useIntroStore((s) => s.done);
  const heroRef = useRef<HTMLElement>(null);

  // Parallaxe à la souris
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const bgX = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const cardRotY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const cardRotX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const contentX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Sortie cinématique au défilement
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.75]);

  const next = useCallback(() => setCurrent((p) => (p + 1) % heroScenes.length), []);

  useEffect(() => {
    if (!introDone) return;
    const id = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [next, introDone, current]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const scene = heroScenes[current];
  const title = siteConfig.name.split(" "); // ["FINAB", "la", "solution"]

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-white"
      aria-label="Présentation FINAB la solution"
    >
      {/* Le film : fondus enchaînés + zoom lent sur chaque photo */}
      <motion.div className="absolute inset-[-24px]" style={{ x: bgX, y: bgY, scale: scrollScale }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <Image
              src={scene.bg}
              alt={scene.alt}
              fill
              priority={current === 0}
              sizes="100vw"
              quality={85}
              className={`kenburns kenburns-${(current % 4) + 1} object-cover`}
              style={{ ["--kb-duration" as string]: `${SLIDE_DURATION / 1000 + 2}s` }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Étalonnage cinéma */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(22,163,74,0.25),transparent_55%)]" />
      <div className="vignette" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="film-grain" /></div>
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: shade }} />

      {/* Contenu */}
      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pb-28 pt-28 md:pb-24 md:pt-40"
        style={{ y: contentY, opacity: contentOpacity, x: contentX }}
      >
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="glass mb-6 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-light" />
            </span>
            Canada &bull; Afrique &bull; Haïti
          </motion.span>

          <h1 className="mb-6" aria-label={siteConfig.name}>
            <span className="block overflow-hidden" aria-hidden="true">
              <span className="flex">
                {title[0].split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%" }}
                    animate={introDone ? { y: "0%" } : {}}
                    transition={{ duration: 1.1, delay: 0.2 + i * 0.06, ease: EASE }}
                    className={`inline-block text-[clamp(4.5rem,min(24vw,19vh),11rem)] font-black leading-[0.82] tracking-[-0.06em] ${i === 3 ? "text-accent-light" : ""}`}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </span>
            <span className="block overflow-hidden pb-2" aria-hidden="true">
              <motion.span
                initial={{ y: "110%" }}
                animate={introDone ? { y: "0%" } : {}}
                transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
                className="display-italic text-gradient-brand inline-block pr-3 text-[clamp(3rem,min(14vw,11.5vh),7rem)] leading-[1]"
              >
                {title.slice(1).join(" ")}
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: EASE }}
          >
            <p className="mb-3 text-xl font-medium md:text-3xl">
              <RotatingPhrase play={introDone} />
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={current}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mb-3 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
              >
                {scene.sub}
              </motion.p>
            </AnimatePresence>
            <p className="mb-7 text-sm italic text-white/55 md:mb-9">&ldquo;{siteConfig.tagline}&rdquo;</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.95, ease: EASE }}
            className="mb-8 flex flex-wrap gap-3 md:mb-10 md:gap-4"
          >
            <Button href="/contact" variant="accent" size="lg">
              Nous contacter
              <svg className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
            <Button href="/services" variant="outline" size="lg" className="border-white/30 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-ink">
              Découvrir nos services
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.15 }}
            className="hidden gap-8 border-t border-white/15 pt-6 sm:flex md:gap-12"
          >
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-3xl font-semibold md:text-4xl">{stat.value}</dd>
                <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Carte photo flottante en 3D (grand écran) */}
      <motion.div
        className="absolute right-[6%] top-1/2 z-10 hidden -translate-y-1/2 lg:block"
        style={{ perspective: 1200, opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={introDone ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.4, delay: 0.7, ease: EASE }}
        >
        <motion.div style={{ rotateY: cardRotY, rotateX: cardRotX, transformStyle: "preserve-3d" }} className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/30 blur-3xl" />
          <div className="relative h-[420px] w-[300px] overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] xl:h-[480px] xl:w-[340px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.2 }}
                animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.3, ease: EASE }}
              >
                <Image src={scene.card} alt={scene.alt} fill sizes="340px" className="object-cover object-top" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: "translateZ(40px)" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-primary-light">
                    {String(current + 1).padStart(2, "0")} — Scène
                  </p>
                  <p className="mt-2 text-xl font-semibold">{scene.headline}</p>
                  <p className="mt-1 text-xs text-white/55">{scene.alt}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        </motion.div>
      </motion.div>

      {/* Barre du bas : chapitres du film + indicateur de défilement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introDone ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute inset-x-0 bottom-0 z-20"
      >
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 pb-7">
          <div className="flex flex-1 items-center gap-3 md:max-w-xl">
            <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-white/20 lg:hidden">
              <Image src={scene.card} alt="" fill sizes="44px" className="object-cover object-top" />
            </div>
            {heroScenes.map((s, i) => (
              <button
                key={s.headline}
                onClick={() => setCurrent(i)}
                className="group flex-1 cursor-pointer text-left"
                aria-label={`Scène ${i + 1} : ${s.headline}`}
                aria-current={i === current}
              >
                <span className="relative block h-[2px] overflow-hidden rounded-full bg-white/20">
                  {i === current && introDone && (
                    <motion.span
                      key={`p-${current}`}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-light to-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                    />
                  )}
                  {i < current && <span className="absolute inset-0 bg-white/60" />}
                </span>
                <span
                  className={`mt-2 hidden truncate text-[11px] uppercase tracking-[0.15em] transition-colors md:block ${
                    i === current ? "text-white" : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {s.headline}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60 md:flex">
            <span className="[writing-mode:vertical-rl]">Défiler</span>
            <span className="relative h-14 w-px overflow-hidden bg-white/20">
              <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-primary-light" />
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
