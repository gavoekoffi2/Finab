"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ParallaxImage from "@/components/immersive/ParallaxImage";
import Button from "@/components/ui/Button";
import { quizQuestions } from "@/data/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const letters = ["A", "B", "C", "D"];

export default function QuizSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    const [location, need] = answers;
    if (location === "canada" && need === "finance") return { service: "Éducation financière & Impôts", link: "/produits#education-financiere" };
    if (need === "assurance") return { service: "Assurance Vie & Santé", link: "/produits#assurance-vie" };
    if (need === "emploi") return { service: "Formation & Recrutement", link: "/produits#formation-recrutement" };
    if (need === "epargne") return { service: "Épargne & Investissement", link: "/produits#epargne-investissement" };
    return { service: "Accompagnement personnalisé", link: "/services" };
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <section className="relative overflow-hidden bg-cream py-28 md:py-36">
      <div className="absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[140px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            badge="Quiz Express"
            title="Quel service vous convient ?"
            subtitle="En 30 secondes, découvrez la solution FINAB idéale pour vous"
            center={false}
            highlight={["convient"]}
          />
          <ParallaxImage
            src="/images/photos/pourquoi-choisir-finab-193088.jpg"
            alt="Trouver la solution FINAB adaptée"
            className="hidden aspect-[16/10] rounded-[2rem] lg:block"
          />
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-2xl" />
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 60, rotateY: -12 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -60, rotateY: 12 }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ transformPerspective: 1200 }}
                className="relative rounded-[2rem] bg-white p-8 shadow-[0_40px_100px_-40px_rgba(5,13,9,0.4)] ring-1 ring-black/5 md:p-12"
              >
                <div className="mb-10 flex gap-2">
                  {quizQuestions.map((_, i) => (
                    <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary-light"
                        initial={{ width: i < step ? "100%" : "0%" }}
                        animate={{ width: i <= step ? "100%" : "0%" }}
                        transition={{ duration: 0.8, ease: EASE }}
                      />
                    </div>
                  ))}
                </div>

                <p className="eyebrow mb-3 text-muted">
                  Question {step + 1}/{quizQuestions.length}
                </p>
                <h3 className="mb-10 text-2xl font-bold tracking-[-0.02em] text-ink md:text-3xl">
                  {quizQuestions[step].question}
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {quizQuestions[step].options.map((opt, i) => (
                    <motion.button
                      key={opt.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(opt.value)}
                      className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-black/10 bg-cream p-4 text-left font-medium text-ink transition-colors duration-500 hover:border-primary hover:text-white"
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-primary to-primary-light transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                      <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-primary shadow-sm">
                        {letters[i]}
                      </span>
                      <span className="relative">{opt.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 text-center text-white shadow-[0_40px_100px_-30px_rgba(22,163,74,0.7)] md:p-12"
              >
                <div className="film-grain" />
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/3 h-2 w-2 rounded-full"
                    style={{ backgroundColor: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#ffffff" : "#bbf7d0" }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos((i / 14) * Math.PI * 2) * 220,
                      y: Math.sin((i / 14) * Math.PI * 2) * 160,
                      opacity: 0,
                    }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                ))}
                <div className="relative">
                  <div className="mb-6 text-6xl">🎯</div>
                  <h3 className="mb-4 text-2xl font-bold">Notre recommandation pour vous</h3>
                  <div className="mb-8 rounded-2xl bg-white/15 p-6 backdrop-blur">
                    <p className="display-italic text-3xl">{getRecommendation().service}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button href={getRecommendation().link} variant="accent">
                      Découvrir ce service
                    </Button>
                    <Button onClick={reset} variant="ghost" className="text-white hover:bg-white/15">
                      Refaire le quiz
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
