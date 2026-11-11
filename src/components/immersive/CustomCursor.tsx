"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Curseur personnalisé (ordinateur uniquement) : un point + un anneau qui réagit aux liens et aux images.
export default function CustomCursor() {
  const enabled = useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");
  const [hidden, setHidden] = useState(true);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, [role='button'], input, select, textarea, label");
      setLabel(labelled?.dataset.cursor ?? "");
      setHovering(Boolean(labelled || interactive));
    };
    const leave = () => setHidden(true);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 84 : hovering ? 54 : 34;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] hidden md:block" aria-hidden="true">
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: hidden ? 0 : 1,
          scale: pressed ? 0.85 : 1,
          backgroundColor: label ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
          borderColor: "rgba(255,255,255,0.85)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-black">{label}</span>
        )}
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-primary-light"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden || label ? 0 : 1 }}
      />
    </div>
  );
}
