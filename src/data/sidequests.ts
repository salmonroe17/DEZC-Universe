import ds1 from '../../DS case study assets/ds1.png'
import ds3 from '../../DS case study assets/ds3.png'
import ds5 from '../../DS case study assets/ds5.png'

export type SideQuestEntry = {
  id: string
  title: string
  description: string
  /** Small preview for carousel nodes; optional */
  cover?: string
  /** Gallery images for the main viewer + thumbnail grid */
  images: string[]
}

/**
 * SideQuest projects — same count order as homepage wave nodes (index % length).
 */
export const SIDEQUESTS: readonly SideQuestEntry[] = [
  {
    id: 'daisy',
    title: 'D.AI.SY',
    description:
      'An experiment in conversational UI and lightweight design ops. Built to stress-test token naming, handoff, and what “one source of truth” really means in a small squad.',
    cover: ds1,
    images: [ds1, ds3, ds5],
  },
  {
    id: 'board-night',
    title: 'Tabletop prototype',
    description:
      'A physical + digital board-game hybrid: print-first layouts, rule sheets, and a companion web surface for state tracking. Focus on legibility, pacing, and table ergonomics.',
    cover: ds3,
    images: [ds3, ds1],
  },
  {
    id: 'vector-field',
    title: 'Flow fields',
    description:
      'Procedural line studies and flow-field sketches used to explore motion language before committing to UI chrome. Grids, noise, and a lot of iteration.',
    cover: ds5,
    images: [ds5],
  },
  {
    id: 'sketch-01',
    title: 'Sketch system 01',
    description:
      'A loose set of product sketches, annotations, and callouts. Less about polish and more about getting teams aligned in the first hour of a crit.',
    cover: ds1,
    images: [ds1],
  },
  {
    id: 'shader-brief',
    title: 'Shader brief',
    description:
      'A technical art direction one-pager: how far we push gradients, noise, and depth before performance budgets complain.',
    cover: ds5,
    images: [ds5, ds3, ds1],
  },
  {
    id: 'icons-pack',
    title: 'Icon pass',
    description:
      'A tight icon and glyph pass for a dense B2B surface: stroke weight, hit targets, and states that do not read like confetti on a 13" laptop.',
    cover: ds3,
    images: [ds3, ds1],
  },
  {
    id: 'writing-walls',
    title: 'Writing on walls',
    description:
      'Workshop wall captures and photographic notes from facilitation sessions. Information architecture in marker ink before it becomes a ticket queue.',
    cover: ds1,
    images: [ds1, ds5],
  },
] as const

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
