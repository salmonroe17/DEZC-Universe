import type { ReactNode } from 'react'
import { ChamferFrame } from '../../components/system/ChamferFrame'
import { ACTION_LAYER_STEP_1 } from './ibmEnviziContentBlocks'

export function IbmCoreFlowStepBlock({
  step,
  title,
  kicker,
  centerColumn,
  rightIntro,
  listItems,
  heading: Heading = 'h2',
  headingId,
  rootClassName = 'col-span-12 grid min-w-0 grid-cols-1 gap-6 p-5 md:grid-cols-3 md:gap-6 md:p-6',
}: {
  step: number
  title: string
  kicker: string
  centerColumn: ReactNode
  rightIntro: string
  listItems: readonly string[]
  heading?: 'h2' | 'h3'
  headingId?: string
  /** When nested in a {@link ChamferFrame}, use `w-full` without `col-span-12`. */
  rootClassName?: string
}) {
  return (
    <div className={rootClassName}>
      <div className="flex min-w-0 items-start gap-4 md:flex-col md:gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 bg-elevated/30 font-mono text-lg font-medium leading-none text-fg"
          aria-hidden
        >
          {step}
        </div>
        <div className="min-w-0">
          {Heading === 'h2' ? (
            <h2
              id={headingId}
              className="m-0 font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg"
            >
              {title}
            </h2>
          ) : (
            <h3 className="m-0 font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg">
              {title}
            </h3>
          )}
          <p className="m-0 mt-1.5 text-[12px] font-mono font-normal text-fg-muted">{kicker}</p>
        </div>
      </div>
      <p className="m-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] [text-wrap:pretty]">
        {centerColumn}
      </p>
      <div className="min-w-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
        <p className="m-0 [text-wrap:pretty]">{rightIntro}</p>
        <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
          {listItems.map((item) => (
            <li key={item} className="[text-wrap:pretty] pl-0.5">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function IbmActionLayerStep1Chamfer() {
  return (
    <ChamferFrame
      fitContentHeight
      className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
      innerClassName="min-w-0 overflow-hidden bg-elevated/20"
    >
      <div className="grid min-w-0 grid-cols-1 gap-6 p-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-8 md:p-6">
        <div className="flex min-w-0 items-start gap-4 md:max-w-none md:flex-col md:gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 bg-elevated/30 font-mono text-lg font-medium leading-none text-fg"
            aria-hidden
          >
            {ACTION_LAYER_STEP_1.step}
          </div>
          <div className="min-w-0">
            <h3 className="m-0 font-mono text-[17px] font-normal leading-snug tracking-[-0.02em] text-fg sm:text-lg">
              {ACTION_LAYER_STEP_1.title}
            </h3>
            <p className="m-0 mt-1.5 text-[12px] font-mono font-normal text-fg-muted">{ACTION_LAYER_STEP_1.kicker}</p>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-5 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] md:grid-cols-2 md:gap-6 md:gap-y-0">
          <p className="m-0 [text-wrap:pretty]">{ACTION_LAYER_STEP_1.middleColumn}</p>
          <div className="min-w-0">
            <p className="m-0 [text-wrap:pretty]">{ACTION_LAYER_STEP_1.rightIntro}</p>
            <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
              {ACTION_LAYER_STEP_1.listItems.map((item) => (
                <li key={item} className="[text-wrap:pretty] pl-0.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ChamferFrame>
  )
}
