"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/content";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1920&h=1080&fit=crop",
    alt: "Homme africain professionnel - FINAB solutions financières",
    headline: "Ensemble, changeons des vies",
    sub: "FINAB accompagne les familles vers la résilience financière",
  },
  {
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=1080&fit=crop",
    alt: "Femme africaine business - Accompagnement FINAB",
    headline: "L'espoir à travers l'éducation",
    sub: "L'éducation financière comme levier de développement",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1920&h=1080&fit=crop",
    alt: "Femme africaine souriante - Communauté FINAB",
    headline: "Bâtir un avenir meilleur",
    sub: "Protection et accompagnement pour chaque famille",
  },
  {
    src: "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?w=1920&h=1080&fit=crop",
    alt: "Professionnel africain - Solidarité sans frontières",
    headline: "La solidarité sans frontières",
    sub: "Du Canada à l'Afrique, de l'Afrique à Haïti",
  },
];

// Typewriter hook
function useTypewriter(texts: string[], typingSpeed = 60, pauseTime = 3000) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentText) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    } else {
      const speed = isDeleting ? typingSpeed / 2 : typingSpeed;
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentText.substring(0, displayText.length - 1)
            : currentText.substring(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, typingSpeed, pauseTime]);

  return displayText;
}

// Floating particles
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.3 + 0.1,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary-light particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            ["--duration" as string]: `${p.duration}s`,
            ["--delay" as string]: `${p.delay}s`,
          }}
        />
      ))}
      {/* Geometric SVG shapes */}
      <svg className="absolute top-1/4 right-1/4 w-32 h-32 text-primary/10 animate-float" viewBox="0 0 100 100" fill="none">
        <polygon points="50,5 95,75 5,75" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-1/3 left-1/6 w-24 h-24 text-primary-light/10 animate-float-delayed" viewBox="0 0 100 100" fill="none">
        <rect x="10" y="10" width="80" height="80" rx="10" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute top-1/3 right-1/6 w-20 h-20 text-primary/8 animate-float-slow" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const typewriterText = useTypewriter([
    "Ensemble, changeons des vies",
    "L'espoir à travers l'éducation",
    "Bâtir un avenir meilleur",
    "La solidarité sans frontières",
  ]);

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

      {/* Gradient overlay: green-dark → black */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-primary-dark/80 to-dark/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-transparent to-navy/50" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise" />

      {/* Floating particles + geometric SVGs */}
      <Particles />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.2) 1px, transparent 1px)`,
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold glass text-primary-light mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            Canada &bull; Afrique &bull; Haïti
          </motion.span>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-4"
          >
            {siteConfig.name}
          </motion.h1>

          {/* Typewriter subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <p className="text-primary-light text-xl md:text-2xl lg:text-3xl font-medium mb-2 min-h-[2.5em]">
              {typewriterText}
              <span className="typewriter-cursor text-primary-light">|</span>
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
              >
                {heroImages[current].sub}
              </motion.p>
            </AnimatePresence>
          </motion.div>

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
                ? "w-3 h-10 bg-primary-light"
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
          className="h-full bg-primary/70"
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
            className="w-1 bg-primary-light/70 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
