"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  label: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
  definitionList?: boolean;
}

function formatCounterValue(value: number, suffix: string) {
  const formatted = value >= 1000
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : String(value);
  return `${formatted}${suffix}`;
}

export default function AnimatedCounter({
  value,
  label,
  className = "",
  valueClassName = "",
  labelClassName = "",
  definitionList = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0 });
  const numericMatch = value.match(/^([\d,]+)/);
  const target = numericMatch ? parseInt(numericMatch[1].replace(/,/g, ""), 10) : null;
  const suffix = numericMatch ? value.slice(numericMatch[0].length) : "";
  const finalValue = target === null ? value : formatCounterValue(target, suffix);
  const [displayValue, setDisplayValue] = useState(() => finalValue);

  useEffect(() => {
    if (!isInView || target === null) return;

    const animationTarget = target;
    setDisplayValue(formatCounterValue(0, suffix));
    const duration = 2000;
    const startTime = performance.now();
    let rafId: number;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * animationTarget);
      setDisplayValue(formatCounterValue(current, suffix));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, suffix, target]);

  if (definitionList) {
    return (
      <motion.div
        ref={ref}
        initial={false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <dt className="sr-only">{label}</dt>
        <dd className={valueClassName}>{displayValue}</dd>
        <dd className={labelClassName}>{label}</dd>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={false}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className={valueClassName}>{displayValue}</div>
      <div className={labelClassName}>{label}</div>
    </motion.div>
  );
}
