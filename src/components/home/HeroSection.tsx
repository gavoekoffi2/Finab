"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/content";

const heroImages = [
  {
    src: "/images/hero/hero-children-1.jpg",
    alt: "Enfants africains - FINAB soutient les communautés",
    headline: "Ensemble, changeons des vies",
    sub: "FINAB accompagne les familles vers la résilience financière",
  },
  {
    src: "/images/hero/hero-children-2.jpg",
    alt: "Sourires d'espoir - Communautés africaines",
    headline: "L'espoir à travers l'éducation",
    sub: "L'éducation financière comme levier de développement",
  },
  {
    src: "/images/hero/hero-children-3.jpg",
    alt: "Enfants de la communauté - Avenir meilleur",
    headline: "Bâtir un avenir meilleur",
    sub: "Protection et accompagnement pour chaque famille",
  },
  {
    src: "/images/hero/hero-africa-1.jpg",
    alt: "Communautés en Afrique - Solidarité FINAB",
    headline: "La solidarité sans frontières",
    sub: "Du Canada à l'Afrique, de l'Afrique à Haïti",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Fullscreen image background slider */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[current].src}
            alt={heroImages[current].alt}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
            quality={85}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-primary-dark/30" />

      {/* Animated grain texture */}
      <div className="absolute inset-0 noise" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="max-w-3xl">
          {/* Live badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold glass text-accent mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Canada &bull; Afrique &bull; Haïti
          </motion.span>

          {/* Main title - always visible */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-4"
          >
            {siteConfig.name}
          </motion.h1>

          {/* Dynamic subtitle based on current slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gradient text-xl md:text-2xl lg:text-3xl font-medium mb-4">
                {heroImages[current].headline}
              </p>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {heroImages[current].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-white/50 text-sm mb-8 italic"
          >
            &ldquo;{siteConfig.tagline}&rdquo;
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Button href="/contact" variant="accent" size="lg">
              Nous contacter
            </Button>
            <Button href="/services" variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              Découvrir nos services
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 }}
            className="flex gap-8 pt-8 border-t border-white/10"
          >
            {[
              { value: "5000+", label: "Clients" },
              { value: "3", label: "Continents" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-white/40 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Image indicators (right side) */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full cursor-pointer ${
              i === current
                ? "w-3 h-10 bg-accent"
                : "w-3 h-3 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5.5, ease: "linear" }}
          className="h-full bg-accent/70"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <motion.div
            animate={{ height: [6, 14, 6], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1 bg-accent/70 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
