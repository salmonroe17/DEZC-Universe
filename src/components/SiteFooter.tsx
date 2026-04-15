const LINKEDIN_URL = 'https://www.linkedin.com/in/dezchang'
const INSTAGRAM_URL = 'https://www.instagram.com/dezsee'

const footerLinkClass =
  'shrink-0 text-[10px] tracking-tight text-fg underline decoration-cell-border underline-offset-[3px] transition-colors hover:text-fg hover:decoration-hud'

/** Mirrored layout + chrome from {@link SiteTopBar}: three columns, same height, border + blur. */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 grid h-12 w-full shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-t border-border bg-bg/95 px-3 backdrop-blur-sm sm:gap-4 sm:px-6">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer noopener"
        className={`min-w-0 justify-self-start truncate ${footerLinkClass}`}
      >
        Instagram
      </a>

      <p
        className="text-center text-[10px] tabular-nums tracking-tight text-fg-muted"
        suppressHydrationWarning
      >
        DEZC {year}
      </p>

      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noreferrer noopener"
        className={`justify-self-end ${footerLinkClass}`}
      >
        LinkedIn
      </a>
    </footer>
  )
}
