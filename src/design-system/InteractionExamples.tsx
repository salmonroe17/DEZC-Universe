import { useState } from 'react'
import { useSiteTheme } from '../contexts/useSiteTheme'
import { CursorReticle } from '../components/CustomCursor'
import { PortfolioButton, PortfolioTextField } from '../components/system/PortfolioControls'
import { PortfolioAccordion } from '../components/system/PortfolioAccordion'
import { ChamferFrame } from '../components/system/ChamferFrame'

export function CursorStates() {
  const { theme } = useSiteTheme()
  if(theme==='luma-c')return <div className="ds-cursor-states"><span><i className="luma-cursor-sample"/>Glass droplet</span><span><i className="luma-cursor-sample luma-cursor-sample-action"/>Expanded on actions</span><span>Native text caret</span></div>
  if (theme.startsWith('luma')) return <div className="ds-cursor-states"><span>Native arrow</span><a href="#" onClick={event=>event.preventDefault()}>Pointer on links</a><span>Text caret in fields</span></div>
  return <div className="ds-cursor-states">{[{label:'Default',expanded:false,description:'Resting reticle · 1×'},{label:'Interactive',expanded:true,description:'Links, buttons & controls · 2.5×'},{label:'Text entry',expanded:false,description:'Native text cursor + resting reticle'}].map((state)=><div key={state.label}><div className="ds-reticle-display"><div><CursorReticle expanded={state.expanded}/></div>{state.label==='Text entry'&&<span className="ds-ibeam">Ⅰ</span>}</div><strong>{state.label}</strong><small>{state.description}</small></div>)}</div>
}

export function CursorPlayground({ compact = false }: {compact?:boolean}) {
  const { theme } = useSiteTheme()
  const [target,setTarget]=useState('Move over this area')
  const [clicked,setClicked]=useState(false)
  return <div className={`ds-cursor-playground ${compact?'ds-cursor-playground-compact':''}`} onPointerOver={(event)=>{const el=event.target as HTMLElement;setTarget(el.closest('input')?'Text entry · native caret':el.closest('button:not([disabled]),a,summary')?'Interactive · expanded reticle':el.closest('button[disabled]')?'Disabled · resting reticle':'Default · resting reticle')}}><div className="ds-cursor-instruction"><span className="ds-live-dot"/>Move, hover, click & type</div><div className="ds-cursor-targets"><PortfolioButton onClick={()=>setClicked(!clicked)}>{clicked?'Clicked ✓':'Hover / click me'}</PortfolioButton><PortfolioButton disabled>Disabled</PortfolioButton><PortfolioTextField aria-label="Cursor text-entry target" placeholder="Text-entry target"/></div><div className="ds-cursor-readout" role="status">{target}</div><p>{theme==='luma-c'?'Luma C uses a glass droplet cursor on desktop, expands over actions, and keeps the native text caret in fields.':theme.startsWith('luma')?'Luma uses native arrow, link and text cursors, with no targeting reticle or particle trail.':'The reticle and falling particle trail are the portfolio’s live cursor. Touch devices keep native behavior.'}</p></div>
}

export function CardCornerExamples({ compact = false }: {compact?:boolean}) {
  return <div className={`ds-corner-examples ${compact?'ds-corner-examples-compact':''}`}>{[false,true].map(animated=><div key={String(animated)}><ChamferFrame meteorTrail={animated} innerClassName="bg-elevated px-5 py-7"><span className="font-mono text-sm text-fg">{animated?'Meteor':'Default'}</span><p className="mt-2 font-mono text-[10px] text-fg-muted">Shared frame and native corner token</p></ChamferFrame></div>)}</div>
}

export function AccordionExamples({ compact = false }: {compact?:boolean}) {
  return <div className="ds-accordion-examples"><PortfolioAccordion className="ds-demo-accordion" summary="What stays consistent?" defaultOpen><p>Content, layout and original media. Shared colors and type create the visual system.</p></PortfolioAccordion><PortfolioAccordion className="ds-demo-accordion" summary="How do the corners work?"><p>The same clipped frame is used for cards, media and the homepage quadrants.</p></PortfolioAccordion>{!compact&&<><PortfolioAccordion className="ds-demo-accordion" summary="Nested content"><PortfolioAccordion className="ds-demo-accordion" summary="A second level"><p>Nested disclosure keeps related details together.</p></PortfolioAccordion></PortfolioAccordion><PortfolioAccordion className="ds-demo-accordion" summary="Unavailable section" disabled><p>Unavailable content.</p></PortfolioAccordion></>}</div>
}
