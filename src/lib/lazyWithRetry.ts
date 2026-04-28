import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import {
  CHUNK_LOAD_RECOVERY_SESSION_KEY,
  dynamicImportLikelyStaleChunkFailure,
} from './chunkLoadRecovery'

type Factory<T extends ComponentType<unknown>> = () => Promise<{ default: T }>

/**
 * Like `lazy()` but retries the dynamic `import()` a few times before failing.
 * Helps mobile / flaky networks where the first chunk fetch fails (stale cache, timeout).
 * After deploys, the shell can reference old hashed filenames — recovering with one full reload
 * fetches fresh `index` + chunk manifests (matches common React/Vite SPA practice).
 *
 * Note: React still invokes this factory once per lazy boundary; retries run inside that call.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: Factory<T>,
  options?: { retries?: number; baseDelayMs?: number },
): LazyExoticComponent<T> {
  const { retries = 5, baseDelayMs = 400 } = options ?? {}

  return lazy(async () => {
    let last: unknown
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const mod = await factory()
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(CHUNK_LOAD_RECOVERY_SESSION_KEY)
        }
        return mod
      } catch (err) {
        last = err
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, baseDelayMs * (attempt + 1)))
        }
      }
    }

    if (
      typeof window !== 'undefined' &&
      dynamicImportLikelyStaleChunkFailure(last) &&
      !sessionStorage?.getItem(CHUNK_LOAD_RECOVERY_SESSION_KEY)
    ) {
      try {
        sessionStorage.setItem(CHUNK_LOAD_RECOVERY_SESSION_KEY, '1')
      } catch {
        /* quota / private mode */
      }
      window.location.reload()
      return await new Promise(() => {
        /* Reloading — never resolves until navigation */
      })
    }

    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem(CHUNK_LOAD_RECOVERY_SESSION_KEY)
      } catch {
        /* ignore */
      }
    }

    throw last
  })
}
