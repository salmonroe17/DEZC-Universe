import { useEffect, useRef, useState } from 'react'

const DEFAULT_CLASS = 'block h-auto w-full max-w-full align-middle'

/**
 * Case-study walkthrough / GIF-replacement video.
 * Does not set `src` until the element is near the viewport, so opening a page
 * does not download a multi-MB MP4. Unloads again when scrolled far away.
 */
export function CaseStudyLazyVideo({
  src,
  poster,
  ariaLabel,
  className = DEFAULT_CLASS,
  ariaHidden = false,
}: {
  src: string
  poster?: string
  ariaLabel?: string
  className?: string
  ariaHidden?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        setNear(entry.isIntersecting)
      },
      { rootMargin: '320px 0px', threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (!near) {
      video.pause()
      video.removeAttribute('src')
      video.load()
      return
    }
    const play = () => {
      video.currentTime = 0
      void video.play().catch(() => {})
    }
    if (video.readyState >= 2) {
      play()
      return
    }
    video.addEventListener('loadeddata', play, { once: true })
    return () => video.removeEventListener('loadeddata', play)
  }, [near, src])

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={near ? src : undefined}
      muted
      loop
      playsInline
      preload={near ? 'metadata' : 'none'}
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : ariaLabel}
    />
  )
}
