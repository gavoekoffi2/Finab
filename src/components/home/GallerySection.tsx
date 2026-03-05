"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const galleryItems = [
  {
    id: 1,
    title: "Accompagnement financier",
    category: "Canada",
    gradient: "from-primary to-primary-light",
    icon: "📊",
  },
  {
    id: 2,
    title: "Séminaire éducation financière",
    category: "Formation",
    gradient: "from-accent-dark to-accent",
    icon: "🎓",
  },
  {
    id: 3,
    title: "Équipe FINAB",
    category: "Équipe",
    gradient: "from-primary-dark to-primary",
    icon: "👥",
  },
  {
    id: 4,
    title: "Services d'assurance en Afrique",
    category: "Afrique",
    gradient: "from-accent to-accent-light",
    icon: "🌍",
  },
  {
    id: 5,
    title: "Accompagnement fiscal",
    category: "Canada",
    gradient: "from-primary-light to-primary",
    icon: "📋",
  },
  {
    id: 6,
    title: "Partenariats internationaux",
    category: "Global",
    gradient: "from-primary to-accent-dark",
    icon: "🤝",
  },
];

const categories = ["Tous", "Canada", "Afrique", "Formation", "Équipe", "Global"];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filtered =
    activeFilter === "Tous"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-accent/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

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
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-surface text-muted hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setSelectedItem(item.id)}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] ${
                  i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-square" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-500 group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/5 blur-lg" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <span className={`${i === 0 ? "text-6xl md:text-8xl" : "text-4xl md:text-5xl"} mb-3 opacity-40 group-hover:opacity-60 transition-opacity duration-300 group-hover:scale-110 transform`}>
                    {item.icon}
                  </span>
                  <h3 className={`font-bold text-center ${i === 0 ? "text-lg md:text-2xl" : "text-sm md:text-base"} opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}>
                    {item.title}
                  </h3>
                  <span className="text-xs text-white/70 mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const item = galleryItems.find((g) => g.id === selectedItem);
                  if (!item) return null;
                  return (
                    <>
                      <div className={`h-64 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                        <span className="text-8xl opacity-50">{item.icon}</span>
                      </div>
                      <div className="p-8">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent-dark">
                          {item.category}
                        </span>
                        <h3 className="text-2xl font-bold text-primary-dark mt-3 mb-2">{item.title}</h3>
                        <p className="text-muted text-sm">
                          FINAB la solution - Nos activités et engagements au service de la communauté.
                        </p>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer"
                        >
                          Fermer
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
