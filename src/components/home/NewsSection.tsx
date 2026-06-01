"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { newsArticles } from "@/data/content";
import { ArrowRightIcon } from "@/components/ui/Icons";

const newsImages: Record<string, string> = {
  "education-financiere-2025": "/images/photos/actualite-finab-81824c.jpg",
  "partenariat-afrique": "/images/photos/actualite-finab-40ddef.jpg",
  "impots-canada-guide": "/images/photos/actualite-finab-9226e1.jpg",
  "recrutement-international": "/images/photos/actualite-finab-c8c2a4.jpg",
};

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
              <div className="relative h-48 overflow-hidden group">
                <Image
                  src={newsImages[article.id] || "/images/photos/actualite-finab-81824c.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-white backdrop-blur-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted">{new Date(article.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <h3 className="font-bold text-dark mb-2 line-clamp-2">{article.title}</h3>
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
