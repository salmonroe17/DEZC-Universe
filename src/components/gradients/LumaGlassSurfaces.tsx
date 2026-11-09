import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSiteTheme } from '../../contexts/useSiteTheme'
import { LiquidGlassLayer } from './LiquidGlassLayer'

const surfaces='.quadrant-cell,.ds-showcase-tile,.luma-panel,.luma-atmosphere,.ds-example,.ds-visual-tile,.ds-state-cell,.ds-story-guidance,.ds-inline-dialog,.port-modal-panel,.portfolio-content-switcher,.site-footer'
const controls='[data-ui=button],[data-ui=icon-button],[data-ui=switch],[data-ui=dropdown],[data-ui=timeline-arrow],[role=tab],[data-glass-action]'
type Surface={id:number;element:HTMLElement;host:HTMLElement;radius:number}

function VisibleLiquidGL({element,radius}:{element:HTMLElement;radius:number}) {
 const [visible,setVisible]=useState(false)
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>setVisible(entries[0]?.isIntersecting??false),{rootMargin:'40px'})
  observer.observe(element)
  return()=>observer.disconnect()
 },[element])
 return visible?<LiquidGlassLayer radius={radius}/>:null
}

/** React glass mounts with its page, so scrolling never creates/recreates its filters. */
function SurfaceGlass({element,radius}:{element:HTMLElement;radius:number}) {
 const {theme}=useSiteTheme()
 return theme==='luma-b'?<VisibleLiquidGL element={element} radius={radius}/>:<LiquidGlassLayer radius={radius}/>
}

/** The same real surfaces get one of the two engines; no substitute CSS-only cards. */
export function LumaGlassSurfaces() {
 const registry=useRef(new Map<HTMLElement,Surface>())
 const [items,setItems]=useState<Surface[]>([])
 useEffect(()=>{
  const owned=registry.current
  let nextId=0
  const root=document.body
  const scan=()=>{
   const elements=[...root.querySelectorAll<HTMLElement>(`${surfaces},${controls}`)].filter(el=>!el.closest('.luma-material-host')&&!el.closest('.refracted-card')&&!el.closest('[data-glass-policy=quiet]')&&(!el.matches(surfaces)||!el.parentElement?.closest(surfaces)))
   for(const [element,item] of owned)if(!elements.includes(element)){item.host.remove();delete element.dataset.glassSurface;owned.delete(element)}
   for(const element of elements){
    let item=owned.get(element)
    if(!item){const host=document.createElement('span');host.className='luma-material-host';host.setAttribute('aria-hidden','true');item={id:nextId++,element,host,radius:element.dataset.ui==='switch'?999:element.matches(controls)?14:parseFloat(getComputedStyle(element).borderTopLeftRadius)||28};owned.set(element,item);element.dataset.glassSurface='true'}
    if(item.host.parentElement!==element)element.appendChild(item.host)
   }
   const next=[...owned.values()]
   setItems(previous=>previous.length===next.length&&previous.every((item,i)=>item===next[i])?previous:next)
  }
  let frame=0
  const observer=new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(scan)})
  observer.observe(root,{childList:true,subtree:true});scan()
  return()=>{observer.disconnect();cancelAnimationFrame(frame);for(const {element,host}of owned.values()){host.remove();delete element.dataset.glassSurface}owned.clear()}
 },[])
 return <>{items.map(({id,element,host,radius})=>createPortal(<SurfaceGlass element={element} radius={radius}/>,host,`glass-${id}`))}</>
}
