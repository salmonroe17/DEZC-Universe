import { useEffect, useState } from 'react'

const QUERY = '(hover: none), (pointer: coarse)'

/**
 * True when the primary input is not a fine pointer (e.g. touch) or the UA reports no
 * hover capability — *not* a breakpoint. Used to mirror :hover with viewport visibility on touch.
 */
export function useNoPrimaryHoverDevice(): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(QUERY)
    const sync = () => setActive(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return active
}
