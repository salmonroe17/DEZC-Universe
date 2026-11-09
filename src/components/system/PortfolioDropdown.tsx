import { useEffect,useId,useRef,useState,type CSSProperties,type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { CaretDown,Check } from '@phosphor-icons/react'
export type DropdownOption={value:string;label:string;paint?:string;font?:string}
export function PortfolioDropdown({id,value,onChange,options,label}:{id?:string;value:string;onChange:(value:string)=>void;options:DropdownOption[];label:string}){
 const uid=useId();const listId=`dropdown-${uid.replace(/[^a-zA-Z0-9_-]/g,'')}`
 const trigger=useRef<HTMLButtonElement>(null);const menu=useRef<HTMLDivElement>(null);const [open,setOpen]=useState(false);const [active,setActive]=useState(0);const [position,setPosition]=useState<CSSProperties>({})
 const selected=Math.max(0,options.findIndex(option=>option.value===value))
 useEffect(()=>{if(!open)return
  const place=()=>{const r=trigger.current!.getBoundingClientRect();const width=Math.min(Math.max(r.width,240),innerWidth-24);const height=Math.min(options.length*48+16,320);const below=innerHeight-r.bottom-12;const top=below>=Math.min(height,160)?r.bottom+8:Math.max(12,r.top-height-8);setPosition({left:Math.max(12,Math.min(r.left,innerWidth-width-12)),top,width,maxHeight:Math.min(320,innerHeight-top-12)})}
  const outside=(event:PointerEvent)=>{if(!trigger.current?.contains(event.target as Node)&&!menu.current?.contains(event.target as Node))setOpen(false)}
  place();document.addEventListener('pointerdown',outside);window.addEventListener('resize',place);document.addEventListener('scroll',place,true)
  return()=>{document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',place);document.removeEventListener('scroll',place,true)}
 },[open,options.length])
 useEffect(()=>{if(open)menu.current?.querySelectorAll<HTMLButtonElement>('[role=option]')[active]?.focus()},[open,active])
 const choose=(index:number)=>{onChange(options[index]!.value);setOpen(false);trigger.current?.focus()}
 const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setOpen(false);trigger.current?.focus()}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();setActive(index=>event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length)}else if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(active)}else if(event.key==='Tab')setOpen(false)}
 return <><button ref={trigger} id={id} type="button" data-ui="dropdown" role="combobox" aria-label={label} aria-expanded={open} aria-controls={open?listId:undefined} aria-haspopup="listbox" className="portfolio-dropdown-trigger" onClick={()=>{setActive(selected);setOpen(!open)}} onKeyDown={event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();setActive(selected);setOpen(true)}}}><span className="portfolio-control-content">{options[selected]?.paint&&<i style={{background:options[selected].paint}}/>}<span>{options[selected]?.label}</span><CaretDown size={16}/></span></button>{open&&createPortal(<div ref={menu} id={listId} className="portfolio-dropdown-menu" role="listbox" aria-label={label} style={position} onKeyDown={key}>{options.map((option,index)=><button type="button" role="option" aria-selected={value===option.value} tabIndex={index===active?0:-1} key={option.value} onClick={()=>choose(index)} onFocus={()=>setActive(index)} style={option.font?{fontFamily:option.font}:undefined}>{option.paint&&<i style={{background:option.paint}}/>}<span>{option.label}</span>{value===option.value&&<Check size={16}/>}</button>)}</div>,document.body)}</>
}
