import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ImageSquare, TextAa, Minus, Plus, X } from '@phosphor-icons/react'
import inventory from './inventory'
import { CaseStudyPresentationOverlay, type CaseStudyPresentationSlide } from '../components/caseStudy/CaseStudyPresentationOverlay'
import { PortfolioButton } from '../components/system/PortfolioControls'

const hero=inventory.assets.find(asset=>asset.file==='Super assets/s1.png')
const overview=inventory.assets.find(asset=>asset.file==='Super assets/s2.png')
type Deck={slides:CaseStudyPresentationSlide[];thumbs:readonly(string|undefined)[]}

export function PresentationExamples({compact=false}:{compact?:boolean}) {
  const [deck,setDeck]=useState<Deck|null>(null)
  const [mode,setMode]=useState<'media'|'mixed'>('media')
  const [open,setOpen]=useState(false)
  const [active,setActive]=useState(0)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const trigger=useRef<HTMLButtonElement|null>(null)
  async function launch(next:'media'|'mixed',button:HTMLButtonElement) {
    trigger.current=button
    setLoading(true)
    setError('')
    try {
      let data=deck
      if(!data){const module=await import('../pages/super/SuperPresentationDeck');data={slides:module.SUPER_PRESENTATION_SLIDES,thumbs:module.SUPER_PRESENTATION_THUMBNAILS};setDeck(data)}
      setMode(next)
      setActive(next==='mixed'?Math.max(0,data.slides.findIndex(slide=>slide.slideKind==='text')):0)
      setOpen(true)
    } catch {setError('The case-study deck could not be loaded. Please try again.')} finally {setLoading(false)}
  }
  function close(){setOpen(false);queueMicrotask(()=>trigger.current?.focus({preventScroll:true}))}
  const preview=(variant:'media'|'mixed')=><div className={`ds-deck-preview ds-deck-preview-${variant}`}>
    <div className="ds-deck-preview-controls" aria-hidden><span><ImageSquare size={12}/>{variant==='mixed'&&<TextAa size={12}/>}</span><span><Minus size={11}/><Plus size={11}/><X size={11}/></span></div>
    <button className="ds-deck-open-surface" onClick={event=>void launch(variant,event.currentTarget)} aria-label={variant==='media'?'Open media-only case-study presentation':'Open media and text case-study presentation'} disabled={loading}>
      {variant==='media'?<img src={hero?.url} alt="Super app case-study cover"/>:<div className="ds-deck-text-preview"><span>Super app / Introduction</span><strong>From scattered features to a shared roadmap.</strong><p>Text sections and original media stay together in the detailed case-study deck.</p></div>}
    </button>
    <div className="ds-deck-preview-strip" aria-hidden><ArrowLeft size={11}/><img src={hero?.url} alt=""/>{variant==='mixed'&&<span>Intro</span>}<img src={overview?.url??hero?.url} alt=""/>{variant==='mixed'&&<span>Overview</span>}<ArrowRight size={11}/></div>
    <div className="ds-deck-mode-label">{variant==='media'?'Media only':'Media + text'}</div>
  </div>
  return <div className={`ds-presentation-examples ${compact?'ds-presentation-examples-compact':''}`}>
    <div className="ds-presentation-mode-previews">{preview('media')}{!compact&&preview('mixed')}</div>
    <div className="ds-presentation-launchers"><PortfolioButton disabled={loading} onClick={event=>void launch('media',event.currentTarget)}>{loading?'Opening deck…':'Open media only'}</PortfolioButton><PortfolioButton disabled={loading} variant="solid" onClick={event=>void launch('mixed',event.currentTarget)}>Open media + text</PortfolioButton></div>
    <p className="ds-presentation-hint">Opens the real full-screen Super app presentation, using the same slides, thumbnails, zoom controls and text-slide switch as the case-study page.</p>
    {error&&<p role="alert" className="ds-note">{error}</p>}
    {deck&&<CaseStudyPresentationOverlay key={`presentation-${mode}`} open={open} activeIndex={active} slides={deck.slides} thumbnailSrcs={deck.thumbs} onClose={close} onActiveIndexChange={setActive} initialTextSlidesVisible={mode==='mixed'} initialControlsVisible/>}
  </div>
}
