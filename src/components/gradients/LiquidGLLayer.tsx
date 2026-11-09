import { useEffect, useId, useRef } from 'react'

/** Luma B: snapshot only the shared scene, rather than the whole document. */
export function LiquidGLLayer({radius=24}:{radius?:number}) {
 const id=`luma-b-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`
 const host=useRef<HTMLDivElement>(null)
 useEffect(()=>{
  let disposed=false;let lenses:import('liquid-gl').LiquidLens[]=[]
  void import('liquid-gl').then(({default:liquidGL})=>{
   if(disposed||!host.current)return
   const result=liquidGL({target:`#${id}`,snapshot:'.luma-page-atmosphere',content:false,resolution:.75,zIndex:2,refraction:.012,aberration:.02,bevelDepth:.045,bevelWidth:.12,frost:2,shadow:false,specular:!matchMedia('(prefers-reduced-motion: reduce)').matches,reveal:'none',tilt:false,on:{init:()=>{if(host.current)host.current.dataset.ready='true'}}})
   lenses=Array.isArray(result)?result:result?[result]:[]
   liquidGL.registerDynamic('.luma-page-atmosphere canvas')
  }).catch(error=>{if(host.current){host.current.dataset.ready='fallback';console.error('Luma B glass initialization failed',error)}})
  return()=>{disposed=true;lenses.forEach(lens=>lens.destroy())}
 },[id])
 return <div id={id} ref={host} className="luma-refractive-layer luma-liquidgl-layer" data-engine="liquidGL" style={{borderRadius:radius}} aria-hidden/>
}
