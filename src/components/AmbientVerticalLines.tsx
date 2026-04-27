import { useEffect, useRef } from 'react'

/** Exactly four dividers → five equal bands (reference mock). */
const LINE_COUNT = 4
const BANDS = 5

/** Minimum wobble (px scale) so lines keep drifting when the pointer is still (e.g. wheel scroll). */
const AMBIENT_WOBBLE_BASE = 0.42

/** Faint vertical dotted rules; subtle horizontal wobble on pointer movement. */
export function AmbientVerticalLines() {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const intensityRef = useRef(0)
  const phaseRef = useRef(0)
  const lastRef = useRef({ x: 0, y: 0, t: 0 })

  useEffect(() => {
    const lines = lineRefs.current
    const bump = (amount: number) => {
      intensityRef.current = Math.min(1, intensityRef.current + amount)
    }
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      const last = lastRef.current
      const dt = Math.max(8, now - last.t)
      const vx = (e.clientX - last.x) / dt
      const vy = (e.clientY - last.y) / dt
      lastRef.current = { x: e.clientX, y: e.clientY, t: now }
      const speed = Math.hypot(vx, vy)
      bump(speed * 0.028)
    }

    let raf = 0
    const tick = () => {
      phaseRef.current += 0.055 + intensityRef.current * 0.12
      intensityRef.current *= 0.988
      const amp = AMBIENT_WOBBLE_BASE + intensityRef.current * 4.2
      for (let i = 0; i < LINE_COUNT; i += 1) {
        const el = lines[i]
        if (!el) continue
        const wobble = Math.sin(phaseRef.current + i * 0.62) * amp
        el.style.transform = `translate3d(${wobble}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }

    const onWheel = () => bump(0.055)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: LINE_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            lineRefs.current[i] = el
          }}
          className="absolute top-0 bottom-0 will-change-transform"
          style={{
            left: `${((i + 1) / BANDS) * 100}%`,
            transform: 'translate3d(0,0,0)',
            width: '2px',
            marginLeft: '-1px',
            backgroundColor: 'transparent',
            backgroundImage:
              'radial-gradient(circle, color-mix(in srgb, var(--color-fg) 26%, transparent) 1px, transparent 1.25px)',
            backgroundSize: '2px 9px',
            backgroundRepeat: 'repeat-y',
            backgroundPosition: 'center top',
            opacity: 0.2,
          }}
        />
      ))}
    </div>
  )
}
