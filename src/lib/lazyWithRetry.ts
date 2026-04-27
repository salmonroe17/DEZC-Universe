import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

type Factory<T extends ComponentType<unknown>> = () => Promise<{ default: T }>

/**
 * Like `lazy()` but retries the dynamic `import()` a few times before failing.
 * Helps mobile / flaky networks where the first chunk fetch fails (stale cache, timeout).
 * Note: React still caches the promise from this factory — retries run inside that one call.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: Factory<T>,
  options?: { retries?: number; baseDelayMs?: number },
): LazyExoticComponent<T> {
  const { retries = 3, baseDelayMs = 400 } = options ?? {}

  return lazy(async () => {
    let last: unknown
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await factory()
      } catch (err) {
        last = err
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, baseDelayMs * (attempt + 1)))
        }
      }
    }
    throw last
  })
}
