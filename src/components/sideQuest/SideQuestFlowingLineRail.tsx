import { FlowingLine } from '../FlowingLine'
import {
  SIDE_QUEST_LINE_BAND_CLASS,
  SIDE_QUEST_LINE_TRACK_CLASS,
} from './sideQuestTimelineConstants'
import type { SideQuestTimelineController } from './useSideQuestTimelineController'

export type SideQuestFlowingLineRailProps = {
  controller: SideQuestTimelineController
  /** Optional multiplier on chevron scrub; default 1 — same as home quadrant (see {@link FlowingLine}). */
  arrowDriftRateScale?: number
  lineBandClassName?: string
  lineTrackClassName?: string
}

/**
 * Single “Side quests” flowing rail: invisible center focus zone, thumbnail spotlight, and idle
 * path motion — same everywhere (home, case-study modal, etc.). Reduced-motion users still get
 * correct gating inside {@link FlowingLine}.
 */
export function SideQuestFlowingLineRail({
  controller,
  arrowDriftRateScale = 1,
  lineBandClassName = SIDE_QUEST_LINE_BAND_CLASS,
  lineTrackClassName = SIDE_QUEST_LINE_TRACK_CLASS,
}: SideQuestFlowingLineRailProps) {
  return (
    <div className={lineBandClassName}>
      <FlowingLine
        sandLineRootRef={controller.sandLineRootRef}
        sandTrackRef={controller.sandTrackRef}
        sandPhaseRef={controller.sandPhaseRef}
        sandHoveredNodeIndexRef={controller.sandHoveredNodeIndexRef}
        sandScrollHUnitRef={controller.sandScrollHUnitRef}
        onNodeClick={controller.onNodeClick}
        getNodePreviewSrc={controller.getNodePreviewSrc}
        getNodeTitle={controller.getNodeTitle}
        arrowDriftRateScale={arrowDriftRateScale}
        idleSpotlightAutoplay
        lineTrackClassName={lineTrackClassName}
      />
    </div>
  )
}
