"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/content";
import { StarIcon } from "@/components/ui/Icons";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const nextTestimonial = useCallback(() => {
    setActive((p) => (p + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[200px] font-serif text-primary/[0.03] leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Témoignages"
          title="Ce que disent nos clients"
          subtitle="La satisfaction de nos clients est notre plus grande fierté"
        />

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-surface rounded-3xl p-8 md:p-12 text-center relative"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-serif">
                &ldquo;
              </div>

              <div className="flex justify-center gap-1 mb-6 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <StarIcon
                      className={`w-6 h-6 ${i < testimonials[active].rating ? "text-primary" : "text-gray-300"}`}
                      filled={i < testimonials[active].rating}
                    />
                  </motion.div>
                ))}
              </div>

              <blockquote className="text-lg md:text-xl text-dark/80 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[active].text}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[active].name[0]}
                </div>
                <div className="text-left">
                  <p className="font-bold text-dark">{testimonials[active].name}</p>
                  <p className="text-muted text-sm">{testimonials[active].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative transition-all duration-300 cursor-pointer ${
                  i === active ? "w-10 h-3" : "w-3 h-3"
                }`}
                aria-label={`Témoignage de ${t.name}`}
              >
                <span
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    i === active ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
