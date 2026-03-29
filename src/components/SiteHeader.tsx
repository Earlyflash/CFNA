import Image from "next/image";
import Link from "next/link";
import { WWAM_APPLE_PODCAST_URL, WWAM_LOGO_URL, WWAM_SITE_URL } from "@/lib/brand";
import { CompassMark } from "@/components/CompassMark";

const navBtnBase =
  "inline-flex min-h-[2.5rem] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold tracking-wide shadow-sm backdrop-blur-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwam-gold-light/80 focus-visible:ring-offset-2 focus-visible:ring-offset-wwam-ink";

const navExternal =
  `${navBtnBase} border-wwam-gold/35 bg-gradient-to-b from-white/[0.09] to-white/[0.02] text-wwam-cream hover:-translate-y-px hover:border-wwam-gold/55 hover:from-wwam-gold/15 hover:to-wwam-gold/5 hover:shadow-md hover:shadow-wwam-gold/15 active:translate-y-0`;

const navPublisher =
  `${navBtnBase} border-wwam-gold-light/45 bg-gradient-to-b from-wwam-gold/28 to-wwam-gold/10 text-wwam-cream hover:-translate-y-px hover:border-wwam-gold-light/65 hover:from-wwam-gold/38 hover:to-wwam-gold/16 hover:shadow-md hover:shadow-wwam-gold/20 active:translate-y-0`;

function ExternalMark() {
  return (
    <span className="text-[0.65rem] font-normal leading-none text-wwam-cream-muted/90" aria-hidden>
      ↗
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="relative overflow-hidden border-b border-wwam-gold/20 bg-wwam-ink/85 shadow-lg shadow-black/20 backdrop-blur-md">
      <div
        className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-wwam-gold/20 lg:right-8 lg:block"
        aria-hidden
      >
        <CompassMark className="h-24 w-24 lg:h-28 lg:w-28" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5 px-4 pb-8 pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:pt-8 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="relative h-16 w-40 shrink-0 sm:h-[4.5rem] sm:w-48">
            <Image
              src={WWAM_LOGO_URL}
              alt="War With A Mate"
              fill
              className="object-contain object-left drop-shadow-md transition-opacity group-hover:opacity-95"
              sizes="(max-width: 640px) 160px, 192px"
              priority
            />
          </div>
          <div className="min-w-0 border-wwam-gold/25 sm:border-l sm:pl-5">
            <p className="font-display text-lg font-semibold tracking-tight text-wwam-cream sm:text-xl">
              Campaign for North Africa
            </p>
            <p className="mt-0.5 text-sm text-wwam-cream-muted">Living play log · one table, both armies</p>
          </div>
        </Link>
        <nav
          className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-2.5"
          aria-label="Podcast and publisher links"
        >
          <a
            href={WWAM_SITE_URL}
            className={navExternal}
            rel="noopener noreferrer"
            target="_blank"
          >
            Podcast site
            <ExternalMark />
          </a>
          <a
            href={WWAM_APPLE_PODCAST_URL}
            className={navExternal}
            rel="noopener noreferrer"
            target="_blank"
          >
            Apple Podcasts
            <ExternalMark />
          </a>
          <Link href="/publish/login" className={navPublisher}>
            Publisher login
          </Link>
        </nav>
      </div>
    </header>
  );
}
