import type { ComponentPropsWithRef } from 'react'

export const presentationIconButtonClass = 'flex size-6 shrink-0 items-center justify-center rounded border border-cell-border bg-elevated/90 text-sm font-medium text-fg shadow-sm transition-[background-color,opacity,transform] duration-200 ease-out hover:bg-surface data-[preview-state=hover]:bg-surface data-[preview-state=focus-visible]:outline data-[preview-state=focus-visible]:outline-2 data-[preview-state=focus-visible]:outline-offset-2 data-[preview-state=focus-visible]:outline-fg/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-35'

/** Actual presentation toolbar action, shared by the deck and design system. */
export function PresentationIconButton({ className = '', ...props }: ComponentPropsWithRef<'button'>) {
  return <button type="button" {...props} data-ui="icon-button" className={`${presentationIconButtonClass} ${className}`}/>
}
