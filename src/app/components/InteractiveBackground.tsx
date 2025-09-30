// "use client";

// import { useEffect, useRef } from 'react';
// import p5 from 'p5';

// const InteractiveBackground = () => {
//   const canvasRef = useRef<HTMLDivElement>(null);
//   const p5InstanceRef = useRef<p5 | null>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     // Theme configuration
//     const THEME = {
//       gradient: {
//         top: "#9ED5DF",
//         mid: "#FDFBED",
//         bottom: "#DD4748",
//         featherTM: 0.35,
//         featherMB: 0.15,
//       },
//       grid: {
//         stroke: "#ffffff",
//         strokeWeight: 0.2,
//         dotColor: "#ffffff",
//         dotMaxAlpha: 80,
//       },
//       art3: {
//         fill: "#DD4748",
//         fillAlpha: 1.0,
//         stroke: "#ffffff",
//         strokeWeight: 0,
//         layout: {
//           desktop: { widthFrac: 0.40, offsetXFrac: 0.00, offsetYFrac: -0.09 },
//           mobile: { widthFrac: 0.70, offsetXFrac: 0.00, offsetYFrac: -0.05 },
//         },
//       },
//     };

//     // Variables
//     let boil = 0;
//     const BOIL_DECAY_PER_SEC = 30;
//     const BOIL_GAIN_PER_PX = 0.003;
//     const BOIL_GAIN_PER_RIPPLE = 0.0;

//     let size = 25;
//     let spacing = 5;
//     let rippleSpeed = 300;
//     let rippleWidth = 60;
//     let rippleLife = 900;
//     let rippleGain = 1;
//     let emitInterval = 220;
//     let moveThreshold = 8;

//     let jaggedAmp = 12;
//     let jaggedFreq = 6;
//     let jaggedTimeScale = 0.9;
//     let widthJitter = 0.4;

//     let ripples: any[] = [];
//     let lastEmitTime = -9999;
//     let lastMouseX: number, lastMouseY: number;

//     let topColor: p5.Color, midColor: p5.Color, bottomColor: p5.Color;

//     const STOP1_BASE = 0.5;
//     const STOP2_BASE = 0.8;
//     const STOP1_AT_MAX_BOIL = 0.3;
//     const STOP2_AT_MAX_BOIL = 0.6;
//     const MIN_GAP = 0.005;

//     let featherTM = THEME.gradient.featherTM;
//     let featherMB = THEME.gradient.featherMB;

//     let waveAmp = 0.3;
//     let waveFreq = 2.0;
//     let waveSpeed = 0.5;

//     let gradG: p5.Graphics;
//     let gradCols = 64;
//     let gradRows = 64;
//     let gradBlurPx = 3;

//     // Art3 (SVG 왜곡 레이어) 변수들
//     let A3 = {
//       enabled: true,
//       SVG_SRC: '/bogglevector3.svg',
      
//       LINE_STEP_PX: 8,
//       CURVE_TOLERANCE_PX: 0.4,
//       MAX_RECURSION: 12,
      
//       RADIUS: 120,
//       FORCE: 2800,
//       K_SPRING: 40,
//       DAMPING: 10,
//       TRAIL_LEN: 6,
//       TRAIL_FADE: 0.6,
      
//       viewBox: { x: 0, y: 0, w: 100, h: 100 },
//       scaleToCanvas: 1,
//       offsetX: 0,
//       offsetY: 0,
      
//       paths: [] as any[],
//       pointerHistory: [] as { x: number, y: number }[],
      
//       clamp: (v: number, a: number, b: number) => Math.max(a, Math.min(b, v)),
//       lerp: (a: number, b: number, t: number) => a + (b - a) * t,
//       vlen: (x: number, y: number) => Math.hypot(x, y),
//     };

//     // Helper functions
//     function smoothstep(a: number, b: number, x: number): number {
//       const t = p5.prototype.constrain((x - a) / Math.max(1e-6, (b - a)), 0, 1);
//       return t * t * (3 - 2 * t);
//     }

//     function addBoil(amount: number) {
//       if (!Number.isFinite(amount) || amount <= 0) return;
//       boil += amount;
//     }

