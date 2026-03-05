"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { stats } from "@/data/content";

export default function StatsSection() {
  return (
    <section className="py-20 bg-dark relative overflow-hidden noise">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 animate-shimmer" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-primary-light font-semibold text-sm tracking-widest uppercase mb-12"
        >
          FINAB en chiffres
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              className="text-center"
              valueClassName="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-2"
              labelClassName="text-white/60 text-sm md:text-base"
            />
          ))}
        </div>

        {/* Divider accents */}
        <div className="flex justify-center mt-12 gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`h-1 rounded-full ${i === 1 ? "w-12 bg-primary-light" : "w-6 bg-white/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
