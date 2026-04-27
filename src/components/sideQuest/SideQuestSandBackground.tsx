import { ShowTellAmbientLines } from '../ShowTellAmbientLines'
import { ShowTellSandCanvas } from '../ShowTellSandCanvas'
import type { SideQuestTimelineController } from './useSideQuestTimelineController'

export type SideQuestSandBackgroundProps = {
  controller: SideQuestTimelineController
}

export function SideQuestSandBackground({ controller }: SideQuestSandBackgroundProps) {
  return (
    <>
      <ShowTellAmbientLines
        scrollHUnitRef={controller.sandScrollHUnitRef}
        hoveredNodeIndexRef={controller.sandHoveredNodeIndexRef}
      />
      <ShowTellSandCanvas sandRefs={controller.sandRefs} />
    </>
  )
}
