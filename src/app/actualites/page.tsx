import type { Metadata } from "next";
import ActualitesPageClient from "./ActualitesPageClient";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Restez informé des dernières nouvelles et activités de FINAB la solution.",
};

export default function ActualitesPage() {
  return <ActualitesPageClient />;
}
