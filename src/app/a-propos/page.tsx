import type { Metadata } from "next";
import AProposPageClient from "./AProposPageClient";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire, la mission et les valeurs de FINAB la solution, fondée par Koffi Abraham AKPOBI.",
};

export default function AProposPage() {
  return <AProposPageClient />;
}
