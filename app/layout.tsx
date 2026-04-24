import type { Metadata } from "next";
import { DotGothic16, Kosugi_Maru } from "next/font/google";
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dot-gothic",
  preload: false,
});

const kosugiMaru = Kosugi_Maru({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kosugi-maru",
  preload: false,
});

export const metadata: Metadata = {
  title: "スリポやりくり帳",
  description: "ポケモンスリープのスリープポイント家計簿",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${dotGothic.variable} ${kosugiMaru.variable}`}>
      <body>{children}</body>
    </html>
  );
}
