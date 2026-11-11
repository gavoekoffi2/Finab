"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplitText from "@/components/immersive/SplitText";

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
    "from-emerald-500 to-emerald-700",
    "from-orange-500 to-orange-700",
    "from-teal-500 to-teal-700",
  ];
  const color = colors[index % colors.length];

  return (
    <article className="group relative flex w-[320px] flex-shrink-0 flex-col gap-4 overflow-hidden rounded-3xl bg-white p-7 shadow-[0_20px_60px_-30px_rgba(5,13,9,0.35)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(22,163,74,0.45)] md:w-[380px]">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-700 group-hover:scale-x-100" />
      <div className="absolute right-6 top-2 select-none font-display text-7xl leading-none text-primary/10">&ldquo;</div>

      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-white`}>
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-ink">{review.name}</p>
          {review.location && <p className="text-xs text-muted">{review.location}</p>}
        </div>
      </div>

      <StarRating value={review.rating} readonly />

      <p className="flex-1 text-sm leading-relaxed text-ink/75">&ldquo;{review.text}&rdquo;</p>

      <p className="text-xs text-muted">
        {new Date(review.date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </article>
  );
}

function ReviewsMarquee({ reviews, reverse = false }: { reviews: Review[]; reverse?: boolean }) {
  const items = [...reviews, ...reviews];
  return (
    <div className="marquee-pause flex overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
      <div
        className={`marquee gap-6 pr-6 ${reverse ? "marquee-reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: `${Math.max(30, reviews.length * 9)}s` }}
      >
        {items.map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} index={i % reviews.length} />
        ))}
      </div>
    </div>
  );
}

export default function ClientReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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
    <section className="relative overflow-hidden bg-cream py-28 md:py-36">
      <div className="pointer-events-none absolute right-10 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        {/* En-tête de section */}
        <div className="mx-auto mb-14 max-w-7xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow mb-6 justify-center text-primary"
          >
            Avis clients
          </motion.span>
          <SplitText
            text="Ce que pensent nos clients"
            highlight={["clients"]}
            className="text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-ink md:text-5xl lg:text-6xl"
          />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
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
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-sm ring-1 ring-black/5"
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
              <span className="font-display text-xl font-semibold text-ink">{avgRating}</span>
              <span className="text-sm text-muted">· {reviews.length} avis vérifiés</span>
            </motion.div>
          )}
        </div>

        {/* Bandeaux d'avis */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="py-12 text-center text-muted">Soyez le premier à laisser un avis !</p>
        ) : reviews.length <= 3 ? (
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6 px-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <ReviewCard review={review} index={i} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <ReviewsMarquee reviews={reviews} />
            <ReviewsMarquee reviews={[...reviews].reverse()} reverse />
          </motion.div>
        )}

        <div className="mx-auto max-w-7xl px-6">
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
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-semibold text-white shadow-lg transition-all duration-500 hover:-translate-y-0.5 hover:bg-primary hover:shadow-primary/30"
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
                className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-left shadow-2xl ring-1 ring-black/5"
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
      </div>
    </section>
  );
}
