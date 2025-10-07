// === Unified art.js (art2 + art3 DOM + art4 DOM) ============================
// p5.js 1.9.x
// - art2: Ripple Grid + 3-Stop Gradient (Canvas)
// - art3: SVG 왜곡 레이어 (DOM-SVG, 적응형 리샘플링, 인터랙티브)
// - art4: landingtext.svg (DOM-SVG, A3 하단 정렬)
// ============================================================================

/* ========================= THEME (색/스트로크/레이아웃) ===================== */
const THEME = {
  gradient: {
    top:    "#9ED5DF",
    mid:    "#FDFBED",
    bottom: "#DD4748",
    featherTM: 0.35,
    featherMB: 0.15,
  },

  grid: {
    stroke: "#ffffff",
    strokeWeight: 0.2,
    dotColor: "#ffffff",
    dotMaxAlpha: 80,
  },

  art3: {
    fill: "#DD4748",
    fillAlpha: 1.0,
    stroke: "#ffffff",
    strokeWeight: 0,

    // 웹/모바일 별 크기·위치(중앙 기준 오프셋)
    layout: {
      desktop: { widthFrac: 0.33, offsetXFrac: 0.005, offsetYFrac: -0.09 },
      mobile:  { widthFrac: 0.70, offsetXFrac: 0.005, offsetYFrac: -0.065 },
    },
  },

  // ▶ landingtext.svg(텍스트 레이어) 스타일/레이아웃 (DOM)
  coming: {
    fill: "#DD4748",
    fillAlpha: 1.0,
    stroke: "#000000",
    strokeWeight: 0,
    layout: {
      desktop: { scaleMul: 1.0, offsetXFrac: 0.0, extraYFrac: 0.0, gapAt1920: 50, gapPow: 0.33, minGap: 0,   maxGap: 1e9 },
      mobile:  { scaleMul: 1.0, offsetXFrac: 0.0, extraYFrac: 0.0, gapAt1920: 50, gapPow: 0.33, minGap: 10,  maxGap: 200 },
    },
  },
};
/* ======================= /THEME (색/스트로크/레이아웃) ===================== */


// -------------------------------[ art2 ]-------------------------------------

let boil = 0; // 상호작용 에너지

const BOIL_DECAY_PER_SEC   = 30;
const BOIL_GAIN_PER_PX     = 0.003;
const BOIL_GAIN_PER_RIPPLE = 0.0;

let size = 25;
let spacing = 5;

let rippleSpeed   = 300;
let rippleWidth   = 60;
let rippleLife    = 900;
let rippleGain    = 1;
let emitInterval  = 220;
let moveThreshold = 8;

// 파동 윤곽 노이즈
let jaggedAmp       = 12;
let jaggedFreq      = 6;
let jaggedTimeScale = 0.9;
let widthJitter     = 0.4;

let ripples = [];
let lastEmitTime = -9999;
let lastMouseX, lastMouseY;
// ★ 추가: 모바일 스와이프 추적용
let lastTouchX, lastTouchY;

let topColor, midColor, bottomColor;

const STOP1_BASE = 0.5;
const STOP2_BASE = 0.8;
const STOP1_AT_MAX_BOIL = 0.3;
const STOP2_AT_MAX_BOIL = 0.6;
const MIN_GAP = 0.005;

let featherTM = THEME.gradient.featherTM;
let featherMB = THEME.gradient.featherMB;

let waveAmp   = 0.3;
let waveFreq  = 2.0;
let waveSpeed = 0.5;

let gradG;
let gradCols = 64;
let gradRows = 64;
let gradBlurPx = 3;


// ---------------------- DOM Overlay (A3/A4 공용 컨테이너) -------------------
const DOMS = {
  overlay: null,
  a3svg: null,
  a3paths: [],
  a4svg: null,
  a4paths: [],
};
function __ensureOverlay() {
  if (!DOMS.overlay) {
    const ov = document.createElement('div');
    ov.id = 'art-overlay';
    Object.assign(ov.style, {
      position: 'fixed',
      left: '0', top: '0',
      width: '100%', height: '100%',
      pointerEvents: 'none',
      zIndex: '10',
      contain: 'layout style size',
      overflow: 'hidden',
    });
    document.body.appendChild(ov);
    DOMS.overlay = ov;
  }
  if (!DOMS.a3svg) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
    Object.assign(svg.style, {
      position: 'absolute',
      left: '0', top: '0',
      width: '100%', height: '100%',
      zIndex: '11',
      pointerEvents: 'none',
    });
    DOMS.overlay.appendChild(svg);
    DOMS.a3svg = svg;
  }
  if (!DOMS.a4svg) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
    Object.assign(svg.style, {
      position: 'absolute',
      left: '0', top: '0',
      width: '100%', height: '100%',
      zIndex: '12',              // A4가 A3 위로
      pointerEvents: 'none',
    });
    DOMS.overlay.appendChild(svg);
    DOMS.a4svg = svg;
  }
}
function __syncOverlayViewBox() {
  if (DOMS.a3svg) DOMS.a3svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  if (DOMS.a4svg) DOMS.a4svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
}


// -------------------------------[ art3 DOM ]---------------------------------

