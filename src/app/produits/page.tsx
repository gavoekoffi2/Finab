import type { Metadata } from "next";
import ProduitsPageClient from "./ProduitsPageClient";

export const metadata: Metadata = {
  title: "Nos Produits",
  description:
    "Découvrez nos produits et services : éducation financière, déclarations d'impôts, formation, assurances vie et santé, micro-assurance, épargne et investissement.",
};

export default function ProduitsPage() {
  return <ProduitsPageClient />;
}
