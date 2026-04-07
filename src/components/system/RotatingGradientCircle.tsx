import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type RotatingGradientCircleProps = {
  className?: string
  innerClassName?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className'>

/**
 * Circular frame: a bright “meteor” segment travels the outline via stroke-dashoffset
 * (same pattern as {@link ChamferFrame} `meteorTrail` and the case-study scroll bar).
 * Inner content stays fixed in the center.
 */
export function RotatingGradientCircle({
  className = '',
  innerClassName = '',
  children,
  style,
  ...rest
}: RotatingGradientCircleProps) {
  const rawId = useId()
  const gradId = `rotating-circle-meteor-grad-${rawId.replace(/:/g, '')}`

  return (
    <div className={`rotating-gradient-circle ${className}`} style={style} {...rest}>
      <svg
        className="rotating-circle-meteor-svg pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-hud)" stopOpacity={0.2} />
            <stop offset="36%" stopColor="var(--color-hud)" stopOpacity={0.88} />
            <stop offset="58%" stopColor="#ffffff" stopOpacity={0.95} />
            <stop offset="100%" stopColor="var(--color-cell-border)" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        {/* -90° so stroke-dash starts at 12 o'clock like a progress ring */}
        <g transform="rotate(-90 50 50)">
          <circle
            className="rotating-circle-meteor-path"
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="nonScalingStroke"
            pathLength={100}
          />
        </g>
      </svg>
      <div className={`rotating-gradient-ring-inner ${innerClassName}`}>{children}</div>
    </div>
  )
}

/** Dot grid placeholder for the inner disc (static; meteor runs on the SVG ring). */
export function RotatingGradientCircleDotPlaceholder({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none size-full min-h-0 min-w-0 rounded-[9999px] ${className}`}
      style={{
        backgroundColor: 'transparent',
        backgroundImage:
          'radial-gradient(circle at center, color-mix(in srgb, var(--color-fg-subtle) 70%, transparent) 1px, transparent 2px)',
        backgroundSize: '9px 9px',
        backgroundPosition: 'center',
      }}
    />
  )
}
