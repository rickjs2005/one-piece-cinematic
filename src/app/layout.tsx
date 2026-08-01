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

export const metadata: Metadata = {
  title: "One Piece — A história que o mundo tentou apagar",
  description:
    "De um homem rindo no cadafalso até uma cadeira no fim do mundo. A jornada, a tripulação e as falas que ficaram.",
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
