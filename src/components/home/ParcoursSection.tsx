"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const parcoursImages = [
  {
    src: "/images/generated/soutien-aux-enfants-b29685.jpg",
    title: "Soutien aux enfants",
    description: "Notre engagement pour l'avenir des enfants africains et haïtiens",
  },
  {
    src: "/images/generated/soutien-aux-enfants-254137.jpg",
    title: "Espoir et résilience",
    description: "Accompagner les communautés vers un avenir meilleur",
  },
  {
    src: "/images/generated/espoir-et-resilience-459175.jpg",
    title: "Éducation pour tous",
    description: "L'éducation financière comme clé du développement",
  },
  {
    src: "/images/generated/education-pour-tous-de93cc.jpg",
    title: "Solidarité communautaire",
    description: "Ensemble, nous construisons des ponts entre les continents",
  },
  {
    src: "/images/generated/solidarite-communautaire-7f8100.jpg",
    title: "Leadership africain",
    description: "Des leaders engagés pour le changement",
  },
  {
    src: "/images/generated/leadership-africain-625606.jpg",
    title: "Formation professionnelle",
    description: "Développer les compétences pour l'autonomie financière",
  },
  {
    src: "/images/generated/formation-professionnelle-242def.jpg",
    title: "Excellence professionnelle",
    description: "FINAB au service de votre réussite",
  },
  {
    src: "/images/generated/excellence-professionnelle-d9c6d9.jpg",
    title: "Accompagnement personnalisé",
    description: "Un suivi sur mesure pour chaque client",
  },
  {
    src: "/images/generated/accompagnement-personnalise-326b1a.jpg",
    title: "Sourire et confiance",
    description: "La satisfaction de nos clients, notre plus grande fierté",
  },
  {
    src: "/images/generated/sourire-et-confiance-cba7b3.jpg",
    title: "Villages et communautés",
    description: "Renforcer les communautés locales à travers la finance",
  },
  {
    src: "/images/generated/villages-et-communautes-7978b2.jpg",
    title: "Éducation des jeunes",
    description: "Investir dans la jeunesse pour un avenir durable",
  },
  {
    src: "/images/generated/education-des-jeunes-cb1ad9.jpg",
    title: "Familles unies",
    description: "Protéger les familles avec des solutions adaptées",
  },
  {
    src: "/images/generated/familles-unies-d58566.jpg",
    title: "Protection familiale",
    description: "L'assurance au service de la tranquillité d'esprit",
  },
  {
    src: "/images/generated/protection-familiale-1c7e00.jpg",
    title: "Réunions communautaires",
    description: "Partager les connaissances et les ressources",
  },
  {
    src: "/images/generated/reunions-communautaires-39c35b.jpg",
    title: "Santé pour tous",
    description: "Des solutions de santé accessibles à chacun",
  },
  {
    src: "/images/generated/sante-pour-tous-ae042a.jpg",
    title: "Croissance financière",
    description: "Épargner et investir pour un avenir solide",
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
