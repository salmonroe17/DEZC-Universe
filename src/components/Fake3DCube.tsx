/**
 * CSS faux 3D cube (4 faces). Rotation follows controlled activeCaseIndex.
 */

import { memo, type ReactNode } from 'react'
import caseStudy1Face from '../../CNC photos/c1.png'

const EDGE = '15rem' as const
const HALF = '7.5rem' as const

const ROTATION_BY_FACE = [0, -90, -180, -270] as const

/**
 * Chamfered face shell — same pseudos as `quadrant-cell` via `cube-face-cell` (see index.css).
 * Do not use `quadrant-cell` here: it forces `position: relative` and breaks `absolute` + 3D.
 */
/** `cube-face-glow` stays on the chamfered inner only — outer box-shadow follows a square box and clashes with chamfer corners. */
const faceChamferOuter =
  'cube-face-cell figma-frame-static absolute inset-0 min-h-0 min-w-0 [backface-visibility:hidden] [--quadrant-chamfer:clamp(14px,1.75vmin,30px)]'

const faceChamferInnerClip =
  'chamfer-fill-clip cube-face-glow min-h-0 min-w-0 size-full'

const faceLabelInner =
  'flex items-center justify-center bg-surface/90 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted'

function CubeChamferFace({
  transform,
  innerClassName,
  children,
}: {
  transform: string
  innerClassName: string
  children: ReactNode
}) {
  return (
    <div className={faceChamferOuter} style={{ transform }}>
      <div className="relative z-10 box-border size-full min-h-0 min-w-0 p-px">
        <div className={`${faceChamferInnerClip} ${innerClassName}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

const CubeFaces = memo(function CubeFaces() {
  return (
    <>
      <CubeChamferFace
        transform={`rotateY(0deg) translateZ(${HALF})`}
        innerClassName="relative"
      >
        <img
          src={caseStudy1Face}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="sr-only">Case 1</span>
      </CubeChamferFace>
      <CubeChamferFace
        transform={`rotateY(90deg) translateZ(${HALF})`}
        innerClassName={faceLabelInner}
      >
        Case 2
      </CubeChamferFace>
      <CubeChamferFace
        transform={`rotateY(180deg) translateZ(${HALF})`}
        innerClassName={faceLabelInner}
      >
        Case 3
      </CubeChamferFace>
      <CubeChamferFace
        transform={`rotateY(-90deg) translateZ(${HALF})`}
        innerClassName={faceLabelInner}
      >
        Case 4
      </CubeChamferFace>
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
