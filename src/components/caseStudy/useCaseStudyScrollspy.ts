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
 * Fallback when {@link UseCaseStudyScrollspyOptions.stickyOffsetPx} is not passed
 * (e.g. non–case-study shell). Must stay roughly in sync with scroll-margin on section targets.
 */
function scrollSpyThresholdPx(): number {
  if (typeof window === 'undefined') return 148
  const rootRemPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const md = window.matchMedia('(min-width: 768px)').matches
  const scrollMarginRem = md ? 32 : 28
  return scrollMarginRem * rootRemPx + 16
}

export type UseCaseStudyScrollspyOptions = {
  /**
   * Distance from viewport top to the “reading line” (px), usually the measured fixed header
   * including the mobile sections row + progress bar (`--cs-components-header-h`).
   */
  stickyOffsetPx?: number
}

export function useCaseStudyScrollspy(
  navSectionsIn: NavSection[],
  options: UseCaseStudyScrollspyOptions = {},
) {
  const { stickyOffsetPx } = options
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

  /** After sidebar / mobile nav click, ignore scroll-driven updates while smooth scroll settles. */
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

  const getOffset = useCallback(() => {
    if (stickyOffsetPx != null && Number.isFinite(stickyOffsetPx)) {
      return Math.max(0, stickyOffsetPx) + 2
    }
    return scrollSpyThresholdPx()
  }, [stickyOffsetPx])

  useEffect(() => {
    if (ids.length === 0) return

    const updateActive = () => {
      if (Date.now() < suppressSpyUntilRef.current) return

      const offset = getOffset()
      const topIdPresent = ids.includes(CASE_STUDY_SIDEBAR_TOP_ID)
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      if (topIdPresent && scrollTop <= 16) {
        setActiveIdState(CASE_STUDY_SIDEBAR_TOP_ID)
        return
      }

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

    const elements = ids
      .map((id) => (id === CASE_STUDY_SIDEBAR_TOP_ID ? null : document.getElementById(id)))
      .filter((el): el is HTMLElement => Boolean(el))

    let raf = 0
    const rafUpdate = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateActive)
    }

    updateActive()
    const t = window.setTimeout(() => {
      rafUpdate()
    }, 0)
    window.addEventListener('scroll', rafUpdate, { passive: true })
    window.addEventListener('resize', rafUpdate, { passive: true })

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(rafUpdate, {
            root: null,
            rootMargin: '0px',
            threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
          })
        : null
    elements.forEach((el) => io?.observe(el))

    return () => {
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', rafUpdate)
      window.removeEventListener('resize', rafUpdate)
      io?.disconnect()
    }
  }, [ids, getOffset])

  return { activeId, onNavigate, navSections }
}
