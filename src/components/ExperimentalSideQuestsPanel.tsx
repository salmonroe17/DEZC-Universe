import { useCallback, useMemo, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { SIDEQUESTS } from '../data/sidequests'
import { FlowingLine } from './FlowingLine'
import { ShowTellAmbientLines } from './ShowTellAmbientLines'
import { ShowTellSandCanvas } from './ShowTellSandCanvas'

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

const quadrantHeadingClass =
  'shrink-0 px-4 pt-3 text-left text-[11px] font-semibold tracking-[0.06em] text-fg/90 md:pt-4 md:text-xs md:tracking-[0.05em]'

const showTellSubtitleClass =
  'shrink-0 px-4 pb-1.5 text-left text-[10px] font-normal leading-snug tracking-[0.04em] text-fg-subtle md:pb-2 md:text-[11px] md:tracking-[0.035em]'

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
 * {@link ExperimentalGrid} and the case-study “Side quests” nav modal.
 */
export function ExperimentalSideQuestsPanel({
  layout = 'quadrant',
  footerColumn = 'home-grid',
  topRightSlot,
}: ExperimentalSideQuestsPanelProps) {
  const navigate = useNavigate()
  const sidequestN = SIDEQUESTS.length

  const onShowTellNodeClick = useCallback(
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
      return sq.images[0] ?? sq.cover
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

  const lineBandClass =
    layout === 'quadrant'
      ? 'relative z-[1] flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-visible opacity-30 transition-opacity duration-300 ease-out group-hover/showtell:opacity-100 group-data-[quadrant-in-view]/showtell:opacity-100'
      : 'relative z-[1] flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-visible opacity-100'

  const sandStack = (
    <>
      <ShowTellAmbientLines
        scrollHUnitRef={sandScrollHUnitRef}
        hoveredNodeIndexRef={sandHoveredNodeIndexRef}
      />
      <ShowTellSandCanvas sandRefs={sandRefs} />
    </>
  )

  const narrativeColumn = (
    <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">
      <h2
        className={`${quadrantHeadingClass} relative z-[2] w-fit max-w-full shrink-0 self-start`}
      >
        My multiple timelines of side quests
      </h2>
      <p
        className={`${showTellSubtitleClass} relative z-[2] mt-[8px] mb-4 w-fit max-w-full shrink-0 self-start md:mb-5`}
      >
        Click squares to see visuals
      </p>
      <div className={lineBandClass}>
        <FlowingLine
          sandLineRootRef={sandLineRootRef}
          sandTrackRef={sandTrackRef}
          sandPhaseRef={sandPhaseRef}
          sandHoveredNodeIndexRef={sandHoveredNodeIndexRef}
          sandScrollHUnitRef={sandScrollHUnitRef}
          onNodeClick={onShowTellNodeClick}
          getNodePreviewSrc={getNodePreviewSrc}
          getNodeTitle={getNodeTitle}
          arrowDriftRateScale={layout === 'footer' ? 1.75 : 1}
          idleSpotlightAutoplay={layout === 'quadrant'}
          lineTrackClassName={layout === 'quadrant' ? '-translate-y-16' : undefined}
        />
      </div>
    </div>
  )

  if (layout === 'quadrant') {
    return (
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
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

export { quadrantHeadingClass, showTellSubtitleClass }
