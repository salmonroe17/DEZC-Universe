/**
 * Case-study media: PNG/JPEG → WebP (max 1600px), GIF → looping MP4,
 * walkthrough MP4 → compressed 720p + poster still.
 *
 * Used as a Vite plugin (rewrites imports) and as `node scripts/optimize-case-study-media.mjs`.
 */

import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const repoRoot = join(__dirname, '..')

export const CASE_STUDY_FOLDERS = [
  'IBM case study assets',
  'CNC photos',
  'Super assets',
  'DS case study assets',
]

const STILL_MAX_WIDTH = 1600
const GIF_MAX_WIDTH = 640
const VIDEO_MAX_HEIGHT = 720

const cacheDir = join(homedir(), '.cache', 'dezc-case-study-media')

export const VIDEO_POSTERS = [
  {
    rel: 'IBM case study assets/IBM prototype video action plans 720p.mp4',
    poster: 'ibm-action-plans.webp',
    video: 'ibm-action-plans.mp4',
  },
  {
    rel: 'CNC photos/cnc video portfolio prototype 720p30.mp4',
    poster: 'carbon-prototype.webp',
    video: 'carbon-prototype.mp4',
  },
  {
    rel: 'Super assets/Super app walkthrough 1080p.mp4',
    poster: 'super-walkthrough.webp',
    video: 'super-walkthrough.mp4',
  },
]

export const POSTER_PUBLIC_DIR = join(repoRoot, 'public', 'case-study-media', 'posters')

function isInsideCaseStudyFolder(absPath) {
  const rel = relative(repoRoot, absPath)
  if (rel.startsWith('..') || rel.includes(`${join('Super assets', '[ARCHIVE]')}`)) return false
  if (rel.includes('[ARCHIVE]')) return false
  return CASE_STUDY_FOLDERS.some((folder) => rel === folder || rel.startsWith(`${folder}/`))
}

function cachePathFor(absPath, suffix) {
  const rel = relative(repoRoot, absPath)
  const { mtimeMs, size } = statSync(absPath)
  const key = createHash('sha1')
    .update(`${rel}:${size}:${mtimeMs}:${suffix}`)
    .digest('hex')
    .slice(0, 16)
  const base = rel.replace(/[^a-zA-Z0-9._-]+/g, '_')
  return join(cacheDir, `${base}.${key}${suffix}`)
}

export async function ensureStillWebp(absPath) {
  mkdirSync(cacheDir, { recursive: true })
  const out = cachePathFor(absPath, '.webp')
  if (existsSync(out)) return out
  await sharp(absPath, { limitInputPixels: false })
    .rotate()
    .resize({ width: STILL_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(out)
  return out
}

export function ensureGifMp4(absPath) {
  const stem = absPath.split('/').pop().replace(/\.gif$/i, '')
  const out = join(repoRoot, 'public', 'case-study-media', 'gifs', `${stem}.mp4`)
  mkdirSync(dirname(out), { recursive: true })
  if (existsSync(out) && existsSync(absPath) && statSync(out).mtimeMs >= statSync(absPath).mtimeMs) {
    return out
  }
  if (!hasFfmpeg()) return existsSync(out) ? out : absPath
  try {
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-i',
        absPath,
        '-vf',
        `scale='trunc(min(${GIF_MAX_WIDTH},iw)/2)*2':-2`,
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-crf',
        '30',
        '-preset',
        'fast',
        '-an',
        '-movflags',
        '+faststart',
        out,
      ],
      { stdio: 'pipe' },
    )
    return existsSync(out) && statSync(out).size > 0 ? out : absPath
  } catch {
    return existsSync(out) && statSync(out).size > 0 ? out : absPath
  }
}

function hasFfmpeg() {
  const r = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' })
  return r.status === 0
}

