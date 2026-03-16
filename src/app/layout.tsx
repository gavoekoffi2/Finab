import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyBar from "@/components/layout/StickyBar";
import DesktopStickyBar from "@/components/layout/DesktopStickyBar";
import Chatbot from "@/components/chatbot/Chatbot";

const inter = localFont({
  src: [
    { path: "./fonts/inter-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

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
    "micro-assurance",
    "assurance vie",
  ],
  authors: [{ name: "FINAB la solution" }],
  creator: "FINAB la solution",
  metadataBase: new URL("https://finablasolution.cloud"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://finablasolution.cloud",
    siteName: "FINAB la solution",
    title: "FINAB la solution – La résurrection financière",
    description:
      "Services financiers au Canada, en Afrique et en Haïti. Éducation financière, assurances, impôts, recrutement.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FINAB la solution – La résurrection financière",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FINAB la solution",
    description: "La résurrection financière au service de votre avenir.",
    images: ["/og-image.jpg"],
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
    <html lang="fr" className={inter.variable}>
      <body className="antialiased font-sans">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <StickyBar />
        <DesktopStickyBar />
        <Chatbot />
      </body>
    </html>
  );
}
