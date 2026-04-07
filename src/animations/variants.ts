import type { Variants } from 'framer-motion'

/**
 * Easing — easeOutExpo-style (fast start, long smooth settle).
 */
export const easeOutExpo: [number, number, number, number] = [0.19, 1, 0.22, 1]

/** Shorter exit: quick bias-in so route changes feel immediate */
export const easeInExpo: [number, number, number, number] = [0.7, 0, 0.84, 0]

const pageEase = easeOutExpo
const pageExitEase = easeInExpo

/**
 * Page enter/exit: opacity only (no transform).
 * Transform on this wrapper breaks descendant `backdrop-filter` (nav glass reads as ~no blur).
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.24,
      ease: pageEase,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.16,
      ease: pageExitEase,
    },
  },
}
