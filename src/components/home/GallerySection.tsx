"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const galleryItems = [
  { id: 1, src: "/images/generated/seminaire-de-formation-e44ee2.jpg", title: "Séminaire de formation", category: "Formation" },
  { id: 2, src: "/images/generated/seminaire-de-formation-34a0fc.jpg", title: "Accompagnement client", category: "Services" },
  { id: 3, src: "/images/generated/seminaire-de-formation-3a57ae.jpg", title: "Développement financier", category: "Services" },
  { id: 4, src: "/images/generated/seminaire-de-formation-f4c654.jpg", title: "Travail d'équipe FINAB", category: "Équipe" },
  { id: 5, src: "/images/generated/seminaire-de-formation-ee76c6.jpg", title: "Rencontres partenaires", category: "Partenaires" },
  { id: 6, src: "/images/generated/seminaire-de-formation-c8d126.jpg", title: "Atelier de formation", category: "Formation" },
  { id: 7, src: "/images/generated/seminaire-de-formation-516e22.jpg", title: "Événement communautaire", category: "Communauté" },
  { id: 8, src: "/images/generated/seminaire-de-formation-e40b99.jpg", title: "Réunion stratégique", category: "Équipe" },
  { id: 9, src: "/images/generated/seminaire-de-formation-d08bc2.jpg", title: "Workshop pratique", category: "Formation" },
  { id: 10, src: "/images/generated/accompagnement-client-c2b2cd.jpg", title: "Impact communautaire", category: "Communauté" },
  { id: 11, src: "/images/generated/developpement-financier-910702.jpg", title: "Histoires de succès", category: "Services" },
  { id: 12, src: "/images/generated/travail-d-equipe-finab-4e8605.jpg", title: "Conférence FINAB", category: "Partenaires" },
];

const categories = ["Tous", "Formation", "Services", "Équipe", "Partenaires", "Communauté"];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filtered =
    activeFilter === "Tous"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const selectedImage = galleryItems.find((g) => g.id === selectedItem);

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Galerie"
          title="FINAB en images"
          subtitle="Découvrez nos activités, événements et moments forts"
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeFilter === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white text-muted hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                onClick={() => setSelectedItem(item.id)}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${
                  i === 0 || i === 5 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className={`relative ${(i === 0 || i === 5) ? "aspect-square" : "aspect-[4/3]"}`}>
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={75}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/90 text-white">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <h3 className="font-bold text-white text-sm md:text-base">{item.title}</h3>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white mb-2 inline-block">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedImage.title}</h3>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                ✕
              </button>

              {/* Nav buttons in lightbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = galleryItems.findIndex((g) => g.id === selectedItem);
                  const prevIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
                  setSelectedItem(galleryItems[prevIdx].id);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl hover:bg-white/20 cursor-pointer"
                aria-label="Précédent"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = galleryItems.findIndex((g) => g.id === selectedItem);
                  const nextIdx = (currentIdx + 1) % galleryItems.length;
                  setSelectedItem(galleryItems[nextIdx].id);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl hover:bg-white/20 cursor-pointer"
                aria-label="Suivant"
              >
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
