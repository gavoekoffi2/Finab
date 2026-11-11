"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Fine barre en haut de l'écran qui indique la progression de la visite.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-primary-light via-primary to-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
