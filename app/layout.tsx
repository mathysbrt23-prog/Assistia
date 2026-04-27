import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistia - Assistant personnel WhatsApp",
  description:
    "Résume tes emails, consulte ton agenda et décale tes réunions directement depuis WhatsApp."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
