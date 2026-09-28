// Draws the orchestra map as an SVG string. The same function feeds the
// interactive map (SSR, then enhanced by orchestraMapClient.ts) and the poster
// figure. Colours are SVG presentation attributes, so the SVG stands alone;
// the site stylesheet overrides them for dark mode. No style attributes: the
// site's CSP forbids inline styles.
import { sections, nodes, edges, motifs, workedExample } from "../data/orchestraMap.mjs";

const W = 1280;
const C = W / 2;
const R_FORMAT = 92;
const R_CENTRE = 56;
const R_LABEL = 208;
const R_MEMBER = 304;
const R_SOURCE = 486;
const NODE_R = 34;
const SOURCE_R = 11;
const GAP = 0.9;
const START = -152;
const GOLD = "#B08D2B";
const GREY = "#8a8f96";
const INK = "#1D2023";
const MUTED = "#50544D";
const PAPER = "#FFFFFF";
const VIEW = "80 80 1120 1120";
const POSTER_VIEW = "95 105 1090 1030";

/** Short labels drawn on the arcs; the panel uses the full label. */
const ARC_LABEL = {
  data: "Data and privacy", mech: "Crop simulation", causal: "Causal, spatial and time series",
  proxy: "Approximation", hub: "Statistics and consensus", decision: "Decisions",
};

/** Order around the ring, chosen to keep the worked example short. */
const ORDER = ["masque", "terroir", "apsimR", "PESTO", "cdzoo", "bacipair", "kalmix", "kernR", "gpfield",
  "koine", "flexyBayes", "quorum", "survkit", "decideR", "grainPlan", "optimix", "proxymix"];

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))];
const f = (x) => Math.round(x * 10) / 10;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Positions for every node, and the angular span of each section. */
export function layout() {
  const secColour = Object.fromEntries(sections.map((s) => [s.id, s.color]));
  const members = nodes.filter((n) => n.kind === "member");
  const units = members.length + GAP * sections.length;
  const step = 360 / units;
  const pos = {};
  const spans = [];
  let a = START;
  for (const s of sections) {
    const inSec = members.filter((n) => n.section === s.id)
      .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
    const from = a;
    a += (GAP / 2) * step;
    for (const n of inSec) {
      const deg = a + step / 2;
      const [x, y] = polar(R_MEMBER, deg);
      pos[n.id] = { x, y, deg, r: NODE_R, colour: s.color };
      a += step;
    }
    a += (GAP / 2) * step;
    spans.push({ ...s, from, to: a });
  }
  pos.conductoR = { x: C, y: C, deg: 0, r: R_CENTRE, colour: GOLD };
  pos.orchestraManifest = { x: C, y: C, deg: 0, r: R_FORMAT, colour: GOLD };
  const [ex, ey] = polar(158, 90);
  pos.cropOrchestra = { x: ex, y: ey, deg: 90, r: 22, colour: GOLD };

  // Outside sources sit on the outer ring near the member they feed, pushed
  // apart until neighbours are at least MIN_SEP degrees apart.
  const MIN_SEP = 12.5;
  const srcs = nodes.filter((n) => n.kind === "source").map((n) => {
    const targets = edges.filter((e) => e.from === n.id).map((e) => pos[e.to]).filter((p) => p && p.deg);
    let ideal = targets.length ? targets.reduce((s, p) => s + p.deg, 0) / targets.length : 90;
    if (!targets.length || edges.some((e) => e.from === n.id && e.to === "conductoR")) ideal = 100;
    return { id: n.id, deg: ideal };
  }).sort((p, q) => p.deg - q.deg);
  for (let it = 0; it < 400; it++) {
    let moved = false;
    for (let i = 1; i < srcs.length; i++) {
      const d = srcs[i].deg - srcs[i - 1].deg;
      if (d < MIN_SEP) {
        const push = (MIN_SEP - d) / 2;
        srcs[i - 1].deg -= push; srcs[i].deg += push; moved = true;
      }
    }
    if (!moved) break;
  }
  for (const s of srcs) {
    const [x, y] = polar(R_SOURCE, s.deg);
    pos[s.id] = { x, y, deg: s.deg, r: SOURCE_R, colour: GREY };
  }
  return { pos, spans, secColour };
}

