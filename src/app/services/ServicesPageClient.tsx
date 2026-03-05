"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Button from "@/components/ui/Button";
import { productsCanada, productsAfrica, siteConfig } from "@/data/content";
import { ArrowRightIcon, WhatsAppIcon, SendIcon } from "@/components/ui/Icons";

type Tab = "catalog" | "request" | "tracking" | "messages";

interface Ticket {
  id: string;
  service: string;
  status: "received" | "in_progress" | "answered" | "closed";
  date: string;
  lastMessage: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  time: string;
}

// Demo data
const demoTickets: Ticket[] = [
  {
    id: "TK-2025-001",
    service: "Déclaration d'impôts",
    status: "in_progress",
    date: "2025-03-10",
    lastMessage: "Votre dossier est en cours de traitement par notre équipe fiscale.",
  },
  {
    id: "TK-2025-002",
    service: "Assurance Santé",
    status: "answered",
    date: "2025-03-05",
    lastMessage: "Nous avons préparé votre devis. Veuillez le consulter ci-joint.",
  },
];

const demoMessages: ChatMessage[] = [
  { id: "1", role: "agent", text: "Bonjour ! Bienvenue dans l'espace d'échanges FINAB. Comment puis-je vous aider ?", time: "09:00" },
  { id: "2", role: "user", text: "Bonjour, je souhaiterais des informations sur l'éducation financière.", time: "09:02" },
  { id: "3", role: "agent", text: "Bien sûr ! Notre programme d'éducation financière couvre la gestion budgétaire, l'investissement et la planification de la retraite. Souhaitez-vous prendre rendez-vous ?", time: "09:05" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  received: { label: "Reçu", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "En cours", color: "bg-yellow-100 text-yellow-700" },
  answered: { label: "Répondu", color: "bg-green-100 text-green-700" },
  closed: { label: "Clos", color: "bg-gray-100 text-gray-600" },
};

export default function ServicesPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const [selectedRegion, setSelectedRegion] = useState<"canada" | "africa">("canada");
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    description: "",
  });
  const [requestFiles, setRequestFiles] = useState<FileList | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [tickets] = useState<Ticket[]>(demoTickets);
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages);
  const [newMessage, setNewMessage] = useState("");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "catalog", label: "Catalogue", icon: "📋" },
    { id: "request", label: "Demander un service", icon: "📝" },
    { id: "tracking", label: "Suivi", icon: "📊" },
    { id: "messages", label: "Échanges", icon: "💬" },
  ];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Service request:", requestForm, requestFiles);
    setRequestSubmitted(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        role: "user",
        text: newMessage,
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setNewMessage("");
    // Simulate agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "agent",
          text: "Merci pour votre message. Un conseiller FINAB vous répondra sous peu. En attendant, n'hésitez pas à consulter notre catalogue de services.",
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 2000);
  };

  const currentProducts = selectedRegion === "canada" ? productsCanada : productsAfrica;

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark via-primary-dark to-primary py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Services & Espace Client
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Consultez nos services, faites une demande, suivez vos dossiers et échangez avec notre équipe
          </motion.p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-surface text-muted hover:bg-primary/5"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-surface min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {/* CATALOG TAB */}
            {activeTab === "catalog" && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Region toggle */}
                <div className="flex justify-center gap-4 mb-12">
                  <button
                    onClick={() => setSelectedRegion("canada")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                      selectedRegion === "canada"
                        ? "bg-primary text-white shadow-lg"
                        : "bg-white text-muted hover:bg-primary/5"
                    }`}
                  >
                    🍁 Canada
                  </button>
                  <button
                    onClick={() => setSelectedRegion("africa")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                      selectedRegion === "africa"
                        ? "bg-primary text-white shadow-lg"
                        : "bg-white text-muted hover:bg-primary/5"
                    }`}
                  >
                    🌍 Afrique & Haïti
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProducts.map((product, i) => (
                    <AnimatedCard key={product.id} delay={i * 0.08}>
                      <div className="p-8">
                        <h3 className="text-xl font-bold text-dark mb-3">{product.title}</h3>
                        <p className="text-muted leading-relaxed mb-4">{product.description}</p>
                        <ul className="space-y-2 mb-6">
                          {product.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-muted">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => {
                              setRequestForm({ ...requestForm, service: product.title });
                              setActiveTab("request");
                            }}
                            variant="primary"
                            size="sm"
                          >
                            Demander ce service
                          </Button>
                          <Button href={siteConfig.whatsapp} external variant="ghost" size="sm">
                            Parler à un conseiller
                          </Button>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REQUEST TAB */}
            {activeTab === "request" && (
              <motion.div
                key="request"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto"
              >
                {requestSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-dark mb-2">Demande envoyée !</h3>
                    <p className="text-muted mb-2">Votre ticket de service a été créé avec succès.</p>
                    <p className="text-muted mb-6">Suivez son évolution dans l&apos;onglet &quot;Suivi&quot;.</p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => setActiveTab("tracking")} variant="primary">
                        Voir le suivi
                      </Button>
                      <Button
                        onClick={() => {
                          setRequestSubmitted(false);
                          setRequestForm({ name: "", email: "", phone: "", service: "", description: "" });
                        }}
                        variant="outline"
                      >
                        Nouvelle demande
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <SectionHeading
                      title="Demander un service"
                      subtitle="Remplissez le formulaire et notre équipe vous recontactera rapidement"
                    />
                    <form onSubmit={handleRequestSubmit} className="bg-white rounded-2xl p-8 md:p-12 shadow-sm space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">Nom complet *</label>
                          <input
                            type="text"
                            required
                            value={requestForm.name}
                            onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">Email *</label>
                          <input
                            type="email"
                            required
                            value={requestForm.email}
                            onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">Téléphone</label>
                          <input
                            type="tel"
                            value={requestForm.phone}
                            onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-dark mb-2">Service souhaité *</label>
                          <select
                            required
                            value={requestForm.service}
                            onChange={(e) => setRequestForm({ ...requestForm, service: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="">Choisir un service</option>
                            <optgroup label="Canada">
                              {productsCanada.map((p) => (
                                <option key={p.id}>{p.title}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Afrique & Haïti">
                              {productsAfrica.map((p) => (
                                <option key={p.id}>{p.title}</option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Description de votre besoin *</label>
                        <textarea
                          required
                          rows={5}
                          value={requestForm.description}
                          onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          placeholder="Décrivez votre besoin en détail..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Pièces jointes</label>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => setRequestFiles(e.target.files)}
                          className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Button type="submit" variant="primary" size="lg">
                          Envoyer la demande
                        </Button>
                        <Button href={siteConfig.whatsapp} external variant="outline" size="lg">
                          <WhatsAppIcon className="w-5 h-5 mr-2" /> Obtenir un devis par WhatsApp
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            )}

            {/* TRACKING TAB */}
            {activeTab === "tracking" && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SectionHeading
                  title="Suivi de vos demandes"
                  subtitle="Consultez le statut de vos demandes de service"
                />

                {tickets.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4 opacity-30">📋</div>
                    <p className="text-muted">Aucune demande en cours.</p>
                    <Button onClick={() => setActiveTab("request")} variant="primary" className="mt-6">
                      Faire une demande
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {tickets.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-sm text-muted">{ticket.id}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[ticket.status].color}`}>
                                {statusLabels[ticket.status].label}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-dark">{ticket.service}</h3>
                          </div>
                          <span className="text-sm text-muted">
                            {new Date(ticket.date).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <p className="text-sm text-muted bg-surface rounded-xl p-4">{ticket.lastMessage}</p>
                        <div className="mt-4 flex gap-3">
                          <Button onClick={() => setActiveTab("messages")} variant="ghost" size="sm">
                            Voir les échanges <ArrowRightIcon className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === "messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto"
              >
                <SectionHeading
                  title="Espace d'échanges"
                  subtitle="Discutez avec l'équipe FINAB"
                />

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Messages */}
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-white rounded-br-md"
                              : "bg-surface text-dark rounded-bl-md"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-white/50" : "text-muted"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Votre message..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary-light transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <SendIcon className="w-5 h-5" />
                    </button>
                  </form>

                  {/* Quick actions */}
                  <div className="border-t px-4 py-3 flex gap-2 flex-wrap">
                    <a
                      href={siteConfig.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" /> Continuer sur WhatsApp
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-xs px-3 py-2 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                    >
                      📧 Envoyer un email
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
