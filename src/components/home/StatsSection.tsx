"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { stats, productsCanada, productsAfrica } from "@/data/content";

const services = [...productsCanada, ...productsAfrica].map((p) => p.title);

function MarqueeRow({ reverse = false, outline = false }: { reverse?: boolean; outline?: boolean }) {
  const items = [...services, ...services];
  return (
    <div className="flex overflow-hidden" aria-hidden="true">
      <div className={`marquee ${reverse ? "marquee-reverse" : ""}`} style={{ ["--marquee-duration" as string]: "60s" }}>
        {items.map((title, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span
              className={`px-6 text-5xl font-bold tracking-[-0.04em] md:text-7xl ${
                outline ? "text-outline" : "display-italic font-normal text-white/90"
              }`}
            >
              {title}
            </span>
            <span className={`text-3xl ${i % 2 ? "text-accent-light" : "text-primary-light"}`}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div className="film-grain" />
      <div className="breathe absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
      <div className="breathe absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow mb-14 justify-center text-primary-light"
        >
          FINAB en chiffres
        </motion.p>

        <div className="grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              className="px-4 py-6 text-center"
              valueClassName="text-gradient whitespace-nowrap font-display text-[2.6rem] font-semibold tracking-tight sm:text-6xl xl:text-7xl"
              labelClassName="mt-3 text-xs uppercase tracking-[0.25em] text-white/55 md:text-sm"
            />
          ))}
        </div>
      </div>

      <div className="relative mt-20 space-y-4 md:mt-28">
        <MarqueeRow />
        <MarqueeRow reverse outline />
      </div>
    </section>
  );
}
