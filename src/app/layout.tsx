import type { Metadata } from "next";
import { Anton, Fraunces, Inter } from "next/font/google";
import { Magnetics } from "@/components/magnetics";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const TITLE = "One Piece — A história que o mundo tentou apagar";
const DESCRIPTION =
  "De um homem rindo no cadafalso até uma cadeira no fim do mundo. A jornada, a tripulação e as falas que ficaram.";

export const metadata: Metadata = {
  // Placeholder: o alias final de deploy pode mudar (ver os outros projetos
  // do molde terral, cada um ganhou o próprio domínio .vercel.app na hora do
  // deploy) — ajustar aqui quando o projeto for pro ar de verdade.
  metadataBase: new URL("https://one-piece-animes.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    locale: "pt_BR",
    type: "website",
    images: ["/shot/amanhecer/full.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="bg-abyss text-parchment min-h-full">
        {children}
        <Magnetics />
      </body>
    </html>
  );
}
