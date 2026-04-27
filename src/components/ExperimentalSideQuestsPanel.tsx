import type { ReactNode } from 'react'
import { SideQuestFlowingLineRail } from './sideQuest/SideQuestFlowingLineRail'
import { SideQuestSandBackground } from './sideQuest/SideQuestSandBackground'
import { useSideQuestTimelineController } from './sideQuest/useSideQuestTimelineController'
import { quadrantHeadingClass, showTellSubtitleClass } from './showTellQuadrantTypography'

/** Chamfered border + fill via ::before/::after (see index.css). */
const quadrantCell = 'quadrant-cell min-h-0 min-w-0'

/**
 * Home grid: bottom-left “Side quests” column is 2fr of a 2:1 split — mirror that width in modals
 * (see {@link ExperimentalGrid} and `caseStudiesHomeColumnWidthClass` for the 1fr / Case Studies
 * column).
 */
const showTellHomeColumnWidthClass =
  'w-full min-w-0 max-w-full lg:max-w-[calc(2*(100vw-2.5rem-1rem)/3)]'

/**
 * Case study nav modal: same max width as the home Side quests quadrant. Pair with
 * `footerColumn="modal-wide"` on the panel.
 */
export const SHOW_TELL_MODAL_SHELL_WIDTH_CLASS = `${showTellHomeColumnWidthClass} shrink-0`

const footerPanelHeightClass =
  'min-h-[max(28rem,min(70svh,44rem))] md:min-h-[max(32rem,min(75svh,50rem))]'

/** Side quests / show & tell: floor height so the sand + line never collapse. */
export const showTellQuadrantCell = 'quadrant-cell min-h-[300px] min-w-0'

export type ExperimentalSideQuestsPanelProps = {
  /** `quadrant`: home grid. `footer`: in-page or modal, chamfered block + min height. */
  layout?: 'quadrant' | 'footer'
  /**
   * `footer` only: `home-grid` width-matches 2/3 home column; `modal-wide` fills a dialog shell
   * (see {@link SHOW_TELL_MODAL_SHELL_WIDTH_CLASS}).
   */
  footerColumn?: 'home-grid' | 'modal-wide'
  topRightSlot?: ReactNode
}

/**
 * “Side quests” / show & tell quadrant: ambient lines, sand, flowing timeline. Shared by
 * {@link ExperimentalGrid} and the case-study “Side quests” nav modal. Timeline behavior is
 * unified via {@link useSideQuestTimelineController} + {@link SideQuestFlowingLineRail}.
 */
export function ExperimentalSideQuestsPanel({
  layout = 'quadrant',
  footerColumn = 'home-grid',
  topRightSlot,
}: ExperimentalSideQuestsPanelProps) {
  const timeline = useSideQuestTimelineController()

  const narrativeColumn = (
    <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">
      <h2 className={`${quadrantHeadingClass} relative z-[2]`}>
        My multiple timelines of side quests
      </h2>
      <p
        className={`${showTellSubtitleClass} relative z-[2] mt-[8px] mb-4 md:mb-5`}
      >
        Click squares to see visuals
      </p>
      <SideQuestFlowingLineRail controller={timeline} />
    </div>
  )

  const sandStack = <SideQuestSandBackground controller={timeline} />

  if (layout === 'quadrant') {
    return (
      <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col">
        {sandStack}
        {narrativeColumn}
      </div>
    )
  }

  const footerWidthClass =
    footerColumn === 'modal-wide' ? 'w-full min-w-0 max-w-full' : showTellHomeColumnWidthClass

  return (
    <div
      className={`${quadrantCell} group/showtell relative mx-auto flex ${footerWidthClass} ${footerPanelHeightClass} flex-col`}
      data-show-tell-quadrant
      data-quadrant-in-view
    >
      {topRightSlot ? (
        <div className="pointer-events-auto absolute right-2 top-2 z-[15] md:right-3 md:top-3">
          {topRightSlot}
        </div>
      ) : null}
      {sandStack}
      {narrativeColumn}
    </div>
  )
}