let A3 = {
  enabled: true,
  SVG_SRC: '/source/bogglevector3.svg',

  // 화면 픽셀 기준 품질 파라미터 (적응형 리샘플링)
  SEGMENT_PX: 2,
  CURVE_TOLERANCE_PX: 0.1,
  MAX_RECURSION: 12,

  // 물리/왜곡
  RADIUS: 300,
  FORCE: 500, 
  K_SPRING: 120,
  DAMPING: 10,
  TRAIL_LEN: 4,
  TRAIL_FADE: 0.6,

  viewBox: { x:0, y:0, w:100, h:100 },
  scaleToCanvas: 1,
  offsetX: 0,
  offsetY: 0,

  srcPaths: [],
  paths: [],
  pointerHistory: [],
  domPaths: [],

  clamp(v,a,b){ return Math.max(a, Math.min(b, v)); },
  lerp(a,b,t){ return a + (b-a)*t; },
  vlen(x,y){ return Math.hypot(x,y); },
  distPointToLine(px,py,ax,ay,bx,by){
    const vx=bx-ax, vy=by-ay, wx=px-ax, wy=py-ay;
    const L=vx*vx+vy*vy || 1e-9, t=(vx*wx+vy*wy)/L;
    const qx=ax+vx*t, qy=ay+vy*t; return Math.hypot(px-qx, py-qy);
  },

  splitQuad(p0,p1,p2){ const q0={x:(p0.x+p1.x)/2,y:(p0.y+p1.y)/2};
    const q1={x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2}; const r={x:(q0.x+q1.x)/2,y:(q0.y+q1.y)/2};
    return [{p0,p1:q0,p2:r},{p0:r,p1:q1,p2}];
  },
  splitCubic(p0,p1,p2,p3){
    const q0={x:(p0.x+p1.x)/2,y:(p0.y+p1.y)/2}, q1={x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2}, q2={x:(p2.x+p3.x)/2,y:(p2.y+p3.y)/2};
    const r0={x:(q0.x+q1.x)/2,y:(q0.y+q1.y)/2}, r1={x:(q1.x+q2.x)/2,y:(q1.y+q2.y)/2};
    const s={x:(r0.x+r1.x)/2,y:(r0.y+r1.y)/2};
    return [{p0,p1:q0,p2:r0,p3:s},{p0:s,p1:r1,p2:q2,p3}];
  },
  flatQuad(p0,p1,p2,t){ return this.distPointToLine(p1.x,p1.y,p0.x,p0.y,p2.x,p2.y)<=t; },
  flatCubic(p0,p1,p2,p3,t){
    return this.distPointToLine(p1.x,p1.y,p0.x,p0.y,p3.x,p3.y)<=t &&
           this.distPointToLine(p2.x,p2.y,p0.x,p0.y,p3.x,p3.y)<=t;
  },

  sampleQuadAdaptive(p0,p1,p2,t,depth=0,out=[]){
    if (depth>this.MAX_RECURSION || this.flatQuad(p0,p1,p2,t)) { out.push({x:p2.x,y:p2.y}); return out; }
    const [L,R]=this.splitQuad(p0,p1,p2);
    this.sampleQuadAdaptive(L.p0,L.p1,L.p2,t,depth+1,out);
    this.sampleQuadAdaptive(R.p0,R.p1,R.p2,t,depth+1,out);
    return out;
  },
  sampleCubicAdaptive(p0,p1,p2,p3,t,depth=0,out=[]){
    if (depth>this.MAX_RECURSION || this.flatCubic(p0,p1,p2,p3,t)) { out.push({x:p3.x,y:p3.y}); return out; }
    const [L,R]=this.splitCubic(p0,p1,p2,p3);
    this.sampleCubicAdaptive(L.p0,L.p1,L.p2,L.p3,t,depth+1,out);
    this.sampleCubicAdaptive(R.p0,R.p1,R.p2,R.p3,t,depth+1,out);
    return out;
  },

  tokenizeNumbers(str,i0){
    const nums=[]; let i=i0;
    while(i<str.length){
      const m=str.slice(i).match(/^[ \t\r\n,]*([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/);
      if(!m) break; nums.push(parseFloat(m[1])); i+=m[0].length;
    }
    return { nums, idx:i };
  },

  parsePathD(d){
    const cmds=[]; let i=0, cx=0, cy=0, sx=0, sy=0, last='';
    while(i<d.length){
      const ch=d[i];
      if(/[MLHVQCZmlhvqcz]/.test(ch)){ last=ch; i++; }
      else if(/\s|,/.test(ch)){ i++; continue; }
      else if(last){} else { i++; continue; }
      const rel=(last>='a'&&last<='z'); const cmd=last.toUpperCase();
      const {nums, idx}=this.tokenizeNumbers(d,i); i=idx; let p=0;
      const pair=()=>{ const x=nums[p++], y=nums[p++]; return rel?{x:cx+x,y:cy+y}:{x,y}; };
      const num =()=>nums[p++];
      while(p<nums.length || cmd==='Z'){
        if(cmd==='M'){ const pt=pair(); cx=pt.x; cy=pt.y; sx=cx; sy=cy; cmds.push({type:'M',x:cx,y:cy});
          while(p+1<nums.length){ const pt2=pair(); cmds.push({type:'L',x:pt2.x,y:pt2.y}); cx=pt2.x; cy=pt2.y; } break; }
        if(cmd==='L'){ const pt=pair(); cmds.push({type:'L',x:pt.x,y:pt.y}); cx=pt.x; cy=pt.y; continue; }
        if(cmd==='H'){ const nx=num(); const x=rel?cx+nx:nx; cmds.push({type:'L',x,y:cy}); cx=x; continue; }
        if(cmd==='V'){ const ny=num(); const y=rel?cy+ny:ny; cmds.push({type:'L',x:cx,y}); cy=y; continue; }
        if(cmd==='Q'){ const c1=pair(); const p2=pair(); cmds.push({type:'Q',x1:c1.x,y1:c1.y,x:p2.x,y:p2.y}); cx=p2.x; cy=p2.y; continue; }
        if(cmd==='C'){ const c1=pair(); const c2=pair(); const p2=pair(); cmds.push({type:'C',x1:c1.x,y1:c1.y,x2:c2.x,y2:c2.y,x:p2.x,y:p2.y}); cx=p2.x; cy=p2.y; continue; }
        if(cmd==='Z'){ cmds.push({type:'Z'}); cx=sx; cy=sy; break; }
      }
    }
    return cmds;
  },

  resampleCommandsAtScale(cmds, scale){
    const segPx = this.SEGMENT_PX;
    const tolPx = this.CURVE_TOLERANCE_PX;
    const stepSrc = Math.max(0.5, segPx / Math.max(scale, 1e-6));
    const tolSrc  = Math.max(0.1, tolPx / Math.max(scale, 1e-6));

    const subs=[]; let cur=[]; let pos={x:0,y:0}; let start={x:0,y:0};
    const push=(pt,force=false)=>{
      if(!force && cur.length){ const a=cur[cur.length-1]; if(Math.hypot(pt.x-a.x,pt.y-a.y)<0.25) return; }
      cur.push({ x0:pt.x,y0:pt.y, x:pt.x,y:pt.y, vx:0,vy:0 });
    };
    for(const c of cmds){
      if(c.type==='M'){ if(cur.length){ subs.push({points:cur,closed:false}); cur=[]; }
        push({x:c.x,y:c.y},true); pos={x:c.x,y:c.y}; start=pos; continue; }
      if(c.type==='L'){ const p0=pos, p1={x:c.x,y:c.y};
        const L=Math.max(1,this.vlen(p1.x-p0.x,p1.y-p0.y));
        const steps=Math.max(1,Math.round(L/stepSrc));
        for(let i=1;i<=steps;i++){ const t=i/steps; push({x:this.lerp(p0.x,p1.x,t), y:this.lerp(p0.y,p1.y,t)}); }
        pos=p1; continue; }
      if(c.type==='Q'){ const p0=pos, p1={x:c.x1,y:c.y1}, p2={x:c.x,y:c.y};
        const pts=this.sampleQuadAdaptive(p0,p1,p2,tolSrc,0,[]); for(const pt of pts) push(pt); pos=p2; continue; }
      if(c.type==='C'){ const p0=pos, p1={x:c.x1,y:c.y1}, p2={x:c.x2,y:c.y2}, p3={x:c.x,y:c.y};
        const pts=this.sampleCubicAdaptive(p0,p1,p2,p3,tolSrc,0,[]); for(const pt of pts) push(pt); pos=p3; continue; }
      if(c.type==='Z'){ const p0=pos, p1=start;
        const L=Math.max(1,this.vlen(p1.x-p0.x,p1.y-p0.y));
        const steps=Math.max(1,Math.round(L/stepSrc));
        for(let i=1;i<=steps;i++){ const t=i/steps; push({x:this.lerp(p0.x,p1.x,t), y:this.lerp(p0.y,p1.y,t)}); }
        subs.push({points:cur,closed:true}); cur=[]; pos=start; continue; }
    }
    if(cur.length) subs.push({points:cur,closed:false});
    return subs;
  },

  async loadSVG(url){
    try{
      const res=await fetch(url,{cache:'no-store'});
      if(!res.ok) throw new Error('SVG load failed '+res.status);
      const text=await res.text();
      const doc=new DOMParser().parseFromString(text,'image/svg+xml');
      const svgEl=doc.querySelector('svg'); if(!svgEl) throw new Error('No <svg>');
      const vb=svgEl.getAttribute('viewBox');
      if(vb){ const [x,y,w,h]=vb.trim().split(/[ ,]+/).map(Number); this.viewBox={x,y,w,h}; }
      else  { const w=parseFloat(svgEl.getAttribute('width'))||100; const h=parseFloat(svgEl.getAttribute('height'))||100; this.viewBox={x:0,y:0,w,h}; }

      const src=[];
      for(const node of doc.querySelectorAll('path')){
        const d=node.getAttribute('d'); if(!d) continue;
        const fr=(node.getAttribute('fill-rule')||'nonzero').toLowerCase()==='evenodd'?'evenodd':'nonzero';
        const cmds=this.parsePathD(d);
        src.push({ fillRule: fr, cmds });
      }
      if (src.length === 0) console.warn('[A3] No <path> in SVG:', url);
      this.srcPaths = src;
    }catch(err){
      console.error(err);
    }
  },

  currentLayout(){
    return (windowWidth <= 768) ? THEME.art3.layout.mobile : THEME.art3.layout.desktop;
  },

  updateLayout(){
    const L = this.currentLayout();
    const frac = L.widthFrac;
    this.scaleToCanvas = (width * frac) / this.viewBox.w;

    const drawW = this.viewBox.w * this.scaleToCanvas;
    const drawH = this.viewBox.h * this.scaleToCanvas;
    const cx = width  * 0.5 + (width  * L.offsetXFrac);
    const cy = height * 0.5 + (height * L.offsetYFrac);

    this.offsetX = cx - (drawW * 0.5) - this.viewBox.x * this.scaleToCanvas;
    this.offsetY = cy - (drawH * 0.5) - this.viewBox.y * this.scaleToCanvas;

    const out=[];
    for(const spath of this.srcPaths){
      const subs = this.resampleCommandsAtScale(spath.cmds, this.scaleToCanvas);
      out.push({ fillRule: spath.fillRule, subpaths: subs });
    }
    this.paths = out;

    for(const path of this.paths){
      for(const sp of path.subpaths){
        for(const p of sp.points){
          p.x = p.x0 * this.scaleToCanvas + this.offsetX;
          p.y = p.y0 * this.scaleToCanvas + this.offsetY;
          p.vx = 0; p.vy = 0;
        }
      }
    }

    this.__ensureDom();
    this.syncDomStyle();
    this.updateDomPaths();
  },

  __ensureDom(){
    __ensureOverlay();
    if (!DOMS.a3svg) return;
    const need = this.paths.length;
    while (DOMS.a3paths.length < need) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      el.setAttribute('vector-effect','non-scaling-stroke');
      DOMS.a3svg.appendChild(el);
      DOMS.a3paths.push(el);
    }
    while (DOMS.a3paths.length > need) {
      const el = DOMS.a3paths.pop();
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
    this.domPaths = DOMS.a3paths;
    __syncOverlayViewBox();
    DOMS.a3svg.style.display = this.enabled ? '' : 'none';
  },

  syncDomStyle(){
    if (!this.domPaths) return;
    for (let i=0;i<this.domPaths.length;i++){
      const el = this.domPaths[i];
      el.setAttribute('fill', THEME.art3.fill);
      el.setAttribute('fill-opacity', String(THEME.art3.fillAlpha));
      if (THEME.art3.strokeWeight > 0) {
        el.setAttribute('stroke', THEME.art3.stroke);
        el.setAttribute('stroke-width', String(THEME.art3.strokeWeight));
      } else {
        el.setAttribute('stroke', 'none');
      }
      const fr = this.paths[i]?.fillRule || 'nonzero';
      el.setAttribute('fill-rule', fr);
    }
  },

  buildPathD(sp){
    if(!sp.points.length) return '';
    let d = `M ${sp.points[0].x.toFixed(2)} ${sp.points[0].y.toFixed(2)} `;
    for (let i=1;i<sp.points.length;i++){
      const q = sp.points[i];
      d += `L ${q.x.toFixed(2)} ${q.y.toFixed(2)} `;
    }
    if (sp.closed) d += 'Z ';
    return d;
  },
  updateDomPaths(){
    if (!this.domPaths) return;
    for (let i=0;i<this.domPaths.length;i++){
      const path = this.paths[i];
      let d = '';
      for (const sp of path.subpaths) d += this.buildPathD(sp);
      this.domPaths[i].setAttribute('d', d);
    }
  },

  pushPointer(x,y){
    if(!this.enabled) return;
    const cx=this.clamp(x,0,width), cy=this.clamp(y,0,height);
    this.pointerHistory.unshift({x:cx,y:cy});
    if(this.pointerHistory.length>this.TRAIL_LEN) this.pointerHistory.length=this.TRAIL_LEN;
  },

  physics(dt){
    if(!this.enabled || this.paths.length===0) return;
    const infl=[]; for(let i=0;i<this.pointerHistory.length;i++){
      infl.push({ x:this.pointerHistory[i].x, y:this.pointerHistory[i].y, w:Math.pow(this.TRAIL_FADE,i) });
    }
    for(const path of this.paths){
      for(const sp of path.subpaths){
        for(const p of sp.points){
          const xr=p.x0*this.scaleToCanvas + this.offsetX;
          const yr=p.y0*this.scaleToCanvas + this.offsetY;
          const fxS=this.K_SPRING*(xr-p.x), fyS=this.K_SPRING*(yr-p.y);
          let fxR=0, fyR=0;
          for(const inf of infl){
            const dx=p.x-inf.x, dy=p.y-inf.y, d2=dx*dx+dy*dy;
            if(d2<this.RADIUS*this.RADIUS){
              const d=Math.max(Math.sqrt(d2),1e-6);
              const fall=1 - d/this.RADIUS;
              const s=this.FORCE*inf.w*fall*fall;
              fxR+=(dx/d)*s; fyR+=(dy/d)*s;
            }
          }
          const fxD=-this.DAMPING*p.vx, fyD=-this.DAMPING*p.vy;
          const ax=fxS+fxR+fxD, ay=fyS+fyR+fyD;   // ★ y축 반발력(fyR) 포함!
          p.vx+=ax*dt; p.vy+=ay*dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
        }
      }
    }
  },

  render(){
    this.updateDomPaths();
  }
};


// -------------------------------[ art4 (DOM) ]-------------------------------

let A4 = {
  enabled: true,
  SVG_SRC: '/source/landingtext.svg',

  viewBox: { x:0, y:0, w:100, h:30 },
  scaleToCanvas: 1,
  offsetX: 0,
  offsetY: 0,

  srcPaths: [],
  paths: [],
  domPaths: [],

  currentLayout(){
    return (windowWidth <= 768) ? THEME.coming.layout.mobile : THEME.coming.layout.desktop;
  },

  async loadSVG(url){
    try{
      const res=await fetch(url,{cache:'no-store'});
      if(!res.ok) throw new Error('SVG load failed '+res.status);
      const text=await res.text();
      const doc=new DOMParser().parseFromString(text,'image/svg+xml');
      const svgEl=doc.querySelector('svg'); if(!svgEl) throw new Error('No <svg>');
      const vb=svgEl.getAttribute('viewBox');
      if(vb){ const [x,y,w,h]=vb.trim().split(/[ ,]+/).map(Number); this.viewBox={x,y,w,h}; }
      else  { const w=parseFloat(svgEl.getAttribute('width'))||100; const h=parseFloat(svgEl.getAttribute('height'))||30; this.viewBox={x:0,y:0,w,h}; }
      const src=[];
      for(const node of doc.querySelectorAll('path')){
        const d=node.getAttribute('d'); if(!d) continue;
        const fr=(node.getAttribute('fill-rule')||'nonzero').toLowerCase()==='evenodd'?'evenodd':'nonzero';
        const cmds=A3.parsePathD(d);
        src.push({ fillRule: fr, cmds });
      }
      if (src.length === 0) console.warn('[A4] No <path> in SVG:', url);
      this.srcPaths = src;
    }catch(err){
      console.error(err);
    }
  },

  updateLayout(){
    if(!this.enabled) return;

    const L3 = A3.currentLayout();
    const cx3 = width  * 0.5 + (width  * L3.offsetXFrac);
    const drawH3 = A3.viewBox.h * A3.scaleToCanvas;
    const bottomY3 = A3.offsetY + drawH3;

    const L = this.currentLayout();
    this.scaleToCanvas = A3.scaleToCanvas * (L.scaleMul ?? 1);

    const drawW = this.viewBox.w * this.scaleToCanvas;
    const drawH = this.viewBox.h * this.scaleToCanvas;

    const wref = Math.max(1, width);
    const gapRaw = (L.gapAt1920 ?? 50) * Math.pow(wref/1920, L.gapPow ?? 0.33);
    const gap = Math.max(L.minGap ?? 0, Math.min(L.maxGap ?? 1e9, gapRaw));

    const extraX = (L.offsetXFrac ?? 0) * width;
    const extraY = (L.extraYFrac  ?? 0) * height;

    const cx = cx3 + extraX;
    const centerY = (bottomY3 + gap) + drawH * 0.5 + extraY;

    this.offsetX = cx - (drawW * 0.5) - this.viewBox.x * this.scaleToCanvas;
    this.offsetY = centerY - (drawH * 0.5) - this.viewBox.y * this.scaleToCanvas;

    const out=[];
    for(const spath of this.srcPaths){
      const subs = A3.resampleCommandsAtScale(spath.cmds, this.scaleToCanvas);
      out.push({ fillRule: spath.fillRule, subpaths: subs });
    }
    this.paths = out;

    for(const path of this.paths){
      for(const sp of path.subpaths){
        for(const p of sp.points){
          p.x = p.x0 * this.scaleToCanvas + this.offsetX;
          p.y = p.y0 * this.scaleToCanvas + this.offsetY;
        }
      }
    }

    this.__ensureDom();
    this.syncDomStyle();
    this.updateDomPaths();
  },

  __ensureDom(){
    __ensureOverlay();
    if (!DOMS.a4svg) return;
    const need = this.paths.length;
    while (DOMS.a4paths.length < need) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      el.setAttribute('vector-effect','non-scaling-stroke');
      DOMS.a4svg.appendChild(el);
      DOMS.a4paths.push(el);
    }
    while (DOMS.a4paths.length > need) {
      const el = DOMS.a4paths.pop();
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
    this.domPaths = DOMS.a4paths;
    __syncOverlayViewBox();
    DOMS.a4svg.style.display = this.enabled ? '' : 'none';
  },

  syncDomStyle(){
    if (!this.domPaths) return;
    for (let i=0;i<this.domPaths.length;i++){
      const el = this.domPaths[i];
      el.setAttribute('fill', THEME.coming.fill);
      el.setAttribute('fill-opacity', String(THEME.coming.fillAlpha));
      if (THEME.coming.strokeWeight > 0) {
        el.setAttribute('stroke', THEME.coming.stroke);
        el.setAttribute('stroke-width', String(THEME.coming.strokeWeight));
      } else {
        el.setAttribute('stroke', 'none');
      }
      const fr = this.paths[i]?.fillRule || 'nonzero';
      el.setAttribute('fill-rule', fr);
    }
  },

  buildPathD(sp){
    if(!sp.points.length) return '';
    let d = `M ${sp.points[0].x.toFixed(2)} ${sp.points[0].y.toFixed(2)} `;
    for (let i=1;i<sp.points.length;i++){
      const q = sp.points[i];
      d += `L ${q.x.toFixed(2)} ${q.y.toFixed(2)} `;
    }
    if (sp.closed) d += 'Z ';
    return d;
  },
  updateDomPaths(){
    if (!this.domPaths) return;
    for (let i=0;i<this.domPaths.length;i++){
      const path = this.paths[i];
      let d = '';
      for (const sp of path.subpaths) d += this.buildPathD(sp);
      this.domPaths[i].setAttribute('d', d);
    }
  },

  render(){ this.updateDomPaths(); }
};


// ------------------------- 공용 유틸 -------------------------
const __OVERSCAN_PX = 0; // 헤어라인/라운딩 여유
function getViewportSize() {
  const vv = window.visualViewport;
  const w = Math.round(vv ? vv.width  : window.innerWidth);
  const h = Math.round(vv ? vv.height : window.innerHeight);
  
  // 모바일에서 주소창을 고려한 정확한 높이 계산
  const mobileHeight = Math.min(
    window.innerHeight,
    window.screen.height,
    vv ? vv.height : window.innerHeight
  );
  
  return { w, h: mobileHeight };
}
function smoothstep(a, b, x) {
  const t = constrain((x - a) / Math.max(1e-6, (b - a)), 0, 1);
  return t * t * (3 - 2 * t);
}

// ===== (추가) 포인터/터치 종료 시 즉시 멈춤 유틸 =====
function __clearPointerTrail() {
  A3.pointerHistory.length = 0;
}


// ============================== setup =======================================
function setup() {
  const { w, h } = getViewportSize();
  const cnv = createCanvas(w + __OVERSCAN_PX, h + __OVERSCAN_PX);
  cnv.parent('bg');
  cnv.elt.style.display = 'block';
  pixelDensity(1);
  frameRate(60);

  __ensureOverlay();
  __syncOverlayViewBox();

  topColor    = color(THEME.gradient.top);
  midColor    = color(THEME.gradient.mid);
  bottomColor = color(THEME.gradient.bottom);

  gradG = createGraphics(gradCols, gradRows);
  gradG.noStroke();
  noiseDetail(2, 0.5);

  lastMouseX = width / 2;
  lastMouseY = height / 2;

  // 입력 이벤트(art2 + art3)
  window.addEventListener('pointermove', e => {
    onPointerMove(e);
    A3.pushPointer(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('pointerdown', e => {
    onPointerDown(e);
    A3.pushPointer(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      const x = e.touches[0].clientX, y = e.touches[0].clientY;
      spawnRipple(x, y, millis());
      addBoil(BOIL_GAIN_PER_RIPPLE * 0.6);
      A3.pushPointer(x, y);
      // ★ 추가: 스와이프 이동량 계산을 위한 시작점 기록
      lastTouchX = x;
      lastTouchY = y;
    }
  }, { passive: true });

  // ★ 변경: 터치 이동 시에도 마우스와 동일 규칙으로 파동 생성
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const x = e.touches[0].clientX, y = e.touches[0].clientY;
      const now = millis();

      const dx = x - (lastTouchX ?? x);
      const dy = y - (lastTouchY ?? y);
      const moved = Math.hypot(dx, dy);

      if (moved > 0) addBoil(moved * BOIL_GAIN_PER_PX);

      if (moved >= moveThreshold && now - lastEmitTime >= emitInterval) {
        spawnRipple(x, y, now);
        lastEmitTime = now;
        addBoil(BOIL_GAIN_PER_RIPPLE);
        lastTouchX = x;
        lastTouchY = y;
      } else {
        lastTouchX = x;
        lastTouchY = y;
      }

      A3.pushPointer(x, y);
    }
  }, { passive: true });

  // ===== (추가) 포인터/터치 종료·이탈 시 즉시 멈춤 =====
  window.addEventListener('pointerup',     __clearPointerTrail, { passive: true });
  window.addEventListener('pointercancel', __clearPointerTrail, { passive: true });
  window.addEventListener('pointerleave',  __clearPointerTrail, { passive: true });
  window.addEventListener('touchend',      __clearPointerTrail, { passive: true });
  window.addEventListener('touchcancel',   __clearPointerTrail, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      A3.pointerHistory.length = 0;
      for (const path of A3.paths){
        for (const sp of path.subpaths){
          for (const p of sp.points){ p.vx*=0.2; p.vy*=0.2; }
        }
      }
    }
  });

  // SVG 로드 → 레이아웃 업데이트
  (async () => {
    await A3.loadSVG(A3.SVG_SRC);
    A3.updateLayout();
    await A4.loadSVG(A4.SVG_SRC);
    A4.updateLayout();
  })();

  // 런타임 세터
  window.__setArt3Svg = async (src) => {
    if (!src || typeof src !== 'string') return;
    await A3.loadSVG(src.trim());
    A3.updateLayout();
    A4.updateLayout();
  };
  window.__setArt3Fill = (hex = "#000000", alpha = THEME.art3.fillAlpha) => {
    THEME.art3.fill = String(hex);
    THEME.art3.fillAlpha = Math.max(0, Math.min(1, alpha));
    A3.syncDomStyle();
  };
  window.__setArt3Stroke = (color, weight = THEME.art3.strokeWeight) => {
    if (color) THEME.art3.stroke = String(color);
    THEME.art3.strokeWeight = weight;
    A3.syncDomStyle();
  };
  window.__setGradient = (top, mid, bottom) => {
    if (top)    THEME.gradient.top = String(top);
    if (mid)    THEME.gradient.mid = String(mid);
    if (bottom) THEME.gradient.bottom = String(bottom);
    topColor    = color(THEME.gradient.top);
    midColor    = color(THEME.gradient.mid);
    bottomColor = color(THEME.gradient.bottom);
  };
  window.__setFeather = (topMid = featherTM, midBottom = featherMB) => {
    THEME.gradient.featherTM = featherTM = topMid;
    THEME.gradient.featherMB = featherMB = midBottom;
  };
  window.__setGridStroke = (color = THEME.grid.stroke, weight = THEME.grid.strokeWeight) => {
    THEME.grid.stroke = String(color);
    THEME.grid.strokeWeight = weight;
  };
  window.__setGridDot = (color = THEME.grid.dotColor, maxAlpha = THEME.grid.dotMaxAlpha) => {
    THEME.grid.dotColor = String(color);
    THEME.grid.dotMaxAlpha = maxAlpha | 0;
  };

  window.__setArt3LayoutDesktop = (widthFrac = THEME.art3.layout.desktop.widthFrac,
                                   offsetXFrac = THEME.art3.layout.desktop.offsetXFrac,
                                   offsetYFrac = THEME.art3.layout.desktop.offsetYFrac) => {
    THEME.art3.layout.desktop.widthFrac   = widthFrac;
    THEME.art3.layout.desktop.offsetXFrac = offsetXFrac;
    THEME.art3.layout.desktop.offsetYFrac = offsetYFrac;
    A3.updateLayout(); A4.updateLayout();
  };
  window.__setArt3LayoutMobile = (widthFrac = THEME.art3.layout.mobile.widthFrac,
                                  offsetXFrac = THEME.art3.layout.mobile.offsetXFrac,
                                  offsetYFrac = THEME.art3.layout.mobile.offsetYFrac) => {
    THEME.art3.layout.mobile.widthFrac   = widthFrac;
    THEME.art3.layout.mobile.offsetXFrac = offsetXFrac;
    THEME.art3.layout.mobile.offsetYFrac = offsetYFrac;
    A3.updateLayout(); A4.updateLayout();
  };
  window.__toggleArt3 = (on = !A3.enabled) => {
    A3.enabled = !!on;
    if (DOMS.a3svg) DOMS.a3svg.style.display = A3.enabled ? '' : 'none';
  };

  // ▶ Coming soon 텍스트 제어
  window.__setComingSvg = async (src) => {
    if (!src || typeof src !== 'string') return;
    await A4.loadSVG(src.trim());
    A4.updateLayout();
  };
  window.__setComingStyle = (fill = THEME.coming.fill,
                             alpha = THEME.coming.fillAlpha,
                             stroke = THEME.coming.stroke,
                             strokeWeight = THEME.coming.strokeWeight) => {
    THEME.coming.fill = String(fill);
    THEME.coming.fillAlpha = Math.max(0, Math.min(1, alpha));
    THEME.coming.stroke = String(stroke);
    THEME.coming.strokeWeight = strokeWeight | 0;
    A4.syncDomStyle();
  };
  window.__setComingLayoutDesktop = (scaleMul = THEME.coming.layout.desktop.scaleMul,
                                     offsetXFrac = THEME.coming.layout.desktop.offsetXFrac,
                                     extraYFrac  = THEME.coming.layout.desktop.extraYFrac,
                                     gapAt1920   = THEME.coming.layout.desktop.gapAt1920,
                                     gapPow      = THEME.coming.layout.desktop.gapPow,
                                     minGap      = THEME.coming.layout.desktop.minGap,
                                     maxGap      = THEME.coming.layout.desktop.maxGap) => {
    Object.assign(THEME.coming.layout.desktop, { scaleMul, offsetXFrac, extraYFrac, gapAt1920, gapPow, minGap, maxGap });
    A4.updateLayout();
  };
  window.__setComingLayoutMobile = (scaleMul = THEME.coming.layout.mobile.scaleMul,
                                    offsetXFrac = THEME.coming.layout.mobile.offsetXFrac,
                                    extraYFrac  = THEME.coming.layout.mobile.extraYFrac,
                                    gapAt1920   = THEME.coming.layout.mobile.gapAt1920,
                                    gapPow      = THEME.coming.layout.mobile.gapPow,
                                    minGap      = THEME.coming.layout.mobile.minGap,
                                    maxGap      = THEME.coming.layout.mobile.maxGap) => {
    Object.assign(THEME.coming.layout.mobile, { scaleMul, offsetXFrac, extraYFrac, gapAt1920, gapPow, minGap, maxGap });
    A4.updateLayout();
  };
  window.__toggleComing = (on = !A4.enabled) => {
    A4.enabled = !!on;
    if (DOMS.a4svg) DOMS.a4svg.style.display = A4.enabled ? '' : 'none';
  };

  // ▶ visualViewport 변화 대응
  const __resizeToVV = () => {
    const { w: vw, h: vh } = getViewportSize();
    resizeCanvas(vw + __OVERSCAN_PX, vh + __OVERSCAN_PX);
    __syncOverlayViewBox();
    A3.updateLayout();
    A4.updateLayout();
  };
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', __resizeToVV, { passive: true });
    window.visualViewport.addEventListener('scroll',  __resizeToVV, { passive: true });
  }
  window.addEventListener('orientationchange', () => setTimeout(__resizeToVV, 60), { passive: true });
}


