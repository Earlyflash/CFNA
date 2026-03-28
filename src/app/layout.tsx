import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CFNA play log",
  description: "Campaign for North Africa — podcast session log and turn progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        <header className="border-b border-sand-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-widest text-sand-600">Living play log</p>
            <h1 className="text-2xl font-semibold tracking-tight text-sand-900">Campaign for North Africa</h1>
            <p className="max-w-2xl text-sm text-sand-600">
              Session notes from both sides, podcast links, and a combined view of where each game-turn sits in the
              weekly sequence.
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-sand-200 bg-sand-100/80 py-6 text-center text-xs text-sand-600">
          Rules reference:{" "}
          <a
            href="https://github.com/tonicebrian/TheCampaignForNorthAfrica"
            className="text-allied hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            TheCampaignForNorthAfrica
          </a>
        </footer>
      </body>
    </html>
  );
}
