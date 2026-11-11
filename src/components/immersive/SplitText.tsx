"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SplitTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Mots mis en valeur (police éditoriale en italique + dégradé) */
  highlight?: string[];
  highlightClassName?: string;
  delay?: number;
  stagger?: number;
  /** Anime au montage (au lieu d'attendre l'entrée à l'écran) */
  play?: boolean;
}

// Titre qui se révèle mot par mot, chaque mot surgissant d'un masque.
export default function SplitText({
  text,
  as = "h2",
  className = "",
  highlight = [],
  highlightClassName = "display-italic text-gradient-brand pr-[0.08em]",
  delay = 0,
  stagger = 0.06,
  play,
}: SplitTextProps) {
  const Tag = motion[as];
  const words = text.split(" ");
  const normalized = highlight.map((h) => h.toLowerCase());
  const controlled = play !== undefined;

  return (
    <Tag
      className={className}
      initial="hidden"
      {...(controlled
        ? { animate: play ? "visible" : "hidden" }
        : { whileInView: "visible", viewport: { once: true, amount: 0.4 } })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => {
        const clean = w.toLowerCase().replace(/[.,!?;:«»"“”’']/g, "");
        const isHighlight = normalized.includes(clean);
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden="true">
            <motion.span
              className={`inline-block ${isHighlight ? highlightClassName : ""}`}
              variants={{
                hidden: { y: "115%", rotate: 4 },
                visible: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </Tag>
  );
}
