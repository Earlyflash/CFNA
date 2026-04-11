import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-3 border-double border-np-ink bg-np-paper py-8 text-center text-sm text-np-ink-muted">
      <div className="mx-auto max-w-5xl space-y-3 px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs tracking-wider uppercase">
          &mdash; Colophon &mdash;
        </p>
        <p className="italic">
          Rules transcription:{" "}
          <a
            href="https://github.com/tonicebrian/TheCampaignForNorthAfrica"
            className="text-np-ink-light underline underline-offset-2 hover:text-np-ink"
            rel="noopener noreferrer"
            target="_blank"
          >
            TheCampaignForNorthAfrica
          </a>{" "}
          &middot; SPI CNA (1978)
        </p>
        <p className="text-xs">
          This site is a fan play log for the{" "}
          <a
            href="https://warwithamate.co.uk/"
            className="text-np-ink-light underline underline-offset-2 hover:text-np-ink"
            rel="noopener noreferrer"
            target="_blank"
          >
            War With A Mate
          </a>{" "}
          podcast. Podcast name and logo belong to the show.
        </p>
        <p>
          <Link
            href="/publish/login"
            className="text-xs text-np-ink-muted/70 underline-offset-2 hover:text-np-ink hover:underline"
          >
            Publisher sign-in
          </Link>
        </p>
      </div>
    </footer>
  );
}
