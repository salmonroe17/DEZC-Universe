import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[min(70dvh,32rem)] flex-1 flex-col items-center justify-center gap-6 px-6 py-16 font-mono text-fg">
      <p className="m-0 text-[11px] font-normal uppercase tracking-[0.22em] text-fg-subtle">404</p>
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
