"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitText from "@/components/immersive/SplitText";
import { useIntroStore } from "@/lib/introStore";

const EASE = [0.16, 1, 0.3, 1] as const;

interface PageHeroProps {
  /** Nom de la page (fil d'Ariane + surtitre) */
  eyebrow: string;
  title: string;
  highlight?: string[];
  subtitle?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  children?: React.ReactNode;
  /** Badge personnalisé à la place du surtitre */
  badge?: React.ReactNode;
  tone?: "green" | "blue";
}

// Ouverture plein écran des pages intérieures : photo en zoom lent, titre révélé mot à mot, sortie en parallaxe.
export default function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  image,
  imageAlt,
  imagePosition = "center",
  children,
  badge,
  tone = "green",
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroStore((s) => s.done);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const glow = tone === "blue" ? "rgba(59,130,246,0.28)" : "rgba(22,163,74,0.28)";

  return (
    <section ref={ref} className="relative flex min-h-[88svh] items-end overflow-hidden bg-ink text-white md:min-h-[92svh]">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.25, opacity: 0 }}
          animate={introDone ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: EASE }}
        >
          <div className="slow-zoom absolute inset-0">
            <Image src={image} alt={imageAlt} fill priority sizes="100vw" quality={85} className="object-cover" style={{ objectPosition: imagePosition }} />
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/15 to-transparent" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 15% 90%, ${glow}, transparent 55%)` }} />
      <div className="vignette" />
      <div className="film-grain" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:pb-28">
        <motion.nav
          aria-label="Fil d'Ariane"
          initial={{ opacity: 0, y: 12 }}
          animate={introDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50"
        >
          <Link href="/" className="transition-colors hover:text-white">
            Accueil
          </Link>
          <span className="h-px w-6 bg-white/30" />
          <span className="text-white/85">{eyebrow}</span>
        </motion.nav>

        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="mb-6"
          >
            {badge}
          </motion.div>
        )}

        <SplitText
          as="h1"
          text={title}
          highlight={highlight}
          play={introDone}
          delay={0.35}
          stagger={0.08}
          className="max-w-5xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-8xl"
        />

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: EASE }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1, ease: EASE }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </motion.div>

      <div className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/55 md:right-12 md:flex">
        <span className="[writing-mode:vertical-rl]">Défiler</span>
        <span className="relative h-14 w-px overflow-hidden bg-white/20">
          <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-primary-light" />
        </span>
      </div>
    </section>
  );
}
