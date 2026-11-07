import { motion, useReducedMotion } from 'framer-motion'
import { useContext } from 'react'
import { SiteThemeContext } from '../contexts/siteThemeContext'
import { portfolioTheme, themeGlyphColors } from '../design-system/theme'

const DANCE_TIMES = [0, 0.12, 0.28, 0.44, 0.58, 0.72, 0.86, 1] as const

const glyphClass =
  'text-[clamp(2.75rem,14vmin,7rem)] font-normal uppercase tracking-[0.12em]'

/** Rainbow animated “404” (glitch chroma CSS in `index.css`) — reused on /404 and ErrorBoundary. */
export function NotFound404Glyph() {
  const reduceMotion = useReducedMotion()
  // ErrorBoundary can render this outside the provider; use the configured palette there.
  const theme = useContext(SiteThemeContext)?.theme ?? portfolioTheme.activeTheme

  if (reduceMotion) {
    return <span className={`${glyphClass} text-fg-subtle`}>404</span>
  }

  return (
    <motion.span
      className={`not-found-404-glitch inline-block ${glyphClass}`}
      data-text="404"
      animate={{ color: themeGlyphColors[theme] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
    >
      <motion.span
        className="block will-change-transform"
        style={{ transformOrigin: '50% 50%' }}
        animate={{
          rotate: [0, -4, 5, -3, 4, -5, 2, 0],
          x: ['0%', '-2.5%', '3%', '-2%', '4%', '-3%', '2%', '0%'],
          y: ['0%', '-5%', '3%', '4%', '-3%', '2%', '-2%', '0%'],
          scale: [1, 1.03, 0.97, 1.02, 1, 1.04, 0.99, 1],
        }}
        transition={{
          duration: 1.35,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
          times: [...DANCE_TIMES],
        }}
      >
        404
      </motion.span>
    </motion.span>
  )
}
