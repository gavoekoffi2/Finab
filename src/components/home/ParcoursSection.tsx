"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const parcoursImages = [
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    title: "Soutien aux enfants",
    description: "Notre engagement pour l'avenir des enfants africains et haïtiens",
  },
  {
    src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
    title: "Espoir et résilience",
    description: "Accompagner les communautés vers un avenir meilleur",
  },
  {
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80",
    title: "Éducation pour tous",
    description: "L'éducation financière comme clé du développement",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    title: "Solidarité communautaire",
    description: "Ensemble, nous construisons des ponts entre les continents",
  },
  {
    src: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=800&q=80",
    title: "Leadership africain",
    description: "Des leaders engagés pour le changement",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    title: "Formation professionnelle",
    description: "Développer les compétences pour l'autonomie financière",
  },
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    title: "Excellence professionnelle",
    description: "FINAB au service de votre réussite",
  },
  {
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    title: "Accompagnement personnalisé",
    description: "Un suivi sur mesure pour chaque client",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
    title: "Sourire et confiance",
    description: "La satisfaction de nos clients, notre plus grande fierté",
  },
  {
    src: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80",
    title: "Villages et communautés",
    description: "Renforcer les communautés locales à travers la finance",
  },
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    title: "Éducation des jeunes",
    description: "Investir dans la jeunesse pour un avenir durable",
  },
  {
    src: "https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=800&q=80",
    title: "Familles unies",
    description: "Protéger les familles avec des solutions adaptées",
  },
  {
    src: "https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=800&q=80",
    title: "Protection familiale",
    description: "L'assurance au service de la tranquillité d'esprit",
  },
  {
    src: "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?w=800&q=80",
    title: "Réunions communautaires",
    description: "Partager les connaissances et les ressources",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    title: "Santé pour tous",
    description: "Des solutions de santé accessibles à chacun",
  },
  {
    src: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80",
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
