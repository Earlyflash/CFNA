import type { Metadata } from "next";
import { Playfair_Display, Lora, Special_Elite } from "next/font/google";
import { NewsprintBackdrop } from "@/components/NewsprintBackdrop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
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
        className={`${playfair.variable} ${lora.variable} ${specialElite.variable} relative min-h-screen font-sans antialiased text-np-ink`}
      >
        <NewsprintBackdrop />
        <SiteHeader />
        <main className="relative z-[1] mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