//     // Art3 helper functions
//     async function loadSVG(url: string) {
//       try {
//         const res = await fetch(url, { cache: 'no-store' });
//         if (!res.ok) throw new Error('SVG load failed ' + res.status);
//         const text = await res.text();
//         const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
//         const svgEl = doc.querySelector('svg');
//         if (!svgEl) throw new Error('No <svg>');
        
//         const vb = svgEl.getAttribute('viewBox');
//         if (vb) {
//           const [x, y, w, h] = vb.trim().split(/[ ,]+/).map(Number);
//           A3.viewBox = { x, y, w, h };
//         } else {
//           const w = parseFloat(svgEl.getAttribute('width') || '100');
//           const h = parseFloat(svgEl.getAttribute('height') || '100');
//           A3.viewBox = { x: 0, y: 0, w, h };
//         }
        
//         const out: any[] = [];
//         for (const node of doc.querySelectorAll('path')) {
//           const d = node.getAttribute('d');
//           if (!d) continue;
//           // 간단한 path 파싱 (실제로는 더 복잡한 파싱이 필요)
//           out.push({ fillRule: 'nonzero', subpaths: [{ points: [], closed: false }] });
//         }
//         A3.paths = out;
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     function updateLayout(p: p5) {
//       const isMobile = p.windowWidth <= 768;
//       const layout = isMobile ? THEME.art3.layout.mobile : THEME.art3.layout.desktop;
//       const frac = layout.widthFrac;
      
//       A3.scaleToCanvas = (p.width * frac) / A3.viewBox.w;
      
//       const drawW = A3.viewBox.w * A3.scaleToCanvas;
//       const drawH = A3.viewBox.h * A3.scaleToCanvas;
      
//       const cx = p.width * 0.5 + (p.width * layout.offsetXFrac);
//       const cy = p.height * 0.5 + (p.height * layout.offsetYFrac);
      
//       A3.offsetX = cx - (drawW * 0.5) - A3.viewBox.x * A3.scaleToCanvas;
//       A3.offsetY = cy - (drawH * 0.5) - A3.viewBox.y * A3.scaleToCanvas;
//     }

//     function pushPointer(x: number, y: number, p: p5) {
//       if (!A3.enabled) return;
//       const cx = A3.clamp(x, 0, p.width);
//       const cy = A3.clamp(y, 0, p.height);
//       A3.pointerHistory.unshift({ x: cx, y: cy });
//       if (A3.pointerHistory.length > A3.TRAIL_LEN) {
//         A3.pointerHistory.length = A3.TRAIL_LEN;
//       }
//     }

//     function physics(dt: number, p: p5) {
//       if (!A3.enabled || A3.paths.length === 0) return;
      
//       const infl: any[] = [];
//       for (let i = 0; i < A3.pointerHistory.length; i++) {
//         infl.push({
//           x: A3.pointerHistory[i].x,
//           y: A3.pointerHistory[i].y,
//           w: Math.pow(A3.TRAIL_FADE, i)
//         });
//       }
      
//       // 간단한 물리 시뮬레이션
//       for (const path of A3.paths) {
//         for (const sp of path.subpaths) {
//           for (const point of sp.points) {
//             // 기본 스프링 복원력
//             const xr = point.x0 * A3.scaleToCanvas + A3.offsetX;
//             const yr = point.y0 * A3.scaleToCanvas + A3.offsetY;
//             const fxS = A3.K_SPRING * (xr - point.x);
//             const fyS = A3.K_SPRING * (yr - point.y);
            
//             let fxR = 0, fyR = 0;
//             for (const inf of infl) {
//               const dx = point.x - inf.x;
//               const dy = point.y - inf.y;
//               const d2 = dx * dx + dy * dy;
//               if (d2 < A3.RADIUS * A3.RADIUS) {
//                 const d = Math.max(Math.sqrt(d2), 1e-6);
//                 const fall = 1 - d / A3.RADIUS;
//                 const s = A3.FORCE * inf.w * fall * fall;
//                 fxR += (dx / d) * s;
//                 fyR += (dy / d) * s;
//               }
//             }
            
//             const fxD = -A3.DAMPING * point.vx;
//             const fyD = -A3.DAMPING * point.vy;
            
//             const ax = fxS + fxR + fxD;
//             const ay = fyS + fyR + fyD;
            
//             point.vx += ax * dt;
//             point.vy += ay * dt;
//             point.x += point.vx * dt;
//             point.y += point.vy * dt;
//           }
//         }
//       }
//     }

//     function renderArt3(p: p5) {
//       if (!A3.enabled || A3.paths.length === 0) return;
      
//       // 간단한 렌더링 (실제로는 더 복잡한 SVG 렌더링 필요)
//       p.fill(THEME.art3.fill);
//       p.noStroke();
      
//       // SVG가 로드되지 않았을 때 간단한 도형으로 대체
//       if (A3.paths.length === 0) {
//         p.ellipse(p.width / 2, p.height / 2, 100, 100);
//       }
//     }

//     function spawnRipple(x: number, y: number, t0: number) {
//       ripples.push({ 
//         x, y, t0, 
//         nx: Math.random() * 1000, 
//         ny: Math.random() * 1000, 
//         nt: Math.random() * 1000 
//       });
//     }

//     function drawThreeStopGradientLowRes(g: p5.Graphics, s1: number, s2: number, p: p5) {
//       featherTM = THEME.gradient.featherTM;
//       featherMB = THEME.gradient.featherMB;

//       topColor = p.color(THEME.gradient.top);
//       midColor = p.color(THEME.gradient.mid);
//       bottomColor = p.color(THEME.gradient.bottom);

//       const time = p.millis() * 0.001 * waveSpeed;
//       const w = g.width, h = g.height;

//       g.noStroke();
//       for (let iy = 0; iy < h; iy++) {
//         for (let ix = 0; ix < w; ix++) {
//           const u = (ix + 0.5) / w;
//           const v = (iy + 0.5) / h;

//           const n1 = p.noise(u * waveFreq, v * waveFreq, time);
//           const n2 = p.noise((u + 100) * waveFreq * 1.7, (v - 50) * waveFreq * 1.7, time * 1.4);
//           const s = 0.03 * Math.sin((u * p.TWO_PI * 2.0) + time * 1.2) * (0.5 + 0.5 * Math.sin(v * p.TWO_PI));
//           const dt = (n1 - 0.5) * (waveAmp * 0.8) + (n2 - 0.5) * (waveAmp * 0.6) + s;

//           const t = p.constrain(v + dt, 0, 1);

//           const w12 = smoothstep(s1 - featherTM, s1 + featherTM, t);
//           const col12 = p.lerpColor(topColor, midColor, w12);
//           const w23 = smoothstep(s2 - featherMB, s2 + featherMB, t);
//           const col = p.lerpColor(col12, bottomColor, w23);

//           g.fill(col);
//           g.rect(ix, iy, 1, 1);
//         }
//       }
//     }

//     const sketch = (p: p5) => {
//       p.setup = () => {
//         const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
//         canvas.parent(canvasRef.current!);
//         p.pixelDensity(1);
//         p.frameRate(60);

//         topColor = p.color(THEME.gradient.top);
//         midColor = p.color(THEME.gradient.mid);
//         bottomColor = p.color(THEME.gradient.bottom);

//         gradG = p.createGraphics(gradCols, gradRows);
//         gradG.noStroke();
//         p.noiseDetail(2, 0.5);

//         lastMouseX = p.width / 2;
//         lastMouseY = p.height / 2;

//         // SVG 로드 및 레이아웃 업데이트
//         (async () => {
//           await loadSVG(A3.SVG_SRC);
//           updateLayout(p);
//         })();
//       };

//       p.draw = () => {
//         const now = p.millis();

//         boil = Math.max(0, boil - BOIL_DECAY_PER_SEC * (p.deltaTime / 1000));

//         const tt = p.constrain(boil / 100, 0, 1);
//         const dynamicStop1 = p.lerp(STOP1_BASE, STOP1_AT_MAX_BOIL, tt);
//         let dynamicStop2 = p.lerp(STOP2_BASE, STOP2_AT_MAX_BOIL, tt);
//         dynamicStop2 = Math.max(dynamicStop2, dynamicStop1 + MIN_GAP);

//         drawThreeStopGradientLowRes(gradG, dynamicStop1, dynamicStop2, p);
//         p.push();
//         p.drawingContext.imageSmoothingEnabled = true;
//         (p.drawingContext as any).filter = `blur(${gradBlurPx}px)`;
//         p.image(gradG, 0, 0, p.width, p.height);
//         (p.drawingContext as any).filter = 'none';
//         p.pop();

//         ripples = ripples.filter(r => now - r.t0 < rippleLife);

//         const step = size + spacing;
//         const cols = p.floor(p.width / step);
//         const rows = p.floor(p.height / step);

//         p.stroke(THEME.grid.stroke);
//         p.strokeWeight(THEME.grid.strokeWeight);
//         p.noFill();

//         for (let y = 0; y < rows; y++) {
//           const cy = y * step + size / 2;
//           for (let x = 0; x < cols; x++) {
//             const cx = x * step + size / 2;

//             let influence = 0;
//             for (let i = 0, L = ripples.length; i < L; i++) {
//               const r = ripples[i];
//               const age = now - r.t0;
//               const baseRadius = (age / 1000) * rippleSpeed;
//               const dx = cx - r.x, dy = cy - r.y;
//               const d = Math.hypot(dx, dy);

//               const theta = Math.atan2(dy, dx);
//               const ax = Math.cos(theta) * jaggedFreq;
//               const ay = Math.sin(theta) * jaggedFreq;
//               const tz = (age / 1000) * jaggedTimeScale;

//               const n = p.noise(ax + r.nx, ay + r.ny, tz + r.nt);
//               const n11 = (n - 0.5) * 2.0;

//               const effectiveRadius = baseRadius + n11 * jaggedAmp;
//               const localWidth = Math.max(4, rippleWidth * (1 + n11 * widthJitter));

//               const band = 1.0 - smoothstep(0, localWidth, Math.abs(d - effectiveRadius));
//               const lifeFade = 1.0 - smoothstep(rippleLife * 0.6, rippleLife, age);
//               const contrib = band * lifeFade * rippleGain;

//               if (contrib > influence) influence = contrib;
//             }

//             const amt = Math.min(Math.max(influence, 0), 1);
//             const fillAlpha = THEME.grid.dotMaxAlpha * amt;
//             const c = p.color(THEME.grid.dotColor);
//             p.fill(p.red(c), p.green(c), p.blue(c), fillAlpha);
//             p.ellipse(cx, cy, size, size);
//           }
//         }

//         // Art3 물리 시뮬레이션 및 렌더링
//         const dt = p.deltaTime / 1000;
//         physics(dt, p);
//         renderArt3(p);
//       };

//       p.mouseMoved = () => {
//         const now = p.millis();
//         const moved = p.dist(p.mouseX, p.mouseY, lastMouseX, lastMouseY);
//         if (moved > 0) addBoil(moved * BOIL_GAIN_PER_PX);

//         if (moved >= moveThreshold && now - lastEmitTime >= emitInterval) {
//           spawnRipple(p.mouseX, p.mouseY, now);
//           lastEmitTime = now;
//           lastMouseX = p.mouseX;
//           lastMouseY = p.mouseY;
//           addBoil(BOIL_GAIN_PER_RIPPLE);
//         }

//         // Art3 포인터 추적
//         pushPointer(p.mouseX, p.mouseY, p);
//       };

//       p.mousePressed = () => {
//         spawnRipple(p.mouseX, p.mouseY, p.millis());
//         addBoil(BOIL_GAIN_PER_RIPPLE * 0.6);
//         pushPointer(p.mouseX, p.mouseY, p);
//       };

//       p.windowResized = () => {
//         p.resizeCanvas(p.windowWidth, p.windowHeight);
//         updateLayout(p);
//       };
//     };

//     // Initialize p5
//     p5InstanceRef.current = new p5(sketch);

//     return () => {
//       if (p5InstanceRef.current) {
//         p5InstanceRef.current.remove();
//       }
//     };
//   }, []);

//   return (
//     <div 
//       ref={canvasRef}
//       className="fixed inset-0 z-0 overflow-hidden"
//       aria-hidden="true"
//     />
//   );
// };

// export default InteractiveBackground;
