// === Unified art.js (art2 + art3) ===========================================
// p5.js 1.9.x
// - art2: Ripple Grid + 3-Stop Gradient
// - art3: SVG 왜곡 레이어(항상 활성화; 웹/모바일 크기/위치 파라미터화)
// ============================================================================

/* ========================= THEME (색/스트로크/레이아웃) ===================== */
var THEME =
  window.THEME ||
  (window.THEME = {
    gradient: {
      top: "#9ED5DF",
      mid: "#FDFBED",
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
      // widthFrac: 캔버스 가로 대비 SVG 가로 비율
      // offsetXFrac/YFrac: 중앙에서의 비율 오프셋(음수=좌/위, 양수=우/아래)
      layout: {
        desktop: { widthFrac: 0.4, offsetXFrac: 0.0, offsetYFrac: -0.09 },
        mobile: { widthFrac: 0.7, offsetXFrac: 0.0, offsetYFrac: -0.05 },
      },
    },
  });
/* ======================= /THEME (색/스트로크/레이아웃) ===================== */

// -------------------------------[ art2 ]-------------------------------------

let boil = 0; // 상호작용 에너지

const BOIL_DECAY_PER_SEC = 30;
const BOIL_GAIN_PER_PX = 0.003;
const BOIL_GAIN_PER_RIPPLE = 0.0;

let size = 25;
let spacing = 5;

let rippleSpeed = 300;
let rippleWidth = 60;
let rippleLife = 900;
let rippleGain = 1;
let emitInterval = 220;
let moveThreshold = 8;

// 파동 윤곽 노이즈
let jaggedAmp = 12;
let jaggedFreq = 6;
let jaggedTimeScale = 0.9;
let widthJitter = 0.4;

let ripples = [];
let lastEmitTime = -9999;
let lastMouseX, lastMouseY;

let topColor, midColor, bottomColor;

const STOP1_BASE = 0.5;
const STOP2_BASE = 0.8;
const STOP1_AT_MAX_BOIL = 0.3;
const STOP2_AT_MAX_BOIL = 0.6;
const MIN_GAP = 0.005;

let featherTM = THEME.gradient.featherTM;
let featherMB = THEME.gradient.featherMB;

let waveAmp = 0.3;
let waveFreq = 2.0;
let waveSpeed = 0.5;

let gradG;
let gradCols = 64;
let gradRows = 64;
let gradBlurPx = 3;

// -------------------------------[ art3 ]-------------------------------------

