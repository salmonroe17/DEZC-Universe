import { useEffect } from 'react'

function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    const done = () => resolve(img)
    img.onload = done
    img.onerror = done
    img.src = src
    if (img.complete) done()
  })
}

/**
 * Warm cache and decode bitmaps for stacked opacity crossfades (e.g. chamfer toggles)
 * so the first toggle doesn’t hitch while the hidden layer loads.
 */
export function usePreloadImages(urls: readonly string[]) {
  const urlsKey = urls.join('\u0000')

  useEffect(() => {
    if (!urlsKey) return
    const list = urlsKey.split('\u0000')
    let cancelled = false
    void Promise.all(
      list.map((src) =>
        preloadImage(src).then(async (img) => {
          if (cancelled) return
          try {
            await img.decode?.()
          } catch {
            /* decode unsupported or failed */
          }
        }),
      ),
    )
    return () => {
      cancelled = true
    }
  }, [urlsKey])
}