// =============================== draw =======================================
function draw() {
  const now = millis();

  boil = Math.max(0, boil - BOIL_DECAY_PER_SEC * (deltaTime / 1000));

  const tt = constrain(boil / 100, 0, 1);
  const dynamicStop1 = lerp(STOP1_BASE, STOP1_AT_MAX_BOIL, tt);
  let dynamicStop2   = lerp(STOP2_BASE, STOP2_AT_MAX_BOIL, tt);
  dynamicStop2 = Math.max(dynamicStop2, dynamicStop1 + MIN_GAP);

  drawThreeStopGradientLowRes(gradG, dynamicStop1, dynamicStop2);
  push();
  drawingContext.imageSmoothingEnabled = true;
  drawingContext.filter = `blur(${gradBlurPx}px)`;
  image(gradG, 0, 0, width, height);
  drawingContext.filter = 'none';
  pop();

  ripples = ripples.filter(r => now - r.t0 < rippleLife);

  const step = size + spacing;
  const cols = floor(width  / step) + 1;
  const rows = floor(height / step) + 1;

  stroke(THEME.grid.stroke);
  strokeWeight(THEME.grid.strokeWeight);
  noFill();

  for (let y = 0; y < rows; y++) {
    const cy = y * step + size / 2;
    for (let x = 0; x < cols; x++) {
      const cx = x * step + size / 2;

      let influence = 0;
      for (let i = 0, L = ripples.length; i < L; i++) {
        const r   = ripples[i];
        const age = now - r.t0;
        const baseRadius = (age / 1000) * rippleSpeed;
        const dx = cx - r.x, dy = cy - r.y;
        const d  = Math.hypot(dx, dy);

        const theta = Math.atan2(dy, dx);
        const ax = Math.cos(theta) * jaggedFreq;
        const ay = Math.sin(theta) * jaggedFreq;
        const tz = (age / 1000) * jaggedTimeScale;

        const n   = noise(ax + r.nx, ay + r.ny, tz + r.nt);
        const n11 = (n - 0.5) * 2.0;

        const effectiveRadius = baseRadius + n11 * jaggedAmp;
        const localWidth = Math.max(4, rippleWidth * (1 + n11 * widthJitter));

        const band     = 1.0 - smoothstep(0, localWidth, Math.abs(d - effectiveRadius));
        const lifeFade = 1.0 - smoothstep(rippleLife * 0.6, rippleLife, age);
        const contrib  = band * lifeFade * rippleGain;

        if (contrib > influence) influence = contrib;
      }

      const amt = Math.min(Math.max(influence, 0), 1);
      const fillAlpha = THEME.grid.dotMaxAlpha * amt;
      const c = color(THEME.grid.dotColor);
      fill(red(c), green(c), blue(c), fillAlpha);
      ellipse(cx, cy, size, size);
    }
  }

  const dt = Math.min(deltaTime / 1000, 0.05);
  A3.physics(dt);
  A3.render();
  A4.render();
}


