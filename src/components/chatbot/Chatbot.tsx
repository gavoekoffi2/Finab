"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chatbotFAQ, siteConfig } from "@/data/content";
import { SendIcon, XIcon, WhatsAppIcon } from "@/components/ui/Icons";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  timestamp: Date;
}

const WELCOME_MSG =
  "Bonjour ! 👋 Je suis l'assistant FINAB. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser une question ou choisir parmi les suggestions ci-dessous.";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: WELCOME_MSG, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", service: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: "bot" | "user", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role, text, timestamp: new Date() },
    ]);
  };

  const findAnswer = (question: string): string => {
    const lower = question.toLowerCase();
    for (const faq of chatbotFAQ) {
      const keywords = faq.question.toLowerCase().split(" ").filter((w) => w.length > 3);
      const matches = keywords.filter((k) => lower.includes(k));
      if (matches.length >= 2) return faq.answer;
    }
    if (lower.includes("canada")) return chatbotFAQ[0].answer;
    if (lower.includes("afrique") || lower.includes("haiti") || lower.includes("haïti")) return chatbotFAQ[1].answer;
    if (lower.includes("impôt") || lower.includes("impot") || lower.includes("déclaration")) return chatbotFAQ[2].answer;
    if (lower.includes("contact") || lower.includes("conseiller") || lower.includes("joindre")) return chatbotFAQ[3].answer;
    if (lower.includes("fondateur") || lower.includes("ceo") || lower.includes("akpobi")) return chatbotFAQ[4].answer;
    if (lower.includes("réclamation") || lower.includes("reclamation") || lower.includes("plainte")) return chatbotFAQ[5].answer;
    return "Merci pour votre question ! Pour un accompagnement plus précis, je vous invite à laisser vos coordonnées ou à contacter directement un conseiller FINAB. Souhaitez-vous remplir le formulaire de contact ?";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage("user", input.trim());
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage("bot", findAnswer(input));
    }, 1000);
  };

  const handleQuickQuestion = (q: string) => {
    addMessage("user", q);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const faq = chatbotFAQ.find((f) => f.question === q);
      addMessage("bot", faq?.answer || findAnswer(q));
    }, 800);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage(
      "bot",
      `Merci ${leadData.name} ! Vos informations ont bien été enregistrées. Un conseiller FINAB vous contactera très rapidement. 📞`
    );
    setShowLeadForm(false);
    setLeadData({ name: "", email: "", phone: "", service: "" });
  };

  return (
    <>
      {/* Launcher Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center group cursor-pointer md:bottom-6"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
        aria-label="Ouvrir le chat"
      >
        {/* African avatar */}
        <div className="relative">
          <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
            {/* Face */}
            <circle cx="20" cy="16" r="10" fill="#8B6914" />
            {/* Hair */}
            <path d="M10 14c0-6 4-10 10-10s10 4 10 10c0 0-3-5-10-5s-10 5-10 5z" fill="#2C1810" />
            {/* Eyes */}
            <circle cx="16" cy="15" r="1.5" fill="white" />
            <circle cx="24" cy="15" r="1.5" fill="white" />
            <circle cx="16.5" cy="15" r="0.8" fill="#2C1810" />
            <circle cx="24.5" cy="15" r="0.8" fill="#2C1810" />
            {/* Smile */}
            <path d="M16 20c0 0 2 3 4 3s4-3 4-3" stroke="#2C1810" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Body */}
            <path d="M12 26c0 0 2-2 8-2s8 2 8 2v8c0 2-2 4-4 4h-8c-2 0-4-2-4-4v-8z" fill="#D4A843" />
          </svg>
          {!isOpen && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            />
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[520px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                  <circle cx="20" cy="16" r="10" fill="#8B6914" />
                  <path d="M10 14c0-6 4-10 10-10s10 4 10 10c0 0-3-5-10-5s-10 5-10 5z" fill="#2C1810" />
                  <circle cx="16" cy="15" r="1.5" fill="white" />
                  <circle cx="24" cy="15" r="1.5" fill="white" />
                  <circle cx="16.5" cy="15" r="0.8" fill="#2C1810" />
                  <circle cx="24.5" cy="15" r="0.8" fill="#2C1810" />
                  <path d="M16 20c0 0 2 3 4 3s4-3 4-3" stroke="#2C1810" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Assistant FINAB</p>
                <p className="text-white/60 text-xs">En ligne • Français</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Fermer le chat"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-surface text-dark rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* Quick suggestions (only show initially) */}
              {messages.length <= 2 && !isTyping && (
                <div className="space-y-2">
                  <p className="text-xs text-muted">Questions fréquentes :</p>
                  {chatbotFAQ.slice(0, 4).map((faq) => (
                    <button
                      key={faq.question}
                      onClick={() => handleQuickQuestion(faq.question)}
                      className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-accent/10 text-primary-dark hover:bg-accent/20 transition-colors cursor-pointer"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              )}

              {/* Lead form */}
              {showLeadForm && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleLeadSubmit}
                  className="bg-surface rounded-xl p-4 space-y-3"
                >
                  <p className="text-xs font-semibold text-primary-dark">Laissez vos coordonnées :</p>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    required
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                  <select
                    value={leadData.service}
                    onChange={(e) => setLeadData({ ...leadData, service: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  >
                    <option value="">Service souhaité</option>
                    <option>Éducation financière</option>
                    <option>Déclarations d&apos;impôts</option>
                    <option>Formation & Recrutement</option>
                    <option>Assurance</option>
                    <option>Épargne & Investissement</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-accent text-primary-dark font-semibold text-sm hover:bg-accent-light transition-colors"
                  >
                    Envoyer
                  </button>
                </motion.form>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Actions */}
            <div className="border-t px-3 py-2 flex gap-2">
              <button
                onClick={() => setShowLeadForm(!showLeadForm)}
                className="text-xs px-3 py-1.5 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                📋 Laisser mes infos
              </button>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white hover:bg-accent-light transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
