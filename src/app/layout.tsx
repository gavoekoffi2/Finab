import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyBar from "@/components/layout/StickyBar";
import Chatbot from "@/components/chatbot/Chatbot";

export const metadata: Metadata = {
  title: {
    default: "FINAB la solution – Éducation financière, Assurances & Services",
    template: "%s | FINAB la solution",
  },
  description:
    "FINAB la solution – Éducation financière, assurances, déclarations d'impôts, formation et recrutement au Canada, en Afrique et en Haïti. La résurrection financière au service de votre avenir.",
  keywords: [
    "FINAB",
    "éducation financière",
    "assurance",
    "déclaration impôts Canada",
    "recrutement",
    "formation",
    "Afrique",
    "Haïti",
    "Canada",
    "services financiers",
  ],
  authors: [{ name: "FINAB la solution" }],
  creator: "FINAB la solution",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "FINAB la solution",
    title: "FINAB la solution – La résurrection financière",
    description:
      "Services financiers au Canada, en Afrique et en Haïti. Éducation financière, assurances, impôts, recrutement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FINAB la solution",
    description: "La résurrection financière au service de votre avenir.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <StickyBar />
        <Chatbot />
      </body>
    </html>
  );
}
