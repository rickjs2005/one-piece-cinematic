import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { SmoothScroll } from "@/lib/smooth-scroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Animes — O Trono Vazio",
  description:
    "Por oitocentos anos o mundo acreditou que o trono estava vazio. A cadeira no centro de Pangea nunca teve dono declarado — e nunca esteve sem ocupante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-void text-parchment min-h-full">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
