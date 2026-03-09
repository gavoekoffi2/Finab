"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/content";

const heroImages = [
  {
    src: "/images/hero1.jpg",
    alt: "Professionnels africains - FINAB ensemble",
    headline: "Ensemble pour l'Afrique",
    sub: "FINAB accompagne les familles vers la résilience financière",
  },
  {
    src: "/images/hero2.jpg",
    alt: "Leader africain - Koffi Abraham AKPOBI",
    headline: "Leadership et Excellence",
    sub: "Koffi Abraham AKPOBI - Votre partenaire de confiance",
  },
  {
    src: "/images/hero3.jpg",
    alt: "Accompagnement africain - Conseil FINAB",
    headline: "Accompagnement Personnalisé",
    sub: "Des solutions adaptées à vos besoins",
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

// Floating particles with 3D depth
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.4 + 0.1,
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
  const heroRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const imageX = useTransform(mouseX, [-0.5, 0.5], [15, -15]);
  const imageY = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const contentX = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const contentY = useTransform(mouseY, [-0.5, 0.5], [-5, 5]);

  const typewriterText = useTypewriter([
    "Ensemble, changeons des vies",
    "L'espoir à travers l'éducation",
    "Bâtir un avenir meilleur",
    "La solidarité sans frontières",
    "Des communautés résilientes",
  ]);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative h-[100vh] flex items-center overflow-hidden"
    >
      {/* Fullscreen image background slider with parallax */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-[-20px]"
          style={{ x: imageX, y: imageY }}
        >
          <Image
            src={heroImages[current].src}
            alt={heroImages[current].alt}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {/* Light gradient overlay - transparent enough to see images clearly */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-dark/20" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise" />

      {/* Floating particles + geometric SVGs */}
      <Particles />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.2) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content with parallax */}
      <motion.div
        className="relative max-w-7xl mx-auto px-6 py-24 w-full"
        style={{ x: contentX, y: contentY }}
      >
        <div className="max-w-3xl">
          {/* Live badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold glass text-white mb-6 border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            Canada &bull; Afrique &bull; Haïti
          </motion.span>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-4 drop-shadow-2xl"
          >
            {siteConfig.name}
          </motion.h1>

          {/* Typewriter subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <p className="text-primary-light text-xl md:text-2xl lg:text-3xl font-medium mb-2 min-h-[2.5em] drop-shadow-lg">
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
                className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-xl drop-shadow-md"
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
            className="text-white/70 text-sm mb-8 italic drop-shadow-md"
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
            <Button href="/services" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm">
              Découvrir nos services
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 }}
            className="flex gap-8 pt-8 border-t border-white/20"
          >
            {[
              { value: "5000+", label: "Clients" },
              { value: "3", label: "Continents" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-gradient drop-shadow-lg">{stat.value}</div>
                <div className="text-white/60 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Image indicators (right side) */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        {heroImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full cursor-pointer group relative ${
              i === current
                ? "w-3 h-12 bg-primary-light shadow-lg shadow-primary/30"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={img.alt}
          >
            {i === current && (
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-primary-light/30 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Current slide caption overlay - bottom right */}
      <div className="absolute bottom-20 right-6 md:right-12 z-10 hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl px-6 py-4 max-w-xs border border-white/10"
          >
            <p className="text-white/90 text-sm font-medium">{heroImages[current].headline}</p>
            <p className="text-white/50 text-xs mt-1">{heroImages[current].alt}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5.5, ease: "linear" }}
          className="h-full bg-gradient-to-r from-primary to-primary-light"
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
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
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
