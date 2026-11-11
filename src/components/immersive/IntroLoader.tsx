"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroStore } from "@/lib/introStore";

const STORAGE_KEY = "finab-intro-seen";
const EASE = [0.16, 1, 0.3, 1] as const;

const word = "FINAB LA SOLUTION".split("");

// Écran d'ouverture cinématique : le logo se dessine, puis le rideau se lève sur le site.
export default function IntroLoader() {
  const finish = useIntroStore((s) => s.finish);
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced || root.classList.contains("intro-seen")) {
      // Déjà vu pendant cette visite : l'écran reste masqué par la classe CSS « intro-seen ».
      root.classList.add("intro-seen");
      finish();
      return;
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}

    root.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1700, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const exit = setTimeout(() => {
      setVisible(false);
      finish();
      root.style.overflow = "";
    }, 2150);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exit);
      root.style.overflow = "";
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="intro-overlay fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink text-white"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1, ease: EASE }}
          aria-hidden="true"
        >
          <div className="film-grain" />
          <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />

          <div className="relative flex flex-col items-center">
            {/* Le symbole du logo : barres de croissance + flèche */}
            <svg viewBox="0 0 120 90" className="mb-8 h-24 w-32 md:h-28 md:w-36" fill="none">
              {[
                { x: 14, h: 30, d: 0.1 },
                { x: 40, h: 46, d: 0.22 },
                { x: 66, h: 62, d: 0.34 },
              ].map((bar) => (
                <motion.rect
                  key={bar.x}
                  x={bar.x}
                  y={84 - bar.h}
                  width="18"
                  height={bar.h}
                  rx="3"
                  fill="url(#introBar)"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ transformOrigin: `${bar.x + 9}px 84px` }}
                  transition={{ duration: 0.7, delay: bar.d, ease: EASE }}
                />
              ))}
              <motion.path
                d="M4 70 L36 46 L56 58 L104 14"
                stroke="#ef4444"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              />
              <motion.path
                d="M88 12 L108 10 L106 30"
                stroke="#ef4444"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 1.2, ease: EASE }}
              />
              <defs>
                <linearGradient id="introBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4ade80" />
                  <stop offset="1" stopColor="#15803d" />
                </linearGradient>
              </defs>
            </svg>

            <div className="flex overflow-hidden text-[clamp(1.5rem,7.5vw,3.75rem)] font-black tracking-tight">
              {word.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, delay: 0.55 + i * 0.03, ease: EASE }}
                  className={`inline-block ${i === 3 ? "text-accent-light" : ""}`}
                >
                  {char === " " ? " " : char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
              className="display-italic mt-4 text-xl text-white/80 md:text-2xl"
            >
              La résurrection financière
            </motion.p>
          </div>

          <div className="absolute inset-x-6 bottom-8 flex items-end justify-between text-xs uppercase tracking-[0.3em] text-white/50 md:inset-x-12 md:bottom-12">
            <span>Canada · Afrique · Haïti</span>
            <span className="font-display text-4xl tracking-normal text-white tabular-nums md:text-6xl">{count}</span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-primary-light via-primary to-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.7, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
