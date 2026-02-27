import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Richiesta Appuntamento | Termoidraulica",
  description:
    "Compila il modulo per richiedere un appuntamento. Ti ricontatteremo al più presto.",
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