/** Curve between two nodes, bent toward the centre, trimmed to the node rims. */
function edgePath(p, q) {
  if (p.x === C && p.y === C || q.x === C && q.y === C) {
    const [a, b] = p.x === C && p.y === C ? [p, q] : [q, p];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    const ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
    const s = [a.x + ux * (a === p ? R_FORMAT + 4 : R_FORMAT + 4), a.y + uy * (R_FORMAT + 4)];
    const e = [b.x - ux * (b.r + 5), b.y - uy * (b.r + 5)];
    return a === p ? `M${f(s[0])} ${f(s[1])} L${f(e[0])} ${f(e[1])}` : `M${f(e[0])} ${f(e[1])} L${f(s[0])} ${f(s[1])}`;
  }
  const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
  const pull = Math.abs(p.r - q.r) > 10 ? 0.92 : 0.55;
  let cx = C + (mx - C) * pull, cy = C + (my - C) * pull;
  // Keep the curve's midpoint clear of the shared-format ring: push the
  // control point outward (sideways when the chord crosses the centre).
  const CLEAR = R_FORMAT + 58;
  for (let i = 0; i < 60; i++) {
    const bx = 0.25 * p.x + 0.5 * cx + 0.25 * q.x, by = 0.25 * p.y + 0.5 * cy + 0.25 * q.y;
    const d = Math.hypot(bx - C, by - C);
    if (d >= CLEAR) break;
    let ux = (bx - C) / (d || 1), uy = (by - C) / (d || 1);
    if (d < 20) { const L = Math.hypot(q.x - p.x, q.y - p.y); ux = -(q.y - p.y) / L; uy = (q.x - p.x) / L; }
    cx += ux * 12; cy += uy * 12;
  }
  const trim = (a, t, r) => {
    const d = Math.hypot(t[0] - a.x, t[1] - a.y) || 1;
    return [a.x + ((t[0] - a.x) / d) * r, a.y + ((t[1] - a.y) / d) * r];
  };
  const s = trim(p, [cx, cy], p.r + 4);
  const e = trim(q, [cx, cy], q.r + 7);
  return `M${f(s[0])} ${f(s[1])} Q${f(cx)} ${f(cy)} ${f(e[0])} ${f(e[1])}`;
}

/** Arc path for text; reversed in the lower half so text reads left to right. */
function arcPath(r, from, to) {
  const mid = (from + to) / 2;
  const lower = Math.sin(rad(mid)) > 0.05;
  const [a0, a1] = lower ? [to, from] : [from, to];
  const [x0, y0] = polar(r, a0), [x1, y1] = polar(r, a1);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return { d: `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${large} ${lower ? 0 : 1} ${f(x1)} ${f(y1)}`, lower };
}

function labelArc(r, from, to, text, size, spacing) {
  const len = text.length * (size * 0.68 + spacing);
  const half = ((len / r) * 180) / Math.PI / 2;
  const mid = (from + to) / 2;
  return arcPath(r, mid - half, mid + half);
}

function bandPath(r0, r1, from, to) {
  const [a, b] = polar(r1, from), [c, d] = polar(r1, to), [e, g] = polar(r0, to), [h, k] = polar(r0, from);
  const large = to - from > 180 ? 1 : 0;
  return `M${f(a)} ${f(b)} A${r1} ${r1} 0 ${large} 1 ${f(c)} ${f(d)} L${f(e)} ${f(g)} A${r0} ${r0} 0 ${large} 0 ${f(h)} ${f(k)} Z`;
}

/** Name label placed outward from the node. */
function outwardLabel(p, gap, cls, size, text, weight, fill) {
  const cos = Math.cos(rad(p.deg)), sin = Math.sin(rad(p.deg));
  const lx = p.x + cos * (p.r + gap), ly = p.y + sin * (p.r + gap);
  const anchor = cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
  const dy = sin > 0.6 ? size * 0.8 : sin < -0.6 ? -size * 0.15 : size * 0.35;
  return `<text class="${cls}" x="${f(lx)}" y="${f(ly + dy)}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}" stroke="${PAPER}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`;
}

/**
 * @param {{ mode?: "web" | "poster", font?: string }} opts
 * mode "poster" draws every flow link faintly and numbers the worked example.
 */
