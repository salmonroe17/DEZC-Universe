import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** Matches `quadrant-cell::after`: 1px inset + same clip chamfer as `index.css`. */
function buildChamferMeteorPath(width: number, height: number, chamferPx: number, borderInsetPx: number): string {
  const w = width
  const h = height
  if (w < 4 || h < 4) return ''

  let c = Number.isFinite(chamferPx) ? chamferPx : 8
  c = Math.max(0, c)

  const innerW = w - borderInsetPx * 2
  const innerH = h - borderInsetPx * 2
  const maxChamfer = Math.max(0, Math.min(innerW, innerH) / 2 - 0.5)
  c = Math.min(c, maxChamfer)

  const ins = borderInsetPx
  const x0 = ins
  const y0 = ins
  const x1 = w - ins - c
  const y1 = ins
  const x2 = w - ins
  const y2 = ins + c
  const x3 = w - ins
  const y3 = h - ins
  const x4 = ins + c
  const y4 = h - ins
  const x5 = ins
  const y5 = h - ins - c

  const sx = (x: number) => (100 * x) / w
  const sy = (y: number) => (100 * y) / h
  const f = (n: number) => Math.round(n * 1000) / 1000

  return `M ${f(sx(x0))},${f(sy(y0))} L ${f(sx(x1))},${f(sy(y1))} L ${f(sx(x2))},${f(sy(y2))} L ${f(sx(x3))},${f(sy(y3))} L ${f(sx(x4))},${f(sy(y4))} L ${f(sx(x5))},${f(sy(y5))} Z`
}

type ChamferFrameProps = {
  children?: ReactNode
  /** Outer wrapper — use for width / margin (e.g. w-full max-w-[1156px]) */
  className?: string
  /** Inner z-10 slot — use for min-height, padding, flex centering */
  innerClassName?: string
  /**
   * Clip inner content to the chamfer polygon (same as `::after`). Turn off for custom
   * inner clips (e.g. split toggles that manage their own polygons).
   */
  clipToChamfer?: boolean
  /** Skip quadrant hover brighten on dense showcase pages */
  staticVisual?: boolean
  /**
   * Traveling “meteor” highlight on the chamfer outline (stroke dash animation), similar to the
   * case-study scroll progress meteor. Inner content does not move.
   */
  meteorTrail?: boolean
}

/**
 * Bordered chamfer silhouette matching homepage `quadrant-cell` (see index.css).
 */
export function ChamferFrame({
  children = null,
  className = '',
  innerClassName = '',
  clipToChamfer = true,
  staticVisual = true,
  meteorTrail = false,
}: ChamferFrameProps) {
  const rawId = useId()
  const meteorGradId = `chamfer-meteor-grad-${rawId.replace(/:/g, '')}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [meteorPathD, setMeteorPathD] = useState('')

  useLayoutEffect(() => {
    if (!meteorTrail) return

    const el = rootRef.current
    if (!el) return

    const update = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const chamferRaw = getComputedStyle(el).getPropertyValue('--quadrant-chamfer').trim()
      const chamferPx = parseFloat(chamferRaw)
      setMeteorPathD(buildChamferMeteorPath(w, h, chamferPx, 1))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [meteorTrail])

  return (
    <div
      ref={rootRef}
      className={`quadrant-cell relative min-h-0 min-w-0 overflow-hidden ${staticVisual ? 'figma-frame-static' : ''} ${className}`}
    >
      {meteorTrail && meteorPathD ? (
        <svg
          className="chamfer-meteor-ring pointer-events-none absolute inset-0 z-[5] h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={meteorGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-hud)" stopOpacity={0.75} />
              <stop offset="42%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <path
            className="chamfer-meteor-path"
            fill="none"
            stroke={`url(#${meteorGradId})`}
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="nonScalingStroke"
            pathLength={100}
            d={meteorPathD}
          />
        </svg>
      ) : null}
      {/* p-px keeps the ::before chamfer ring visible above z-0 pseudos (inner was full-bleed). */}
      <div className="relative z-10 box-border min-h-0 min-w-0 size-full p-px">
        <div
          className={`min-h-0 min-w-0 size-full ${clipToChamfer ? 'chamfer-fill-clip' : ''} ${innerClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
