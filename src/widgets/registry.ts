// Member-page widget registry. One seeded, self-contained canvas sketch per
// released member — an intuition for the method, never a computation. House
// rules: deterministic (mulberry32 seed), theme-aware (colours read from CSS
// custom properties at mount), reduced-motion renders the final frame
// statically, ~60fps cap via requestAnimationFrame, no external assets
// (CSP script-src 'self').
//
// To add a member's widget: write `sketch<Id>` following the PESTO pattern
// and register it in `sketches` below. Unregistered ids fall back to the
// constellation shimmer so a page never ships an empty stage.

type Sketch = (ctx: CanvasRenderingContext2D, w: number, h: number,
               col: Colours, reduced: boolean) => void;

interface Colours { ink: string; accent: string; muted: string; edge: string }

const mulberry32 = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const readColours = (el: HTMLElement): Colours => {
  const s = getComputedStyle(el);
  const v = (n: string, fb: string) => s.getPropertyValue(n).trim() || fb;
  return { ink: v("--paper-ink", "#1D2023"), accent: v("--accent", "#B8431B"),
           muted: v("--muted", "#50544D"), edge: v("--edge", "#E2E0DA") };
};

// --- PESTO: braided ensemble converging on the source -----------------------
// An ensemble of guesses (braids) iterates toward the parameter whose forward
// curve matches the observed delta. Iteration = one smoother step: braids
// contract toward the data-consistent manifold; spread that remains IS the
// answer (uncertainty), not a failure to converge.
const sketchPESTO: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260902);
  const n = 24, steps = 90;
  const truth = 0.62;
  const start = Array.from({ length: n }, () => 0.1 + 0.8 * rand());
  const noise = Array.from({ length: n }, () => (rand() - 0.5) * 0.16);
  const at = (i: number, t: number) => {
    const a = start[i], u = 1 - Math.exp(-3.2 * t);
    return a + (truth + noise[i] * (1 - 0.72 * u) - a) * u;
  };
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.4; ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.7;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      for (let s = 0; s <= 60; s++) {
        const x = (s / 60) * (w - 120) + 30;
        const tt = (s / 60) * t;
        const y = h - 50 - at(i, tt) * (h - 100);
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // the observed delta (target band) on the right
    const yT = h - 50 - truth * (h - 100);
    ctx.strokeStyle = col.accent; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(w - 86, yT); ctx.lineTo(w - 30, yT); ctx.stroke();
    ctx.fillStyle = col.accent; ctx.globalAlpha = 0.16;
    ctx.fillRect(w - 86, yT - 14, 56, 28); ctx.globalAlpha = 1;
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("observed", w - 86, yT - 20);
    ctx.fillText("ensemble of guesses", 30, 24);
    ctx.fillText("iterations →", 30, h - 18);
    ctx.fillStyle = col.accent;
    ctx.fillText("spread that remains = the uncertainty, kept", w / 2 - 80, 24);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 30) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- flexyBayes: three engines toward one posterior --------------------------
// Three per-site estimates, noisy and separate, are drawn toward a shared
// hierarchy line as three inference engines (solid / dashed / dotted) close
// on the same answer from different paths. The gauge only completes its
// circle once the three genuinely agree — agreement is checked, not assumed.
const sketchFlexyBayes: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260903);
  const steps = 100;
  const hierarchy = h * 0.5;
  const siteX = [0.22, 0.5, 0.78].map((f) => f * (w - 80) + 40);
  const start = siteX.map(() => hierarchy + (rand() - 0.5) * (h * 0.5));
  const spread = siteX.map(() => 10 + rand() * 22);
  const engineStart = [hierarchy - 80, hierarchy + 60, hierarchy - 30];
  const dashes: number[][] = [[], [8, 5], [2, 4]];
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = col.edge; ctx.lineWidth = 1.4; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(40, hierarchy); ctx.lineTo(w - 40, hierarchy); ctx.stroke();
    ctx.lineWidth = 1.6;
    for (let e = 0; e < 3; e++) {
      const y = engineStart[e] + (hierarchy - engineStart[e]) * t;
      ctx.setLineDash(dashes[e]); ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 220, y); ctx.stroke();
    }
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    for (let i = 0; i < siteX.length; i++) {
      const y = start[i] + (hierarchy - start[i]) * t;
      const s = spread[i] * (1 - 0.75 * t);
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(siteX[i], y - s); ctx.lineTo(siteX[i], y + s); ctx.stroke();
      ctx.fillStyle = col.ink;
      ctx.beginPath(); ctx.arc(siteX[i], y, 4, 0, 7); ctx.fill();
    }
    const cx = w - 96, cy = 70, r = 34;
    ctx.strokeStyle = col.edge; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI * 1.5); ctx.stroke();
    ctx.strokeStyle = col.accent; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + t * Math.PI * 2); ctx.stroke();
    ctx.fillStyle = col.ink; ctx.font = "11px ui-monospace, monospace";
    ctx.fillText("agreement", cx - 30, cy + r + 18);
    ctx.fillText("three engines, one posterior", 30, 24);
    ctx.fillStyle = col.accent;
    ctx.fillText("agreement is a gate, not a courtesy", 30, h - 18);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- kernR: a witness function between two clouds ----------------------------
