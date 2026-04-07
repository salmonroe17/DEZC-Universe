import { useEffect, useState } from 'react'

function readScrollProgress(): number {
  const root = document.documentElement
  const max = root.scrollHeight - root.clientHeight
  if (max <= 0) return 0
  const top = window.scrollY ?? root.scrollTop
  return Math.min(1, Math.max(0, top / max))
}

/** Reading progress: 1px rail + meteor taper + rounded cap on the head; glow on the head. */
export function CaseStudyScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => setProgress(readScrollProgress())
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const pct = Math.round(progress * 100)

  return (
    <div
      className="relative z-10 h-[4px] w-full shrink-0 overflow-visible"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      {/* 1px rail — full width; meteor head extends ±1.5px from center. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-px -translate-y-1/2 bg-fg/[0.06]"
        aria-hidden
      />
      <div className="relative z-[1] h-full w-full">
        <div
          className="absolute left-0 top-0 h-full min-w-0 overflow-visible transition-[width] duration-100 ease-out"
          style={{ width: `${pct}%` }}
        >
          {/* Tapered body; width leaves 3px for a rounded cap at the head. */}
          <div
            className="case-study-scroll-progress-meteor absolute left-0 top-0 h-full"
            style={{ width: 'max(0px, calc(100% - 3px))' }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
              }}
            />
          </div>
          {/* Rounded head + per-shape halo (drop-shadow isn’t clipped like a separate glow fill can be). */}
          <div
            className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-[3px] rounded-r-full bg-white [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.7))_drop-shadow(8px_0_22px_rgba(255,255,255,0.45))_drop-shadow(18px_0_42px_color-mix(in_srgb,var(--color-hud)_45%,transparent))]"
            aria-hidden
          />
          {/* Transparent layer so the cap stays clean; bloom is mostly box-shadow + pulse. */}
          <div
            className="case-study-scroll-progress-glow pointer-events-none absolute right-0 top-1/2 z-[2] h-[4px] w-[min(100%,7.5rem)] bg-transparent"
            style={{
              boxShadow:
                '12px 0 32px -1px rgba(255, 255, 255, 0.55), 22px 0 56px -4px rgba(255, 255, 255, 0.38), 38px 0 88px -8px rgba(255, 255, 255, 0.22), 52px 0 120px -12px color-mix(in srgb, var(--color-hud) 42%, transparent), 0 0 24px 2px rgba(255, 255, 255, 0.2)',
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}
