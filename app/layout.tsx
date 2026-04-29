import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistia Reply - Réponses professionnelles dans Gmail",
  description:
    "Génère ou reformule des brouillons professionnels en français directement dans Gmail."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="fr">
      <body>{children}</body>
    </html>
  );
}
