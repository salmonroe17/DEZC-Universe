/**
 * Builds small WebP previews for Side quests flowing-line squares (~160px wide).
 * Full album PNGs are 1–4 MB each; these land around 5–25 KB.
 */

import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const albumsRoot = join(root, 'Side quest albums')
const outDir = join(root, 'public', 'sidequest-thumbs')

/** Must match SIDEQUESTS ids in src/data/sidequests.ts */
const ALBUMS = [
  { id: 'bobaghosteas', folder: 'Bobaghosteas' },
  { id: 'neon-drawings', folder: 'Neon drawings' },
  { id: 'japan-adventures', folder: 'Japan photos' },
  { id: 'concert-adventures', folder: 'Concert Photos' },
  { id: 'a-marriage-proposal', folder: 'A Marriage Proposal' },
  { id: 'eedenn', folder: 'EEDENN' },
  { id: 'daisy', folder: 'D.AI.SY' },
]

const IMAGE_EXT = /\.(png|jpe?g|gif|webp)$/i
const THUMB_WIDTH = 160

function firstImagePath(folderPath) {
  if (!existsSync(folderPath)) return null
  const names = readdirSync(folderPath)
    .filter((n) => IMAGE_EXT.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  if (names.length === 0) return null
  return join(folderPath, names[0])
}

async function main() {
  mkdirSync(outDir, { recursive: true })
  let wrote = 0

  for (const { id, folder } of ALBUMS) {
    const source = firstImagePath(join(albumsRoot, folder))
    const dest = join(outDir, `${id}.webp`)
    if (!source) {
      console.warn(`[sidequest-thumbs] skip ${id}: no image in "${folder}"`)
      continue
    }
    await sharp(source)
      .rotate()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(dest)
    wrote++
    console.info(`[sidequest-thumbs] ${id}.webp ← ${folder}/${source.split('/').pop()}`)
  }

  console.info(`[sidequest-thumbs] wrote ${wrote} preview(s) → public/sidequest-thumbs/`)
}

await main()
