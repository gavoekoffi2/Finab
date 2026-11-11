"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitText from "@/components/immersive/SplitText";
import Button from "@/components/ui/Button";
import { productsCanada, productsAfrica, productImages } from "@/data/content";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { useMediaQuery } from "@/lib/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

const cardThemes = [
  { bg: "bg-ink-2 text-white", muted: "text-white/60", dot: "bg-primary-light", tag: "bg-primary text-white" },
  { bg: "bg-white text-ink ring-1 ring-black/5", muted: "text-muted", dot: "bg-primary", tag: "bg-ink text-white" },
  { bg: "bg-gradient-to-br from-primary-dark to-[#0c4d26] text-white", muted: "text-white/70", dot: "bg-white", tag: "bg-white text-primary-dark" },
];

function StackCard({
  product,
  index,
  total,
  progress,
  stacked,
}: {
  product: (typeof productsCanada)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  const targetScale = stacked ? 1 - (total - index) * 0.05 : 1;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const img = productImages[product.id];
  const theme = cardThemes[index % cardThemes.length];

  return (
    <div className="mb-6 md:sticky md:top-0 md:mb-0 md:flex md:h-screen md:items-center">
      <motion.article
        style={{ scale, top: stacked ? `calc(-4vh + ${index * 28}px)` : undefined }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE }}
        className={`relative grid w-full origin-top overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-40px_rgba(5,13,9,0.55)] md:h-[70vh] md:min-h-[480px] md:grid-cols-2 ${theme.bg}`}
      >
        {img && (
          <div className="group relative h-64 overflow-hidden md:h-full" data-cursor="Voir">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className={`absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-semibold ${theme.tag}`}>Canada</span>
          </div>
        )}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <span className="font-display text-6xl font-light opacity-30 md:text-8xl">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">{product.title}</h3>
          <p className={`mt-5 max-w-md text-base leading-relaxed md:text-lg ${theme.muted}`}>{product.description}</p>
          <ul className="mt-6 space-y-2.5">
            {product.features.slice(0, 3).map((f) => (
              <li key={f} className={`flex items-center gap-3 text-sm ${theme.muted}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={`/produits#${product.id}`}
            className="group mt-8 inline-flex w-fit items-center gap-3 text-sm font-semibold"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current transition-all duration-500 group-hover:bg-current">
              <ArrowRightIcon className="h-4 w-4 transition-colors duration-500 group-hover:text-primary-light" />
            </span>
            En savoir plus
          </Link>
        </div>
      </motion.article>
    </div>
  );
}

function CanadaStack() {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative">
      {productsCanada.map((product, i) => (
        <StackCard
          key={product.id}
          product={product}
          index={i}
          total={productsCanada.length}
          progress={scrollYProgress}
          stacked={isDesktop}
        />
      ))}
    </div>
  );
}

function AfricaCard({ product, index }: { product: (typeof productsAfrica)[number]; index: number }) {
  const img = productImages[product.id];
  return (
    <Link
      href={`/produits#${product.id}`}
      data-cursor="Détails"
      className="glow-border group relative block h-[62vh] max-h-[560px] min-h-[420px] w-[78vw] flex-shrink-0 snap-center overflow-hidden rounded-[2rem] bg-ink-3 sm:w-[360px] lg:w-[400px]"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
        {img && (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 640px) 80vw, 400px"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
      </div>
      <div className="relative flex h-full flex-col justify-between p-7">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">Afrique & Haïti</span>
          <span className="font-display text-3xl text-white/40">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div>
          <h3 className="text-3xl font-bold tracking-[-0.03em] text-white">{product.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">{product.description}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-light">
            Détails
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function AfricaHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [height, setHeight] = useState<number | undefined>(undefined);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (!isDesktop) {
      distance.set(0);
      return;
    }
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distance.set(d);
      setHeight(d + window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop, distance]);

  return (
    <section ref={sectionRef} className="relative bg-ink text-white" style={{ height: isDesktop ? height : undefined }}>
      <div className="film-grain pointer-events-none" />
      <div className={`${isDesktop ? "sticky top-0 h-screen" : "py-24"} flex flex-col justify-center overflow-hidden`}>
        <div className="absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/15 blur-[150px]" />
        <div className="relative mx-auto mb-10 flex w-full max-w-7xl flex-col gap-6 px-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow mb-5 text-primary-light">Produits Afrique & Haïti</span>
            <SplitText
              text="Nos services en Afrique et Haïti"
              highlight={["Haïti"]}
              className="text-4xl font-bold leading-[1.02] tracking-[-0.035em] md:text-5xl lg:text-6xl"
            />
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Des solutions d&apos;assurance et de finance adaptées aux réalités locales
            </p>
          </div>
          <div className="hidden w-64 lg:block">
            <div className="mb-3 flex justify-between text-xs uppercase tracking-[0.25em] text-white/50">
              <span>Faites défiler</span>
              <span>{String(productsAfrica.length).padStart(2, "0")} offres</span>
            </div>
            <div className="h-[2px] overflow-hidden rounded-full bg-white/15">
              <motion.div className="h-full bg-gradient-to-r from-primary-light to-accent" style={{ width: bar }} />
            </div>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={isDesktop ? { x } : undefined}
          className={`relative flex gap-5 px-6 lg:gap-7 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-[8vw] ${
            isDesktop ? "w-max" : "no-scrollbar snap-x snap-mandatory overflow-x-auto pb-4"
          }`}
        >
          {productsAfrica.map((product, i) => (
            <AfricaCard key={product.id} product={product} index={i} />
          ))}
          <div className="flex h-[62vh] max-h-[560px] min-h-[420px] w-[78vw] flex-shrink-0 snap-center flex-col items-center justify-center gap-6 rounded-[2rem] border border-white/10 text-center sm:w-[360px]">
            <p className="display-italic px-8 text-3xl text-white/80">Une solution pour chaque besoin</p>
            <Button href="/produits" variant="primary" size="lg">
              Voir tous nos produits
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ProductsPreview() {
  return (
    <>
      <section className="relative bg-cream pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Produits Canada"
            title="Nos services au Canada"
            subtitle="Des solutions adaptées pour votre réussite financière au Canada"
            highlight={["Canada"]}
          />
          <CanadaStack />
        </div>
      </section>
      <AfricaHorizontal />
    </>
  );
}
