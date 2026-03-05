import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Services & Espace Client",
  description:
    "Accédez à nos services, demandez un accompagnement, suivez vos demandes et échangez avec l'équipe FINAB.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
