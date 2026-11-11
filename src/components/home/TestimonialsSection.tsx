"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import SplitText from "@/components/immersive/SplitText";
import { testimonials } from "@/data/content";
import { StarIcon } from "@/components/ui/Icons";
import { getLenis } from "@/components/immersive/SmoothScroll";
import type { GlobeStop } from "@/components/three/Globe";

const EASE = [0.16, 1, 0.3, 1] as const;

// Coordonnées des villes de nos clients (Canada en rouge érable, Afrique en vert, Haïti en bleu)
const cities: { match: string; city: string; lat: number; lng: number; color: string }[] = [
  { match: "montréal", city: "Montréal", lat: 45.5, lng: -73.57, color: "#ef4444" },
  { match: "lomé", city: "Lomé", lat: 6.13, lng: 1.22, color: "#22c55e" },
  { match: "port-au-prince", city: "Port-au-Prince", lat: 18.59, lng: -72.31, color: "#3b82f6" },
  { match: "abidjan", city: "Abidjan", lat: 5.36, lng: -4.01, color: "#4ade80" },
];

const journey = testimonials.map((t) => {
  const c = cities.find((city) => t.location.toLowerCase().includes(city.match)) ?? cities[0];
  return { ...t, ...c };
});

const stops: GlobeStop[] = journey.map(({ lat, lng, color }) => ({ lat, lng, color }));

function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[70%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#14532d,#04140b_65%)] shadow-[0_0_120px_20px_rgba(34,197,94,0.25)]" />
    </div>
  );
}

const Globe = dynamic(() => import("@/components/three/Globe"), { ssr: false, loading: () => <GlobeFallback /> });

class GlobeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <GlobeFallback /> : this.props.children;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setWebgl((w) => w ?? hasWebGL());
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.04) / 0.88)) * (journey.length - 1);
    setActive(Math.round(t));
  });

  // Clic sur une ville : on fait défiler jusqu'à son étape
  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const p = 0.04 + (i / (journey.length - 1)) * 0.88;
    const target = start + span * p;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  const item = journey[active];

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink text-white"
      style={{ height: `${(journey.length + 1) * 90}vh` }}
      aria-label="Témoignages de nos clients"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="film-grain" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(22,163,74,0.18),transparent_60%)]" />
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col px-6 pb-8 pt-24 lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-10 lg:pb-0 lg:pt-16">
          {/* Texte */}
          <div className="relative z-10 flex flex-col lg:order-1">
            <span className="eyebrow mb-4 text-primary-light lg:mb-6">Témoignages</span>
            <SplitText
              text="Ce que disent nos clients"
              highlight={["clients"]}
              className="text-3xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-6xl"
            />
            <p className="mt-4 hidden max-w-md text-lg text-white/60 md:block">
              La satisfaction de nos clients est notre plus grande fierté
            </p>
            <p className="display-italic mt-2 hidden text-lg text-white/45 lg:block">
              Du Canada à l&apos;Afrique, de l&apos;Afrique à Haïti
            </p>

            {/* Carte témoignage (bureau) */}
            <div className="relative mt-10 hidden min-h-[260px] lg:block">
              <AnimatePresence mode="wait">
                <TestimonialCard key={active} item={item} />
              </AnimatePresence>
            </div>

            {/* Étapes du voyage */}
            <div className="mt-8 hidden lg:block">
              <div className="mb-4 h-px overflow-hidden bg-white/10">
                <motion.div className="h-full bg-gradient-to-r from-primary-light via-primary to-accent" style={{ width: bar }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {journey.map((stop, i) => (
                  <button
                    key={stop.name}
                    onClick={() => goTo(i)}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-500 ${
                      i === active ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-white/45 hover:text-white/80"
                    }`}
                    aria-label={`Témoignage de ${stop.name}, ${stop.city}`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stop.color }} />
                    {stop.city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Globe */}
          <div className="relative -mx-6 min-h-0 flex-1 lg:order-2 lg:mx-0 lg:h-[min(80vh,720px)] lg:flex-none">
            <div className="absolute inset-0">
              {webgl === false ? (
                <GlobeFallback />
              ) : webgl ? (
                <GlobeBoundary>
                  <Globe stops={stops} progress={scrollYProgress} active={visible} />
                </GlobeBoundary>
              ) : null}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="pointer-events-none absolute right-6 top-4 text-right lg:right-0 lg:top-10"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">Étape {active + 1} / {journey.length}</p>
                <p className="font-display text-2xl italic md:text-4xl" style={{ color: item.color }}>
                  {item.city}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carte témoignage (mobile) */}
          <div className="relative z-10 min-h-[210px] lg:hidden">
            <AnimatePresence mode="wait">
              <TestimonialCard key={active} item={item} compact />
            </AnimatePresence>
            <div className="mt-4 flex justify-center gap-2">
              {journey.map((stop, i) => (
                <button
                  key={stop.name}
                  onClick={() => goTo(i)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${i === active ? "w-8 bg-primary-light" : "w-1.5 bg-white/25"}`}
                  aria-label={`Témoignage de ${stop.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, compact = false }: { item: (typeof journey)[number]; compact?: boolean }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`glass-dark relative rounded-3xl ${compact ? "p-5" : "p-8"}`}
    >
      <span className="absolute -top-6 right-6 font-display text-8xl leading-none text-primary/40" aria-hidden="true">
        &ldquo;
      </span>
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < item.rating ? "text-yellow-400" : "text-white/20"}`}
            filled={i < item.rating}
          />
        ))}
      </div>
      <blockquote className={`leading-relaxed text-white/85 ${compact ? "line-clamp-4 text-sm" : "text-lg"}`}>
        &ldquo;{item.text}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${item.color}, #15803d)` }}
        >
          {item.name[0]}
        </span>
        <span>
          <span className="block font-semibold">{item.name}</span>
          <span className="block text-sm text-white/50">{item.location}</span>
        </span>
      </figcaption>
    </motion.figure>
  );
}
