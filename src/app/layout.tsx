import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { SmoothScroll } from "@/lib/smooth-scroll";
import { Preloader } from "@/components/ui/Preloader";
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
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-abyss text-parchment min-h-full">
        <Preloader />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
