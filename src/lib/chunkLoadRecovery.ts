/** Survives one full reload so we retry with a fresh document after stale hashed chunks (.e.g post-deploy cache mismatch). */
export const CHUNK_LOAD_RECOVERY_SESSION_KEY = 'dezc.dynamicImportRecoveryAttempt'

export function dynamicImportLikelyStaleChunkFailure(err: unknown): boolean {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : err != null && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : String(err)

  return /failed to fetch dynamically imported module|importing a module script failed|loading dynamically imported module|error loading dynamically imported module|import\(\).*failed/i.test(
    msg,
  )
}
