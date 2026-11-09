import { useEffect, useRef, useState } from 'react'
export type OpticalShape = 'blob' | 'soft' | 'torus' | 'waves' | 'beam' | 'collision'
const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`
const fragment = `precision highp float;
uniform vec2 resolution, pointer;uniform vec3 paletteA,paletteB,paletteC;uniform float customPalette; uniform float time, shape, family, stretch, light, ambience, night;
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float segment(vec3 p,vec3 a,vec3 b,float r){vec3 v=p-a,w=b-a;return length(v-w*clamp(dot(v,w)/dot(w,w),0.,1.))-r;}
float blendVolumes(float a,float b){float h=clamp(.5+.5*(b-a)/.4,0.,1.);return mix(b,a,h)-.4*h*(1.-h);}
float scene(vec3 p){
 if(shape>4.5){vec3 a=vec3(sin(time*.24)*.9,cos(time*.18)*.55,0.);vec3 b=vec3(cos(time*.2+2.)*.8,sin(time*.22+1.)*.6,.1);vec3 c=vec3(sin(time*.17+4.)*.8,cos(time*.21+3.)*.65,-.15);return blendVolumes(blendVolumes(length(p-a)-.66,length(p-b)-.73),length(p-c)-.6);}

 p.xy=rot(.18+pointer.x*.16+time*.10)*p.xy; p.yz=rot(.35+pointer.y*.2+time*.07)*p.yz;
 if(shape<1.5){float wobble=.14*sin(p.x*3.+time*.3)*sin(p.y*3.5+1.)*sin(p.z*3.+.4);p.x+=.16*sin(p.y*2.8+time*.2);p.z+=.13*cos(p.x*3.);return length(p*vec3(1.,.9,1.1))-.83-wobble;}
 if(shape<2.5){p.yz=rot(.48)*p.yz; p.xz=rot(-.25)*p.xz;return length(vec2(length(p.xy)-.65,p.z))-.24;}
 if(shape<3.5){float d=10.;for(int i=0;i<6;i++){float k=float(i);float y=p.y-(k-2.5)*.23-.19*sin(p.x*3.2+k*.65+time*.4);vec3 q=vec3(abs(p.x)-1.2,abs(y)-.034,abs(p.z-(k-2.5)*.065)-.10);d=min(d,length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.));}return d;}
 float d=segment(p,vec3(-1.5,0.,0.),vec3(-.08,0.,0.),.035);
 for(int i=0;i<7;i++){float k=float(i)-3.;d=min(d,segment(p,vec3(-.08,0.,0.),vec3(1.5,k*.19,k*.035),.025));}return d;
}
vec3 rainbow(float t){return .52+.48*cos(6.28318*(vec3(.02,.30,.63)+t));}
vec3 palette(float t){float k=.5+.5*sin(t*6.28318);if(customPalette>.5)return mix(mix(paletteA,paletteB,smoothstep(0.,.5,k)),paletteC,smoothstep(.5,1.,k));if(family<.5)return mix(vec3(.025,.055,.72),vec3(.20,.92,1.),k);if(family<1.5)return mix(vec3(.16,.015,.63),vec3(.91,.31,.94),k);if(family<2.5)return rainbow(t);if(family<3.5)return mix(mix(vec3(.02,.85,.78),vec3(.06,.18,.95),smoothstep(.05,.55,k)),vec3(.95,.04,.65),smoothstep(.5,.98,k));if(family<4.5)return mix(vec3(.03,.12,.85),vec3(1.,.25,.15),k);if(family<5.5)return mix(vec3(.3,.02,.8),vec3(.65,.92,.08),k);if(family<6.5)return mix(vec3(.12,.05,.65),vec3(1.,.55,.35),k);if(family<7.5)return mix(vec3(.02,.55,.75),vec3(.75,.84,.95),k);if(family<8.5)return mix(mix(vec3(.16,.43,.94),vec3(.49,.32,.88),smoothstep(.05,.65,k)),vec3(1.,.62,.52),smoothstep(.6,1.,k));if(family<9.5)return mix(mix(vec3(.094,.894,1.),vec3(.412,.314,1.),smoothstep(.05,.55,k)),vec3(1.,.314,.855),smoothstep(.5,1.,k));if(family<10.5)return mix(mix(vec3(.42,.91,.86),vec3(.65,.545,1.),smoothstep(.05,.6,k)),vec3(1.,.59,.71),smoothstep(.55,1.,k));return mix(mix(vec3(.157,.47,1.),vec3(.133,.87,.937),smoothstep(.05,.6,k)),vec3(.847,1.,.392),smoothstep(.6,1.,k));}
void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;uv+=pointer*.035;
 // Cylindrical UV refraction: compress the center and stretch the edge, with RGB dispersion.
 uv.x=(uv.x+stretch*.28*cos(uv.y*2.4))/(1.+stretch*.72);uv.y*=1.+stretch*.32*cos(uv.x*1.7);
 vec3 ro=vec3(0.,0.,3.4),rd=normalize(vec3(uv*2.4,-3.));float travel=0.,d=0.;vec3 p;
 for(int i=0;i<64;i++){p=ro+rd*travel;d=scene(p);if(d<.002||travel>6.)break;travel+=d*.75;}
 vec3 bg=mix(vec3(.012,.018,.045),vec3(1.),light);vec3 col=bg;
 if(travel<6.){vec2 e=vec2(.002,0.);vec3 n=normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx)));
 float fres=pow(1.-max(dot(n,-rd),0.),2.);float diffuse=max(dot(n,normalize(vec3(-.6,.9,1.5))),0.);
 vec3 spectrum=palette(n.x*.22+n.y*.28+p.z*.17+family*.13);
 float band=.5+.5*sin(n.y*5.+n.x*3.+p.z*2.);spectrum=mix(spectrum,vec3(.03,.08,.38),smoothstep(.40,.64,band)*.75);
 float spec=pow(max(dot(reflect(rd,n),normalize(vec3(-.5,.8,1.))),0.),shape<1.5?32.:80.);
 col=spectrum*(.20+diffuse*.8)+palette(fres*.45+.3)*fres*.85+spec*vec3(.75,.9,1.);
 if(shape>3.5&&shape<4.5)col=rainbow(p.y*.8+.15)*(1.2+spec);
 if(shape>.5&&shape<1.5)col=mix(col,spectrum,.55);
 col=mix(col,bg,clamp(pow(travel/6.,5.),0.,.3));
 if(ambience>.5)col=shape>4.5?mix(mix(vec3(1.),palette(p.x*.22+p.y*.3+n.z*.15+sin(time*.1)*.2),.55),palette(p.x*.22+p.y*.3+n.z*.15+sin(time*.1)*.2)*.50,night):mix(vec3(1.),palette(n.x*.35+n.y*.3+p.z*.25),.70);
 }
 float glow=exp(-length(uv*vec2(.85,1.))*3.5)*.14;col+=palette(.2+uv.y*.2)*glow*(1.-light*.8);
 // Fine optical grain breaks up overly perfect computer gradients.
 float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
 col+=grain*.009;
 if(abs(stretch)>.1){vec2 page=gl_FragCoord.xy/resolution;float inset=.14*(1.-pow(abs(page.y-.5)*2.,2.));float edge=abs(page.x-.5);float mask=1.-smoothstep(.49-inset,.50-inset,edge);float rim=exp(-abs(edge-(.495-inset))*100.);col=mix(vec3(.941,.953,.976),col,mask)+palette(page.y*.6)*rim*.28;}
 gl_FragColor=vec4(col,ambience>.5&&travel>6.?0.:1.);}`

type RenderParams={shape:OpticalShape;family:number;motion:boolean;stretch:number;light:boolean;ambient:boolean;px:number;py:number;time:number;diffusion:number;nocturnal:boolean;colors?:readonly [string,string,string]}
// One reusable GPU context. Each visible surface receives a 2D snapshot, avoiding a WebGL context per card.
let engine: {surface:HTMLCanvasElement;gl:WebGLRenderingContext;program:WebGLProgram}|null=null
function renderOptics(target:HTMLCanvasElement,p:RenderParams,w:number,h:number) {
 if(!engine){
  const surface=document.createElement('canvas');const gl=surface.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'});if(!gl)return false
  const make=(kind:number,source:string)=>{const shader=gl.createShader(kind)!;gl.shaderSource(shader,source);gl.compileShader(shader);return gl.getShaderParameter(shader,gl.COMPILE_STATUS)?shader:null}
  const vs=make(gl.VERTEX_SHADER,vertex),fs=make(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return false
  const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return false
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)
  surface.addEventListener('webglcontextlost',event=>{event.preventDefault();engine=null});engine={surface,gl,program}
 }
 const {surface,gl,program}=engine
 if(surface.width!==w||surface.height!==h){surface.width=w;surface.height=h}gl.viewport(0,0,w,h);gl.useProgram(program)
 const loc=(key:string)=>gl.getUniformLocation(program,key)
 gl.uniform1f(loc('customPalette'),p.colors?1:0);p.colors?.forEach((hex,i)=>{const value=parseInt(hex.slice(1),16);gl.uniform3f(loc(['paletteA','paletteB','paletteC'][i]!),((value>>16)&255)/255,((value>>8)&255)/255,(value&255)/255)});gl.uniform2f(loc('resolution'),w,h);gl.uniform2f(loc('pointer'),p.px,p.py);gl.uniform1f(loc('shape'),['blob','soft','torus','waves','beam','collision'].indexOf(p.shape));gl.uniform1f(loc('family'),p.family);gl.uniform1f(loc('stretch'),p.stretch);gl.uniform1f(loc('light'),p.light?1:0);gl.uniform1f(loc('ambience'),p.ambient?1:0);gl.uniform1f(loc('night'),p.nocturnal?1:0);gl.uniform1f(loc('time'),p.time);gl.drawArrays(gl.TRIANGLES,0,6)
 if(target.width!==w||target.height!==h){target.width=w;target.height=h}const ctx=target.getContext('2d');if(!ctx)return false;ctx.clearRect(0,0,w,h);ctx.filter=p.ambient?`blur(${p.diffusion*w/Math.max(target.getBoundingClientRect().width,1)}px)`:'none';ctx.drawImage(surface,0,0);ctx.filter='none';return true
}

/** Ray-marched geometry, shared renderer, softly diffused output. */
export function OpticalField({shape='blob',family=0,motion=false,stretch=0,light=false,interactive=true,ambient=false,diffusion=64,motionSpeed=1,nocturnal=false,formBlur,colors}:{shape?:OpticalShape;family?:number;motion?:boolean;stretch?:number;light?:boolean;interactive?:boolean;ambient?:boolean;diffusion?:number;motionSpeed?:number;nocturnal?:boolean;formBlur?:number;colors?:readonly [string,string,string]}) {
 const canvas=useRef<HTMLCanvasElement>(null);const [failed,setFailed]=useState(false)
 useEffect(()=>{
  const node=canvas.current;if(!node)return
  let frame=0,visible=false,px=0,py=0,last=0;const start=performance.now();const reduced=window.matchMedia('(prefers-reduced-motion: reduce)')
  const draw=(now=performance.now())=>{if(!visible)return;if(now-last<40&&motion&&!reduced.matches){frame=requestAnimationFrame(draw);return}last=now;const r=node.getBoundingClientRect();const ratio=Math.min(window.devicePixelRatio||1,1.25,(ambient?360:900)/Math.max(r.width,1));const w=Math.max(1,Math.round(r.width*ratio)),h=Math.max(1,Math.round(r.height*ratio));if(!renderOptics(node,{shape,family,motion,stretch,light,ambient,px,py,diffusion,nocturnal,colors,time:reduced.matches?0:motion?(now-start)/1000*motionSpeed:family*.7},w,h))setFailed(true);if(motion&&!reduced.matches)frame=requestAnimationFrame(draw)}
  const request=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw)}
  const move=(e:PointerEvent)=>{if(!interactive||reduced.matches||e.pointerType==='touch')return;const r=node.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;request()}
  const leave=()=>{px=0;py=0;request()};const parent=node.parentElement!;parent.addEventListener('pointermove',move);parent.addEventListener('pointerleave',leave)
  const resize=new ResizeObserver(request);resize.observe(node);const visibility=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)request();else cancelAnimationFrame(frame)},{rootMargin:'120px'});visibility.observe(node);reduced.addEventListener('change',request)
  return()=>{cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();reduced.removeEventListener('change',request);parent.removeEventListener('pointermove',move);parent.removeEventListener('pointerleave',leave)}
 },[shape,family,motion,stretch,light,interactive,ambient,diffusion,motionSpeed,nocturnal,colors])
 return <canvas ref={canvas} className={`optical-field ${failed?'optical-field-fallback':''}`} data-renderer={failed?'fallback':'webgl-shared'} data-optical-shape={shape} data-color-family={family} data-ambient={ambient} style={{filter:`blur(${ambient?0:formBlur??(shape==='soft'?64:44)}px)`,transform:'scale(1.28)',opacity:undefined}} aria-hidden/>
}
