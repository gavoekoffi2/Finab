"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${center ? "text-center" : ""}`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase bg-accent/15 text-accent-dark mb-4">
          {badge}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${light ? "text-white" : "text-primary-dark"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${center ? "mx-auto" : ""} ${light ? "text-white/70" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-6 h-1 w-20 rounded-full bg-accent ${center ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
