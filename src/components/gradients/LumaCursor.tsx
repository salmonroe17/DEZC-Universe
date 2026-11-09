import { createPortal } from 'react-dom'
import { useEffect,useId,useRef } from 'react'
export function LumaCursor(){
 const id=`cursor-lens-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`
 const map=`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><defs><linearGradient id="x"><stop stop-color="rgb(191,0,0)"/><stop offset="1" stop-color="rgb(64,0,0)"/></linearGradient><linearGradient id="y" x2="0" y2="1"><stop stop-color="rgb(0,191,0)"/><stop offset="1" stop-color="rgb(0,64,0)"/></linearGradient></defs><rect width="64" height="64" fill="url(#x)"/><rect width="64" height="64" fill="url(#y)" style="mix-blend-mode:screen"/></svg>')}`
 const ref=useRef<HTMLDivElement>(null)
 useEffect(()=>{const node=ref.current;if(!node)return;const query=matchMedia('(pointer:fine) and (hover:hover)');let frame=0;let x=0,y=0
 const sync=()=>document.body.classList.toggle('luma-cursor-active',query.matches)
 const move=(event:PointerEvent)=>{if(!query.matches)return;x=event.clientX;y=event.clientY;const target=event.target as HTMLElement;node.dataset.mode=target.closest('input,textarea,[contenteditable=true]')?'text':target.closest('button,a,summary,[role=button]')?'action':'rest';node.style.opacity='1';cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{node.style.transform=`translate3d(${x}px,${y}px,0)`})}
 const down=()=>node.dataset.pressed='true';const up=()=>node.dataset.pressed='false';const leave=()=>node.style.opacity='0'
 sync();query.addEventListener('change',sync);window.addEventListener('pointermove',move);window.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);document.addEventListener('pointerleave',leave)
 return()=>{cancelAnimationFrame(frame);query.removeEventListener('change',sync);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);document.removeEventListener('pointerleave',leave);document.body.classList.remove('luma-cursor-active')}
 },[])
 return createPortal(<div ref={ref} className="luma-cursor" aria-hidden><svg width="0" height="0"><defs><filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feImage href={map} width="100%" height="100%" preserveAspectRatio="none" result="lens"/><feDisplacementMap in="SourceGraphic" in2="lens" scale="24" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg><span><i style={{filter:`url(#${id})`}}/></span></div>,document.body)
}
