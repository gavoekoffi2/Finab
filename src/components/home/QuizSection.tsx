"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { quizQuestions } from "@/data/content";

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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Quiz Express"
          title="Quel service vous convient ?"
          subtitle="En 30 secondes, découvrez la solution FINAB idéale pour vous"
        />

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-surface rounded-3xl p-8 md:p-12"
              >
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                  {quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= step ? "bg-accent" : "bg-primary/10"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted mb-2">Question {step + 1}/{quizQuestions.length}</p>
                <h3 className="text-xl md:text-2xl font-bold text-primary-dark mb-8">
                  {quizQuestions[step].question}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {quizQuestions[step].options.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(opt.value)}
                      className="p-4 rounded-xl bg-white border-2 border-transparent hover:border-accent text-left font-medium text-primary-dark shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-primary to-primary-light rounded-3xl p-8 md:p-12 text-center text-white"
              >
                <div className="text-5xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Notre recommandation pour vous</h3>
                <div className="bg-white/10 rounded-2xl p-6 mb-8">
                  <p className="text-xl font-bold text-accent">{getRecommendation().service}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button href={getRecommendation().link} variant="accent">
                    Découvrir ce service
                  </Button>
                  <Button onClick={reset} variant="ghost" className="text-white hover:bg-white/10">
                    Refaire le quiz
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
