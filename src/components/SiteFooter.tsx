import { InstagramLogo, LinkedinLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const LINKEDIN_URL = 'https://www.linkedin.com/in/dezchang'
const INSTAGRAM_URL = 'https://www.instagram.com/dezsee'

const footerLinkClass =
  'shrink-0 text-[10px] tracking-tight text-fg underline decoration-cell-border underline-offset-[3px] transition-colors hover:text-fg hover:decoration-hud'

const iconLinkClass =
  'inline-flex shrink-0 items-center justify-center rounded-sm text-fg transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud'

const iconProps = {
  size: 16 as const,
  weight: 'regular' as const,
  className: 'shrink-0 text-current',
  'aria-hidden': true as const,
}

function scrollDocumentToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

/** Mirrored layout + chrome from {@link SiteTopBar}: three columns, same height, border + blur. */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 grid h-12 w-full shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-t border-border bg-bg/95 px-3 backdrop-blur-sm sm:gap-4 sm:px-6">
      <Link
        to="/privacy"
        className={`justify-self-start ${footerLinkClass}`}
        onClick={scrollDocumentToTop}
      >
        Privacy
      </Link>

      <Link
        to="/"
        className={`justify-self-center text-center tabular-nums ${footerLinkClass}`}
        suppressHydrationWarning
        onClick={scrollDocumentToTop}
      >
        DEZC {year}
      </Link>

      <div className="flex items-center justify-end gap-3 justify-self-end">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={iconLinkClass}
          aria-label="Instagram"
        >
          <InstagramLogo {...iconProps} />
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={iconLinkClass}
          aria-label="LinkedIn"
        >
          <LinkedinLogo {...iconProps} />
        </a>
      </div>
    </footer>
  )
}
