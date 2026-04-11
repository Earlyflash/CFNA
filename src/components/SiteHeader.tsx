import Image from "next/image";
import Link from "next/link";
import { WWAM_APPLE_PODCAST_URL, WWAM_LOGO_URL, WWAM_SITE_URL } from "@/lib/brand";
import { OrnamentalRule } from "@/components/OrnamentalRule";

export function SiteHeader() {
  return (
    <header className="border-b-3 border-double border-np-ink bg-np-paper">
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-4 sm:px-6 lg:px-8">
        {/* Top thin rule */}
        <div className="mb-4 border-t border-np-rule" />

        {/* Masthead */}
        <div className="text-center">
          <Link href="/" className="group inline-block">
            <div className="relative mx-auto mb-2 h-10 w-32 sm:h-12 sm:w-40">
              <Image
                src={WWAM_LOGO_URL}
                alt="War With A Mate"
                fill
                className="object-contain opacity-80 transition-opacity group-hover:opacity-100"
                sizes="160px"
                priority
              />
            </div>
            <h1 className="font-display text-4xl font-black uppercase tracking-wide text-np-ink sm:text-5xl lg:text-6xl">
              Campaign for North Africa
            </h1>
          </Link>
          <p className="mt-1 font-mono text-xs tracking-widest text-np-ink-muted sm:text-sm">
            A Living Play Log &mdash; War With A Mate &mdash; Est. 2024
          </p>
        </div>

        <OrnamentalRule className="my-4" />

        {/* Nav row */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-1 text-sm text-np-ink-light"
          aria-label="Podcast and publisher links"
        >
          <a
            href={WWAM_SITE_URL}
            className="underline decoration-np-rule underline-offset-2 transition hover:text-np-ink hover:decoration-np-ink"
            rel="noopener noreferrer"
            target="_blank"
          >
            Podcast Site
          </a>
          <span className="text-np-rule" aria-hidden>&ensp;|&ensp;</span>
          <a
            href={WWAM_APPLE_PODCAST_URL}
            className="underline decoration-np-rule underline-offset-2 transition hover:text-np-ink hover:decoration-np-ink"
            rel="noopener noreferrer"
            target="_blank"
          >
            Apple Podcasts
          </a>
          <span className="text-np-rule" aria-hidden>&ensp;|&ensp;</span>
          <Link
            href="/publish/login"
            className="underline decoration-np-rule underline-offset-2 transition hover:text-np-ink hover:decoration-np-ink"
          >
            Publisher Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
