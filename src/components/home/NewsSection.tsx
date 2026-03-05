"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { newsArticles } from "@/data/content";
import { ArrowRightIcon } from "@/components/ui/Icons";

export default function NewsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Actualités"
          title="Dernières nouvelles"
          subtitle="Restez informé de nos dernières activités et développements"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newsArticles.map((article, i) => (
            <AnimatedCard key={article.id} delay={i * 0.1}>
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-6xl opacity-30">📰</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent-dark">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted">{new Date(article.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <h3 className="font-bold text-primary-dark mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-muted line-clamp-3 mb-4">{article.excerpt}</p>
                <Button href={`/actualites#${article.id}`} variant="ghost" size="sm" className="text-xs">
                  Lire la suite <ArrowRightIcon className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/actualites" variant="outline">
            Toutes les actualités
          </Button>
        </div>
      </div>
    </section>
  );
}