let A3 = {
  enabled: true, // 시작부터 켜짐
  SVG_SRC: "/source/bogglevector3.svg",

  LINE_STEP_PX: 8,
  CURVE_TOLERANCE_PX: 0.4,
  MAX_RECURSION: 12,

  RADIUS: 120,
  FORCE: 2800,
  K_SPRING: 40,
  DAMPING: 10,
  TRAIL_LEN: 6,
  TRAIL_FADE: 0.6,

  viewBox: { x: 0, y: 0, w: 100, h: 100 },
  scaleToCanvas: 1,
  offsetX: 0,
  offsetY: 0,

  paths: [],
  pointerHistory: [],

  clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  },
  lerp(a, b, t) {
    return a + (b - a) * t;
  },
  vlen(x, y) {
    return Math.hypot(x, y);
  },
  distPointToLine(px, py, ax, ay, bx, by) {
    const vx = bx - ax,
      vy = by - ay,
      wx = px - ax,
      wy = py - ay;
    const L = vx * vx + vy * vy || 1e-9,
      t = (vx * wx + vy * wy) / L;
    const qx = ax + vx * t,
      qy = ay + vy * t;
    return Math.hypot(px - qx, py - qy);
  },
  splitQuad(p0, p1, p2) {
    const q0 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
    const q1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const r = { x: (q0.x + q1.x) / 2, y: (q0.y + q1.y) / 2 };
    return [
      { p0, p1: q0, p2: r },
      { p0: r, p1: q1, p2 },
    ];
  },
  splitCubic(p0, p1, p2, p3) {
    const q0 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 },
      q1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
      q2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
    const r0 = { x: (q0.x + q1.x) / 2, y: (q0.y + q1.y) / 2 },
      r1 = { x: (q1.x + q2.x) / 2, y: (q1.y + q2.y) / 2 };
    const s = { x: (r0.x + r1.x) / 2, y: (r0.y + r1.y) / 2 };
    return [
      { p0, p1: q0, p2: r0, p3: s },
      { p0: s, p1: r1, p2: q2, p3 },
    ];
  },
  flatQuad(p0, p1, p2, t) {
    return this.distPointToLine(p1.x, p1.y, p0.x, p0.y, p2.x, p2.y) <= t;
  },
  flatCubic(p0, p1, p2, p3, t) {
    return (
      this.distPointToLine(p1.x, p1.y, p0.x, p0.y, p3.x, p3.y) <= t &&
      this.distPointToLine(p2.x, p2.y, p0.x, p0.y, p3.x, p3.y) <= t
    );
  },
  sampleQuadAdaptive(p0, p1, p2, t, depth = 0, out = []) {
    if (depth > this.MAX_RECURSION || this.flatQuad(p0, p1, p2, t)) {
      out.push({ x: p2.x, y: p2.y });
      return out;
    }
    const [L, R] = this.splitQuad(p0, p1, p2);
    this.sampleQuadAdaptive(L.p0, L.p1, L.p2, t, depth + 1, out);
    this.sampleQuadAdaptive(R.p0, R.p1, R.p2, t, depth + 1, out);
    return out;
  },
  sampleCubicAdaptive(p0, p1, p2, p3, t, depth = 0, out = []) {
    if (depth > this.MAX_RECURSION || this.flatCubic(p0, p1, p2, p3, t)) {
      out.push({ x: p3.x, y: p3.y });
      return out;
    }
    const [L, R] = this.splitCubic(p0, p1, p2, p3);
    this.sampleCubicAdaptive(L.p0, L.p1, L.p2, L.p3, t, depth + 1, out);
    this.sampleCubicAdaptive(R.p0, R.p1, R.p2, R.p3, t, depth + 1, out);
    return out;
  },
  tokenizeNumbers(str, i0) {
    const nums = [];
    let i = i0;
    while (i < str.length) {
      const m = str
        .slice(i)
        .match(/^[ \t\r\n,]*([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/);
      if (!m) break;
      nums.push(parseFloat(m[1]));
      i += m[0].length;
    }
    return { nums, idx: i };
  },
  parsePathD(d) {
    const cmds = [];
    let i = 0,
      cx = 0,
      cy = 0,
      sx = 0,
      sy = 0,
      last = "";
    while (i < d.length) {
      const ch = d[i];
      if (/[MLHVQCZmlhvqcz]/.test(ch)) {
        last = ch;
        i++;
      } else if (/\s|,/.test(ch)) {
        i++;
        continue;
      } else if (last) {
      } else {
        i++;
        continue;
      }
      const rel = last >= "a" && last <= "z";
      const cmd = last.toUpperCase();
      const { nums, idx } = this.tokenizeNumbers(d, i);
      i = idx;
      let p = 0;
      const pair = () => {
        const x = nums[p++],
          y = nums[p++];
        return rel ? { x: cx + x, y: cy + y } : { x, y };
      };
      const num = () => nums[p++];
      while (p < nums.length || cmd === "Z") {
        if (cmd === "M") {
          const pt = pair();
          cx = pt.x;
          cy = pt.y;
          sx = cx;
          sy = cy;
          cmds.push({ type: "M", x: cx, y: cy });
          while (p + 1 < nums.length) {
            const pt2 = pair();
            cmds.push({ type: "L", x: pt2.x, y: pt2.y });
            cx = pt2.x;
            cy = pt2.y;
          }
          break;
        }
        if (cmd === "L") {
          const pt = pair();
          cmds.push({ type: "L", x: pt.x, y: pt.y });
          cx = pt.x;
          cy = pt.y;
          continue;
        }
        if (cmd === "H") {
          const nx = num();
          const x = rel ? cx + nx : nx;
          cmds.push({ type: "L", x, y: cy });
          cx = x;
          continue;
        }
        if (cmd === "V") {
          const ny = num();
          const y = rel ? cy + ny : ny;
          cmds.push({ type: "L", x: cx, y });
          cy = y;
          continue;
        }
        if (cmd === "Q") {
          const c1 = pair();
          const p2 = pair();
          cmds.push({ type: "Q", x1: c1.x, y1: c1.y, x: p2.x, y: p2.y });
          cx = p2.x;
          cy = p2.y;
          continue;
        }
        if (cmd === "C") {
          const c1 = pair();
          const c2 = pair();
          const p2 = pair();
          cmds.push({
            type: "C",
            x1: c1.x,
            y1: c1.y,
            x2: c2.x,
            y2: c2.y,
            x: p2.x,
            y: p2.y,
          });
          cx = p2.x;
          cy = p2.y;
          continue;
        }
        if (cmd === "Z") {
          cmds.push({ type: "Z" });
          cx = sx;
          cy = sy;
          break;
        }
      }
    }
    return cmds;
  },
  resampleCommands(cmds) {
    const subs = [];
    let cur = [];
    let pos = { x: 0, y: 0 };
    let start = { x: 0, y: 0 };
    const push = (pt, force = false) => {
      if (!force && cur.length) {
        const a = cur[cur.length - 1];
        if (Math.hypot(pt.x - a.x, pt.y - a.y) < 0.25) return;
      }
      cur.push({ x0: pt.x, y0: pt.y, x: pt.x, y: pt.y, vx: 0, vy: 0 });
    };
    for (const c of cmds) {
      if (c.type === "M") {
        if (cur.length) {
          subs.push({ points: cur, closed: false });
          cur = [];
        }
        push({ x: c.x, y: c.y }, true);
        pos = { x: c.x, y: c.y };
        start = pos;
        continue;
      }
      if (c.type === "L") {
        const p0 = pos,
          p1 = { x: c.x, y: c.y };
        const L = Math.max(1, this.vlen(p1.x - p0.x, p1.y - p0.y));
        const steps = Math.max(1, Math.round(L / this.LINE_STEP_PX));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          push({ x: this.lerp(p0.x, p1.x, t), y: this.lerp(p0.y, p1.y, t) });
        }
        pos = p1;
        continue;
      }
      if (c.type === "Q") {
        const p0 = pos,
          p1 = { x: c.x1, y: c.y1 },
          p2 = { x: c.x, y: c.y };
        const pts = this.sampleQuadAdaptive(
          p0,
          p1,
          p2,
          this.CURVE_TOLERANCE_PX,
          0,
          []
        );
        for (const pt of pts) push(pt);
        pos = p2;
        continue;
      }
      if (c.type === "C") {
        const p0 = pos,
          p1 = { x: c.x1, y: c.y1 },
          p2 = { x: c.x2, y: c.y2 },
          p3 = { x: c.x, y: c.y };
        const pts = this.sampleCubicAdaptive(
          p0,
          p1,
          p2,
          p3,
          this.CURVE_TOLERANCE_PX,
          0,
          []
        );
        for (const pt of pts) push(pt);
        pos = p3;
        continue;
      }
      if (c.type === "Z") {
        const p0 = pos,
          p1 = start;
        const L = Math.max(1, this.vlen(p1.x - p0.x, p1.y - p0.y));
        const steps = Math.max(1, Math.round(L / this.LINE_STEP_PX));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          push({ x: this.lerp(p0.x, p1.x, t), y: this.lerp(p0.y, p1.y, t) });
        }
        subs.push({ points: cur, closed: true });
        cur = [];
        pos = start;
        continue;
      }
    }
    if (cur.length) subs.push({ points: cur, closed: false });
    return subs;
  },
  async loadSVG(url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("SVG load failed " + res.status);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (!svgEl) throw new Error("No <svg>");
      const vb = svgEl.getAttribute("viewBox");
      if (vb) {
        const [x, y, w, h] = vb.trim().split(/[ ,]+/).map(Number);
        this.viewBox = { x, y, w, h };
      } else {
        const w = parseFloat(svgEl.getAttribute("width")) || 100;
        const h = parseFloat(svgEl.getAttribute("height")) || 100;
        this.viewBox = { x: 0, y: 0, w, h };
      }
      const out = [];
      for (const node of doc.querySelectorAll("path")) {
        const d = node.getAttribute("d");
        if (!d) continue;
        const fr =
          (node.getAttribute("fill-rule") || "nonzero").toLowerCase() ===
          "evenodd"
            ? "evenodd"
            : "nonzero";
        const cmds = this.parsePathD(d);
        const subs = this.resampleCommands(cmds);
        out.push({ fillRule: fr, subpaths: subs });
      }
      this.paths = out;
    } catch (err) {
      console.error(err);
    }
  },
  currentLayout() {
    return windowWidth <= 768
      ? THEME.art3.layout.mobile
      : THEME.art3.layout.desktop;
  },
  updateLayout() {
    const L = this.currentLayout();
    const frac = L.widthFrac;
    this.scaleToCanvas = (width * frac) / this.viewBox.w;

    const drawW = this.viewBox.w * this.scaleToCanvas;
    const drawH = this.viewBox.h * this.scaleToCanvas;

    const cx = width * 0.5 + width * L.offsetXFrac;
    const cy = height * 0.5 + height * L.offsetYFrac;

    this.offsetX = cx - drawW * 0.5 - this.viewBox.x * this.scaleToCanvas;
    this.offsetY = cy - drawH * 0.5 - this.viewBox.y * this.scaleToCanvas;

    for (const path of this.paths) {
      for (const sp of path.subpaths) {
        for (const p of sp.points) {
          p.x = p.x0 * this.scaleToCanvas + this.offsetX;
          p.y = p.y0 * this.scaleToCanvas + this.offsetY;
          p.vx = p.vy = 0;
        }
      }
    }
  },
  pushPointer(x, y) {
    if (!this.enabled) return;
    const cx = this.clamp(x, 0, width),
      cy = this.clamp(y, 0, height);
    this.pointerHistory.unshift({ x: cx, y: cy });
    if (this.pointerHistory.length > this.TRAIL_LEN)
      this.pointerHistory.length = this.TRAIL_LEN;
  },
  physics(dt) {
    if (!this.enabled || this.paths.length === 0) return;
    const infl = [];
    for (let i = 0; i < this.pointerHistory.length; i++) {
      infl.push({
        x: this.pointerHistory[i].x,
        y: this.pointerHistory[i].y,
        w: Math.pow(this.TRAIL_FADE, i),
      });
    }
    for (const path of this.paths) {
      for (const sp of path.subpaths) {
        for (const p of sp.points) {
          const xr = p.x0 * this.scaleToCanvas + this.offsetX;
          const yr = p.y0 * this.scaleToCanvas + this.offsetY;
          const fxS = this.K_SPRING * (xr - p.x),
            fyS = this.K_SPRING * (yr - p.y);
          let fxR = 0,
            fyR = 0;
          for (const inf of infl) {
            const dx = p.x - inf.x,
              dy = p.y - inf.y,
              d2 = dx * dx + dy * dy;
            if (d2 < this.RADIUS * this.RADIUS) {
              const d = Math.max(Math.sqrt(d2), 1e-6);
              const fall = 1 - d / this.RADIUS;
              const s = this.FORCE * inf.w * fall * fall;
              fxR += (dx / d) * s;
              fyR += (dy / d) * s;
            }
          }
          const fxD = -this.DAMPING * p.vx,
            fyD = -this.DAMPING * p.vy;
          const ax = fxS + fxR + fxD,
            ay = fyS + fyR + fyD;
          p.vx += ax * dt;
          p.vy += ay * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
      }
    }
  },
  render() {
    if (!this.enabled || this.paths.length === 0) return;
    const ctx = drawingContext;

    // 채우기 — 경로별 fill-rule 반영
    ctx.save();
    for (const path of this.paths) {
      ctx.beginPath();
      for (const sp of path.subpaths) {
        if (!sp.points.length) continue;
        ctx.moveTo(sp.points[0].x, sp.points[0].y);
        for (let i = 1; i < sp.points.length; i++) {
          const q = sp.points[i];
          ctx.lineTo(q.x, q.y);
        }
        if (sp.closed) ctx.closePath();
      }
      const prevAlpha = ctx.globalAlpha;
      ctx.fillStyle = THEME.art3.fill;
      ctx.globalAlpha = THEME.art3.fillAlpha;
      ctx.fill(path.fillRule || "nonzero");
      ctx.globalAlpha = prevAlpha;
    }
    ctx.restore();

    // 스트로크
    if (THEME.art3.strokeWeight > 0) {
      stroke(THEME.art3.stroke);
      strokeWeight(THEME.art3.strokeWeight);
      noFill();
      for (const path of this.paths) {
        for (const sp of path.subpaths) {
          beginShape();
          for (const pt of sp.points) vertex(pt.x, pt.y);
          if (sp.closed) endShape(CLOSE);
          else endShape();
        }
      }
    }
  },
};

