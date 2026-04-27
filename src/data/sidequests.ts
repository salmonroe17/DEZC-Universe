import { FLOW_NODE_COUNT } from '../lib/flowingLineWave'

/**
 * Side quest media in repo root `Side quest albums/<folder>/`.
 * Sorted paths: first file in each folder is the thumbnail (`coverImage` === `galleryImages[0]`).
 *
 * Each `import.meta.glob` pattern and options must be static literals (no variables / spread).
 */
function sortGlobModules(mods: Record<string, string>): string[] {
  return Object.keys(mods)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((k) => mods[k]!)
}

const bobaghosteasMedia = sortGlobModules(
  import.meta.glob('../../Side quest albums/Bobaghosteas/*.{png,jpg,jpeg,gif,mp4,JPG,JPEG,PNG,GIF,MP4}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
const neonDrawingsMedia = sortGlobModules(
  import.meta.glob('../../Side quest albums/Neon drawings/*.{png,jpg,jpeg,gif,mp4,JPG,JPEG,PNG,GIF,MP4}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
const japanPhotosMedia = sortGlobModules(
  import.meta.glob('../../Side quest albums/Japan photos/*.{png,jpg,jpeg,gif,mp4,JPG,JPEG,PNG,GIF,MP4}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
const concertPhotosMedia = sortGlobModules(
  import.meta.glob('../../Side quest albums/Concert Photos/*.{png,jpg,jpeg,gif,mp4,JPG,JPEG,PNG,GIF,MP4}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
const marriageProposalMedia = sortGlobModules(
  import.meta.glob('../../Side quest albums/A Marriage Proposal/*.{png,jpg,jpeg,gif,mp4,JPG,JPEG,PNG,GIF,MP4}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
const eedennMedia = sortGlobModules(
  import.meta.glob('../../Side quest albums/EEDENN/*.{png,jpg,jpeg,gif,mp4,JPG,JPEG,PNG,GIF,MP4}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
const daisyMedia = sortGlobModules(
  import.meta.glob('../../Side quest albums/D.AI.SY/*.{png,jpg,jpeg,gif,mp4,JPG,JPEG,PNG,GIF,MP4}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)

export function isSideQuestVideoUrl(url: string): boolean {
  return /\.mp4$/i.test(url)
}

export type SideQuestEntry = {
  id: string
  title: string
  description: string
  /** First file in album (thumbnail): carousel + flowing-line node preview */
  coverImage: string
  /** All album files in sort order, including video */
  galleryImages: string[]
}

/**
 * SideQuest projects — same count order as homepage wave nodes (index % length).
 * Default viewer route uses index 0 (BobaGhosteas).
 */
export const SIDEQUESTS: readonly SideQuestEntry[] = [
  {
    id: 'bobaghosteas',
    title: 'BobaGhosteas',
    description:
      'A playful character series I created with my wife, turning bubble tea flavors into tiny ghost personalities inspired by our relationship. Built for comics, jokes, and documenting everyday moments with charm.',
    coverImage: bobaghosteasMedia[0] ?? '',
    galleryImages: bobaghosteasMedia,
  },
  {
    id: 'neon-drawings',
    title: 'Neon Drawings',
    description:
      'A collection of one-line neon illustrations focused on sneakers, Raptors themes, and everyday obsessions. An exploration of simplicity, glow, and nostalgic arcade energy.',
    coverImage: neonDrawingsMedia[0] ?? '',
    galleryImages: neonDrawingsMedia,
  },
  {
    id: 'japan-adventures',
    title: 'Japan Adventures',
    description:
      'A photo journal dedicated to my favorite place in the world. Moments, streets, food, and memories captured across trips through Japan.',
    coverImage: japanPhotosMedia[0] ?? '',
    galleryImages: japanPhotosMedia,
  },
  {
    id: 'concert-adventures',
    title: 'Concert Adventures',
    description:
      'A visual archive of unforgettable live shows and music memories. Featuring highlights like BTS, Coldplay, Childish Gambino, Jeremy Zucker, and more.',
    coverImage: concertPhotosMedia[0] ?? '',
    galleryImages: concertPhotosMedia,
  },
  {
    id: 'a-marriage-proposal',
    title: 'A Marriage Proposal',
    description:
      'A 40-page illustrated storybook I created for my wife before proposing. It documented a surprise one-day New York adventure that ended with the proposal itself.',
    coverImage: marriageProposalMedia[0] ?? '',
    galleryImages: marriageProposalMedia,
  },
  {
    id: 'eedenn',
    title: 'EEDENN',
    description:
      'A reflective social app concept where thoughts grow into living plants inside a personal digital garden. I used it to pitch co-founders through Y Combinator matching and explore calmer alternatives to modern social media.',
    coverImage: eedennMedia[0] ?? '',
    galleryImages: eedennMedia,
  },
  {
    id: 'daisy',
    title: 'D.AI.SY',
    description:
      'Short for Design AI System, an AI-powered platform that generates and maintains full design systems from screenshots, ideas, or URLs. Built to help teams create components faster, detect inconsistencies, and scale product design with less friction.',
    coverImage: daisyMedia[0] ?? '',
    galleryImages: daisyMedia,
  },
]

if (import.meta.env.DEV && SIDEQUESTS.length !== FLOW_NODE_COUNT) {
  console.error(
    `[sidequests] SIDEQUESTS.length (${SIDEQUESTS.length}) must equal FLOW_NODE_COUNT (${FLOW_NODE_COUNT}) — homepage wave will mismatch.`,
  )
}

const byId = new Map(SIDEQUESTS.map((q) => [q.id, q] as const))

export function getSideQuestById(id: string | undefined): SideQuestEntry | undefined {
  if (!id) return undefined
  return byId.get(id)
}

export function getSideQuestIndexById(id: string | undefined): number {
  if (!id) return 0
  const i = SIDEQUESTS.findIndex((q) => q.id === id)
  return i < 0 ? 0 : i
}
