import { useEffect } from 'react'
import { SIDEQUESTS } from '../../data/sidequests'

/** Warm-cache small square previews (~72 KB total) after first paint. */
export function usePrefetchSideQuestPreviews() {
  useEffect(() => {
    const prefetch = () => {
      for (const sq of SIDEQUESTS) {
        const preview = sq.coverPreview
        if (!preview) continue
        const img = new Image()
        img.decoding = 'async'
        img.src = preview
      }
    }

    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(prefetch, { timeout: 2500 })
      return () => cancelIdleCallback(id)
    }
    const id = window.setTimeout(prefetch, 400)
    return () => window.clearTimeout(id)
  }, [])
}
