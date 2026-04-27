/**
 * Deletes global leaderboard data from Upstash (same key as api/leaderboard/store.ts).
 *
 * Usage (from repo root):
 *   node scripts/clear-leaderboard.mjs
 *
 * Reads KV_REST_API_* or UPSTASH_REDIS_* from the environment, or from .env.local / .env if present.
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Redis } from '@upstash/redis'

const LEADERBOARD_REDIS_KEY = 'leaderboard:scores'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnvFile(name) {
  const p = join(root, name)
  if (!existsSync(p)) return
  const text = readFileSync(p, 'utf8')
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const k = t.slice(0, eq).trim()
    let v = t.slice(eq + 1).trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    if (process.env[k] === undefined) process.env[k] = v
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? '').trim()
const token = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? '').trim()

if (!url || !token) {
  console.error(
    'Missing Redis REST credentials. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_*), or add them to .env.local',
  )
  process.exit(1)
}

const redis = new Redis({ url, token })
const n = await redis.del(LEADERBOARD_REDIS_KEY)
console.log(`DEL ${LEADERBOARD_REDIS_KEY} removed ${n} key(s). Global leaderboard is empty.`)
