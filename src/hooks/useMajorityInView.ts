import { useEffect, useState } from 'react'

const DEFAULT_RATIO = 0.5
const THRESHOLDS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

/**
 * True when the element has at least `minRatio` of its area within the viewport
 * (`intersectionRatio`). Pass the live `HTMLElement | null` from a ref callback so the effect
 * re-runs when the node mounts (ref object identity alone does not trigger updates).
 */
export function useMajorityInView(
  element: HTMLElement | null,
  enabled: boolean,
  minRatio: number = DEFAULT_RATIO,
): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setInView(false)
      return
    }
    if (!element) return

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e) return
        setInView(e.intersectionRatio >= minRatio)
      },
      { root: null, rootMargin: '0px', threshold: THRESHOLDS },
    )
    obs.observe(element)
    return () => {
      obs.disconnect()
    }
  }, [element, enabled, minRatio])

  return inView
}
