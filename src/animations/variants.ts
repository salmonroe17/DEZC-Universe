import type { Variants } from 'framer-motion'

/**
 * Easing — easeOutExpo-style (fast start, long smooth settle).
 */
export const easeOutExpo: [number, number, number, number] = [0.19, 1, 0.22, 1]

/** Shorter exit: quick bias-in so route changes feel immediate */
export const easeInExpo: [number, number, number, number] = [0.7, 0, 0.84, 0]

const pageEase = easeOutExpo
const pageExitEase = easeInExpo

/** GPU-friendly page enter/exit: opacity + subtle scale */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.992,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: pageEase,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.996,
    transition: {
      duration: 0.16,
      ease: pageExitEase,
    },
  },
}
