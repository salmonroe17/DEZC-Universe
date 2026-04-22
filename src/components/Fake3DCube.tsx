/**
 * CSS faux 3D cube (4 faces). Rotation follows controlled activeCaseIndex.
 */

import { memo, type ReactNode } from 'react'
import caseStudy1Face from '../../CNC photos/c1.png'
import caseStudy2Face from '../../Super assets/s1.png'
import caseStudy3IbmFace from '../../IBM case study assets/ap1.png'

const EDGE = '15rem' as const
const HALF = '7.5rem' as const

const ROTATION_BY_FACE = [0, -90, -180, -270] as const

/**
 * Chamfered face shell — same pseudos as `quadrant-cell` via `cube-face-cell` (see index.css).
 * Do not use `quadrant-cell` here: it forces `position: relative` and breaks `absolute` + 3D.
 *
 * `cube-face-glow` sits on a wrapper outside `cube-face-cell`: clip-path on the cell would hide
 * inner `box-shadow`; animated `drop-shadow` on the wrapper follows the chamfered paint.
 */
const faceGlowWrap =
  'cube-face-glow absolute inset-0 min-h-0 min-w-0 [backface-visibility:hidden]'

const faceChamferShell =
  'cube-face-cell figma-frame-static relative h-full w-full [--quadrant-chamfer:clamp(14px,1.75vmin,30px)]'

const faceChamferInnerClip = 'chamfer-fill-clip min-h-0 min-w-0 size-full'

const faceLabelInner =
  'flex items-center justify-center bg-surface/90 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted'

/** Darkens edges of image faces so they match the mood of the label faces. */
const caseStudyImageFaceVignette =
  'pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_92%_92%_at_50%_50%,rgb(0_0_0/0)_38%,rgb(0_0_0/0.55)_72%,rgb(0_0_0/0.88)_100%)]'

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
    <div className={faceGlowWrap} style={{ transform }}>
      <div className={faceChamferShell}>
        <div className="relative z-10 box-border size-full min-h-0 min-w-0 p-px">
          <div className={`${faceChamferInnerClip} ${innerClassName}`}>
            {children}
          </div>
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
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className={caseStudyImageFaceVignette} aria-hidden />
        <span className="sr-only">Case 1</span>
      </CubeChamferFace>
      <CubeChamferFace
        transform={`rotateY(90deg) translateZ(${HALF})`}
        innerClassName="relative"
      >
        <img
          src={caseStudy2Face}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className={caseStudyImageFaceVignette} aria-hidden />
        <span className="sr-only">Case 2</span>
      </CubeChamferFace>
      <CubeChamferFace
        transform={`rotateY(180deg) translateZ(${HALF})`}
        innerClassName="relative"
      >
        <img
          src={caseStudy3IbmFace}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className={caseStudyImageFaceVignette} aria-hidden />
        <span className="sr-only">IBM Envizi</span>
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
