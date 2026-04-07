import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type NavSection = { id: string; label: string }

/**
 * Horizontal line: a section is "active" once its `#id` top crosses at or above this viewport Y.
 * Must stay in sync with {@link caseStudyScrollAnchorClass}: `scroll-mt-28` / `md:scroll-mt-32`
 * (see `caseStudyPatternStyles.ts`). Those margins position headings after `scrollIntoView`; if the
 * threshold is smaller than that offset, the previous section stays "active" forever.
 */
function scrollSpyThresholdPx(): number {
  if (typeof window === 'undefined') return 148
  const rootRemPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const md = window.matchMedia('(min-width: 768px)').matches
  const scrollMarginRem = md ? 32 : 28
  return scrollMarginRem * rootRemPx + 16
}

export function useCaseStudyScrollspy(navSections: NavSection[]) {
  const [activeIdState, setActiveIdState] = useState<string | null>(
    () => navSections[0]?.id ?? null,
  )

  const ids = useMemo(() => navSections.map((s) => s.id), [navSections])
  const activeId = useMemo(() => {
    if (ids.length === 0) return null
    if (activeIdState != null && ids.includes(activeIdState)) return activeIdState
    return ids[0]!
  }, [ids, activeIdState])

  /** After sidebar click, ignore scroll-driven updates while smooth scroll settles (avoids flicker). */
  const suppressSpyUntilRef = useRef(0)

  const onNavigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveIdState(id)
    suppressSpyUntilRef.current = Date.now() + 520
  }, [])

  useEffect(() => {
    if (ids.length === 0) return

    const updateActive = () => {
      if (Date.now() < suppressSpyUntilRef.current) return

      const offset = scrollSpyThresholdPx()
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= offset) current = id
      }
      setActiveIdState(current)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [ids])

  return { activeId, onNavigate }
}
