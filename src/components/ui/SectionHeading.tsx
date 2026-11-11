"use client";

import { motion } from "framer-motion";
import SplitText from "@/components/immersive/SplitText";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
  /** Mots du titre à mettre en valeur */
  highlight?: string[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
  light = false,
  highlight,
}: SectionHeadingProps) {
  // Par défaut, on met en valeur le dernier mot du titre.
  const words = title.replace(/[?!.]/g, "").split(" ");
  const emphasis = highlight ?? [words[words.length - 1]];

  return (
    <div className={`mb-14 md:mb-20 ${center ? "text-center" : ""}`}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className={`eyebrow mb-6 ${light ? "text-primary-light" : "text-primary"} ${center ? "justify-center" : ""}`}
        >
          {badge}
        </motion.span>
      )}
      <SplitText
        text={title}
        highlight={emphasis}
        className={`text-4xl font-bold leading-[1.02] tracking-[-0.035em] md:text-5xl lg:text-6xl ${light ? "text-white" : "text-ink"}`}
      />
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className={`mt-6 max-w-2xl text-lg leading-relaxed md:text-xl ${center ? "mx-auto" : ""} ${light ? "text-white/65" : "text-muted"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
