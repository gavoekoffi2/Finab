"use client";

import { useState } from "react";
import { motion } from "framer-motion";

let firstRender = true;

// Transition entre les pages : un rideau aux couleurs FINAB balaie l'écran.
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => {
    if (typeof window === "undefined") return false;
    const value = !firstRender;
    firstRender = false;
    return value;
  });

  return (
    <>
      {animate && (
        <div className="pointer-events-none fixed inset-0 z-[120]" aria-hidden="true">
          <motion.div
            className="absolute inset-0 origin-top bg-gradient-to-b from-primary-dark via-ink to-ink"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary-light to-accent"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        </div>
      )}
      <motion.div
        initial={animate ? { opacity: 0, y: 40 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: animate ? 0.35 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
