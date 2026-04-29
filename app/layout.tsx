import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KOKA Essowaba David — Développeur Web & Mobile Full Stack",
  description:
    "Portfolio de KOKA Essowaba David, étudiant en 2ème année de Génie Logiciel à IAI-TOGO. Solutions web et mobiles innovantes.",
  keywords: [
    "développeur web", "développeur mobile", "full stack",
    "Next.js", "React", "Django", "Flutter", "IAI-TOGO", "Togo",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <body
        style={{
          backgroundColor: "#111111",
          color: "#EDE0D4",
          fontFamily: "var(--font-dm), sans-serif",
          overflowX: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}