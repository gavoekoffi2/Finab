"use client";

import { motion, type Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "scale" | "blur";

const EASE = [0.16, 1, 0.3, 1] as const;

const hidden: Record<Direction, Record<string, number | string>> = {
  up: { opacity: 0, y: 60 },
  down: { opacity: 0, y: -60 },
  left: { opacity: 0, x: -80 },
  right: { opacity: 0, x: 80 },
  scale: { opacity: 0, scale: 0.88 },
  blur: { opacity: 0, filter: "blur(14px)", y: 20 },
};

interface RevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number;
  as?: "div" | "li" | "section" | "article" | "span";
}

// Fait apparaître un bloc avec élégance quand il entre à l'écran.
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1,
  className = "",
  amount = 0.2,
  as = "div",
}: RevealProps) {
  const variants: Variants = {
    hidden: hidden[direction],
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration, delay, ease: EASE },
    },
  };
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  );
}
