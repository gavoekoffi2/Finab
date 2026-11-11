"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/immersive/Reveal";
import Button from "@/components/ui/Button";
import { newsArticles, newsImages } from "@/data/content";
import { ArrowRightIcon } from "@/components/ui/Icons";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsSection() {
  const [featured, ...others] = newsArticles;

  return (
    <section className="relative bg-surface py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            badge="Actualités"
            title="Dernières nouvelles"
            subtitle="Restez informé de nos dernières activités et développements"
            center={false}
            highlight={["nouvelles"]}
          />
          <div className="mb-14 md:mb-20">
            <Button href="/actualites" variant="outline">
              Toutes les actualités
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <Link href={`/actualites#${featured.id}`} className="group block" data-cursor="Lire">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image
                  src={newsImages[featured.id] || "/images/photos/actualite-finab-81824c.jpg"}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="absolute left-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{featured.category}</span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{formatDate(featured.date)}</p>
                  <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] md:text-4xl">{featured.title}</h3>
                  <p className="mt-3 line-clamp-2 max-w-xl text-white/75">{featured.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-light">
                    Lire la suite <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col divide-y divide-black/10 lg:col-span-5">
            {others.map((article, i) => (
              <Reveal key={article.id} delay={0.1 + i * 0.1}>
                <Link href={`/actualites#${article.id}`} className="group flex gap-5 py-6 first:pt-0">
                  <div className="relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-2xl md:h-28 md:w-36">
                    <Image
                      src={newsImages[article.id] || "/images/photos/actualite-finab-81824c.jpg"}
                      alt={article.title}
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-3 text-xs">
                      <span className="font-semibold uppercase tracking-[0.15em] text-primary">{article.category}</span>
                      <span className="text-muted">{formatDate(article.date)}</span>
                    </div>
                    <h3 className="line-clamp-2 font-bold text-ink transition-colors group-hover:text-primary md:text-lg">{article.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Lire la suite <ArrowRightIcon className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
