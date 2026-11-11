"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { getLenis } from "@/components/immersive/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

const galleryItems = [
  { id: 1, src: "/images/photos/seminaire-de-formation-e44ee2.jpg", title: "Séminaire de formation", category: "Formation" },
  { id: 2, src: "/images/photos/seminaire-de-formation-34a0fc.jpg", title: "Accompagnement client", category: "Services" },
  { id: 3, src: "/images/photos/seminaire-de-formation-3a57ae.jpg", title: "Développement financier", category: "Services" },
  { id: 4, src: "/images/photos/seminaire-de-formation-f4c654.jpg", title: "Travail d'équipe FINAB", category: "Équipe" },
  { id: 5, src: "/images/photos/seminaire-de-formation-ee76c6.jpg", title: "Rencontres partenaires", category: "Partenaires" },
  { id: 6, src: "/images/photos/seminaire-de-formation-c8d126.jpg", title: "Atelier de formation", category: "Formation" },
  { id: 7, src: "/images/photos/seminaire-de-formation-516e22.jpg", title: "Événement communautaire", category: "Communauté" },
  { id: 8, src: "/images/photos/seminaire-de-formation-e40b99.jpg", title: "Réunion stratégique", category: "Équipe" },
  { id: 9, src: "/images/photos/seminaire-de-formation-d08bc2.jpg", title: "Workshop pratique", category: "Formation" },
  { id: 10, src: "/images/photos/accompagnement-client-c2b2cd.jpg", title: "Impact communautaire", category: "Communauté" },
  { id: 11, src: "/images/photos/developpement-financier-910702.jpg", title: "Histoires de succès", category: "Services" },
  { id: 12, src: "/images/photos/travail-d-equipe-finab-4e8605.jpg", title: "Conférence FINAB", category: "Partenaires" },
];

const categories = ["Tous", "Formation", "Services", "Équipe", "Partenaires", "Communauté"];
const aspects = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]"];

type Item = (typeof galleryItems)[number];

function Column({ items, y, onOpen, offset }: { items: Item[]; y: MotionValue<string>; onOpen: (id: number) => void; offset: number }) {
  return (
    <motion.div style={{ y }} className="flex flex-col gap-4 md:gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <motion.button
            layout
            key={item.id}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.7, ease: EASE }}
            onClick={() => onOpen(item.id)}
            data-cursor="Voir"
            className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl ${aspects[(i + offset) % aspects.length]}`}
            aria-label={`Agrandir : ${item.title}`}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={75}
              className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-5">
              <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-white">{item.category}</span>
              <p className="text-sm font-bold text-white md:text-base">{item.title}</p>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start end", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const y1 = useTransform(scrollYProgress, [0, 1], ["12%", "-14%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["4%", "-6%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["16%", "-12%"]);
  const speeds = [y0, y1, y2, y3];

  const filtered = activeFilter === "Tous" ? galleryItems : galleryItems.filter((item) => item.category === activeFilter);
  const columnCount = isDesktop ? 4 : 2;
  const columns = Array.from({ length: columnCount }, (_, c) => filtered.filter((_, i) => i % columnCount === c));

  const selectedIndex = galleryItems.findIndex((g) => g.id === selectedItem);
  const selectedImage = selectedIndex >= 0 ? galleryItems[selectedIndex] : null;

  const step = useCallback(
    (dir: number) => {
      if (selectedIndex < 0) return;
      setSelectedItem(galleryItems[(selectedIndex + dir + galleryItems.length) % galleryItems.length].id);
    },
    [selectedIndex]
  );

  useEffect(() => {
    if (!selectedImage) return;
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [selectedImage, step]);

  return (
    <section className="relative overflow-hidden bg-cream py-28 md:py-36">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading badge="Galerie" title="FINAB en images" subtitle="Découvrez nos activités, événements et moments forts" highlight={["images"]} />

        <div className="mb-14 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`relative cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                activeFilter === cat ? "text-white" : "bg-white text-muted ring-1 ring-black/5 hover:text-primary"
              }`}
            >
              {activeFilter === cat && (
                <motion.span layoutId="galleryFilter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.5, bounce: 0.2 }} />
              )}
              <span className="relative">{cat}</span>
            </button>
          ))}
        </div>

        <div ref={gridRef} className="grid grid-cols-2 items-start gap-4 md:grid-cols-4 md:gap-6">
          {columns.map((items, c) => (
            <Column key={c} items={items} y={speeds[c]} onOpen={setSelectedItem} offset={c} />
          ))}
        </div>
      </div>

      {/* Visionneuse plein écran */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-xl md:p-10"
            onClick={() => setSelectedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title}
          >
            <div className="film-grain" />
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.92, clipPath: "inset(10% 10% 10% 10% round 24px)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative h-[70vh] w-full max-w-5xl overflow-hidden rounded-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={selectedImage.src} alt={selectedImage.title} fill sizes="(max-width: 1024px) 100vw, 1024px" quality={90} className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{selectedImage.category}</span>
                  <h3 className="text-2xl font-bold text-white md:text-4xl">{selectedImage.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/50">
                    {String(selectedIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => setSelectedItem(null)}
              className="glass absolute right-5 top-5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-xl text-white transition-colors hover:bg-white hover:text-ink"
              aria-label="Fermer"
            >
              ✕
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="glass absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-2xl text-white transition-colors hover:bg-white hover:text-ink md:left-8"
              aria-label="Précédent"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="glass absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-2xl text-white transition-colors hover:bg-white hover:text-ink md:right-8"
              aria-label="Suivant"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
