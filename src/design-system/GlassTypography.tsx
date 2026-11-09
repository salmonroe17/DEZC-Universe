import { useEffect,useRef,useState } from 'react'
import { useSiteTheme } from '../contexts/useSiteTheme'
import { paintGlyphMask,renderGlassGlyph } from '../components/gradients/glassTextRenderer'

type GlassTextProps={text?:string;number?:boolean;fitText?:string;maxFontSize?:number}
function GlassTextRenderer({text='Liquid.',number=false,fitText,maxFontSize}:GlassTextProps){
 const textRef=useRef(text)
 useEffect(()=>{textRef.current=text},[text])
 const canvas=useRef<HTMLCanvasElement>(null)
 const {previewOptions}=useSiteTheme()
 useEffect(()=>{
  const element=canvas.current;if(!element)return
  const mask=document.createElement('canvas')
  let frame=0,last=0,visible=false,dirty=true,lastText='',disposed=false
  const reduced=matchMedia('(prefers-reduced-motion: reduce)')
  const draw=(now:number)=>{
   frame=requestAnimationFrame(draw)
   if(!visible||now-last<65&&!dirty&&lastText===textRef.current)return
   last=now
   const rect=element.getBoundingClientRect();if(rect.width<1||rect.height<1)return;const width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height))
   if(dirty||mask.width!==width||mask.height!==height||lastText!==textRef.current){paintGlyphMask(mask,width,height,{text:textRef.current,font:previewOptions.font,light:previewOptions.mode==='light',number,fitText,maxFontSize});lastText=textRef.current;dirty=false}
   renderGlassGlyph(element,mask,document.querySelector<HTMLCanvasElement>('.luma-page-atmosphere canvas'),previewOptions.mode==='light')
   if(reduced.matches)visible=false
  }
  const resize=new ResizeObserver(()=>{dirty=true;visible=true});resize.observe(element)
  const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;dirty=true});intersection.observe(element)
  void document.fonts.ready.then(()=>{if(!disposed){dirty=true;visible=true}})
  frame=requestAnimationFrame(draw)
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect()}
 },[previewOptions.font,previewOptions.mode,number,fitText,maxFontSize])
 return <span className={number?'glass-number':'glass-display'}><canvas key="shared-glyph-2d" ref={canvas} className="ds-glyph-glass" role="img" aria-label={text} data-renderer="shared-glyph-2d"/></span>
}
export function GlassText({text='Liquid.',number=false,fitText,maxFontSize}:GlassTextProps){
 const host=useRef<HTMLSpanElement>(null);const [active,setActive]=useState(false)
 useEffect(()=>{const element=host.current;if(!element)return;const observer=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting){setActive(true);observer.disconnect()}},{rootMargin:'400px'});observer.observe(element);return()=>observer.disconnect()},[])
 return <span ref={host} className={number?'glass-number':'glass-display'}>{active?<GlassTextRenderer text={text} number={number} fitText={fitText} maxFontSize={maxFontSize}/>:<canvas className="ds-glyph-glass" role="img" aria-label={text}/>}</span>
}
export function GlassTypography(){return <div className="ds-glass-type"><GlassText/><p>Light through letterforms. A display treatment for short titles, paired with solid, readable text.</p></div>}


export function TypeExperiments() {
 const [font,setFont]=useState('Manrope')
 return <div className="ds-type-experiments"><div className="ds-type-options" role="group" aria-label="Compare typefaces">{['Manrope','DM Sans','Space Grotesk'].map(name=><button type="button" data-glass-action aria-pressed={font===name} key={name} onClick={()=>setFont(name)}>{name}</button>)}</div><div className="ds-type-experiment-sample" style={{fontFamily:`"${font}",sans-serif`}}><strong>Make room<br/>for a new view.</strong><p>Aa Bb Cc · 0123456789</p><small>Medium for reading. Bold for emphasis.</small></div></div>
}
