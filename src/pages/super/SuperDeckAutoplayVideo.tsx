import { useEffect, useRef } from 'react'

export function SuperDeckAutoplayVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          video.currentTime = 0
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="block h-auto w-full max-w-full align-middle"
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Screen recording of the Super app walkthrough"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
