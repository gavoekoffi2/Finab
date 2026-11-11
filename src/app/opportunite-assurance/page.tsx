import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookingForm from "./BookingForm";
import Reveal from "@/components/immersive/Reveal";
import "./opportunite.css";

export const metadata: Metadata = {
  title: "Recrutement de conseillers financiers | FINAB",
  description:
    "FINAB recrute des conseillers financiers au Canada. Découvrez les conditions, le parcours de formation et soumettez votre candidature.",
  openGraph: {
    title: "Rejoignez FINAB comme conseiller financier",
    description:
      "Soumettez votre candidature pour découvrir notre parcours de recrutement, de formation et de permis.",
    images: ["/images/team/partner-opportunity.jpg"],
  },
};

const requirements = [
  {
    number: "01",
    title: "Une disponibilité réelle",
    text: "Prévoyez au moins 20 heures par semaine pendant les trois premiers mois, puis une disponibilité à temps plein à partir du quatrième mois.",
  },
  {
    number: "02",
    title: "Une formation encadrée",
    text: "Les candidats sélectionnés sont accompagnés dans leur préparation et doivent se présenter à l’examen requis pour obtenir leur permis.",
  },
  {
    number: "03",
    title: "Un profil professionnel",
    text: "Nous recherchons des personnes motivées, disciplinées, présentes aux formations et prêtes à appliquer leurs apprentissages auprès des clients.",
  },
];

const benefits = [
  "Découvrir le rôle de conseiller financier",
  "Comprendre les étapes de recrutement et de sélection",
  "Connaître le parcours de formation et de permis",
  "Évaluer si le poste correspond à votre projet professionnel",
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="opportunity-arrow">
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="opportunity-check" aria-hidden="true">
      ✓
    </span>
  );
}

