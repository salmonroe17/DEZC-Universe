/** Public WebP previews for homepage Side quests squares (see scripts/generate-sidequest-thumbs.mjs). */
export const SIDEQUEST_PREVIEW_PATHS: Record<string, string> = {
  bobaghosteas: '/sidequest-thumbs/bobaghosteas.webp',
  'neon-drawings': '/sidequest-thumbs/neon-drawings.webp',
  'japan-adventures': '/sidequest-thumbs/japan-adventures.webp',
  'concert-adventures': '/sidequest-thumbs/concert-adventures.webp',
  'a-marriage-proposal': '/sidequest-thumbs/a-marriage-proposal.webp',
  eedenn: '/sidequest-thumbs/eedenn.webp',
  daisy: '/sidequest-thumbs/daisy.webp',
}

export function sideQuestCoverPreview(id: string): string {
  return SIDEQUEST_PREVIEW_PATHS[id] ?? ''
}
