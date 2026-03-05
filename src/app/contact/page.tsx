import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez FINAB la solution par téléphone, email ou via notre formulaire. Trouvez un agent près de chez vous.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
