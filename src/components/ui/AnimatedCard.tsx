"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

// Carte qui apparaît en douceur et s'incline en 3D sous la souris.
export default function AnimatedCard({ children, delay = 0, className = "", hover = true }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const glow = useTransform(
    [mx, my],
    ([x, y]: number[]) => `radial-gradient(500px circle at ${x * 100}% ${y * 100}%, rgba(34,197,94,0.12), transparent 45%)`
  );

  const onMove = (e: React.PointerEvent) => {
    if (!hover || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={hover ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={`group relative h-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-30px_rgba(5,13,9,0.35)] ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-[0_40px_80px_-30px_rgba(22,163,74,0.45)] ${className}`}
      >
        {hover && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glow }}
          />
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}
