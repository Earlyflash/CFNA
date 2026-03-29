import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, Geist_Mono } from "next/font/google";
import { DesertBackdrop } from "@/components/DesertBackdrop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "War With A Mate — CNA play log",
    template: "%s · War With A Mate",
  },
  description:
    "Campaign for North Africa: session-by-session play log from the War With A Mate podcast — both sides each episode, turn progress, and links.",
  openGraph: {
    title: "War With A Mate — CNA play log",
    description: "North Africa, game-turn by game-turn: each episode covers both sides at the table.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${sourceSans.variable} ${geistMono.variable} relative min-h-screen font-sans antialiased text-wwam-cream`}
      >
        <DesertBackdrop />
        <SiteHeader />
        <main className="relative z-[1] mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
