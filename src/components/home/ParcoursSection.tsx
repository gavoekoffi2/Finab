"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const parcoursImages = [
  {
    src: "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?w=800&q=80",
    title: "Séminaire de formation",
    description: "Nos séminaires d'éducation financière au service des communautés",
  },
  {
    src: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
    title: "Accompagnement client",
    description: "Un suivi personnalisé pour chaque client FINAB",
  },
  {
    src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80",
    title: "Croissance et développement",
    description: "Ensemble, construisons un avenir financier solide",
  },
  {
    src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
    title: "Travail d'équipe",
    description: "Notre équipe dévouée au service de votre réussite",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    title: "Partenariats stratégiques",
    description: "Des collaborations de haut niveau pour un impact maximal",
  },
  {
    src: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=800&q=80",
    title: "Formation continue",
    description: "L'apprentissage au cœur de notre mission",
  },
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    title: "Événements communautaires",
    description: "FINAB au cœur des communautés africaines et caribéennes",
  },
  {
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    title: "Réunions partenaires",
    description: "Renforcer nos alliances pour mieux vous servir",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
    title: "Ateliers pratiques",
    description: "Des ateliers concrets pour une autonomie financière",
  },
  {
    src: "https://images.unsplash.com/photo-1611432579699-484f7990b127?w=800&q=80",
    title: "Impact social",
    description: "Notre engagement pour le développement des communautés",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    title: "Succès clients",
    description: "Chaque histoire de réussite nous inspire à faire plus",
  },
  {
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
    title: "Conférences",
    description: "Partager notre expertise sur les scènes internationales",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    title: "Nos bureaux",
    description: "Un environnement professionnel dédié à votre accompagnement",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    title: "Signature de partenariats",
    description: "Des accords stratégiques pour élargir nos services",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    title: "Communauté FINAB",
    description: "Une grande famille unie par des valeurs communes",
  },
  {
    src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
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
