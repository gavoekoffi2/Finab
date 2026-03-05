"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  label: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export default function AnimatedCounter({
  value,
  label,
  className = "",
  valueClassName = "",
  labelClassName = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericMatch = value.match(/^([\d,]+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const target = parseInt(numericMatch[1].replace(/,/g, ""), 10);
    const suffix = value.slice(numericMatch[0].length);
    const duration = 2000;
    const startTime = performance.now();
    let rafId: number;

    function formatNum(n: number) {
      if (n >= 1000) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + suffix;
      }
      return n + suffix;
    }

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setDisplayValue(formatNum(current));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Ensure final value is exact
        setDisplayValue(formatNum(target));
      }
    }

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className={valueClassName}>{displayValue}</div>
      <div className={labelClassName}>{label}</div>
    </motion.div>
  );
}
