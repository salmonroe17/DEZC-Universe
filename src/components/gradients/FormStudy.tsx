import { useEffect, useRef, useState } from 'react'
import './form-study.css'

export type StudyForm = 'solar' | 'spectral' | 'cat' | 'vortex' | 'ribbon' | 'cube' | 'halo' | 'pastel' | 'rings' | 'flare' | 'starburst' | 'water' | 'ripples' | 'target'
const kinds: StudyForm[] = ['solar', 'spectral', 'cat', 'vortex', 'ribbon', 'cube', 'halo', 'pastel', 'rings', 'flare', 'starburst', 'water', 'ripples', 'target']
const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`
const fragment = `precision highp float;
// Live material program: shader edits restart the canvas loop.
uniform vec2 resolution;uniform float time,kind,brightness,showSphere;uniform vec3 stopA,stopB,stopC;
#define PI 3.14159265
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 gradient(float t){t=clamp(t,0.,1.);return mix(mix(stopA,stopB,smoothstep(0.,.5,t)),stopC,smoothstep(.5,1.,t));}
vec3 spectrum(float t){return gradient(.5+.5*sin(t*6.28318));}
vec3 ink(float t){return mix(vec3(.09,.06,.28),spectrum(t),.8);}
float smoothUnion(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float capsule(vec3 p,vec3 a,vec3 b,float r){vec3 q=p-a,v=b-a;return length(q-v*clamp(dot(q,v)/dot(v,v),0.,1.))-r;}
vec3 transform(vec3 p){p.xz=rot(.55+time*.32)*p.xz;p.yz=rot(-.37+sin(time*.43)*.14)*p.yz;p.xy=rot(sin(time*.23)*.1)*p.xy;return p;}
vec3 catSpace(vec3 p){p.y-=sin(time*.8)*.045;p.xz=rot(sin(time*.65)*.36)*p.xz;p.yz=rot(sin(time*.48)*.12)*p.yz;p.xy=rot(-.08+sin(time*.7)*.08)*p.xy;return p;}
float ellipsoid(vec3 p,vec3 r){return (length(p/r)-1.)*min(r.x,min(r.y,r.z));}
float geometry(vec3 p){
 if(kind>4.5&&kind<5.5){p=transform(p);vec3 q=abs(p)-vec3(.62);return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-.085;}
 if(kind<2.5){p=catSpace(p);float head=(length(p/vec3(.68,.57,.44))-1.)*.44;float ear=capsule(p,vec3(-.45,.40,-.015),vec3(-.48,.63,-.015),.18);ear=min(ear,capsule(p,vec3(.45,.40,-.015),vec3(.48,.63,-.015),.18));return smoothUnion(head,ear,.10);}
 if(kind>2.5&&kind<3.5){p.xz=rot(sin(time*.5)*.23)*p.xz;p.yz=rot(.2+sin(time*.47)*.16)*p.yz;float a=atan(p.y,p.x);return length(vec2(length(p.xy)-.57,p.z*1.2))-(.21+.035*sin(a*3.+time*.6));}
 if(kind>3.5&&kind<4.5){p.xz=rot(sin(time*.5)*.32)*p.xz;float y=clamp(p.y,-.92,.92);vec3 q=p-vec3(.30*sin(y*3.5+sin(time*.35)*.2),y,.16*cos(y*3.5+time*.5));q.xz=rot(y*2.8+time*.85)*q.xz;float thickness=(length(q.xz/vec2(.26,.045))-1.)*.038;return max(thickness,abs(p.y)-.92);}

 if(kind>5.5&&kind<6.5){float pulse=1.+.055*sin(time*2.6);p/=pulse;p.xz=rot(.16+sin(time*.7)*.17)*p.xz;p.yz=rot(.12+sin(time*.6)*.12)*p.yz;float a=atan(p.y,p.x),r=length(p.xy);float spikes=pow(.5+.5*sin(a*23.+sin(a*5.+time*.45)*1.4+time*.8),8.);float major=.61+.018*sin(a*11.+time*4.);return (length(vec2((r-major-.10*spikes)/(.010+.10*spikes),p.z/.034))-1.)*.015;}



 // Breathing, unequal ellipsoids stretch into necks, then divide along drifting paths.
 float phase=time*.60;vec3 q=p;q.xy=rot(sin(time*.23)*.22)*q.xy;
 vec3 a=vec3(-.43*cos(phase),-.22+sin(phase*.73)*.22,sin(phase)*.16);
 vec3 b=vec3(.58*cos(phase),.36+sin(phase)*.26,-.10);
 vec3 c=vec3(.63*sin(phase),-.45*cos(phase),.12);
 vec3 d=vec3(-.58*sin(phase*.82),.53*cos(phase*.82),-.04);
 vec3 qa=q-a;qa.xy=rot(sin(phase)*.6)*qa.xy;
 vec3 qb=q-b;qb.yz=rot(phase*.4)*qb.yz;
 vec3 qc=q-c;qc.xy=rot(-phase*.5)*qc.xy;
 float volume=ellipsoid(qa,vec3(.37+.08*sin(phase),.52+.11*cos(phase),.34));
 volume=smoothUnion(volume,ellipsoid(qb,vec3(.29,.36+.1*sin(phase+1.),.27)),.27);
 volume=smoothUnion(volume,ellipsoid(qc,vec3(.19+.045*sin(phase+2.),.30,.22)),.22);
 volume=smoothUnion(volume,ellipsoid(q-d,vec3(.14,.20+.04*cos(phase),.15)),.18);
 float ripple=.025*sin(q.x*7.+time*.8)*sin(q.y*6.-time*.6)*sin(q.z*5.+time*.4);
 return volume+ripple;
}
vec3 environment(vec3 r){
 float blue=exp(-pow((r.x+r.z*.4+.28)*4.,2.));float gold=exp(-pow((r.y-r.x*.35-.25)*5.,2.));float cyan=exp(-pow((r.z+r.y*.55+.1)*6.,2.));
 vec3 c=vec3(.10,.16,.23)+stopA*blue*.75+stopC*gold+stopB*cyan*.7;
 float strip=pow(max(0.,1.-abs(dot(r,normalize(vec3(.2,.85,.4))))),38.);return c+strip*vec3(.95,.98,1.)*1.4;
}
// Shared optical primitives. These flares are procedural light studies, not meshes.
float softRing(vec2 p,float radius,float width){return exp(-pow((length(p)-radius)/width,2.));}
float sparkle(vec2 p,float reach){float r=length(p);return exp(-r*65.)*4.+exp(-abs(p.x)*120.)*exp(-abs(p.y)/reach)*1.5+exp(-abs(p.y)*120.)*exp(-abs(p.x)/reach)*1.5;}
float opticalCoverage=0.;float waterCoverage=0.;
vec3 lightOnPaper(vec3 background,vec3 tint,float energy){float alpha=clamp(1.-exp(-energy),0.,.82);float hot=smoothstep(.9,3.,energy);opticalCoverage=alpha+opticalCoverage*(1.-alpha);opticalCoverage=hot+opticalCoverage*(1.-hot);vec3 c=mix(background,tint,alpha);return mix(c,vec3(1.),hot);}
float waterHeight(vec2 p){
 if(kind<11.5){return .065*sin(p.x*3.+p.y*1.4-time*.75)+.045*sin(p.y*4.5-p.x*1.3+time*.55)+.024*sin(p.x*8.+p.y*5.-time*.9)+.012*sin(p.x*15.-p.y*11.+time*1.1);}
 float height=0.;
 for(int i=0;i<3;i++){float index=float(i);float age=mod(time+index*2.3,6.9);vec2 center=vec2(sin(index*2.7)*.33,cos(index*3.9)*.24);float r=length(p-center);float front=age*.37;float envelope=exp(-pow((r-front)/.34,2.))*exp(-age*.32);height+=.075*cos((r-front)*24.)*envelope*smoothstep(0.,.25,age);}
 return height;
}
vec3 waterStudy(vec2 uv){
 vec3 origin=vec3(uv.x*3.8,3.,-uv.y*3.8);vec3 ray=vec3(0.,-1.,0.);
 float t=-origin.y/ray.y;
 for(int i=0;i<10;i++){vec3 p=origin+ray*t;t+=(waterHeight(p.xz)-p.y)/ray.y*.8;}
 vec3 p=origin+ray*t;float e=.008;vec3 normal=normalize(vec3(waterHeight(p.xz-vec2(e,0.))-waterHeight(p.xz+vec2(e,0.)),2.*e,waterHeight(p.xz-vec2(0.,e))-waterHeight(p.xz+vec2(0.,e))));
 vec3 reflected=reflect(ray,normal);float fresnel=pow(1.-max(dot(normal,-ray),0.),4.);
 float flow=.5+.22*sin(p.x*.65+p.z*.48+time*.11)+normal.x*.6+normal.z*.3;
 vec3 body=mix(vec3(.97,.985,1.),gradient(flow),.55);
 vec3 reflection=mix(vec3(.92,.96,1.),gradient(.5+reflected.x*.3+reflected.z*.2),.5);
 vec3 col=mix(body,reflection,.28+fresnel*.55);
 vec3 sun=normalize(vec3(-.4,1.,.5));float glint=pow(max(dot(reflected,sun),0.),100.);col+=glint*.55;
 float caustic=pow(.5+.5*sin(p.x*17.+normal.x*8.+sin(p.z*10.+normal.z*8.)),12.);col=mix(col,vec3(1.),caustic*.20);
 waterCoverage=clamp(.42+length(normal.xz)*.5+glint*.5+caustic*.12,.4,.92);
 // Darker refracted troughs give the surface readable relief on the light canvas.
 col*=.9+.1*normal.y;col=mix(col,gradient(flow),clamp(length(normal.xz)*.14,0.,.15));
 return col;
}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);vec3 paper=vec3(.972,.971,.956);vec3 col=paper;
 float grain=hash(gl_FragCoord.xy)-.5;float coverage=1.;opticalCoverage=0.;
 if(kind>12.5){
  vec2 p=uv*2.35;float r=length(p),a=atan(p.y,p.x);float beat=.5+.5*sin(time*2.3);
  col=paper;
  float circle=softRing(p,.43+.025*sin(time*1.8),.008)+softRing(p,.66+.012*sin(time*1.3),.005)*.4;
  float ticks=pow(.5+.5*cos(a*32.+time*.32),18.)*exp(-pow((r-.49)/.035,2.));
  col=lightOnPaper(col,gradient(fract(a/6.283+time*.045)),circle*.75+ticks*.55);
  // Opposing arm lengths and offsets breathe independently around a clear target.
  for(int i=0;i<4;i++){float index=float(i);vec2 q=rot(index*1.570796)*p;float armLength=.28+.13*sin(time*1.5+index*1.7);float offset=.07+.025*sin(time*2.+index);float arm=exp(-abs(q.y)*150.)*smoothstep(offset,offset+.02,q.x)*(1.-smoothstep(armLength,armLength+.06,q.x));col=lightOnPaper(col,gradient(index/3.),arm*(1.1+beat*.4));}
  float train=pow(.5+.5*sin(p.x*14.-time*4.),9.);float passing=exp(-pow((p.x-1.1*sin(time*.7))/.17,2.));
  float beam=exp(-abs(p.y)*130.)*exp(-abs(p.x)*.5);col=lightOnPaper(col,gradient(.5+.45*sin(p.x*3.-time*1.7)),beam*(.7+train*1.5+passing*3.));
  float traveling=pow(.5+.5*cos(r*38.-time*5.+sin(a*5.)*.6),15.)+pow(.5+.5*cos(r*31.+time*4.+sin(a*7.)*.6),17.)*.7;float spokes=pow(.5+.5*cos(a*39.+sin(a*9.)*.7),18.);float radialFlow=traveling*spokes*exp(-r*3.)*smoothstep(.10,.18,r);col=lightOnPaper(col,gradient(fract(r-time*.15)),radialFlow*2.);
  float core=exp(-r*r/.0007)*(.65+beat*.35);col=mix(col,vec3(1.),core);opticalCoverage=core+opticalCoverage*(1.-core);coverage=opticalCoverage;
 }
 else if(kind>10.5){col=waterStudy(uv);coverage=waterCoverage;}
 else if(kind>7.5){
  vec2 p=uv*2.35;float pulse=1.+.035*sin(time*1.25);p/=pulse;
  if(kind<8.5){
   p+=vec2(sin(time*.3),cos(time*.26))*.018;float r=length(p),angle=atan(p.y,p.x);
   vec3 field=mix(paper,gradient(.55),.20+exp(-r*r*1.5)*.25);col=field;
   float tilt=.92+.035*sin(time*.45);vec2 q=p*vec2(1.,1./tilt);
   float rings=softRing(q,.73,.008)+softRing(q,.94,.009);
   float aura=softRing(q,.73,.045)*.35+softRing(q,.94,.04)*.24;
   vec3 prism=gradient(fract(angle/6.283+.5+time*.018));col=lightOnPaper(col,prism,(rings+aura)*.85);
   float sphereMask=1.-smoothstep(.35,.365,r);vec3 n=normalize(vec3(p/.365,sqrt(max(0.,1.-r*r/(.365*.365)))));
   vec3 orb=mix(gradient(.55+n.y*.2)*.80,vec3(1.),.25);orb+=pow(max(dot(n,normalize(vec3(-.5,.7,1.))),0.),24.)*.22;col=mix(col,orb,sphereMask*.85);
   float flares=sparkle(p,.17);
   for(int i=0;i<4;i++){float a=float(i)*1.570796;vec2 at=vec2(cos(a),sin(a))*.73*vec2(1.,tilt);flares+=sparkle(p-at,.12)*.75;}
   col=lightOnPaper(col,mix(stopC,vec3(1.),.3),flares);
   float poles=exp(-pow(p.x/.11,2.))*(exp(-pow((p.y-.39)/.12,2.))+exp(-pow((p.y+.39)/.12,2.)));col=lightOnPaper(col,stopC,poles*.6);
  }else if(kind<9.5){
   // The long optical axis is horizontal, unlike the supplied vertical reference.
   p.y+=sin(time*.4)*.015;float r=length(p);col=mix(paper,gradient(.5),.12+exp(-r*r*3.)*.22);
   float beam=exp(-abs(p.y)*120.)*exp(-abs(p.x)*.65)*2.6+exp(-abs(p.y)*30.)*exp(-abs(p.x)*1.5)*.45;
   float ring=softRing(p,.58,.012)+softRing(p,.36,.006)*.5;
   col=lightOnPaper(col,gradient(.5+.4*sin(atan(p.y,p.x)*2.)),ring*.8);
   col=lightOnPaper(col,mix(stopC,vec3(1.),.3),beam+sparkle(p,.18));
   for(int i=0;i<6;i++){float k=float(i)-2.5;vec2 center=vec2(k*.31+sin(float(i)*3.2)*.055+sin(time*.3+k)*.018,0.);float d=length(p-center);float size=.018+.022*(.5+.5*sin(float(i)*2.1));float ghost=exp(-d*d/(size*size))+softRing(p-center,size*1.5,.008)*.12;col=lightOnPaper(col,gradient(float(i)/5.),ghost*.65);}
  }else{
   p+=vec2(sin(time*.45),cos(time*.39))*.025;vec2 q=rot(-.63+sin(time*.55)*.09)*p;float r=length(p),angle=atan(p.y,p.x);
   col=paper;
   float rays=pow(.5+.5*cos(angle*43.+sin(angle*9.+time*.55)*1.2),22.)*exp(-r*(6.+sin(time*1.6)))*smoothstep(.015,.07,r);
   float axis=exp(-abs(q.y)*100.)*exp(-abs(q.x)*1.6)+exp(-abs(p.y)*180.)*exp(-abs(p.x)*4.);
   col=lightOnPaper(col,gradient(.5+.45*sin(angle*3.)),rays*(3.+sin(time*2.)*.8)+axis*(1.3+.3*sin(time*2.4))+sparkle(p,.18+.06*sin(time*1.7))*1.5);float core=exp(-r*r/.0016);col=mix(col,vec3(1.),core);opticalCoverage=core+opticalCoverage*(1.-core);
   float sweep=exp(-pow((q.x-.8*sin(time*.8))/.12,2.))*exp(-abs(q.y)*65.);float streaming=pow(.5+.5*cos(r*38.-time*5.),12.)*pow(.5+.5*cos(angle*27.+sin(time*.4)),12.)*exp(-r*4.);col=lightOnPaper(col,gradient(.5+.4*sin(time*.8+q.x*3.)),sweep*2.+streaming*1.8);
   for(int i=0;i<5;i++){float k=float(i)-2.;vec2 center=vec2(k*.39+sin(time*.7+k)*.10,0.);float ghost=exp(-pow(length((q-center)*vec2(.6,1.5))/.055,2.));col=lightOnPaper(col,gradient(float(i)/4.),ghost*.9);}
   coverage=opticalCoverage;
  }
 }
 else if(kind<1.5){
  // Trace through a three-dimensional accretion volume. Bending rays reveal the
  // far side of the disk above and below its center instead of drawing flat arcs.
  bool spectral=kind>.5;vec2 screen=uv*2.65;
  if(spectral)screen=rot(.57+sin(time*.35)*.08)*screen;
  float inclination=(spectral?.19:.12)+sin(time*.32)*.055;
  vec3 origin=vec3(0.,3.4*sin(inclination),3.4*cos(inclination));
  vec3 forward=normalize(-origin),right=vec3(1.,0.,0.),up=cross(right,forward);
  vec3 ray=normalize(forward+screen.x*.38*right+screen.y*.38*up);
  vec3 pos=origin+ray*hash(gl_FragCoord.xy)*.08,lightSum=vec3(0.),backdrop=paper;float opacity=0.;
  for(int i=0;i<112;i++){
   float radius=length(pos);if(radius>5.2||opacity>.995)break;
   if(radius<.39){
    if(showSphere>.5){vec3 normal=normalize(pos);float f=pow(1.-max(dot(normal,-ray),0.),3.);vec3 reflection=environment(reflect(ray,normal));backdrop=mix(vec3(.95,.97,.99),reflection,.25+f*.42);float highlight=pow(max(dot(normal,normalize(vec3(-.5,.8,1.))),0.),28.);backdrop+=highlight*.5;}
    break;
   }
   float stepSize=clamp(radius*.05,.018,.13);
   // A thin tilted rotating disk with radial filaments and irregular dust lanes.
   float radial=length(pos.xz),angle=atan(pos.z,pos.x);
   float warp=.012*sin(angle*3.+radial*4.-time*.35);
   float altitude=abs(pos.y-warp);
   float inner=smoothstep(.45,.56,radial),outer=1.-smoothstep(1.22,1.62,radial);
   float filaments=.5+.5*sin(radial*110.+sin(angle*7.+time*.4)*2.+sin(radial*17.-angle*3.)*1.5-time*2.);
   float dust=.5+.5*sin(radial*63.-angle*9.+time*.7);
   float volume=exp(-altitude/ .024)*inner*outer*(.3+pow(filaments,5.)*2.2+dust*.18);
   float bloom=exp(-altitude/.075)*inner*outer*.045;
   vec3 tint=gradient(clamp(.48+.30*sin(radial*5.-angle*.35-time*.12),0.,1.));
   if(spectral)tint=mix(tint,spectrum(radial*.32+angle*.16),.45);
   float hot=pow(filaments,12.)*.7;vec3 emission=mix(tint,vec3(1.),hot);
   float density=volume+bloom;
   if(!spectral){float jet=exp(-length(pos.xz)*180.)*exp(-abs(pos.y)*.9)*.7;density+=jet;emission=mix(emission,mix(stopA,vec3(1.),.65),clamp(jet,0.,1.));}
   float alpha=1.-exp(-density*stepSize*23.);
   lightSum+=(1.-opacity)*alpha*emission;opacity+=(1.-opacity)*alpha;
   // Gravitational deflection is an optical approximation, not a GR solver.
   ray=normalize(ray-pos*(.13*stepSize/(radius*radius*radius)));
   pos+=ray*stepSize;
  }
  col=lightSum+backdrop*(1.-opacity);
 }else if(kind<2.5||kind>6.5||kind>2.5&&kind<4.5||kind>5.5&&kind<6.5){
  coverage=0.;
  vec3 ro=vec3(0.,0.,3.),rd=normalize(vec3(uv*2.7,-3.));float travel=0.;vec3 p=ro;bool hit=false;
  for(int i=0;i<80;i++){p=ro+rd*travel;float d=geometry(p);if(d<.0015){hit=true;break;}travel+=d*.6;if(travel>6.)break;}
  if(hit){coverage=1.;vec2 e=vec2(.002,0.);vec3 n=normalize(vec3(geometry(p+e.xyy)-geometry(p-e.xyy),geometry(p+e.yxy)-geometry(p-e.yxy),geometry(p+e.yyx)-geometry(p-e.yyx)));float diffuse=max(dot(n,normalize(vec3(-.6,.7,1.))),0.);float edge=pow(1.-max(dot(n,-rd),0.),2.);
   if(kind<2.5){vec3 local=catSpace(p);vec3 tint=gradient(clamp(.5+local.y*.45+local.x*.28,0.,1.));float fresnel=pow(1.-max(dot(n,-rd),0.),2.);vec3 reflectedDir=reflect(rd,n);float softbox=exp(-pow((reflectedDir.x+.5)/.20,4.)-pow((reflectedDir.y-.48)/.36,4.));float edgeRibbon=fresnel*smoothstep(-.15,.55,dot(n,normalize(vec3(-.5,.7,.2))));col=mix(paper,tint,.42);col+=gradient(.5+reflectedDir.y*.4+reflectedDir.x*.2)*fresnel*.06;col=mix(col,mix(paper,environment(reflectedDir),.25),fresnel*.12);col=mix(col,vec3(1.),softbox*.55+edgeRibbon*.35);float innerEar=exp(-pow((abs(local.x)-(.43+.18*(local.y-.23)))/.11,2.))*smoothstep(.43,.56,local.y)*(1.-smoothstep(.70,.8,local.y));col=mix(col,mix(stopC,paper,.25),innerEar*.26);float blink=1.-exp(-pow((mod(time,4.6)-3.4)/.15,2.));vec2 eyeL=local.xy-vec2(-.25,.02),eyeR=local.xy-vec2(.25,.02);eyeL.y/=mix(.06,1.,blink);eyeR.y/=mix(.06,1.,blink);float eyes=exp(-dot(eyeL,eyeL)*220.)+exp(-dot(eyeR,eyeR)*220.);col=mix(col,vec3(1.),clamp(eyes*1.4,0.,1.));}
   else if(kind<3.5){float a=atan(p.y,p.x);col=spectrum(a/6.283+time*.035);col=mix(col,paper,.20);col*=.8+diffuse*.2;col=mix(col,paper,edge*.22);}
   else if(kind<4.5){float t=smoothstep(-.3,.6,p.y);col=gradient(t);col*=.65+diffuse*.35;col+=pow(max(dot(reflect(rd,n),normalize(vec3(-.5,.8,1.))),0.),12.)*.16;col=mix(col,paper,smoothstep(.68,.94,abs(p.y)));}
   else if(kind<6.5){float a=atan(p.y,p.x);col=mix(paper,mix(vec3(.35,.5,.66),spectrum(a*.25),.3),.12+pow(diffuse,6.)*.3);}
   else{vec3 tint=gradient(clamp(.5+p.y*.45+p.x*.3+sin(time*.25)*.08,0.,1.));col=mix(tint,paper,.12+pow(diffuse,3.)*.32);col=mix(col,paper,edge*.55);float shine=pow(max(dot(reflect(rd,n),normalize(vec3(-.6,.8,1.))),0.),24.);col+=shine*.14;}
  }
  if(kind>2.5&&kind<3.5){float r=length(uv*2.7);col=mix(col,vec3(1.),1.-smoothstep(.30,.48,r));}
  if(kind>5.5&&kind<6.5){opticalCoverage=coverage;vec2 q=uv*2.7/(1.+.055*sin(time*2.6));float r=length(q),a=atan(q.y,q.x);float phase=a*19.+sin(a*5.+time*.45)*1.4+time*.8;float streak=pow(.5+.5*sin(phase),7.)*exp(-pow((r-(.77+.04*sin(a*7.+time*3.)))/.18,2.));float flare=pow(.5+.5*sin(phase+.65),12.)*exp(-pow((r-.91)/.19,2.));vec3 prism=gradient(.5+.5*sin(a*4.+.8));col=lightOnPaper(col,prism,streak*.85);col=lightOnPaper(col,spectrum(a*.4+.2),flare*.48);col=mix(col,paper,exp(-pow((r-.63)/.013,2.))*.75);coverage=opticalCoverage;}

  col+=grain*.075;
 }else if(kind<5.5){
  coverage=0.;
  vec3 ro=vec3(0.,0.,3.4),rd=normalize(vec3(uv*2.9,-3.));float travel=0.;vec3 p;bool hit=false;
  for(int i=0;i<70;i++){p=ro+rd*travel;float d=geometry(p);if(d<.001){hit=true;break;}travel+=d*.85;if(travel>6.)break;}
  if(hit){coverage=1.;vec2 e=vec2(.001,0.);vec3 n=normalize(vec3(geometry(p+e.xyy)-geometry(p-e.xyy),geometry(p+e.yxy)-geometry(p-e.yxy),geometry(p+e.yyx)-geometry(p-e.yyx)));float f=pow(1.-max(dot(n,-rd),0.),3.);vec3 reflected=environment(reflect(rd,n));vec3 local=transform(p);vec3 distances=abs(abs(local)-vec3(.62));float edge=1.-smoothstep(.018,.09,min(max(distances.x,distances.y),min(max(distances.x,distances.z),max(distances.y,distances.z))));vec3 inside=transform(refract(rd,n,.68));vec3 exitT=(sign(inside)*.62-local)/inside;float exitDistance=min(exitT.x,min(exitT.y,exitT.z));vec3 back=local+inside*exitDistance;vec3 backD=abs(abs(back)-vec3(.62));float backEdge=1.-smoothstep(.015,.065,min(max(backD.x,backD.y),min(max(backD.x,backD.z),max(backD.y,backD.z))));vec3 transmitted=environment(refract(rd,n,.64));col=mix(paper,transmitted,.64)+reflected*(f*.55+.09);col=mix(col,environment(-inside),backEdge*.12);col=mix(col,reflected+vec3(.2,.22,.23),edge*.65);float glint=pow(max(dot(reflect(rd,n),normalize(vec3(-.5,.8,1.))),0.),48.);col+=glint*.9;col=mix(col,mix(stopC,vec3(1.),.8),pow(edge,8.)*.4);col=mix(col,paper,brightness);}

 }
 // Remove the temporary paper matte from optical light layers. Geometry uses
 // its own surface color; water is a translucent reflection film.
 if(kind>12.5||(kind>9.5&&kind<10.5)||(kind>5.5&&kind<6.5)){
  col=coverage>.001?(col-paper*(1.-coverage))/coverage:vec3(0.);
 }
 col+=grain*.012;gl_FragColor=vec4(clamp(col,0.,1.),clamp(coverage,0.,1.));
}`

type Engine={surface:HTMLCanvasElement;gl:WebGLRenderingContext;program:WebGLProgram;source:string}
let engine:Engine|null=null
if(import.meta.hot){import.meta.hot.dispose(()=>{if(engine&&!engine.gl.isContextLost())engine.gl.deleteProgram(engine.program);engine=null})}
function getEngine(source:string){
 if(engine&&!engine.gl.isContextLost()&&engine.source===source)return engine
 if(engine&&!engine.gl.isContextLost())engine.gl.deleteProgram(engine.program)
 const surface=document.createElement('canvas'),gl=surface.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'})
 if(!gl)return null
 const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)??'Shader failed');return shader}
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,source),program=gl.createProgram()!
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null
 gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
 const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)
 surface.addEventListener('webglcontextlost',event=>{event.preventDefault();engine=null})
 engine={surface,gl,program,source};return engine
}
export function FormStudy({form,blur,motion,colors,brightness=0,sphere=true}:{form:StudyForm;blur:number;motion:boolean;colors:readonly [string,string,string];brightness?:number;sphere?:boolean}){
 const shaderSource=fragment
 const canvas=useRef<HTMLCanvasElement>(null),[failed,setFailed]=useState(false)
 const settings=useRef({colors,brightness,sphere})
 useEffect(()=>{settings.current={colors,brightness,sphere}},[colors,brightness,sphere])
 useEffect(()=>{
  const node=canvas.current;if(!node)return
  let frame=0,visible=false,last=-100;const start=performance.now()
  const draw=(now:number)=>{
   if(!visible)return
   if(now-last<66){frame=requestAnimationFrame(draw);return}last=now
   try{const current=getEngine(shaderSource);if(!current){setFailed(true);return}const {surface,gl,program}=current;const rect=node.getBoundingClientRect();const ratio=Math.min(devicePixelRatio,1.5,720/Math.max(rect.width,1));const w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));
    if(surface.width!==w||surface.height!==h){surface.width=w;surface.height=h}gl.viewport(0,0,w,h);gl.useProgram(program);gl.uniform2f(gl.getUniformLocation(program,'resolution'),w,h);gl.uniform1f(gl.getUniformLocation(program,'kind'),kinds.indexOf(form));gl.uniform1f(gl.getUniformLocation(program,'time'),motion?(now-start)/1000:0);gl.uniform1f(gl.getUniformLocation(program,'brightness'),settings.current.brightness);gl.uniform1f(gl.getUniformLocation(program,'showSphere'),settings.current.sphere?1:0);settings.current.colors.forEach((hex,i)=>{const value=parseInt(hex.slice(1),16);gl.uniform3f(gl.getUniformLocation(program,['stopA','stopB','stopC'][i]!),((value>>16)&255)/255,((value>>8)&255)/255,(value&255)/255)});gl.drawArrays(gl.TRIANGLES,0,6)
    node.dataset.frameTime=(motion?(now-start)/1000:0).toFixed(2);if(node.width!==w||node.height!==h){node.width=w;node.height=h}const ctx=node.getContext('2d')!;ctx.clearRect(0,0,w,h);ctx.drawImage(surface,0,0)
   }catch{setFailed(true);return}
   if(motion)frame=requestAnimationFrame(draw)
  }
  const request=()=>{cancelAnimationFrame(frame);last=-100;frame=requestAnimationFrame(draw)}
  const materialChange=()=>request();node.addEventListener('form-material-change',materialChange)
  const resize=new ResizeObserver(request);resize.observe(node)
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)request();else cancelAnimationFrame(frame)},{rootMargin:'100px'});observer.observe(node)
  return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();node.removeEventListener('form-material-change',materialChange)}
 },[form,motion,shaderSource])
 useEffect(()=>{canvas.current?.dispatchEvent(new Event('form-material-change'))},[colors,brightness,sphere])
 return <div className="form-study" data-form={form} data-shader-revision={fragment.length}><canvas ref={canvas} style={{filter:`blur(${blur}px)`}} role="img" aria-label={`${form} procedural form on a light background`}/>{failed&&<p role="status">This form needs WebGL rendering support.</p>}</div>
}
