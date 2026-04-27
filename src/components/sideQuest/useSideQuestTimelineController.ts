import {
  useCallback,
  useMemo,
  useRef,
  type MutableRefObject,
  type RefObject,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { SIDEQUESTS } from '../../data/sidequests'

export type SideQuestTimelineController = {
  sandLineRootRef: RefObject<HTMLDivElement | null>
  sandTrackRef: RefObject<HTMLDivElement | null>
  sandPhaseRef: MutableRefObject<number>
  sandHoveredNodeIndexRef: MutableRefObject<number | null>
  sandScrollHUnitRef: MutableRefObject<number>
  sandRefs: {
    lineRootRef: RefObject<HTMLDivElement | null>
    trackRef: RefObject<HTMLDivElement | null>
    phaseRef: MutableRefObject<number>
    hoveredNodeIndexRef: MutableRefObject<number | null>
  }
  onNodeClick: (nodeIndex: number) => void
  getNodePreviewSrc: (nodeIndex: number) => string | undefined
  getNodeTitle: (nodeIndex: number) => string | undefined
}

/** Refs + navigation callbacks wired to {@link SIDEQUESTS} — one source for home, modal, and embeds. */
export function useSideQuestTimelineController(): SideQuestTimelineController {
  const navigate = useNavigate()
  const sidequestN = SIDEQUESTS.length

  const onNodeClick = useCallback(
    (nodeIndex: number) => {
      if (sidequestN === 0) return
      const sq = SIDEQUESTS[nodeIndex % sidequestN]
      if (!sq) return
      navigate(`/sidequest/${sq.id}`)
    },
    [navigate, sidequestN],
  )

  const getNodePreviewSrc = useCallback(
    (nodeIndex: number) => {
      if (sidequestN === 0) return undefined
      const sq = SIDEQUESTS[nodeIndex % sidequestN]!
      return sq.galleryImages[0] ?? sq.coverImage
    },
    [sidequestN],
  )

  const getNodeTitle = useCallback(
    (nodeIndex: number) => {
      if (sidequestN === 0) return undefined
      return SIDEQUESTS[nodeIndex % sidequestN]!.title
    },
    [sidequestN],
  )

  const sandLineRootRef = useRef<HTMLDivElement>(null)
  const sandTrackRef = useRef<HTMLDivElement>(null)
  const sandPhaseRef = useRef(0)
  const sandHoveredNodeIndexRef = useRef<number | null>(null)
  const sandScrollHUnitRef = useRef(0)

  const sandRefs = useMemo(
    () => ({
      lineRootRef: sandLineRootRef,
      trackRef: sandTrackRef,
      phaseRef: sandPhaseRef,
      hoveredNodeIndexRef: sandHoveredNodeIndexRef,
    }),
    [],
  )

  return {
    sandLineRootRef,
    sandTrackRef,
    sandPhaseRef,
    sandHoveredNodeIndexRef,
    sandScrollHUnitRef,
    sandRefs,
    onNodeClick,
    getNodePreviewSrc,
    getNodeTitle,
  }
}
