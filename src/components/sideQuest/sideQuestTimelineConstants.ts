/**
 * Line band: matches home “Side quests” quadrant — fades in with group hover / in-view.
 * Modal/footer shells should set `data-quadrant-in-view` on an ancestor `group/showtell` so the
 * rail stays fully visible while the dialog is open.
 */
export const SIDE_QUEST_LINE_BAND_CLASS =
  'relative z-[1] flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-visible opacity-30 transition-opacity duration-300 ease-out group-hover/showtell:opacity-100 group-data-[quadrant-in-view]/showtell:opacity-100'

/** Shared vertical offset for the scrolling track (wave + nodes + focus zone). */
export const SIDE_QUEST_LINE_TRACK_CLASS = '-translate-y-16'
