import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t border-wwam-gold/15 bg-wwam-ink/90 py-10 text-center text-sm text-wwam-cream-muted backdrop-blur-sm">
      <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
        <p>
          Rules transcription:{" "}
          <a
            href="https://github.com/tonicebrian/TheCampaignForNorthAfrica"
            className="text-wwam-gold-light underline-offset-2 hover:text-wwam-cream hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            TheCampaignForNorthAfrica
          </a>{" "}
          · SPI CNA (1978)
        </p>
        <p className="text-xs opacity-80">
          This site is a fan play log for the{" "}
          <a
            href="https://warwithamate.co.uk/"
            className="text-wwam-gold-light hover:underline"
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
            className="text-xs text-wwam-cream-muted/70 underline-offset-2 hover:text-wwam-gold-light hover:underline"
          >
            Publisher sign-in
          </Link>
        </p>
      </div>
    </footer>
  );
}
