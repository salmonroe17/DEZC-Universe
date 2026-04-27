import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const COLOR_CYCLE = [
  '#ff2d95',
  '#00ffc8',
  '#ffd000',
  '#6eb0ff',
  '#e879f9',
  '#3cdbcb',
  '#ff2d95',
] as const

const DANCE_TIMES = [0, 0.12, 0.28, 0.44, 0.58, 0.72, 0.86, 1] as const

const glyphClass =
  'text-[clamp(2.75rem,14vmin,7rem)] font-normal uppercase tracking-[0.12em]'

function NotFound404Glyph() {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <span className={`${glyphClass} text-fg-subtle`}>404</span>
  }

  return (
    <motion.span
      className={`not-found-404-glitch inline-block ${glyphClass}`}
      data-text="404"
      animate={{ color: [...COLOR_CYCLE] }}
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

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[min(70dvh,32rem)] flex-1 flex-col items-center justify-center gap-6 px-6 py-16 font-mono text-fg">
      <p className="m-0 font-normal leading-none">
        <NotFound404Glyph />
      </p>
      <h1 className="m-0 max-w-md text-center text-[clamp(1.25rem,3.5vw,1.75rem)] font-normal leading-snug tracking-[-0.03em]">
        This page does not exist.
      </h1>
      <p className="m-0 max-w-sm text-center text-xs leading-relaxed text-fg-muted">
        The URL may be mistyped, or the page was moved.
      </p>
      <Link
        to="/"
        className="rounded border border-cell-border bg-elevated px-4 py-2.5 text-xs text-fg transition-[background-color,border-color] hover:border-fg/25 hover:bg-surface"
      >
        Back to home
      </Link>
    </main>
  )
}