// ------------------------- 공용 유틸 -------------------------
function smoothstep(a, b, x) {
  const t = constrain((x - a) / Math.max(1e-6, b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

// ============================== setup =======================================
function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("bg");
  pixelDensity(1);
  frameRate(60);

  topColor = color(THEME.gradient.top);
  midColor = color(THEME.gradient.mid);
  bottomColor = color(THEME.gradient.bottom);

  gradG = createGraphics(gradCols, gradRows);
  gradG.noStroke();
  noiseDetail(2, 0.5);

  lastMouseX = width / 2;
  lastMouseY = height / 2;

  // 입력 이벤트(art2 + art3)
  window.addEventListener(
    "pointermove",
    (e) => {
      onPointerMove(e);
      A3.pushPointer(e.clientX, e.clientY);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    (e) => {
      onPointerDown(e);
      A3.pushPointer(e.clientX, e.clientY);
    },
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches && e.touches[0]) {
        const x = e.touches[0].clientX,
          y = e.touches[0].clientY;
        spawnRipple(x, y, millis());
        addBoil(BOIL_GAIN_PER_RIPPLE * 0.6);
        A3.pushPointer(x, y);
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        const x = e.touches[0].clientX,
          y = e.touches[0].clientY;
        A3.pushPointer(x, y);
      }
    },
    { passive: true }
  );

  // SVG 로드 → 레이아웃 업데이트
  (async () => {
    await A3.loadSVG(A3.SVG_SRC);
    A3.updateLayout();
  })();

  // 런타임 세터
  window.__setArt3Svg = async (src) => {
    if (!src || typeof src !== "string") return;
    await A3.loadSVG(src.trim());
    A3.updateLayout();
  };
  window.__setArt3Fill = (hex = "#000000", alpha = THEME.art3.fillAlpha) => {
    THEME.art3.fill = String(hex);
    THEME.art3.fillAlpha = Math.max(0, Math.min(1, alpha));
  };
  window.__setArt3Stroke = (color, weight = THEME.art3.strokeWeight) => {
    if (color) THEME.art3.stroke = String(color);
    THEME.art3.strokeWeight = weight;
  };
  window.__setGradient = (top, mid, bottom) => {
    if (top) THEME.gradient.top = String(top);
    if (mid) THEME.gradient.mid = String(mid);
    if (bottom) THEME.gradient.bottom = String(bottom);
    topColor = color(THEME.gradient.top);
    midColor = color(THEME.gradient.mid);
    bottomColor = color(THEME.gradient.bottom);
  };
  window.__setFeather = (topMid = featherTM, midBottom = featherMB) => {
    THEME.gradient.featherTM = featherTM = topMid;
    THEME.gradient.featherMB = featherMB = midBottom;
  };
  window.__setGridStroke = (
    color = THEME.grid.stroke,
    weight = THEME.grid.strokeWeight
  ) => {
    THEME.grid.stroke = String(color);
    THEME.grid.strokeWeight = weight;
  };
  window.__setGridDot = (
    color = THEME.grid.dotColor,
    maxAlpha = THEME.grid.dotMaxAlpha
  ) => {
    THEME.grid.dotColor = String(color);
    THEME.grid.dotMaxAlpha = maxAlpha | 0;
  };

  // 레이아웃 세터
  window.__setArt3LayoutDesktop = (
    widthFrac = THEME.art3.layout.desktop.widthFrac,
    offsetXFrac = THEME.art3.layout.desktop.offsetXFrac,
    offsetYFrac = THEME.art3.layout.desktop.offsetYFrac
  ) => {
    THEME.art3.layout.desktop.widthFrac = widthFrac;
    THEME.art3.layout.desktop.offsetXFrac = offsetXFrac;
    THEME.art3.layout.desktop.offsetYFrac = offsetYFrac;
    A3.updateLayout();
  };
  window.__setArt3LayoutMobile = (
    widthFrac = THEME.art3.layout.mobile.widthFrac,
    offsetXFrac = THEME.art3.layout.mobile.offsetXFrac,
    offsetYFrac = THEME.art3.layout.mobile.offsetYFrac
  ) => {
    THEME.art3.layout.mobile.widthFrac = widthFrac;
    THEME.art3.layout.mobile.offsetXFrac = offsetXFrac;
    THEME.art3.layout.mobile.offsetYFrac = offsetYFrac;
    A3.updateLayout();
  };
  window.__toggleArt3 = (on = !A3.enabled) => {
    A3.enabled = !!on;
  };
}

// =============================== draw =======================================
function draw() {
  const now = millis();

  boil = Math.max(0, boil - BOIL_DECAY_PER_SEC * (deltaTime / 1000));

  const tt = constrain(boil / 100, 0, 1);
  const dynamicStop1 = lerp(STOP1_BASE, STOP1_AT_MAX_BOIL, tt);
  let dynamicStop2 = lerp(STOP2_BASE, STOP2_AT_MAX_BOIL, tt);
  dynamicStop2 = Math.max(dynamicStop2, dynamicStop1 + MIN_GAP); // 안전: Math.max

  drawThreeStopGradientLowRes(gradG, dynamicStop1, dynamicStop2);
  push();
  drawingContext.imageSmoothingEnabled = true;
  drawingContext.filter = `blur(${gradBlurPx}px)`;
  image(gradG, 0, 0, width, height);
  drawingContext.filter = "none";
  pop();

  ripples = ripples.filter((r) => now - r.t0 < rippleLife);

  const step = size + spacing;
  const cols = floor(width / step);
  const rows = floor(height / step);

  stroke(THEME.grid.stroke);
  strokeWeight(THEME.grid.strokeWeight);
  noFill();

  for (let y = 0; y < rows; y++) {
    const cy = y * step + size / 2;
    for (let x = 0; x < cols; x++) {
      const cx = x * step + size / 2;

      let influence = 0;
      for (let i = 0, L = ripples.length; i < L; i++) {
        const r = ripples[i];
        const age = now - r.t0;
        const baseRadius = (age / 1000) * rippleSpeed;
        const dx = cx - r.x,
          dy = cy - r.y;
        const d = Math.hypot(dx, dy);

        const theta = Math.atan2(dy, dx);
        const ax = Math.cos(theta) * jaggedFreq;
        const ay = Math.sin(theta) * jaggedFreq;
        const tz = (age / 1000) * jaggedTimeScale;

        const n = noise(ax + r.nx, ay + r.ny, tz + r.nt);
        const n11 = (n - 0.5) * 2.0;

        const effectiveRadius = baseRadius + n11 * jaggedAmp;
        const localWidth = Math.max(4, rippleWidth * (1 + n11 * widthJitter));

        const band =
          1.0 - smoothstep(0, localWidth, Math.abs(d - effectiveRadius));
        const lifeFade = 1.0 - smoothstep(rippleLife * 0.6, rippleLife, age);
        const contrib = band * lifeFade * rippleGain;

        if (contrib > influence) influence = contrib;
      }

      const amt = Math.min(Math.max(influence, 0), 1);
      const fillAlpha = THEME.grid.dotMaxAlpha * amt;
      const c = color(THEME.grid.dotColor);
      fill(red(c), green(c), blue(c), fillAlpha);
      ellipse(cx, cy, size, size);
    }
  }

  const dt = deltaTime / 1000;
  A3.physics(dt);
  A3.render();
}

// ============================ art2 helpers ==================================
function drawThreeStopGradientLowRes(g, s1, s2) {
  featherTM = THEME.gradient.featherTM;
  featherMB = THEME.gradient.featherMB;

  topColor = color(THEME.gradient.top);
  midColor = color(THEME.gradient.mid);
  bottomColor = color(THEME.gradient.bottom);

  const time = millis() * 0.001 * waveSpeed;
  const w = g.width,
    h = g.height;

  g.noStroke();
  for (let iy = 0; iy < h; iy++) {
    for (let ix = 0; ix < w; ix++) {
      const u = (ix + 0.5) / w;
      const v = (iy + 0.5) / h;

      const n1 = noise(u * waveFreq, v * waveFreq, time);
      const n2 = noise(
        (u + 100) * waveFreq * 1.7,
        (v - 50) * waveFreq * 1.7,
        time * 1.4
      );
      const s =
        0.03 *
        Math.sin(u * TWO_PI * 2.0 + time * 1.2) *
        (0.5 + 0.5 * Math.sin(v * TWO_PI));
      const dt =
        (n1 - 0.5) * (waveAmp * 0.8) + (n2 - 0.5) * (waveAmp * 0.6) + s;

      const t = constrain(v + dt, 0, 1);

      const w12 = smoothstep(s1 - featherTM, s1 + featherTM, t);
      const col12 = lerpColor(topColor, midColor, w12);
      const w23 = smoothstep(s2 - featherMB, s2 + featherMB, t);
      const col = lerpColor(col12, bottomColor, w23);

      g.fill(col);
      g.rect(ix, iy, 1, 1);
    }
  }
}

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
  const x = e.clientX,
    y = e.clientY;
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
  ripples.push({
    x,
    y,
    t0,
    nx: random(1000),
    ny: random(1000),
    nt: random(1000),
  });
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  A3.updateLayout();
}
function addBoil(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  boil += amount;
}