export default function OpportuniteAssurancePage() {
  return (
    <div className="opportunity-page">
      <section className="opportunity-hero">
        <div className="opportunity-hero-grid" />
        <div className="opportunity-container opportunity-hero-content">
          <div className="opportunity-hero-copy">
            <div className="opportunity-eyebrow">
              <span className="opportunity-eyebrow-line" />
              FINAB · Canada
            </div>
            <h1>
              Rejoignez FINAB comme <em>conseiller financier</em>
            </h1>
            <p className="opportunity-lead">
              FINAB recrute des personnes motivées pour se former, obtenir leur permis et exercer comme conseiller financier au Canada — avec un accompagnement clair à chaque étape.
            </p>
            <div className="opportunity-actions">
              <a className="opportunity-button opportunity-button-primary" href="#reservation">
                Soumettre ma candidature <ArrowIcon />
              </a>
              <a className="opportunity-text-link" href="#parcours">
                Comprendre le parcours <span>↓</span>
              </a>
            </div>
            <div className="opportunity-trust-row" aria-label="Éléments de réassurance">
              <span><CheckIcon /> Rencontre sans engagement</span>
              <span><CheckIcon /> Informations transparentes</span>
            </div>
          </div>
          <div className="opportunity-hero-visual">
            <div className="opportunity-visual-orbit opportunity-orbit-one" />
            <div className="opportunity-visual-orbit opportunity-orbit-two" />
            <div className="opportunity-photo-frame">
              <Image
                src="/images/team/partner-opportunity.jpg"
                alt="Professionnel FINAB en entretien"
                fill
                priority
                sizes="(max-width: 900px) 86vw, 440px"
                className="opportunity-photo"
              />
              <div className="opportunity-photo-caption">
                <span className="opportunity-caption-dot" />
                Une conversation peut changer une trajectoire.
              </div>
            </div>
            <div className="opportunity-floating-card">
              <span className="opportunity-floating-label">VOTRE PROCHAINE ÉTAPE</span>
              <strong>Un appel pour clarifier votre prochaine étape.</strong>
            </div>
          </div>
        </div>
        <div className="opportunity-scroll-cue">DÉCOUVRIR <span>↓</span></div>
      </section>

      <section className="opportunity-proof-strip">
        <div className="opportunity-container opportunity-proof-inner">
          <span className="opportunity-proof-kicker">RECRUTEMENT · CONSEILLERS FINANCIERS</span>
          <span className="opportunity-proof-rule" />
          <p>Découvrez les attentes du poste, le processus de sélection et les étapes nécessaires pour devenir conseiller financier chez FINAB.</p>
        </div>
      </section>

      <section className="opportunity-section opportunity-section-light" id="parcours">
        <div className="opportunity-container">
          <Reveal className="opportunity-section-heading">
            <div>
              <div className="opportunity-eyebrow dark"><span className="opportunity-eyebrow-line" /> LE POSTE DE CONSEILLER FINANCIER</div>
              <h2>Construisez votre carrière au sein d’une équipe qui vous accompagne.</h2>
            </div>
            <p>Un entretien de recrutement vous permet de comprendre les exigences du poste, les conditions de sélection et les prochaines étapes.</p>
          </Reveal>
          <div className="opportunity-benefit-grid">
            {benefits.map((benefit, i) => (
              <Reveal className="opportunity-benefit" key={benefit} delay={i * 0.08}>
                <CheckIcon />
                <span>{benefit}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="opportunity-section opportunity-section-cream">
        <div className="opportunity-container">
          <Reveal className="opportunity-section-heading stacked">
            <div className="opportunity-eyebrow dark"><span className="opportunity-eyebrow-line" /> LES CONDITIONS À CONNAÎTRE</div>
            <h2>La clarté avant l’engagement.</h2>
            <p>Le poste demande de la disponibilité et de la constance. Voici les éléments essentiels à connaître avant de soumettre votre candidature.</p>
          </Reveal>
          <div className="opportunity-requirement-grid">
            {requirements.map((item, i) => (
              <Reveal as="article" className="opportunity-requirement" key={item.number} delay={i * 0.12}>
                <span className="opportunity-number">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="opportunity-fee-note">
            <span className="opportunity-fee-symbol">i</span>
            <p><strong>Frais administratifs :</strong> des frais de vérification de dossier de 199 $ plus taxes peuvent s&apos;appliquer selon les conditions du parcours. Tous les détails seront expliqués avant toute décision.</p>
          </div>
        </div>
      </section>

      <section className="opportunity-section opportunity-section-light">
        <div className="opportunity-container">
          <Reveal className="opportunity-section-heading stacked">
            <div className="opportunity-eyebrow dark"><span className="opportunity-eyebrow-line" /> PRENEZ UNE DÉCISION ÉCLAIRÉE</div>
            <h2>Un appel pour clarifier votre prochaine étape.</h2>
            <p>Avant tout engagement, échangez avec un professionnel pour comprendre le parcours et obtenir des réponses adaptées à votre situation.</p>
          </Reveal>
        </div>
      </section>

      <section className="opportunity-bonus-section">
        <div className="opportunity-bonus-glow" />
        <div className="opportunity-container opportunity-bonus-layout">
          <div>
            <div className="opportunity-eyebrow"><span className="opportunity-eyebrow-line" /> UN PROGRAMME QUI RÉCOMPENSE L’ENGAGEMENT</div>
            <h2>Donnez-vous les moyens de réussir. <em>Soyez récompensé(e).</em></h2>
            <p>Les candidats qui progressent avec sérieux dans leur formation et obtiennent leur permis dans les conditions prévues peuvent être admissibles à un <strong>bonus de 5 000 $ à 10 000 $</strong>. Une raison de plus de transformer votre motivation en véritable projet professionnel.</p>
          </div>
          <Reveal direction="scale" className="opportunity-bonus-badge">
            <span>Bonus potentiel</span>
            <strong>5 000 $<br />à 10 000 $</strong>
            <small>selon les conditions du programme</small>
          </Reveal>
        </div>
      </section>

      <section className="opportunity-cta-section" id="reservation">
        <div className="opportunity-cta-pattern" />
        <div className="opportunity-container opportunity-cta-content">
          <div className="opportunity-eyebrow"><span className="opportunity-eyebrow-line" /> VOTRE PROCHAINE ÉTAPE</div>
          <h2>Prêt(e) à rejoindre FINAB ?<br /><em>Soumettez votre candidature.</em></h2>
          <p>Choisissez un créneau pour votre entretien de recrutement. Nous vous présenterons le poste, les conditions de sélection et les prochaines étapes.</p>
          <BookingForm />
        </div>
      </section>

      <section className="opportunity-footer-note">
        <div className="opportunity-container">
          <p>FINAB recrute des conseillers financiers. L’admissibilité, la sélection, le permis, les frais et toute prime éventuelle sont soumis aux exigences et conditions applicables. La candidature ne garantit ni une sélection, ni un permis, ni un revenu.</p>
          <Link href="/">Retourner sur FINAB la solution</Link>
        </div>
      </section>
    </div>
  );
}
