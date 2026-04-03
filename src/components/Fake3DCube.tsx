/**
 * CSS faux 3D cube (4 faces). Rotation follows controlled activeCaseIndex.
 */

import { memo } from 'react'

const EDGE = '15rem' as const
const HALF = '7.5rem' as const

const ROTATION_BY_FACE = [0, -90, -180, -270] as const

const faceBase =
  'cube-face-glow absolute inset-0 flex items-center justify-center border border-cell-border/80 bg-surface/90 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted [backface-visibility:hidden]'

const CubeFaces = memo(function CubeFaces() {
  return (
    <>
      <div
        className={faceBase}
        style={{ transform: `rotateY(0deg) translateZ(${HALF})` }}
      >
        Case 1
      </div>
      <div
        className={faceBase}
        style={{ transform: `rotateY(90deg) translateZ(${HALF})` }}
      >
        Case 2
      </div>
      <div
        className={faceBase}
        style={{ transform: `rotateY(180deg) translateZ(${HALF})` }}
      >
        Case 3
      </div>
      <div
        className={faceBase}
        style={{ transform: `rotateY(-90deg) translateZ(${HALF})` }}
      >
        Case 4
      </div>
    </>
  )
})

function clampCaseIndex(i: number) {
  return Math.min(3, Math.max(0, Math.floor(i)))
}

export type Fake3DCubeProps = {
  activeCaseIndex: number
}

export function Fake3DCube({ activeCaseIndex }: Fake3DCubeProps) {
  const idx = clampCaseIndex(activeCaseIndex)
  const rotateY = ROTATION_BY_FACE[idx] ?? 0

  return (
    <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center p-4">
      <div
        className="relative [perspective:1000px] opacity-50 grayscale transition-[filter,opacity] duration-300 ease-out group-hover/right-quadrant:opacity-100 group-hover/right-quadrant:grayscale-0"
        style={{ width: EDGE, height: EDGE }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transition:
              'transform 600ms cubic-bezier(0.42, 0, 0.58, 1)',
            willChange: 'transform',
          }}
        >
          <CubeFaces />
        </div>
      </div>
    </div>
  )
}
