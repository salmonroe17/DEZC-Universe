import { useEffect, useState } from 'react'

export type CursorPosition = {
  /** Normalized -0.5 … 0.5 from center */
  x: number
  y: number
  rawX: number
  rawY: number
}

/**
 * Subtle cursor tracking for future parallax / magnetic UI.
 * Values are normalized for stable math across viewport sizes.
 */
export function useCursorInteraction(enabled = true): CursorPosition {
  const [position, setPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
    rawX: 0,
    rawY: 0,
  })

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const nx = e.clientX / innerWidth - 0.5
      const ny = e.clientY / innerHeight - 0.5
      setPosition({
        x: nx,
        y: ny,
        rawX: e.clientX,
        rawY: e.clientY,
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled])

  return position
}
