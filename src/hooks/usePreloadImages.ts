import { useLayoutEffect, type RefObject } from 'react'

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

function warmUrls(urls: readonly string[], cancelled: () => boolean) {
  return Promise.all(
    urls.map((src) =>
      preloadImage(src).then(async (img) => {
        if (cancelled()) return
        try {
          await img.decode?.()
        } catch {
          /* decode unsupported or failed */
        }
      }),
    ),
  )
}

/**
 * Warm cache and decode bitmaps for stacked opacity crossfades (e.g. chamfer toggles)
 * so the first toggle doesn’t hitch while the hidden layer loads.
 *
 * Pass `rootRef` to wait until that node is near the viewport instead of fetching on mount.
 */
export function usePreloadImages(
  urls: readonly string[],
  rootRef?: RefObject<Element | null>,
) {
  const urlsKey = urls.join('\u0000')

  useLayoutEffect(() => {
    if (!urlsKey) return
    const list = urlsKey.split('\u0000')
    let cancelled = false
    const isCancelled = () => cancelled

    const node = rootRef?.current
    if (!node) {
      if (rootRef) return
      void warmUrls(list, isCancelled)
      return () => {
        cancelled = true
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        observer.disconnect()
        void warmUrls(list, isCancelled)
      },
      { rootMargin: '280px 0px', threshold: 0.01 },
    )
    observer.observe(node)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [urlsKey, rootRef])
}
