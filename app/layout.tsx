import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Termoidraulica Lotito | Impianti idraulici, termici e di condizionamento",
  description:
    "Progettazione e installazione di impianti idraulici, termici, di condizionamento e industriali. Oltre 25 anni di esperienza. Richiedi un preventivo gratuito.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