// ============================ art2 helpers ==================================
function drawThreeStopGradientLowRes(g, s1, s2) {
  featherTM = THEME.gradient.featherTM;
  featherMB = THEME.gradient.featherMB;

  topColor    = color(THEME.gradient.top);
  midColor    = color(THEME.gradient.mid);
  bottomColor = color(THEME.gradient.bottom);

  const time = millis() * 0.001 * waveSpeed;
  const w = g.width, h = g.height;

  g.noStroke();
  for (let iy = 0; iy < h; iy++) {
    for (let ix = 0; ix < w; ix++) {
      const u = (ix + 0.5) / w;
      const v = (iy + 0.5) / h;

      const n1 = noise(u * waveFreq, v * waveFreq, time);
      const n2 = noise((u + 100) * waveFreq * 1.7, (v - 50) * waveFreq * 1.7, time * 1.4);
      const s  = 0.03 * Math.sin((u * TWO_PI * 2.0) + time * 1.2) * (0.5 + 0.5 * Math.sin(v * TWO_PI));
      const dt = (n1 - 0.5) * (waveAmp * 0.8) + (n2 - 0.5) * (waveAmp * 0.6) + s;

      const t = constrain(v + dt, 0, 1);

      const w12   = smoothstep(s1 - featherTM, s1 + featherTM, t);
      const col12 = lerpColor(topColor, midColor, w12);
      const w23   = smoothstep(s2 - featherMB, s2 + featherMB, t);
      const col   = lerpColor(col12, bottomColor, w23);

      g.fill(col);
      g.rect(ix, iy, 1, 1);
    }
  }
}