export function renderSvg(opts = {}) {
  const mode = opts.mode ?? "web";
  const font = opts.font ?? "Instrument Sans, system-ui, -apple-system, Segoe UI, sans-serif";
  const { pos, spans } = layout();
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const colourOf = (id) => pos[id]?.colour ?? GREY;
  const out = [];

  out.push(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${mode === "poster" ? POSTER_VIEW : VIEW}" class="om-svg" font-family="${esc(font)}" role="group" aria-label="Map of the Crop Analytics Orchestra: ${nodes.filter((n) => n.kind === "member").length} member packages in six sections around the connector, conductoR, with the outside sources they use on the outer ring.">`);

  // Arrowheads, one per colour.
  const colours = [...new Set([...sections.map((s) => s.color), GOLD, GREY])];
  out.push("<defs>");
  for (const c of colours) {
    out.push(`<marker id="om-arrow-${c.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker>`);
  }
  out.push("</defs>");

  // Section bands and arc labels.
  out.push(`<g class="om-sections">`);
  for (const s of spans) {
    const pad = 1.2;
    out.push(`<path class="om-band" data-section="${s.id}" d="${bandPath(R_LABEL - 16, R_MEMBER + NODE_R + 20, s.from + pad, s.to - pad)}" fill="${s.color}" fill-opacity="0.07" stroke="${s.color}" stroke-opacity="0.22" stroke-width="1"/>`);
    const arc = labelArc(R_LABEL, s.from + pad, s.to - pad, ARC_LABEL[s.id], 13, 1.4);
    out.push(`<path id="om-arc-${s.id}" d="${arc.d}" fill="none" stroke="none"/>`);
    out.push(`<text class="om-seclabel" font-size="13" font-weight="700" letter-spacing="1.4" fill="${s.color}" dy="${arc.lower ? 11 : 0}"><textPath href="#om-arc-${s.id}" xlink:href="#om-arc-${s.id}">${esc(ARC_LABEL[s.id].toUpperCase())}</textPath></text>`);
  }
  out.push("</g>");

  // Links. Hidden on the web until a node is chosen; faint on the poster.
  const scorePairs = new Set(workedExample.slice(1).map((s, i) => `${workedExample[i].id}>${s.id}`));
  out.push(`<g class="om-edges">`);
  for (const e of edges) {
    const p = pos[e.from], q = pos[e.to];
    if (!p || !q) continue;
    if (mode === "poster" && e.kind === "source" && e.to === "conductoR") continue;
    const c = colourOf(e.from);
    const dash = e.kind === "build" ? ` stroke-dasharray="7 5"` : e.kind === "source" ? ` stroke-dasharray="2 4"` : "";
    const score = scorePairs.has(`${e.from}>${e.to}`);
    // Poster: the worked example stands out; every other link is faint.
    const posterScore = mode === "poster" && score;
    const stroke = posterScore ? "#D55E00" : c;
    const opacity = mode !== "poster" ? "" : ` stroke-opacity="${score ? 0.95 : e.kind === "source" ? 0.45 : 0.16}"`;
    const width = posterScore ? 4 : 2.2;
    out.push(`<path class="om-edge k-${e.kind}${score ? " is-score" : ""}" data-from="${esc(e.from)}" data-to="${esc(e.to)}" d="${edgePath(p, q)}" fill="none" stroke="${stroke}" stroke-width="${width}"${opacity}${dash} ${mode === "poster" && !score && e.kind !== "source" ? "" : ` marker-end="url(#om-arrow-${stroke.slice(1)})"`}/>`);
  }
  out.push("</g>");

  // Shared-format ring. The ring is clickable; the keyboard reaches it through
  // its top label, whose centre is not covered by the connector.
  const top = labelArc(R_FORMAT + 16, 200, 340, "SHARED RESULT FORMAT", 12.5, 1.2);
  const bottom = labelArc(R_FORMAT + 16, 35, 145, "ORCHESTRAMANIFEST", 12.5, 1.2);
  const label = (id, arc, text) =>
    `<path id="${id}" d="${arc.d}" fill="none" stroke="none"/><text class="om-ringlabel" font-size="12.5" font-weight="700" letter-spacing="1.2" fill="${GOLD}" dy="${arc.lower ? 10 : 0}"><textPath href="#${id}" xlink:href="#${id}">${text}</textPath></text>`;
  out.push(`<g class="om-node om-format" data-id="orchestraManifest" aria-hidden="true">`);
  out.push(`<circle class="om-hit" cx="${C}" cy="${C}" r="${R_FORMAT}" fill="none" stroke="transparent" stroke-width="26"/>`);
  out.push(`<circle class="om-ring" cx="${C}" cy="${C}" r="${R_FORMAT}" fill="none" stroke="${GOLD}" stroke-width="9" stroke-opacity="0.5"/>`);
  out.push(label("om-arc-ring-b", bottom, "ORCHESTRAMANIFEST"));
  out.push("</g>");
  out.push(`<g class="om-node om-format-label" data-id="orchestraManifest" tabindex="0" role="button" aria-label="orchestraManifest: ${esc(byId.orchestraManifest.purpose)}">`);
  out.push(`<path class="om-hit" d="${top.d} Z" fill="transparent" stroke="transparent" stroke-width="24"/>`);
  out.push(label("om-arc-ring", top, "SHARED RESULT FORMAT"));
  out.push("</g>");

  // The connector at the centre.
  out.push(`<g class="om-node om-centre" data-id="conductoR" tabindex="0" role="button" aria-label="conductoR: ${esc(byId.conductoR.purpose)}">`);
  out.push(`<circle class="om-halo" cx="${C}" cy="${C}" r="${R_CENTRE + 10}" fill="${GOLD}" fill-opacity="0"/>`);
  out.push(`<circle class="om-disc" cx="${C}" cy="${C}" r="${R_CENTRE}" fill="${INK}"/>`);
  out.push(`<text class="om-centre-name" x="${C}" y="${C + 2}" text-anchor="middle" font-size="19" font-weight="700" fill="#F7F5F1">conductoR</text>`);
  out.push(`<text class="om-centre-sub" x="${C}" y="${C + 21}" text-anchor="middle" font-size="11.5" fill="#E7D9AE">runs the plan</text>`);
  out.push("</g>");

  // The entry point.
  {
    const p = pos.cropOrchestra;
    out.push(`<g class="om-node om-entry" data-id="cropOrchestra" tabindex="0" role="button" aria-label="cropOrchestra: ${esc(byId.cropOrchestra.purpose)}">`);
    out.push(`<rect class="om-pill" x="${f(p.x - 76)}" y="${f(p.y - 17)}" width="152" height="34" rx="17" fill="${PAPER}" stroke="${GOLD}" stroke-width="2"/>`);
    out.push(`<text class="om-name" x="${f(p.x)}" y="${f(p.y + 5)}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">cropOrchestra</text>`);
    out.push(`<text class="om-sub" x="${f(p.x)}" y="${f(p.y + 34)}" text-anchor="middle" font-size="11.5" fill="${MUTED}">start here</text>`);
    out.push("</g>");
  }

  // Members.
  for (const n of nodes.filter((m) => m.kind === "member")) {
    const p = pos[n.id];
    const c = p.colour;
    const motif = (motifs[n.motif] ?? "").replace(/'C'/g, `'${c}'`).replace(/fill='S'/g, `fill='${PAPER}' class='om-msurf'`);
    out.push(`<g class="om-node om-member" data-id="${esc(n.id)}" data-section="${n.section}" tabindex="0" role="button" aria-label="${esc(n.id)}: ${esc(n.purpose)}">`);
    out.push(`<circle class="om-halo" cx="${f(p.x)}" cy="${f(p.y)}" r="${NODE_R + 9}" fill="${c}" fill-opacity="0"/>`);
    out.push(`<circle class="om-disc" cx="${f(p.x)}" cy="${f(p.y)}" r="${NODE_R}" fill="${PAPER}" stroke="${c}" stroke-width="3"/>`);
    out.push(`<svg class="om-motif" x="${f(p.x - 22)}" y="${f(p.y - 24)}" width="44" height="48" viewBox="44 34 72 78" color="${INK}">${motif}</svg>`);
    out.push(outwardLabel(p, 13, "om-name", mode === "poster" ? 19 : 20, n.id, 700, INK));
    out.push(`<text class="om-step" x="${f(p.x + NODE_R * 0.72)}" y="${f(p.y - NODE_R * 0.72 + 5)}" text-anchor="middle" font-size="13" font-weight="800" fill="#FFFFFF"></text>`);
    out.push("</g>");
  }

  // Outside sources.
  for (const n of nodes.filter((m) => m.kind === "source")) {
    const p = pos[n.id];
    if (mode === "poster" && edges.filter((e) => e.from === n.id).every((e) => e.to === "conductoR")) continue;
    out.push(`<g class="om-node om-source" data-id="${esc(n.id)}" tabindex="0" role="button" aria-label="${esc(n.id)}, outside source: ${esc(n.purpose)}">`);
    out.push(`<circle class="om-halo" cx="${f(p.x)}" cy="${f(p.y)}" r="${SOURCE_R + 7}" fill="${GREY}" fill-opacity="0"/>`);
    out.push(`<circle class="om-disc" cx="${f(p.x)}" cy="${f(p.y)}" r="${SOURCE_R}" fill="${PAPER}" stroke="${GREY}" stroke-width="2" stroke-dasharray="3 3"/>`);
    out.push(outwardLabel(p, 8, "om-name om-source-name", mode === "poster" ? 15 : 15, n.id, 600, MUTED));
    out.push("</g>");
  }

  // Poster: number the worked example on its nodes.
  if (mode === "poster") {
    workedExample.forEach((s, i) => {
      const p = pos[s.id];
      const bx = p.x + NODE_R * 0.74, by = p.y - NODE_R * 0.74;
      out.push(`<circle cx="${f(bx)}" cy="${f(by)}" r="11" fill="#D55E00" stroke="${PAPER}" stroke-width="2"/>`);
      out.push(`<text x="${f(bx)}" y="${f(by + 4.5)}" text-anchor="middle" font-size="13" font-weight="800" fill="#FFFFFF">${i + 1}</text>`);
    });
  }

  out.push("</svg>");
  return out.join("\n");
}
