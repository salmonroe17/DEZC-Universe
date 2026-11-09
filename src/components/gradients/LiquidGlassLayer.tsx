import { useLayoutEffect,useRef } from 'react'
import { useSiteTheme } from '../../contexts/useSiteTheme'
import { LiquidGLLayer } from './LiquidGLLayer'
import LiquidGlass from 'liquid-glass-react'

// The upstream component only remeasures on window resize. Coalesce surface resize
// notifications so sidebar/content/font changes refresh its geometry without remounting.
let measurementFrame=0
function refreshGlassMeasurements(){
 if(measurementFrame)return
 measurementFrame=requestAnimationFrame(()=>{measurementFrame=0;window.dispatchEvent(new Event('resize'))})
}
function ReactGlassLayer({radius,profile,refined}:{radius:number;profile:'surface'|'text';refined:boolean}){
 const host=useRef<HTMLDivElement>(null)
 useLayoutEffect(()=>{
  const element=host.current;if(!element)return
  let width=-1,height=-1
  const observer=new ResizeObserver(([entry])=>{if(!entry)return;const w=Math.round(entry.contentRect.width*10)/10,h=Math.round(entry.contentRect.height*10)/10;if(w<=0||h<=0||w===width&&h===height)return;width=w;height=h;refreshGlassMeasurements()})
  observer.observe(element)
  return()=>observer.disconnect()
 },[])
 return <div ref={host} className="luma-refractive-layer" aria-hidden data-engine="liquid-glass-react" data-glass-treatment={refined?'refined':'original'}>
  <LiquidGlass className="luma-react-glass" displacementScale={profile==='text'?10:refined?64:42} blurAmount={profile==='text'?.02:refined?.12:.22} saturation={profile==='text'?110:refined?140:125} aberrationIntensity={profile==='text'?.1:refined?1.1:.8} elasticity={0} cornerRadius={radius} padding="0" mode={refined&&profile!=='text'?'prominent':'standard'} overLight={false} style={{position:'absolute',top:'50%',left:'50%',width:'100%',height:'100%'}}><span className="luma-react-glass-fill"/></LiquidGlass>
 </div>
}
/** Local backdrop refraction; no document snapshots or fixed scrolling canvas. */
export function LiquidGlassLayer({radius=24,profile='surface'}:{radius?:number;profile?:'surface'|'text'}) {
 const {theme}=useSiteTheme()
 return theme==='luma-b'?<LiquidGLLayer radius={radius}/>:<ReactGlassLayer radius={radius} profile={profile} refined={theme==='luma-c'}/>
}
