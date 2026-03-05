import type { Metadata } from "next";
import CoordinationMedicaleClient from "./CoordinationMedicaleClient";

export const metadata: Metadata = {
  title: "Coordination Médicale Internationale | FINAB la solution",
  description:
    "Coordination médicale internationale Afrique → Canada. Sécurisons l'accès aux soins spécialisés au Canada pour les patients d'Afrique centrale et de l'Ouest.",
};

export default function CoordinationMedicalePage() {
  return <CoordinationMedicaleClient />;
}
