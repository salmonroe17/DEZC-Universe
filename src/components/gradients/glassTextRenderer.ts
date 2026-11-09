/** A single offscreen GPU context serves every glass label in this document.
 * Visible canvases are 2D, so GPU loss never leaves Chrome's broken-canvas panel on screen.
 */
type Engine={surface:HTMLCanvasElement;gl:WebGLRenderingContext;program:WebGLProgram;textures:WebGLTexture[]}
let engine:Engine|null=null
let unavailable=false
const vertex=`attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`
const fragment=`precision highp float;varying vec2 uv;uniform sampler2D scene,glyph;uniform vec2 size,sceneSize,offset,extent;uniform float lightMode;
float alphaAt(vec2 q){return texture2D(glyph,q).a;}
vec3 backdrop(vec2 q){vec4 c=texture2D(scene,q);return mix(mix(vec3(.031,.051,.133),vec3(.94,.96,.99),lightMode),c.rgb,c.a*.85);}
void main(){vec2 t=vec2(2.5)/size;float a=alphaAt(uv);if(a<.01)discard;vec2 g=vec2(alphaAt(uv+vec2(t.x,0.))-alphaAt(uv-vec2(t.x,0.)),alphaAt(uv+vec2(0.,t.y))-alphaAt(uv-vec2(0.,t.y)));float edge=clamp(length(g)*1.6,0.,1.);vec3 n=normalize(vec3(-g*3.,.7));vec2 base=offset+uv*extent;vec2 bend=g*18./sceneSize;vec3 c=backdrop(base+bend);c.r=backdrop(base+bend*1.08).r;c.b=backdrop(base+bend*.93).b;float shine=pow(max(dot(n,normalize(vec3(-.6,.8,1.))),0.),24.);c=mix(c,vec3(1.),.34)+shine*1.1+edge*.14;gl_FragColor=vec4(c,a*.8);}`

function getEngine():Engine|null {
 if(engine&&!engine.gl.isContextLost())return engine
 engine=null
 if(unavailable)return null
 const surface=document.createElement('canvas')
 const gl=surface.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'})
 if(!gl){unavailable=true;return null}
 const make=(kind:number,source:string)=>{const shader=gl.createShader(kind)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null}return shader}
 const vs=make(gl.VERTEX_SHADER,vertex),fs=make(gl.FRAGMENT_SHADER,fragment)
 if(!vs||!fs){unavailable=true;return null}
 const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program)
 gl.deleteShader(vs);gl.deleteShader(fs)
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);unavailable=true;return null}
 gl.useProgram(program)
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
 const position=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
 const textures=[gl.createTexture()!,gl.createTexture()!]
 textures.forEach((texture,index)=>{gl.activeTexture(gl.TEXTURE0+index);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)})
 surface.addEventListener('webglcontextlost',event=>{event.preventDefault();if(engine?.surface===surface)engine=null})
 engine={surface,gl,program,textures}
 return engine
}
export type GlassGlyphOptions={text:string;font:string;light:boolean;number:boolean;fitText?:string;maxFontSize?:number}
export function paintGlyphMask(mask:HTMLCanvasElement,width:number,height:number,options:GlassGlyphOptions){
 mask.width=width;mask.height=height
 const context=mask.getContext('2d')!
 const lines=options.text.split('\n')
 const reference=(options.fitText??options.text).split('\n')
 let size=Math.min(options.maxFontSize??(options.number?130:190),height/(reference.length*1.16+.12))
 context.font=`800 ${size}px "${options.font}"`
 const measured=Math.max(1,...reference.map(line=>context.measureText(line).width))
 if(measured>width-8){size*=(width-8)/measured;context.font=`800 ${size}px "${options.font}"`}
 context.fillStyle='#fff'
 lines.forEach((line,index)=>context.fillText(line,4,size*(1.05+index*1.16)))
}
function paintFallback(target:HTMLCanvasElement,mask:HTMLCanvasElement,light:boolean){
 const context=target.getContext('2d')!;context.clearRect(0,0,target.width,target.height)
 context.drawImage(mask,0,0);context.globalCompositeOperation='source-in'
 const fill=context.createLinearGradient(0,0,0,target.height)
 fill.addColorStop(0,light?'rgba(255,255,255,.9)':'rgba(255,255,255,.85)');fill.addColorStop(.48,light?'rgba(160,185,224,.32)':'rgba(210,227,255,.3)');fill.addColorStop(1,'rgba(255,255,255,.5)')
 context.fillStyle=fill;context.fillRect(0,0,target.width,target.height);context.globalCompositeOperation='source-over'
}
export function renderGlassGlyph(target:HTMLCanvasElement,mask:HTMLCanvasElement,scene:HTMLCanvasElement|null,light:boolean){
 const context=target.getContext('2d');if(!context)return
 if(target.width!==mask.width||target.height!==mask.height){target.width=mask.width;target.height=mask.height}
 const current=getEngine()
 if(!current||!scene?.width){paintFallback(target,mask,light);return}
 try{
  const {surface,gl,program,textures}=current
  const width=target.width,height=target.height
  if(surface.width!==width||surface.height!==height){surface.width=width;surface.height=height}
  const rect=target.getBoundingClientRect(),source=scene.getBoundingClientRect()
  if(source.width<=0||source.height<=0){paintFallback(target,mask,light);return}
  gl.viewport(0,0,width,height);gl.useProgram(program);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1)
  ;[scene,mask].forEach((image,index)=>{gl.activeTexture(gl.TEXTURE0+index);gl.bindTexture(gl.TEXTURE_2D,textures[index]!);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image)})
  const location=(name:string)=>gl.getUniformLocation(program,name)
  gl.uniform1f(location('lightMode'),light?1:0);gl.uniform1i(location('scene'),0);gl.uniform1i(location('glyph'),1)
  gl.uniform2f(location('size'),width,height);gl.uniform2f(location('sceneSize'),source.width,source.height)
  gl.uniform2f(location('offset'),(rect.left-source.left)/source.width,1-(rect.bottom-source.top)/source.height)
  gl.uniform2f(location('extent'),rect.width/source.width,rect.height/source.height)
  gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,6)
  if(gl.isContextLost()){engine=null;paintFallback(target,mask,light);return}
  context.clearRect(0,0,width,height);context.drawImage(surface,0,0)
 }catch{engine=null;paintFallback(target,mask,light)}
}
