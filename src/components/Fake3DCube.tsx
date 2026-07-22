/**
 * CSS faux 3D cube (4 faces). Rotation follows controlled activeCaseIndex.
 *
 * Navigation: a flat 2D Link overlay on the bezel (not the 3D faces). Preserve-3d faces plus
 * ancestor `overflow: hidden` / `filter` break hit-testing in Chromium & WebKit — clicks on the
 * graphic would miss the face Links. Overlay targets the same path as the active list “View”.
 */

import {
  memo,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { Link } from 'react-router-dom'
import {
  CASE_STUDY_FACE_PATHS,
  IBM_ENVIZI_CASE_STUDY,
  PRIMARY_CASE_STUDY,
  SUPER_CASE_STUDY,
} from '../constants/caseStudyCatalog'
import caseStudy1Face from '../../CNC photos/c1.png'
import caseStudy2Face from '../../Super assets/s1.png'
import caseStudy3IbmFace from '../../IBM case study assets/ap1.png'
import caseStudy4DsFace from '../../DS case study assets/ds1.png'

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
/* Outer face = 3D transform + chamfer var only. `cube-face-glow` is on an inner block so the stroke
 * layer is never under `filter: drop-shadow` (which breaks / eats SVG in many browsers). */
const face3dShell =
  'pointer-events-none absolute inset-0 min-h-0 min-w-0 [backface-visibility:hidden] [--quadrant-chamfer:clamp(14px,1.75vmin,30px)]'

const FACE_ARIA = [
  `Open case study: ${PRIMARY_CASE_STUDY.title}`,
  `Open case study: ${SUPER_CASE_STUDY.title}`,
  `Open case study: ${IBM_ENVIZI_CASE_STUDY.title}`,
  'Open design system reference: Systems behind the screens',
] as const

/** Flat hit target over the cube — avoids broken 3D face pointer events. */
const cubeNavOverlayClass =
  'absolute inset-0 z-20 block cursor-pointer bg-transparent no-underline outline-none focus-visible:ring-2 focus-visible:ring-fg/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

const faceContentGlow = 'cube-face-glow absolute inset-0 min-h-0 min-w-0'

const faceChamferShell = 'cube-face-cell figma-frame-static relative h-full w-full'

/** Dims face media only; inner border is a sibling so it stays full opacity (see `opacity-50` note). */
const faceContentDim =
  'absolute inset-0 opacity-50 grayscale transition-[filter,opacity] duration-300 ease-out group-hover/right-quadrant:opacity-100 group-hover/right-quadrant:grayscale-0 group-data-[quadrant-in-view]/right-quadrant:opacity-100 group-data-[quadrant-in-view]/right-quadrant:grayscale-0'

const faceChamferInnerClip = 'chamfer-fill-clip relative min-h-0 min-w-0 size-full'

/** Darkens edges of image faces to match the panel mood. */
const caseStudyImageFaceVignette =
  'pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_92%_92%_at_50%_50%,rgb(0_0_0/0)_38%,rgb(0_0_0/0.55)_72%,rgb(0_0_0/0.88)_100%)]'

type ChamferDim = { w: number; h: number; c: number }

function readChamferStrokeDims(el: HTMLElement): ChamferDim | null {
  const w = el.clientWidth
  const h = el.clientHeight
  if (w < 1 || h < 1) return null
  const raw = getComputedStyle(el).getPropertyValue('--quadrant-chamfer').trim()
  let c = parseFloat(raw)
  if (!Number.isFinite(c) || c <= 0) {
    c = Math.min(24, Math.min(w, h) * 0.1)
  }
  const cap = Math.min(w, h) * 0.45
  return { w, h, c: Math.min(c, cap) }
}

/**
 * Inner highlight on the true chamfer outline (SVG), on `.cube-face-stroke-clip` — *not* inside
 * `.chamfer-fill-clip` (see index.css) so the stroke is not double-clipped. Sibling of the dimmed
 * face content so the line is not multiplied by `opacity-50`.
 */
/** Sensible first paint (15rem @16px) until `ResizeObserver` runs — avoids no SVG in 3D. */
const STROKE_DIM_FALLBACK: ChamferDim = { w: 240, h: 240, c: 20 }

function CubeFaceChamferInnerStroke({ measureRef }: { measureRef: RefObject<HTMLDivElement | null> }) {
  const [dim, setDim] = useState<ChamferDim>(STROKE_DIM_FALLBACK)

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const sync = () => {
      const d = readChamferStrokeDims(el)
      if (d) setDim(d)
    }

    sync()
    requestAnimationFrame(sync)
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      ro.disconnect()
    }
  }, [measureRef])

  const { w, h, c } = dim
  const points = `0,0 ${w - c},0 ${w},${c} ${w},${h} ${c},${h} 0,${h - c}`
  const cx = w / 2
  const cy = h / 2
  // Slight inset so a centered hairline is not half-clipped at the chamfer clip edge
  const insetG = `translate(${cx} ${cy}) scale(0.997) translate(${-cx} ${-cy})`

  return (
    <svg
      className="block h-full w-full [color:var(--color-hud)]"
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
    >
      <g transform={insetG}>
        <polygon
          fill="none"
          points={points}
          stroke="currentColor"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={0.5}
          vectorEffect="nonScalingStroke"
        />
      </g>
    </svg>
  )
}

function CubeChamferFace({
  transform,
  innerClassName,
  children,
}: {
  transform: string
  innerClassName: string
  children: ReactNode
}) {
  const strokeMeasureRef = useRef<HTMLDivElement | null>(null)
  return (
    <div className={face3dShell} style={{ transform }} aria-hidden>
      <div className={faceContentGlow}>
        <div className={faceContentDim}>
          <div className={faceChamferShell}>
            <div className="relative z-10 box-border size-full min-h-0 min-w-0 p-px">
              <div className={`${faceChamferInnerClip} ${innerClassName}`}>{children}</div>
            </div>
          </div>
        </div>
      </div>
      <div ref={strokeMeasureRef} className="cube-face-stroke-clip">
        <CubeFaceChamferInnerStroke measureRef={strokeMeasureRef} />
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
      </CubeChamferFace>
      <CubeChamferFace
        transform={`rotateY(-90deg) translateZ(${HALF})`}
        innerClassName="relative"
      >
        <img
          src={caseStudy4DsFace}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className={caseStudyImageFaceVignette} aria-hidden />
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
  const href = CASE_STUDY_FACE_PATHS[idx]

  return (
    <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center p-4">
      <div
        className="group/cube-bezel relative [perspective:1000px]"
        style={{ width: EDGE, height: EDGE }}
      >
        {/* Flat overlay: same destination as active list “View”; reliable across viewports */}
        <Link to={href} className={cubeNavOverlayClass} aria-label={FACE_ARIA[idx]} />
        {/* 2D scale wrapper: keep separate from 3D rotateY so `transform` does not get overwritten */}
        <div
          className="pointer-events-none h-full w-full origin-center transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:group-hover/cube-bezel:scale-100 motion-reduce:group-data-[quadrant-in-view]/right-quadrant:scale-100 group-hover/cube-bezel:scale-[1.02] group-data-[quadrant-in-view]/right-quadrant:scale-[1.02]"
        >
          <div
            className="relative h-full w-full [transform-style:preserve-3d]"
            style={{
              transform: `rotateY(${rotateY}deg)`,
              transition: 'transform 600ms cubic-bezier(0.42, 0, 0.58, 1)',
              willChange: 'transform',
            }}
          >
            <CubeFaces />
          </div>
        </div>
      </div>
    </div>
  )
}
