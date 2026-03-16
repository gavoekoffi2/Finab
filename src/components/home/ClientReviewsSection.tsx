"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <svg
            className={`w-6 h-6 transition-all duration-150 ${
              star <= (hovered || value)
                ? "text-yellow-400 scale-110"
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const colors = [
    "from-red-500 to-red-700",
    "from-green-500 to-green-700",
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-orange-500 to-orange-700",
    "from-teal-500 to-teal-700",
  ];
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
    >
      {/* Accent décoratif */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Guillemet décoratif */}
      <div className="absolute top-4 right-4 text-5xl text-primary/10 font-serif leading-none select-none">
        &ldquo;
      </div>

      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {initials}
        </div>
        <div>
          <p className="font-bold text-dark text-sm">{review.name}</p>
          {review.location && (
            <p className="text-muted text-xs">{review.location}</p>
          )}
        </div>
      </div>

      {/* Étoiles */}
      <StarRating value={review.rating} readonly />

      {/* Texte */}
      <p className="text-dark/75 text-sm leading-relaxed italic flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Date */}
      <p className="text-muted text-xs">
        {new Date(review.date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </motion.div>
  );
}

export default function ClientReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [visibleStart, setVisibleStart] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 0,
    text: "",
  });

  // Charger les avis
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-scroll du carousel
  const VISIBLE = 3;
  useEffect(() => {
    if (reviews.length <= VISIBLE) return;
    autoScrollRef.current = setInterval(() => {
      setVisibleStart((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [reviews.length]);

  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    const result = [];
    for (let i = 0; i < Math.min(VISIBLE, reviews.length); i++) {
      result.push(reviews[(visibleStart + i) % reviews.length]);
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Veuillez entrer votre nom.");
    if (form.rating === 0) return setError("Veuillez choisir une note.");
    if (form.text.trim().length < 10)
      return setError("Votre avis doit contenir au moins 10 caractères.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => [...prev, data.review]);
        setSubmitted(true);
        setForm({ name: "", location: "", rating: 0, text: "" });
        setTimeout(() => {
          setSubmitted(false);
          setShowForm(false);
        }, 3000);
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Impossible de soumettre votre avis. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Avis clients
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Ce que pensent nos clients
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Des témoignages authentiques de personnes qui nous ont fait confiance
            au Canada, en Afrique et en Haïti.
          </p>

          {/* Stats globales */}
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 mt-6 bg-primary/5 border border-primary/15 rounded-2xl px-6 py-3"
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-dark text-lg">{avgRating}</span>
              <span className="text-muted text-sm">
                · {reviews.length} avis vérifiés
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Carousel d'avis */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-muted py-12">
            Soyez le premier à laisser un avis !
          </p>
        ) : (
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getVisibleReviews().map((review, i) => (
                  <ReviewCard key={review.id + visibleStart} review={review} index={i} />
                ))}
              </div>
            </AnimatePresence>

            {/* Indicateurs de pagination */}
            {reviews.length > VISIBLE && (
              <div className="flex justify-center gap-2 mt-8">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setVisibleStart(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === visibleStart
                        ? "w-8 h-2.5 bg-primary"
                        : "w-2.5 h-2.5 bg-primary/25 hover:bg-primary/50"
                    }`}
                    aria-label={`Voir avis ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bouton / Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 text-center"
        >
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-2xl hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Laisser mon avis
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-left"
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Merci pour votre avis !</h3>
                    <p className="text-muted">Votre témoignage a été publié avec succès.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-dark">Partagez votre expérience</h3>
                      <button
                        onClick={() => setShowForm(false)}
                        className="text-muted hover:text-dark transition-colors"
                        aria-label="Fermer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-1.5">
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Votre prénom et nom"
                            maxLength={60}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-1.5">
                            Ville / Pays
                          </label>
                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            placeholder="Ex: Abidjan, Côte d'Ivoire"
                            maxLength={60}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                          Note <span className="text-red-500">*</span>
                        </label>
                        <StarRating
                          value={form.rating}
                          onChange={(v) => setForm({ ...form, rating: v })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                          Votre avis <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={form.text}
                          onChange={(e) => setForm({ ...form, text: e.target.value })}
                          placeholder="Partagez votre expérience avec FINAB la solution..."
                          rows={4}
                          maxLength={500}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                        />
                        <p className="text-xs text-muted mt-1 text-right">
                          {form.text.length}/500
                        </p>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5"
                        >
                          {error}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Publication en cours...
                          </>
                        ) : (
                          "Publier mon avis"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}
