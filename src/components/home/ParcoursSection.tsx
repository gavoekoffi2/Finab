"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const parcoursImages = [
  {
    src: "/images/gallery/gallery-1.jpg",
    title: "Séminaire de formation",
    description: "Nos séminaires d'éducation financière au service des communautés",
  },
  {
    src: "/images/gallery/gallery-2.jpg",
    title: "Accompagnement client",
    description: "Un suivi personnalisé pour chaque client FINAB",
  },
  {
    src: "/images/gallery/gallery-3.jpg",
    title: "Croissance et développement",
    description: "Ensemble, construisons un avenir financier solide",
  },
  {
    src: "/images/gallery/gallery-4.jpg",
    title: "Travail d'équipe",
    description: "Notre équipe dévouée au service de votre réussite",
  },
  {
    src: "/images/gallery/gallery-5.jpg",
    title: "Partenariats stratégiques",
    description: "Des collaborations de haut niveau pour un impact maximal",
  },
  {
    src: "/images/gallery/gallery-6.jpg",
    title: "Formation continue",
    description: "L'apprentissage au cœur de notre mission",
  },
  {
    src: "/images/gallery/gallery-7.jpg",
    title: "Événements communautaires",
    description: "FINAB au cœur des communautés africaines et caribéennes",
  },
  {
    src: "/images/gallery/gallery-8.jpg",
    title: "Réunions partenaires",
    description: "Renforcer nos alliances pour mieux vous servir",
  },
  {
    src: "/images/gallery/gallery-9.jpg",
    title: "Ateliers pratiques",
    description: "Des ateliers concrets pour une autonomie financière",
  },
  {
    src: "/images/gallery/gallery-10.jpg",
    title: "Impact social",
    description: "Notre engagement pour le développement des communautés",
  },
  {
    src: "/images/gallery/gallery-11.jpg",
    title: "Succès clients",
    description: "Chaque histoire de réussite nous inspire à faire plus",
  },
  {
    src: "/images/gallery/gallery-12.jpg",
    title: "Conférences",
    description: "Partager notre expertise sur les scènes internationales",
  },
  {
    src: "/images/gallery/gallery-13.jpg",
    title: "Nos bureaux",
    description: "Un environnement professionnel dédié à votre accompagnement",
  },
  {
    src: "/images/gallery/gallery-14.jpg",
    title: "Signature de partenariats",
    description: "Des accords stratégiques pour élargir nos services",
  },
  {
    src: "/images/gallery/gallery-15.jpg",
    title: "Communauté FINAB",
    description: "Une grande famille unie par des valeurs communes",
  },
  {
    src: "/images/gallery/gallery-16.jpg",
    title: "Ensemble vers le succès",
    description: "La solidarité comme fondement de notre action",
  },
];

export default function ParcoursSection() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % parcoursImages.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + parcoursImages.length) % parcoursImages.length);
  }, []);

  // Auto-play (pause on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next, isHovered]);

  // Get visible slides for the filmstrip
  const getVisibleSlides = () => {
    const slides = [];
    for (let i = -2; i <= 3; i++) {
      const idx = (current + i + parcoursImages.length) % parcoursImages.length;
      slides.push({ ...parcoursImages[idx], index: idx, offset: i });
    }
    return slides;
  };

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Notre Parcours"
          title="Le chemin de la réussite"
          subtitle="Revivez les moments forts de FINAB la solution à travers notre parcours en images"
          light
        />

        {/* Main featured image */}
        <div
          className="relative mb-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[21/9] md:aspect-[21/8] rounded-3xl overflow-hidden group">
            <AnimatePresence mode="sync">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={parcoursImages[current].src}
                  alt={parcoursImages[current].title}
                  fill
                  className="object-cover transition-transform duration-[8s] group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  quality={85}
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-primary-light text-sm font-semibold tracking-widest uppercase">
                    {String(current + 1).padStart(2, "0")} / {String(parcoursImages.length).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                    {parcoursImages[current].title}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base mt-1 max-w-lg">
                    {parcoursImages[current].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Précédent"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Suivant"
            >
              ›
            </button>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
              <motion.div
                key={current}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: isHovered ? 99999 : 4, ease: "linear" }}
                className="h-full bg-primary-light"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail filmstrip */}
        <div
          ref={sliderRef}
          className="relative"
          onTouchStart={(e) => { touchStartX.current = e.targetTouches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
          }}
        >
          <div className="flex gap-3 overflow-hidden py-2">
            {getVisibleSlides().map((slide) => (
              <motion.button
                key={`${slide.index}-${slide.offset}`}
                layout
                onClick={() => setCurrent(slide.index)}
                className={`relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  slide.index === current
                    ? "w-[200px] h-[120px] md:w-[260px] md:h-[150px] ring-2 ring-primary-light ring-offset-2 ring-offset-navy"
                    : "w-[140px] h-[90px] md:w-[180px] md:h-[110px] opacity-50 hover:opacity-80"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="260px"
                  quality={60}
                />
                {slide.index === current && (
                  <div className="absolute inset-0 bg-primary-light/10 border-b-2 border-accent" />
                )}
                {slide.index !== current && (
                  <div className="absolute inset-0 bg-black/30" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {parcoursImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-6 bg-primary-light" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