// ============================ input handlers ================================
function mouseMoved() {
  const now = millis();
  const moved = dist(mouseX, mouseY, lastMouseX, lastMouseY);
  if (moved > 0) addBoil(moved * BOIL_GAIN_PER_PX);

  if (moved >= moveThreshold && now - lastEmitTime >= emitInterval) {
    spawnRipple(mouseX, mouseY, now);
    lastEmitTime = now;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    addBoil(BOIL_GAIN_PER_RIPPLE);
  }
}
function mousePressed() {
  spawnRipple(mouseX, mouseY, millis());
  addBoil(BOIL_GAIN_PER_RIPPLE * 0.6);
}

function onPointerMove(e) {
  const now = millis();
  const x = e.clientX, y = e.clientY;
  const dx = x - (lastMouseX ?? x);
  const dy = y - (lastMouseY ?? y);
  const moved = Math.hypot(dx, dy);

  if (moved > 0) addBoil(moved * BOIL_GAIN_PER_PX);

  if (moved >= moveThreshold && now - lastEmitTime >= emitInterval) {
    spawnRipple(x, y, now);
    lastEmitTime = now;
    lastMouseX = x;
    lastMouseY = y;
    addBoil(BOIL_GAIN_PER_RIPPLE);
  }
}
function onPointerDown(e) {
  spawnRipple(e.clientX, e.clientY, millis());
  addBoil(BOIL_GAIN_PER_RIPPLE * 0.6);
}

function spawnRipple(x, y, t0) {
  ripples.push({ x, y, t0, nx: random(1000), ny: random(1000), nt: random(1000) });
}
function windowResized() {
  const { w, h } = getViewportSize();
  resizeCanvas(w + __OVERSCAN_PX, h + __OVERSCAN_PX);
  __syncOverlayViewBox();
  A3.updateLayout();
  A4.updateLayout();
}
function addBoil(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  boil += amount;
}
