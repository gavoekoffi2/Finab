"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  strength?: number;
  priority?: boolean;
  /** Révèle l'image avec un rideau (clip-path) à son entrée à l'écran */
  curtain?: boolean;
}

// Image qui glisse plus lentement que la page (effet de profondeur), avec révélation en rideau.
export default function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  strength = 12,
  priority,
  curtain = true,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  // La détection d'entrée à l'écran est portée par l'enveloppe (un élément masqué n'est pas « vu »).
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={curtain ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)" },
          visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        <motion.div className="absolute inset-[-14%_0]" style={{ y }}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imageClassName}`} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
