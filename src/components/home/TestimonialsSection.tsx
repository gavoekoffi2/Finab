"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/content";
import { StarIcon } from "@/components/ui/Icons";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Témoignages"
          title="Ce que disent nos clients"
          subtitle="La satisfaction de nos clients est notre plus grande fierté"
        />

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-surface rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-6 h-6 ${i < testimonials[active].rating ? "text-accent" : "text-gray-300"}`}
                    filled={i < testimonials[active].rating}
                  />
                ))}
              </div>
              <blockquote className="text-lg md:text-xl text-dark/80 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[active].text}&rdquo;
              </blockquote>
              <div>
                <p className="font-bold text-primary-dark text-lg">{testimonials[active].name}</p>
                <p className="text-muted text-sm">{testimonials[active].location}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === active ? "bg-accent w-10" : "bg-primary/20 hover:bg-primary/40"
                }`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