// Two point clouds (a field sample and a mechanism sample) sit side by side;
// a witness curve rises beneath wherever their local densities disagree. As
// the clouds separate the witness lights up; as points thin out it has too
// little standing to speak and fades to a dashed abstention.
const sketchKernR: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260904);
  const steps = 110;
  const n = 16;
  const fieldPts = Array.from({ length: n }, () => ({ x: rand(), y: rand() }));
  const mechPts = Array.from({ length: n }, () => ({ x: rand(), y: rand() }));
  const topY = 60, cloudH = 110;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const sep = Math.min(1, t / 0.55);
    const thin = Math.max(0, (t - 0.6) / 0.4);
    const cx1 = w * 0.5 - sep * 90, cx2 = w * 0.5 + sep * 90;
    const visible = Math.round(n * (1 - thin));
    ctx.fillStyle = col.ink;
    for (let i = 0; i < visible; i++) {
      const p = fieldPts[i];
      ctx.beginPath(); ctx.arc(cx1 - 60 + p.x * 90, topY + p.y * cloudH, 3, 0, 7); ctx.fill();
    }
    ctx.fillStyle = col.muted;
    for (let i = 0; i < visible; i++) {
      const p = mechPts[i];
      ctx.beginPath(); ctx.arc(cx2 - 30 + p.x * 90, topY + p.y * cloudH, 3, 0, 7); ctx.fill();
    }
    const baseY = h - 70, amp = 70 * sep * (1 - thin);
    const mid = (cx1 + cx2) / 2, sigma = 70 + sep * 40;
    ctx.lineWidth = 2;
    ctx.strokeStyle = thin > 0.5 ? col.muted : col.accent;
    ctx.setLineDash(thin > 0.5 ? [6, 5] : []);
    ctx.globalAlpha = thin > 0.5 ? 0.5 : 1;
    ctx.beginPath();
    for (let s = 0; s <= 80; s++) {
      const x = 30 + (s / 80) * (w - 60);
      const y = baseY - amp * Math.exp(-(((x - mid) / sigma) ** 2));
      if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("field", cx1 - 66, topY - 12);
    ctx.fillText("mechanism", cx2 - 30, topY - 12);
    ctx.fillText("witness function", 30, baseY + 24);
    if (thin > 0.5) {
      ctx.fillStyle = col.muted;
      ctx.fillText("abstain: too few eyes (ESS floor)", 30, h - 14);
    }
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- apsimR: six seasons grown in glass ---------------------------------------
// Six growth curves under increasing nitrogen share a hidden physiological
// cap; the high-N curves plateau together well before the top of the frame —
// a ceiling the simulator can show before any field trial can reveal it.
const sketchApsimR: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260905);
  const steps = 100;
  const nCurves = 6;
  const cap = 0.78;
  const rates = Array.from({ length: nCurves }, (_, i) => (i + 1) / nCurves);
  const noise = rates.map(() => (rand() - 0.5) * 0.03);
  const asymptote = (r: number) => Math.min(cap, 0.18 + r * 0.75);
  const yAt = (r: number, x: number, nz: number) =>
    asymptote(r) * (1 - Math.exp(-3.4 * x)) + nz * Math.sin(x * 6);
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const baseY = h - 46, top = 40, plotW = w - 80;
    ctx.strokeStyle = col.edge; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, baseY); ctx.lineTo(w - 40, baseY); ctx.stroke();
    for (let c = 0; c < nCurves; c++) {
      ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.5 + 0.5 * (c / nCurves);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let s = 0; s <= 60; s++) {
        const x = (s / 60) * t;
        if (x > t) break;
        const px = 40 + (s / 60) * plotW;
        const py = baseY - yAt(rates[c], x, noise[c]) * (baseY - top);
        if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const capY = baseY - cap * (baseY - top);
    ctx.strokeStyle = col.accent; ctx.lineWidth = 1.6; ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(40, capY); ctx.lineTo(w - 40, capY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("N rate, low to high, one season each", 30, 24);
    ctx.fillText("the season grown in glass first", 30, h - 14);
    ctx.fillStyle = col.accent;
    ctx.fillText("the plateau the field will reveal", w - 240, capY - 10);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- quorum: the fastest faithful imitation ------------------------
// An expensive simulator is sampled slowly, one point at a time; a cheap
// surrogate spans the whole domain immediately but states its own
// error — the band around it narrows only where evidence has accumulated.
const sketchQuorum: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260906);
  const steps = 120;
  const guessBias = (rand() - 0.5) * 0.2;
  const trueF = (x: number) => 0.5 + 0.28 * Math.sin(x * 6.2) + 0.1 * Math.sin(x * 13 + 1.1);
  const guess = (_x: number) => 0.5 + guessBias;
  const nPts = 14;
  const baseY = h - 50, top = 40, plotW = w - 80;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const revealed = Math.min(nPts, Math.floor(t * nPts * 1.15));
    const coverage = Math.min(1, revealed / nPts);
    ctx.fillStyle = col.muted;
    for (let i = 0; i < revealed; i++) {
      const x = i / (nPts - 1);
      const px = 40 + x * plotW, py = baseY - trueF(x) * (baseY - top);
      ctx.beginPath(); ctx.arc(px, py, 3.4, 0, 7); ctx.fill();
    }
    const surrogateY = (x: number) => guess(x) * (1 - coverage) + trueF(x) * coverage;
    const bandHalf = 46 * (1 - coverage) + 3;
    ctx.fillStyle = col.accent; ctx.globalAlpha = 0.14;
    ctx.beginPath();
    for (let s = 0; s <= 60; s++) {
      const x = s / 60, px = 40 + x * plotW, y = baseY - surrogateY(x) * (baseY - top);
      if (s === 0) ctx.moveTo(px, y - bandHalf); else ctx.lineTo(px, y - bandHalf);
    }
    for (let s = 60; s >= 0; s--) {
      const x = s / 60, px = 40 + x * plotW, y = baseY - surrogateY(x) * (baseY - top);
      ctx.lineTo(px, y + bandHalf);
    }
    ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.accent; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let s = 0; s <= 60; s++) {
      const x = s / 60, px = 40 + x * plotW, y = baseY - surrogateY(x) * (baseY - top);
      if (s === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("the fastest faithful imitation", 30, 24);
    ctx.fillText("and it says where it differs", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 25) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- terroir: pins dated and sealed -------------------------------------------
// Measurement pins drop onto a map grid one at a time; each lands with a
// dated seal of provenance. One pin fails the seal and is crossed out rather
// than silently kept — unsealed provenance is refused, not smoothed over.
const sketchTerroir: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260907);
  const steps = 130;
  const nPins = 7;
  const unsealed = 4;
  const cells = Array.from({ length: nPins }, () => ({
    x: 70 + rand() * (w - 140), y: 60 + rand() * (h - 160),
  }));
  const order = cells.map((_, i) => i).sort(() => rand() - 0.5);
  const dropAt = order.map((_, k) => k / nPins);
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = col.edge; ctx.lineWidth = 1;
    for (let gx = 60; gx < w - 40; gx += 60) {
      ctx.beginPath(); ctx.moveTo(gx, 40); ctx.lineTo(gx, h - 40); ctx.stroke();
    }
    for (let gy = 40; gy < h - 20; gy += 50) {
      ctx.beginPath(); ctx.moveTo(60, gy); ctx.lineTo(w - 40, gy); ctx.stroke();
    }
    for (let k = 0; k < nPins; k++) {
      const i = order[k];
      const p = cells[i];
      const start = dropAt[k], land = start + 0.12;
      if (t < start) continue;
      const drop = Math.min(1, (t - start) / 0.12);
      const y = p.y - 30 + drop * 30;
      ctx.fillStyle = col.ink;
      ctx.beginPath(); ctx.arc(p.x, y, 4, 0, 7); ctx.fill();
      if (t < land) continue;
      const sealT = Math.min(1, (t - land) / 0.1);
      ctx.globalAlpha = sealT;
      if (i === unsealed) {
        ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(p.x - 10, p.y - 10); ctx.lineTo(p.x + 10, p.y + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p.x + 10, p.y - 10); ctx.lineTo(p.x - 10, p.y + 10); ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = col.accent; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(p.x, p.y - 16, 8, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p.x - 3, p.y - 16); ctx.lineTo(p.x - 1, p.y - 13); ctx.lineTo(p.x + 4, p.y - 20); ctx.stroke();
        ctx.fillStyle = col.muted; ctx.font = "9px ui-monospace, monospace";
        ctx.fillText("date", p.x - 8, p.y - 26);
      }
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("every pin, dated and sealed", 30, 24);
    ctx.fillStyle = col.muted;
    ctx.fillText("unsealed = refused", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- masque: the fit that transfers from mask to face -------------------------
// A face (the real data) and a structurally identical mask (the synthetic
// clone) share the same underlying trend but different jitter. A line fit
// on the mask alone lands correctly when the face reappears.
const sketchMasque: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260908);
  const steps = 120;
  const n = 22;
  const xs = Array.from({ length: n }, (_, i) => (i + 0.5) / n);
  const trend = (x: number) => 0.72 - 0.44 * x;
  const faceY = xs.map((x) => trend(x) + (rand() - 0.5) * 0.22);
  const maskY = xs.map((x) => trend(x) + (rand() - 0.5) * 0.22);
  const baseY = h - 50, top = 44, plotW = w - 80;
  const px = (x: number) => 40 + x * plotW;
  const py = (y: number) => baseY - y * (baseY - top);
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    let faceA = 1, maskA = 0, showLine = false;
    if (t < 1 / 3) { maskA = t / (1 / 3); }
    else if (t < 2 / 3) { maskA = 1; faceA = 1 - (t - 1 / 3) / (1 / 3); showLine = true; }
    else { maskA = 1; faceA = (t - 2 / 3) / (1 / 3); showLine = true; }
    ctx.fillStyle = col.ink; ctx.globalAlpha = faceA;
    for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(px(xs[i]), py(faceY[i]), 3.4, 0, 7); ctx.fill(); }
    ctx.fillStyle = col.accent; ctx.globalAlpha = maskA;
    for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(px(xs[i]), py(maskY[i]), 3.4, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    if (showLine) {
      ctx.strokeStyle = col.accent; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px(0), py(trend(0))); ctx.lineTo(px(1), py(trend(1))); ctx.stroke();
    }
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("analyse the mask", 30, 24);
    ctx.fillStyle = col.accent;
    ctx.fillText("the fit transfers to the face", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- decideR: no rate where unverified -----------------------------------------
// A loss curve has a clean optimum — until an unverified-input band sweeps
// across it. Where the band covers the optimum, the rate recommendation is
// withdrawn and replaced with an explicit refusal flag, not a fallback guess.
const sketchDecideR: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260909);
  const steps = 120;
  const optX = 0.45;
  const steep = 3.0 + rand() * 0.8;
  const loss = (x: number) => 0.08 + steep * (x - optX) ** 2;
  const baseY = h - 50, top = 40, plotW = w - 80;
  const px = (x: number) => 40 + x * plotW;
  const py = (y: number) => baseY - Math.min(1, y) * (baseY - top);
  const bandW = 0.3;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let s = 0; s <= 80; s++) {
      const x = s / 80, xp = px(x), yp = py(loss(x));
      if (s === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    ctx.stroke();
    const bandX = 1.3 - t * 1.0;
    const covered = bandX <= optX && bandX + bandW >= optX;
    ctx.fillStyle = col.edge; ctx.globalAlpha = 0.55;
    ctx.fillRect(px(bandX), top, plotW * bandW, baseY - top);
    ctx.globalAlpha = 1;
    if (!covered) {
      ctx.fillStyle = col.accent;
      ctx.beginPath(); ctx.arc(px(optX), py(loss(optX)), 5, 0, 7); ctx.fill();
      ctx.fillStyle = col.ink; ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("optimum", px(optX) - 22, py(loss(optX)) - 12);
    } else {
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(px(optX), top + 16); ctx.lineTo(px(optX), top + 40); ctx.stroke();
      ctx.fillStyle = col.muted;
      ctx.beginPath(); ctx.moveTo(px(optX), top + 16); ctx.lineTo(px(optX) + 18, top + 22);
      ctx.lineTo(px(optX), top + 28); ctx.closePath(); ctx.fill();
      ctx.fillStyle = col.ink; ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("no rate", px(optX) - 16, top + 54);
    }
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("loss-optimal where grounded", 30, 24);
    ctx.fillStyle = col.muted;
    ctx.fillText("no rate where unverified", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- grainPlan: the plan inherits every refusal ---------------------------------
// Four seasonal decision cards fill in one by one. One card is refused
// upstream and greys out with a stamp; the plan does not paper over it —
// later cards visibly carry the mark of the refusal they inherited.
const sketchGrainPlan: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260910);
  const steps = 130;
  const labels = ["sow", "N", "grade", "harvest"];
  const refusedIdx = 2;
  const cardW = 150, gap = 26, top = 90, cardH = 130;
  const startX = (w - (cardW * 4 + gap * 3)) / 2;
  const fillAt = labels.map((_, i) => (i + 0.4) / labels.length);
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("season timeline", 30, 26);
    for (let i = 0; i < labels.length; i++) {
      const x = startX + i * (cardW + gap);
      ctx.strokeStyle = col.edge; ctx.lineWidth = 1.4;
      ctx.strokeRect(x, top, cardW, cardH);
      const filled = t >= fillAt[i];
      if (i === refusedIdx) {
        if (filled) {
          ctx.fillStyle = col.muted; ctx.globalAlpha = 0.25;
          ctx.fillRect(x, top, cardW, cardH); ctx.globalAlpha = 1;
          ctx.strokeStyle = col.muted; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
          ctx.strokeRect(x + 8, top + cardH / 2 - 16, cardW - 16, 32);
          ctx.setLineDash([]);
          ctx.fillStyle = col.muted; ctx.font = "10px ui-monospace, monospace";
          ctx.fillText("refused upstream", x + 16, top + cardH / 2 + 4);
        }
      } else if (filled) {
        const inherits = i > refusedIdx && t >= fillAt[refusedIdx];
        ctx.fillStyle = col.accent; ctx.globalAlpha = 0.18;
        ctx.fillRect(x, top, cardW, cardH); ctx.globalAlpha = 1;
        ctx.strokeStyle = col.accent; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(x + cardW - 20, top + 20, 6, 0, 7); ctx.stroke();
        if (inherits) {
          ctx.strokeStyle = col.muted; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]);
          ctx.strokeRect(x + 3, top + 3, 14, 14);
          ctx.setLineDash([]);
        }
      }
      ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
      ctx.fillText(labels[i], x + 10, top + cardH + 20);
    }
    ctx.fillStyle = col.muted;
    ctx.fillText("the plan inherits every refusal", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- gpfield: point to block -----------------------------------------------------
// A Gaussian-process band narrows as point observations accumulate along a
// transect; a highlighted block interval then re-averages the same band,
// showing the block variance settle below what any single point carried.
const sketchGpField: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260911);
  const steps = 130;
  const nPts = 9;
  const xs = Array.from({ length: nPts }, (_, i) => (i + 0.5) / nPts);
  const truth = (x: number) => 0.55 + 0.25 * Math.sin(x * 5.4);
  const ys = xs.map((x) => truth(x) + (rand() - 0.5) * 0.12);
  const baseY = h - 60, top = 44, plotW = w - 80;
  const px = (x: number) => 40 + x * plotW;
  const py = (y: number) => baseY - y * (baseY - top);
  const blockLo = 0.55, blockHi = 0.82;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const shown = Math.min(nPts, Math.floor(t * nPts * 1.3));
    const cond = shown / nPts;
    const bandBase = 46 * (1 - 0.6 * cond);
    ctx.fillStyle = col.edge; ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (let s = 0; s <= 60; s++) {
      const x = s / 60, xp = px(x), yp = py(truth(x)) - bandBase;
      if (s === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    for (let s = 60; s >= 0; s--) {
      const x = s / 60, xp = px(x), yp = py(truth(x)) + bandBase;
      ctx.lineTo(xp, yp);
    }
    ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let s = 0; s <= 60; s++) {
      const x = s / 60, xp = px(x), yp = py(truth(x));
      if (s === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    ctx.stroke();
    ctx.fillStyle = col.ink;
    for (let i = 0; i < shown; i++) { ctx.beginPath(); ctx.arc(px(xs[i]), py(ys[i]), 3.4, 0, 7); ctx.fill(); }
    if (t > 0.55) {
      const blockT = (t - 0.55) / 0.45;
      ctx.strokeStyle = col.accent; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]);
      ctx.strokeRect(px(blockLo), top, px(blockHi) - px(blockLo), baseY - top);
      ctx.setLineDash([]);
      const blockBand = bandBase * (1 - 0.7 * blockT);
      const midY = py(truth((blockLo + blockHi) / 2));
      ctx.fillStyle = col.accent; ctx.globalAlpha = 0.25;
      ctx.fillRect(px(blockLo), midY - blockBand, px(blockHi) - px(blockLo), blockBand * 2);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("point to block", 30, 24);
    ctx.fillStyle = col.accent;
    ctx.fillText("the variance a block truly carries", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- kalmix: the day it turned, marked --------------------------------------------
// A filtered latent tracks a noisy series; two-thirds along the axis the
// underlying level actually shifts, and a change-point line with a small
// evidence tick marks the day the filter caught it.
const sketchKalmix: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260912);
  const steps = 130;
  const n = 70;
  const cp = Math.floor(n * 0.66);
  const level = (i: number) => (i < cp ? 0.38 : 0.68);
  const noisy = Array.from({ length: n }, (_, i) => level(i) + (rand() - 0.5) * 0.24);
  let latent = level(0);
  const filtered = noisy.map((v) => { latent += (v - latent) * 0.18; return latent; });
  const baseY = h - 55, top = 44, plotW = w - 80;
  const px = (i: number) => 40 + (i / (n - 1)) * plotW;
  const py = (y: number) => baseY - y * (baseY - top);
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const shown = Math.max(1, Math.floor(t * n));
    ctx.strokeStyle = col.edge; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.8;
    ctx.beginPath();
    for (let i = 0; i < shown; i++) {
      const xp = px(i), yp = py(noisy[i]);
      if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    ctx.stroke(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < shown; i++) {
      const xp = px(i), yp = py(filtered[i]);
      if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    ctx.stroke();
    if (shown > cp) {
      ctx.strokeStyle = col.accent; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(px(cp), top); ctx.lineTo(px(cp), baseY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = col.accent;
      ctx.beginPath(); ctx.arc(px(cp), top + 10, 3.2, 0, 7); ctx.fill();
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("evidence", px(cp) + 6, top + 14);
    }
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("the current under the chop", 30, 24);
    ctx.fillStyle = col.accent;
    ctx.fillText("the day it turned, marked", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- koine: said again in a second tongue -------------------------------------
// The same estimates are drawn twice, in two independent scripts. Where the
// two scripts agree, a tick accumulates quietly; where they diverge, a
// question-mark flag raises instead of being averaged away.
const sketchKoine: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260913);
  const steps = 120;
  const n = 8;
  const divergeAt = 5;
  const xs = Array.from({ length: n }, (_, i) => (i + 0.5) / n);
  const a = xs.map((x) => 0.4 + 0.3 * Math.sin(x * 4));
  const b = a.map((v, i) => (i === divergeAt ? v - 0.3 : v + (rand() - 0.5) * 0.02));
  const baseY = h - 70, top = 50, plotW = w - 80;
  const px = (x: number) => 40 + x * plotW;
  const py = (y: number) => baseY - y * (baseY - top);
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const shown = Math.max(1, Math.min(n, Math.floor(t * n * 1.2)));
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.setLineDash([]);
    ctx.beginPath();
    for (let i = 0; i < shown; i++) {
      const xp = px(xs[i]), yp = py(a[i]);
      if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    ctx.stroke();
    ctx.strokeStyle = col.accent; ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]);
    ctx.beginPath();
    for (let i = 0; i < shown; i++) {
      const xp = px(xs[i]), yp = py(b[i]);
      if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    ctx.stroke(); ctx.setLineDash([]);
    for (let i = 0; i < shown; i++) {
      const agree = Math.abs(a[i] - b[i]) < 0.06;
      const xp = px(xs[i]);
      if (agree) {
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(xp - 4, baseY + 16); ctx.lineTo(xp + 4, baseY + 16); ctx.stroke();
      } else {
        ctx.fillStyle = col.accent; ctx.font = "16px ui-monospace, monospace";
        ctx.fillText("?", xp - 4, py(Math.max(a[i], b[i])) - 12);
      }
    }
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("said again in a second tongue", 30, 24);
    ctx.fillStyle = col.accent;
    ctx.fillText("divergence is a signal", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- proxymix: a few declared shapes ------------------------------------------------
// A banana-shaped cloud of points is compressed into three ellipses — the
// blend. A small meter states the cost of that compression and settles on a
// nonzero value; the approximation is cheap, not free, and says so.
const sketchProxymix: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260914);
  const steps = 120;
  const n = 90;
  const baseY = h - 60, top = 50, plotW = w - 200, plotH = baseY - top;
  const px = (x: number) => 60 + x * plotW;
  const py = (y: number) => baseY - y * plotH;
  const banana = (u: number) => ({ x: u, y: 0.5 + 0.35 * Math.sin(u * Math.PI) - 0.25 * u * u });
  const pts = Array.from({ length: n }, () => {
    const u = rand();
    const c = banana(u);
    return { x: c.x + (rand() - 0.5) * 0.06, y: c.y + (rand() - 0.5) * 0.1 };
  });
  const ellipses = [
    { u: 0.18, w: 0.16, h: 0.14, rot: -0.3 },
    { u: 0.5, w: 0.2, h: 0.16, rot: 0 },
    { u: 0.82, w: 0.16, h: 0.14, rot: 0.35 },
  ];
  const costFinal = 0.14 + rand() * 0.05;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = col.muted; ctx.globalAlpha = 0.6;
    for (const p of pts) { ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 2.4, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    const shown = Math.min(3, Math.floor(t * 3.3));
    ctx.strokeStyle = col.accent; ctx.lineWidth = 2;
    for (let e = 0; e < shown; e++) {
      const el = ellipses[e], c = banana(el.u);
      ctx.beginPath();
      ctx.ellipse(px(el.u), py(c.y), (el.w * plotW) / 2, el.h * plotH, el.rot, 0, 7);
      ctx.stroke();
    }
    const mx = w - 110, my = h - 80, mw = 70, mh = 12;
    const cost = costFinal * Math.min(1, t * 1.2);
    ctx.strokeStyle = col.edge; ctx.lineWidth = 1; ctx.strokeRect(mx, my, mw, mh);
    ctx.fillStyle = col.accent; ctx.fillRect(mx, my, (mw * cost) / 0.3, mh);
    ctx.fillStyle = col.ink; ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("cost of blending", mx - 6, my - 6);
    ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("a few declared shapes", 30, 24);
    ctx.fillStyle = col.accent;
    ctx.fillText("the blending cost, stated", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- optimix: raced under a fair budget --------------------------------------------
// Three racers descend a multi-modal landscape under one shared, shrinking
// fuel budget. The best summit found is flagged; a basin none of the three
// reached stays circled — admitted, not hidden.
const sketchOptimix: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260915);
  const steps = 110;
  const landscape = (x: number) => 0.5 + 0.22 * Math.sin(x * 9) + 0.12 * Math.sin(x * 3.3 + 1) + 0.05 * x;
  const baseY = h - 55, top = 60, plotW = w - 80;
  const px = (x: number) => 40 + x * plotW;
  const py = (y: number) => baseY - y * (baseY - top);
  const racerX = [0.12, 0.45, 0.7].map((x) => x + (rand() - 0.5) * 0.03);
  const step = (x: number) => {
    const eps = 0.01;
    const g = (landscape(x + eps) - landscape(x - eps)) / (2 * eps);
    return Math.max(0, Math.min(1, x - g * 0.02));
  };
  const unexplored = 0.9;
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let s = 0; s <= 100; s++) {
      const x = s / 100, xp = px(x), yp = py(landscape(x));
      if (s === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
    }
    ctx.stroke();
    let xs = [...racerX];
    const descentSteps = Math.floor(t * 60);
    for (let k = 0; k < descentSteps; k++) xs = xs.map(step);
    ctx.fillStyle = col.ink;
    for (const x of xs) { ctx.beginPath(); ctx.arc(px(x), py(landscape(x)), 4.4, 0, 7); ctx.fill(); }
    const fw = 200, fx = w - 40 - fw, fy = 26;
    ctx.strokeStyle = col.edge; ctx.lineWidth = 1; ctx.strokeRect(fx, fy, fw, 10);
    ctx.fillStyle = col.muted; ctx.fillRect(fx, fy, fw * (1 - t), 10);
    ctx.fillStyle = col.ink; ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("fuel", fx, fy - 6);
    if (t > 0.85) {
      const best = xs.reduce((b, x) => (landscape(x) < landscape(b) ? x : b), xs[0]);
      ctx.fillStyle = col.accent;
      ctx.beginPath(); ctx.arc(px(best), py(landscape(best)), 6, 0, 7); ctx.fill();
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("best found", px(best) - 18, py(landscape(best)) - 14);
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.arc(px(unexplored), py(landscape(unexplored)), 14, 0, 7); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = col.muted;
      ctx.fillText("unexplored", px(unexplored) - 22, py(landscape(unexplored)) + 26);
    }
    ctx.fillStyle = col.ink; ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("raced under a fair budget", 30, 24);
    ctx.fillStyle = col.muted;
    ctx.fillText("other summits admitted", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- cdzoo: sixteen schools, one convention ------------------------------------------
// Five nodes; edges thicken as more schools cast a vote for them. Most edges
// converge to a solid consensus; one edge stays dashed with a small
// split-vote bar — the disagreement is kept on the record, not resolved away.
const sketchCdzoo: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(20260916);
  const steps = 130;
  const nSchools = 16;
  const nodes = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return { x: w / 2 + Math.cos(a) * 130, y: h / 2 + Math.sin(a) * 120 };
  });
  const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]];
  const contested = 5;
  const votesFor = edges.map((_, i) => (i === contested ? 9 : 12 + Math.floor(rand() * 4)));
  const votesAgainst = edges.map((_, i) => (i === contested ? 7 : Math.floor(rand() * 3)));
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const castSchools = Math.floor(t * nSchools);
    for (let e = 0; e < edges.length; e++) {
      const [i, j] = edges[e];
      const total = votesFor[e] + votesAgainst[e];
      const cast = Math.min(total, Math.round((castSchools / nSchools) * total));
      if (cast <= 0) continue;
      const frac = cast / nSchools;
      const isContested = e === contested;
      ctx.lineWidth = Math.max(0.8, frac * 10);
      ctx.strokeStyle = isContested ? col.muted : col.ink;
      ctx.setLineDash(isContested && t > 0.9 ? [5, 4] : []);
      ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      if (isContested && t > 0.9) {
        const mx = (nodes[i].x + nodes[j].x) / 2, my = (nodes[i].y + nodes[j].y) / 2;
        const barW = 40, forW = barW * (votesFor[e] / total);
        ctx.fillStyle = col.ink; ctx.fillRect(mx - barW / 2, my - 16, forW, 5);
        ctx.fillStyle = col.muted; ctx.fillRect(mx - barW / 2 + forW, my - 16, barW - forW, 5);
        ctx.fillStyle = col.accent; ctx.font = "10px ui-monospace, monospace";
        ctx.fillText("split vote", mx - 20, my - 22);
      }
    }
    ctx.fillStyle = col.ink;
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 5, 0, 7); ctx.fill(); }
    ctx.font = "12px ui-monospace, monospace";
    ctx.fillText("sixteen schools, one convention", 30, 24);
    ctx.fillStyle = col.muted;
    ctx.fillText("dissent on the record", 30, h - 14);
  };
  if (reduced) { draw(1); return; }
  let f = 0;
  const tick = () => { f++; draw(Math.min(1, f / steps)); if (f < steps + 20) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

// --- fallback: constellation shimmer ----------------------------------------
const sketchFallback: Sketch = (ctx, w, h, col, reduced) => {
  const rand = mulberry32(578);
  const pts = Array.from({ length: 26 }, () => ({
    x: 30 + rand() * (w - 60), y: 30 + rand() * (h - 60),
    p: rand() * Math.PI * 2,
  }));
  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = col.edge; ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 120) { ctx.globalAlpha = 1 - d / 120; ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
    ctx.globalAlpha = 1; ctx.fillStyle = col.accent;
    for (const p of pts) {
      const r = 2.2 + Math.sin(t / 500 + p.p) * 1.1;
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1, r), 0, 7); ctx.fill();
    }
  };
  if (reduced) { draw(0); return; }
  let start: number | null = null;
  const tick = (ts: number) => { if (start === null) start = ts;
    draw(ts - start); if (ts - start < 6000) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

const sketches: Record<string, Sketch> = {
  PESTO: sketchPESTO,
  flexyBayes: sketchFlexyBayes,
  kernR: sketchKernR,
  apsimR: sketchApsimR,
  quorum: sketchQuorum,
  terroir: sketchTerroir,
  masque: sketchMasque,
  decideR: sketchDecideR,
  grainPlan: sketchGrainPlan,
  gpfield: sketchGpField,
  kalmix: sketchKalmix,
  koine: sketchKoine,
  proxymix: sketchProxymix,
  optimix: sketchOptimix,
  cdzoo: sketchCdzoo,
};

export const mountWidget = (id: string, canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const col = readColours(canvas);
  // crisp on retina
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.width, h = canvas.height;
  canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  (sketches[id] ?? sketchFallback)(ctx, w, h, col, reduced);
};
