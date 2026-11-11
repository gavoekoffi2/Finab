"use client";

import { MotionConfig } from "framer-motion";

// Respecte automatiquement le réglage « réduire les animations » de l'appareil.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
