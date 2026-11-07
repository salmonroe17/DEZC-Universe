import { useEffect, useRef, useState } from 'react'
export type OpticalShape = 'blob' | 'soft' | 'torus' | 'waves' | 'beam'
const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`
const fragment = `precision highp float;
uniform vec2 resolution, pointer; uniform float time, shape, family, stretch, light;
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float segment(vec3 p,vec3 a,vec3 b,float r){vec3 v=p-a,w=b-a;return length(v-w*clamp(dot(v,w)/dot(w,w),0.,1.))-r;}
float scene(vec3 p){
 p.xy=rot(.18+pointer.x*.16)*p.xy; p.yz=rot(.35+pointer.y*.2)*p.yz;
 if(shape<1.5){float wobble=.14*sin(p.x*3.+time*.3)*sin(p.y*3.5+1.)*sin(p.z*3.+.4);p.x+=.16*sin(p.y*2.8+time*.2);p.z+=.13*cos(p.x*3.);return length(p*vec3(1.,.9,1.1))-.83-wobble;}
 if(shape<2.5){p.yz=rot(.48)*p.yz; p.xz=rot(-.25)*p.xz;return length(vec2(length(p.xy)-.65,p.z))-.24;}
 if(shape<3.5){float d=10.;for(int i=0;i<6;i++){float k=float(i);float y=p.y-(k-2.5)*.23-.19*sin(p.x*3.2+k*.65+time*.4);vec3 q=vec3(abs(p.x)-1.2,abs(y)-.034,abs(p.z-(k-2.5)*.065)-.10);d=min(d,length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.));}return d;}
 float d=segment(p,vec3(-1.5,0.,0.),vec3(-.08,0.,0.),.035);
 for(int i=0;i<7;i++){float k=float(i)-3.;d=min(d,segment(p,vec3(-.08,0.,0.),vec3(1.5,k*.19,k*.035),.025));}return d;
}
vec3 rainbow(float t){return .52+.48*cos(6.28318*(vec3(.02,.30,.63)+t));}
vec3 palette(float t){float k=.5+.5*sin(t*6.28318);if(family<.5)return mix(vec3(.025,.055,.72),vec3(.20,.92,1.),k);if(family<1.5)return mix(vec3(.16,.015,.63),vec3(.91,.31,.94),k);return rainbow(t);}
void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;uv+=pointer*.035;
 // Cylindrical UV refraction: compress the center and stretch the edge, with RGB dispersion.
 uv.x=(uv.x+stretch*.28*cos(uv.y*2.4))/(1.+stretch*.72);uv.y*=1.+stretch*.32*cos(uv.x*1.7);
 vec3 ro=vec3(0.,0.,3.4),rd=normalize(vec3(uv*2.4,-3.));float travel=0.,d=0.;vec3 p;
 for(int i=0;i<64;i++){p=ro+rd*travel;d=scene(p);if(d<.002||travel>6.)break;travel+=d*.75;}
 vec3 bg=mix(vec3(.012,.018,.045),vec3(.955,.965,.985),light);vec3 col=bg;
 if(travel<6.){vec2 e=vec2(.002,0.);vec3 n=normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx)));
 float fres=pow(1.-max(dot(n,-rd),0.),2.);float diffuse=max(dot(n,normalize(vec3(-.6,.9,1.5))),0.);
 vec3 spectrum=palette(n.x*.22+n.y*.28+p.z*.17+family*.13);
 float band=.5+.5*sin(n.y*5.+n.x*3.+p.z*2.);spectrum=mix(spectrum,vec3(.03,.08,.38),smoothstep(.40,.64,band)*.75);
 float spec=pow(max(dot(reflect(rd,n),normalize(vec3(-.5,.8,1.))),0.),shape<1.5?32.:80.);
 col=spectrum*(.20+diffuse*.8)+palette(fres*.45+.3)*fres*.85+spec*vec3(.75,.9,1.);
 if(shape>3.5)col=rainbow(p.y*.8+.15)*(1.2+spec);
 if(shape>.5&&shape<1.5)col=mix(col,spectrum,.55);
 col=mix(col,bg,clamp(pow(travel/6.,5.),0.,.3));
 }
 float glow=exp(-length(uv*vec2(.85,1.))*3.5)*.14;col+=palette(.2+uv.y*.2)*glow*(1.-light*.8);
 // Fine optical grain breaks up overly perfect computer gradients.
 float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
 col+=grain*.009;
 if(abs(stretch)>.1){vec2 page=gl_FragCoord.xy/resolution;float inset=.14*(1.-pow(abs(page.y-.5)*2.,2.));float edge=abs(page.x-.5);float mask=1.-smoothstep(.49-inset,.50-inset,edge);float rim=exp(-abs(edge-(.495-inset))*100.);col=mix(vec3(.941,.953,.976),col,mask)+palette(page.y*.6)*rim*.28;}
 gl_FragColor=vec4(col,1.);}`

/** Ray-marched signed-distance geometry with surface normals, iridescent lighting and UV refraction. */
export function OpticalField({ shape='blob', family=0, motion=false, stretch=0, light=false, interactive=true }: {shape?:OpticalShape;family?:number;motion?:boolean;stretch?:number;light?:boolean;interactive?:boolean}) {
 const canvas=useRef<HTMLCanvasElement>(null)
 const [failed,setFailed]=useState(false)
 useEffect(()=>{
  const node=canvas.current;if(!node)return
  const gl=node.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl){setFailed(true);return}
  const make=(kind:number,source:string)=>{const shader=gl.createShader(kind)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null}return shader}
  const vs=make(gl.VERTEX_SHADER,vertex),fs=make(gl.FRAGMENT_SHADER,fragment)
  if(!vs||!fs){setFailed(true);return}
  const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program)
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){setFailed(true);return}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
  const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)
  const loc=(key:string)=>gl.getUniformLocation(program,key)
  gl.uniform1f(loc('shape'),['blob','soft','torus','waves','beam'].indexOf(shape));gl.uniform1f(loc('family'),family);gl.uniform1f(loc('stretch'),stretch);gl.uniform1f(loc('light'),light?1:0)
  let frame=0,visible=true,px=0,py=0,last=0;const start=performance.now();const reduced=window.matchMedia('(prefers-reduced-motion: reduce)')
  const draw=(now=performance.now())=>{if(!visible)return;if(now-last<32&&motion&&!reduced.matches){frame=requestAnimationFrame(draw);return}last=now;const rect=node.getBoundingClientRect();const ratio=Math.min(window.devicePixelRatio||1,1.25,900/Math.max(rect.width,1));const w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));if(node.width!==w||node.height!==h){node.width=w;node.height=h;gl.viewport(0,0,w,h)}gl.uniform2f(loc('resolution'),w,h);gl.uniform2f(loc('pointer'),px,py);gl.uniform1f(loc('time'),reduced.matches?0:(now-start)/1000);gl.drawArrays(gl.TRIANGLES,0,6);if(motion&&!reduced.matches)frame=requestAnimationFrame(draw)}
  const request=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw)}
  const move=(e:PointerEvent)=>{if(!interactive||reduced.matches||e.pointerType==='touch')return;const r=node.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;request()}
  const leave=()=>{px=0;py=0;request()}
  const parent=node.parentElement!;parent.addEventListener('pointermove',move);parent.addEventListener('pointerleave',leave)
  const resize=new ResizeObserver(request);resize.observe(node)
  const visibility=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)request();else cancelAnimationFrame(frame)});visibility.observe(node)
  const change=()=>request();reduced.addEventListener('change',change);request()
  return()=>{cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();reduced.removeEventListener('change',change);parent.removeEventListener('pointermove',move);parent.removeEventListener('pointerleave',leave);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)}
 },[shape,family,motion,stretch,light,interactive])
 return <canvas ref={canvas} className={`optical-field ${failed?'optical-field-fallback':''}`} data-renderer={failed?'fallback':'webgl'} data-optical-shape={shape} style={{filter:`blur(${shape==='soft'?28:14}px)`,transform:'scale(1.12)'}} aria-hidden/>
}
