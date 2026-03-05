import type { Metadata } from "next";
import ReclamationsPageClient from "./ReclamationsPageClient";

export const metadata: Metadata = {
  title: "Réclamations",
  description:
    "Soumettez une réclamation à FINAB la solution. Notre équipe s'engage à traiter votre demande sous 48h.",
};

export default function ReclamationsPage() {
  return <ReclamationsPageClient />;
}
