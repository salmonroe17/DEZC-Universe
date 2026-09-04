import { useId } from 'react'

export function HudLoadingScreen({ label = 'Loading…' }: { label?: string }) {
  const rawId = useId()
  const gradId = `hud-loading-meteor-grad-${rawId.replace(/:/g, '')}`

  return (
    <div
      className="flex min-h-dvh w-full items-center justify-center bg-bg"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative size-[min(8.5rem,46vw)]">
        <svg
          className="hud-loading-meteor-svg pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-hud)" stopOpacity={0} />
              <stop offset="55%" stopColor="var(--color-hud)" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
            </linearGradient>
          </defs>
          <circle
            className="hud-loading-meteor-rail"
            cx="50"
            cy="50"
            r="46"
            strokeWidth={1}
            vectorEffect="nonScalingStroke"
          />
          <g transform="rotate(-90 50 50)">
            <circle
              className="hud-loading-meteor-path"
              cx="50"
              cy="50"
              r="46"
              stroke={`url(#${gradId})`}
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="nonScalingStroke"
              pathLength={100}
            />
          </g>
        </svg>
        <span className="absolute inset-0 z-[1] flex items-center justify-center font-mono text-xs text-fg-muted">
          {label}
        </span>
      </div>
    </div>
  )
}