export function ensureCompressedVideo(absPath, publicFileName) {
  const out = join(repoRoot, 'public', 'case-study-media', 'videos', publicFileName)
  mkdirSync(dirname(out), { recursive: true })
  if (existsSync(out) && existsSync(absPath) && statSync(out).mtimeMs >= statSync(absPath).mtimeMs) {
    return out
  }
  if (!hasFfmpeg()) return existsSync(out) ? out : absPath
  try {
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-i',
        absPath,
        '-vf',
        `scale=-2:'min(${VIDEO_MAX_HEIGHT},ih)'`,
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-crf',
        '28',
        '-preset',
        'fast',
        '-an',
        '-movflags',
        '+faststart',
        out,
      ],
      { stdio: 'pipe' },
    )
    return existsSync(out) ? out : absPath
  } catch {
    return existsSync(out) ? out : absPath
  }
}

export async function writeVideoPosterFromFrame(absPath, posterFileName) {
  mkdirSync(POSTER_PUBLIC_DIR, { recursive: true })
  mkdirSync(cacheDir, { recursive: true })
  const dest = join(POSTER_PUBLIC_DIR, posterFileName)
  if (existsSync(dest) && statSync(dest).mtimeMs >= statSync(absPath).mtimeMs) return dest
  if (!hasFfmpeg()) return dest
  const tmpPng = join(cacheDir, `${posterFileName}.frame.png`)
  try {
    execFileSync(
      'ffmpeg',
      ['-y', '-ss', '0.15', '-i', absPath, '-frames:v', '1', tmpPng],
      { stdio: 'pipe' },
    )
  } catch {
    return dest
  }
  if (!existsSync(tmpPng)) return dest
  await sharp(tmpPng)
    .resize({ width: STILL_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toFile(dest)
  return dest
}

export function caseStudyMediaPlugin() {
  return {
    name: 'case-study-media',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!importer || source.includes('\0')) return null
      const bare = source.split('?')[0]
      if (!/\.(png|jpe?g|gif|mp4)$/i.test(bare)) return null
      const from = importer.split('?')[0]
      const abs = join(dirname(from), bare)
      if (!existsSync(abs) || !isInsideCaseStudyFolder(abs)) return null
      const ext = extname(abs).toLowerCase()
      let resolved = abs
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') resolved = await ensureStillWebp(abs)
      else if (ext === '.gif') resolved = ensureGifMp4(abs)
      else if (ext === '.mp4') {
        const spec = VIDEO_POSTERS.find((v) => abs.endsWith(v.rel) || relative(repoRoot, abs) === v.rel)
        if (!spec) return null
        resolved = ensureCompressedVideo(abs, spec.video)
      } else {
        return null
      }
      const publicRoot = join(repoRoot, 'public')
      const relPublic = relative(publicRoot, resolved)
      if (!relPublic.startsWith('..')) {
        return `\0case-study-public:${relPublic.replace(/\\/g, '/')}`
      }
      return resolved
    },
    load(id) {
      if (!id.startsWith('\0case-study-public:')) return null
      const rel = id.slice('\0case-study-public:'.length)
      return `export default ${JSON.stringify(`/${rel}`)}`
    },
  }
}

function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc
  for (const name of readdirSync(dir)) {
    if (name === '[ARCHIVE]' || name === '.DS_Store') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walkFiles(full, acc)
    else acc.push(full)
  }
  return acc
}

export async function optimizeAllCaseStudyMedia() {
  mkdirSync(cacheDir, { recursive: true })
  mkdirSync(POSTER_PUBLIC_DIR, { recursive: true })
  let stills = 0
  let gifs = 0
  for (const folder of CASE_STUDY_FOLDERS) {
    const files = walkFiles(join(repoRoot, folder))
    for (const file of files) {
      const ext = extname(file).toLowerCase()
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        await ensureStillWebp(file)
        stills++
      } else if (ext === '.gif') {
        ensureGifMp4(file)
        gifs++
      }
    }
  }
  let videos = 0
  for (const { rel, poster, video } of VIDEO_POSTERS) {
    const abs = join(repoRoot, rel)
    if (!existsSync(abs)) continue
    ensureCompressedVideo(abs, video)
    await writeVideoPosterFromFrame(abs, poster)
    videos++
  }
  writeFileSync(
    join(POSTER_PUBLIC_DIR, '.keep'),
    '',
  )
  console.info(
    `[case-study-media] stills=${stills} gifs=${gifs} videos=${videos} cache=${cacheDir}`,
  )
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isDirectRun) {
  await optimizeAllCaseStudyMedia()
}
