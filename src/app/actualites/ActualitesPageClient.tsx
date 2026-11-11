"use client";

import { motion } from "framer-motion";
import PageHero from "@/components/immersive/PageHero";
import ParallaxImage from "@/components/immersive/ParallaxImage";
import { newsArticles, newsImages } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ActualitesPageClient() {
  return (
    <>
      <PageHero
        eyebrow="Actualités"
        title="Actualités"
        subtitle="Nos dernières nouvelles, articles et analyses"
        image="/images/photos/education-financiere-2025-632640.jpg"
        imageAlt="Actualités FINAB"
      />

      <section className="bg-cream py-28 md:py-36">
        <div className="mx-auto max-w-6xl space-y-24 px-6 md:space-y-32">
          {newsArticles.map((article, i) => {
            const reversed = i % 2 === 1;
            return (
              <article key={article.id} id={article.id} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-2 md:gap-16">
                <ParallaxImage
                  src={newsImages[article.id] || "/images/photos/actualite-finab-81824c.jpg"}
                  alt={article.title}
                  className={`aspect-[4/3] rounded-[2rem] shadow-[0_40px_90px_-40px_rgba(5,13,9,0.5)] ${reversed ? "md:order-2" : ""}`}
                />
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: EASE }}
                  className={reversed ? "md:order-1" : ""}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{article.category}</span>
                    <span className="text-sm text-muted">
                      {new Date(article.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-ink md:text-4xl">{article.title}</h2>
                  <p className="mt-5 text-lg leading-relaxed text-muted">{article.excerpt}</p>
                  <span className="mt-8 block h-px w-24 bg-gradient-to-r from-primary to-accent" />
                </motion.div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
