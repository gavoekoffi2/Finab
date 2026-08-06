import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookingForm from "./BookingForm";
import "./opportunite.css";

export const metadata: Metadata = {
  title: "Bâtissez votre prochaine opportunité professionnelle",
  description:
    "Découvrez une voie structurée vers une carrière en services financiers au Canada. Vérifiez votre admissibilité et réservez un appel d'information avec FINAB.",
  openGraph: {
    title: "Votre prochaine opportunité professionnelle commence ici",
    description:
      "Une rencontre d'information pour comprendre le parcours, les conditions et les prochaines étapes.",
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
    title: "Un parcours encadré",
    text: "Vous serez accompagné(e) dans votre préparation et devrez vous présenter à l'examen requis pour obtenir votre permis.",
  },
  {
    number: "03",
    title: "Une posture professionnelle",
    text: "La réussite repose sur la motivation, la discipline, la participation active aux formations et la capacité à appliquer les apprentissages.",
  },
];

const benefits = [
  "Comprendre le parcours avant de vous engager",
  "Échanger avec un professionnel et poser vos questions",
  "Identifier les étapes de formation et de permis",
  "Évaluer si cette opportunité correspond à votre situation",
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
              Et si votre prochaine <em>opportunité</em> professionnelle commençait ici ?
            </h1>
            <p className="opportunity-lead">
              Découvrez un parcours structuré pour vous former, obtenir votre permis et bâtir une activité dans les services financiers — avec un accompagnement clair à chaque étape.
            </p>
            <div className="opportunity-actions">
              <a className="opportunity-button opportunity-button-primary" href="#reservation">
                Réserver mon appel d&apos;information <ArrowIcon />
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
              <span className="opportunity-floating-label">Votre prochaine étape</span>
              <strong>Un appel. Des réponses. Une direction.</strong>
            </div>
          </div>
        </div>
        <div className="opportunity-scroll-cue">DÉCOUVRIR <span>↓</span></div>
      </section>

      <section className="opportunity-proof-strip">
        <div className="opportunity-container opportunity-proof-inner">
          <span className="opportunity-proof-kicker">UN PARCOURS QUI SE PRÉPARE</span>
          <span className="opportunity-proof-rule" />
          <p>Avant de prendre une décision, prenez le temps de comprendre le parcours et de vérifier s&apos;il vous correspond.</p>
        </div>
      </section>

      <section className="opportunity-section opportunity-section-light" id="parcours">
        <div className="opportunity-container">
          <div className="opportunity-section-heading">
            <div>
              <div className="opportunity-eyebrow dark"><span className="opportunity-eyebrow-line" /> CE QUE VOUS ALLEZ CLARIFIER</div>
              <h2>Une décision professionnelle mérite une information de qualité.</h2>
            </div>
            <p>Un premier échange vous permet de distinguer ce qui est possible, ce qui est requis et ce qui doit être préparé.</p>
          </div>
          <div className="opportunity-benefit-grid">
            {benefits.map((benefit) => (
              <div className="opportunity-benefit" key={benefit}>
                <CheckIcon />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="opportunity-section opportunity-section-cream">
        <div className="opportunity-container">
          <div className="opportunity-section-heading stacked">
            <div className="opportunity-eyebrow dark"><span className="opportunity-eyebrow-line" /> LES CONDITIONS À CONNAÎTRE</div>
            <h2>La clarté avant l’engagement.</h2>
            <p>Cette voie demande de la disponibilité et de la constance. Voici les éléments essentiels à comprendre avant votre appel.</p>
          </div>
          <div className="opportunity-requirement-grid">
            {requirements.map((item) => (
              <article className="opportunity-requirement" key={item.number}>
                <span className="opportunity-number">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="opportunity-fee-note">
            <span className="opportunity-fee-symbol">i</span>
            <p><strong>Frais administratifs :</strong> des frais de vérification de dossier de 199 $ plus taxes peuvent s&apos;appliquer selon les conditions du parcours. Tous les détails seront expliqués avant toute décision.</p>
          </div>
        </div>
      </section>

      <section className="opportunity-bonus-section">
        <div className="opportunity-bonus-glow" />
        <div className="opportunity-container opportunity-bonus-layout">
          <div>
            <div className="opportunity-eyebrow"><span className="opportunity-eyebrow-line" /> UN PROGRAMME QUI VALORISE L&apos;EFFORT</div>
            <h2>Atteignez votre objectif. <em>Soyez reconnu(e).</em></h2>
            <p>Selon les conditions et les critères du programme, une prime pouvant atteindre <strong>3 000 $</strong> peut être offerte lorsque le permis est obtenu dans le délai prévu.</p>
          </div>
          <div className="opportunity-bonus-badge">
            <span>Jusqu&apos;à</span>
            <strong>3 000 $</strong>
            <small>selon les conditions du programme</small>
          </div>
        </div>
      </section>

      <section className="opportunity-cta-section" id="reservation">
        <div className="opportunity-cta-pattern" />
        <div className="opportunity-container opportunity-cta-content">
          <div className="opportunity-eyebrow"><span className="opportunity-eyebrow-line" /> VOTRE PROCHAINE ÉTAPE</div>
          <h2>Vous avez des questions ?<br /><em>Commençons par une conversation.</em></h2>
          <p>Réservez un appel d&apos;information pour comprendre le parcours, les conditions et les prochaines étapes. Vous repartirez avec une vision claire — sans pression.</p>
          <BookingForm />
        </div>
      </section>

      <section className="opportunity-footer-note">
        <div className="opportunity-container">
          <p>FINAB présente une opportunité d&apos;information et d&apos;accompagnement. L&apos;admissibilité, le permis, les frais et toute prime éventuelle sont soumis aux exigences et conditions applicables. Cette page ne constitue pas une offre d&apos;emploi ni une garantie de revenus.</p>
          <Link href="/">Retourner sur FINAB la solution</Link>
        </div>
      </section>
    </div>
  );
}
