"use client";

import { motion } from "framer-motion";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { newsArticles } from "@/data/content";

export default function ActualitesPageClient() {
  return (
    <>
      <section className="bg-gradient-to-br from-dark via-primary-dark to-primary py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Actualités
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Nos dernières nouvelles, articles et analyses
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            {newsArticles.map((article, i) => (
              <AnimatedCard key={article.id} delay={i * 0.1}>
                <div id={article.id} className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-6xl opacity-30">📰</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(article.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-dark mb-3">{article.title}</h2>
                    <p className="text-muted leading-relaxed">{article.excerpt}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
