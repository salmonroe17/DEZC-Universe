import type { VercelResponse } from '@vercel/node'

/** Allow browser calls from localhost / other origins when `VITE_LEADERBOARD_API` points here. */
export function applyLeaderboardCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
}

export function preflightLeaderboard(res: VercelResponse) {
  applyLeaderboardCors(res)
  return res.status(204).end()
}
