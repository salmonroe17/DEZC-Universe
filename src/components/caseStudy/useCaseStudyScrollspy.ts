import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type NavSection = { id: string; label: string }

/** First sidebar row: smooth-scrolls to `window` top (no `#id` target). */
export const CASE_STUDY_SIDEBAR_TOP_ID = '__case-study-sidebar-top'

const SIDEBAR_TOP_ITEM: NavSection = {
  id: CASE_STUDY_SIDEBAR_TOP_ID,
  label: 'Top of page',
}

function withSidebarTopItem(sections: NavSection[]): NavSection[] {
  if (sections[0]?.id === CASE_STUDY_SIDEBAR_TOP_ID) return sections
  return [SIDEBAR_TOP_ITEM, ...sections]
}

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

export function useCaseStudyScrollspy(navSectionsIn: NavSection[]) {
  const navSections = useMemo(() => withSidebarTopItem(navSectionsIn), [navSectionsIn])

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
    if (id === CASE_STUDY_SIDEBAR_TOP_ID) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setActiveIdState(id)
    suppressSpyUntilRef.current = Date.now() + 520
  }, [])

  useEffect(() => {
    if (ids.length === 0) return

    const updateActive = () => {
      if (Date.now() < suppressSpyUntilRef.current) return

      const topIdPresent = ids.includes(CASE_STUDY_SIDEBAR_TOP_ID)
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      if (topIdPresent && scrollTop <= 16) {
        setActiveIdState(CASE_STUDY_SIDEBAR_TOP_ID)
        return
      }

      const offset = scrollSpyThresholdPx()
      const contentIds = topIdPresent
        ? ids.filter((i) => i !== CASE_STUDY_SIDEBAR_TOP_ID)
        : ids
      if (contentIds.length === 0) {
        setActiveIdState(topIdPresent ? CASE_STUDY_SIDEBAR_TOP_ID : null)
        return
      }
      let current = contentIds[0]
      for (const id of contentIds) {
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

  return { activeId, onNavigate, navSections }
}
