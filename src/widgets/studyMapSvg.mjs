// Draws the introduction's map for one study (src/data/studyMaps.mjs): the poster's member circles and section bands,
// conductoR at the centre with no arrows, the study's own hand-overs as arrows, its steps numbered on the circles, and
// every package the study did not use faded. No background links and no outside packages. Every id is prefixed with
// the study's id, so both studies can sit on one page. No style attributes: the site's CSP forbids inline styles.
import { layout } from "./orchestraMapSvg.mjs";
import { sections, nodes, motifs } from "../data/orchestraMap.mjs";
import { studyOrder } from "../data/studyMaps.mjs";

const C = 640;
const R_FORMAT = 92;
const R_CENTRE = 56;
const R_LABEL = 208;
const R_MEMBER = 304;
const NODE_R = 34;
const GOLD = "#B08D2B";
const INK = "#1D2023";
const PAPER = "#FFFFFF";
const PATH = "#D55E00";
const VIEW = "80 90 1120 1100";
const FONT = "Helvetica Neue, Arial, sans-serif";
const ARC_LABEL = {
  data: "Data and privacy", mech: "Crop simulation", causal: "Causal, spatial and time series",
  proxy: "Approximation", hub: "Statistics and consensus", decision: "Decisions",
};
// R packages are written {name}; DataHub is a data catalogue, not a package
const braced = (id) => (id === "DataHub" ? id : `{${id}}`);
// a label nudged sideways where braces make two neighbours touch (screen px)
const NUDGE = { survkit: -10, quorum: 6, flexyBayes: 10 };
// where a step badge sits on its circle (screen degrees); upper right unless an arrow arrives there
const BADGE_AT = { proxymix: 225, quorum: 200, decideR: 20, grainPlan: 200, koine: 0, janusplot: -90, flexyBayes: -10, kernR: -60 };

const rad = (d) => (d * Math.PI) / 180;
const f = (x) => (Math.round(x * 10) / 10).toString();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const polar = (r, deg) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))];

function arcPath(r, from, to) {
  const mid = (from + to) / 2;
  const lower = Math.sin(rad(mid)) > 0.05;
  const [a0, a1] = lower ? [to, from] : [from, to];
  const [x0, y0] = polar(r, a0), [x1, y1] = polar(r, a1);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return { d: `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${large} ${lower ? 0 : 1} ${f(x1)} ${f(y1)}`, lower };
}
function labelArc(r, from, to, text, size, spacing) {
  const half = ((text.length * (size * 0.68 + spacing)) / r) * 90 / Math.PI;
  const mid = (from + to) / 2;
  return arcPath(r, mid - half, mid + half);
}
function bandPath(r0, r1, from, to) {
  const [a, b] = polar(r1, from), [c, d] = polar(r1, to), [e, g] = polar(r0, to), [h, k] = polar(r0, from);
  const large = to - from > 180 ? 1 : 0;
  return `M${f(a)} ${f(b)} A${r1} ${r1} 0 ${large} 1 ${f(c)} ${f(d)} L${f(e)} ${f(g)} A${r0} ${r0} 0 ${large} 0 ${f(h)} ${f(k)} Z`;
}

/** A smooth curve (Catmull-Rom as cubic Beziers) from one circle's rim, through the waypoints, to the other's rim. */
function arrowPath(p, q, a) {
  const w = a.via.map(([r, d]) => polar(r, d));
  // the rim point faces the nearest waypoint, so the arrow meets the circle head-on
  const rim = (n, t, gap) => { const d = Math.hypot(t[0] - n.x, t[1] - n.y); return [n.x + (t[0] - n.x) / d * gap, n.y + (t[1] - n.y) / d * gap]; };
  // out/into (screen degrees), where given, fix the rim point instead, so arrows sharing a circle fan out
  const at = (n, deg, gap) => [n.x + Math.cos(rad(deg)) * gap, n.y + Math.sin(rad(deg)) * gap];
  const head = a.out == null ? [rim(p, w[0], p.r + 4)] : [at(p, a.out, p.r + 4), at(p, a.out, p.r + 20)];
  const tail = a.into == null ? [rim(q, w[w.length - 1], q.r + 9)] : [at(q, a.into, q.r + 24), at(q, a.into, q.r + 9)];
  const pts = [...head, ...w, ...tail];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a0 = pts[Math.max(i - 1, 0)], b = pts[i], c = pts[i + 1], e = pts[Math.min(i + 2, pts.length - 1)];
    const c1 = [b[0] + (c[0] - a0[0]) / 6, b[1] + (c[1] - a0[1]) / 6];
    const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(c[0])} ${f(c[1])}`;
  }
  return d;
}

/**
 * @param {object} study one entry of studies in src/data/studyMaps.mjs
 * @param {{ bust?: string }} opts bust: data: URI of janusplot's Janus bust, drawn in its circle
 */
export function renderStudySvg(study, opts = {}) {
  const P = `sm-${study.id}`;
  const { pos, spans } = layout([], {}, studyOrder);
  const members = nodes.filter((n) => n.kind === "member");
  const inStudy = new Set([...study.steps.flatMap((s) => s.ids), ...study.arrows.flatMap((a) => [a.from, a.to])]);
  for (const a of study.arrows) {
    for (const id of [a.from, a.to]) {
      if (id === "conductoR") throw new Error(`${study.id}: no arrow may touch conductoR (${a.from} to ${a.to})`);
      if (!pos[id] || !members.some((m) => m.id === id)) throw new Error(`${study.id}: arrow end ${id} is not a drawn circle`);
    }
  }
  for (const id of inStudy) if (!pos[id]) throw new Error(`${study.id}: ${id} is not on the map`);
  const out = [];
  const nArrows = study.arrows.length;
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${VIEW}" class="poster-svg" font-family="${FONT}" role="img" aria-labelledby="${P}-title">`);
  out.push(`<title id="${P}-title">The orchestra's packages in six sections around conductoR, with the steps of the study "${esc(study.label)}" numbered on their circles and ${nArrows} arrows showing which package's data or result the next package read. Packages the study did not use are faded.</title>`);
  out.push(`<defs><marker id="${P}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${PATH}"/></marker>`);
  if (opts.bust) out.push(`<clipPath id="${P}-bust"><circle cx="${f(pos.janusplot.x)}" cy="${f(pos.janusplot.y)}" r="${NODE_R - 3}"/></clipPath>`);
  out.push("</defs>");

  // section bands; their labels are drawn over the arrows, with a white halo
  const labels = [];
  for (const s of spans) {
    const pad = 1.2;
    out.push(`<path d="${bandPath(R_LABEL - 16, R_MEMBER + NODE_R + 20, s.from + pad, s.to - pad)}" fill="${s.color}" fill-opacity="0.07" stroke="${s.color}" stroke-opacity="0.22" stroke-width="1"/>`);
    const arc = labelArc(R_LABEL, s.from + pad, s.to - pad, ARC_LABEL[s.id], 13, 1.4);
    labels.push(`<path id="${P}-arc-${s.id}" d="${arc.d}" fill="none" stroke="none"/>`);
    labels.push(`<text font-size="13" font-weight="700" letter-spacing="1.4" fill="${s.color}" stroke="${PAPER}" stroke-width="4" stroke-linejoin="round" paint-order="stroke" dy="${arc.lower ? 11 : 0}"><textPath href="#${P}-arc-${s.id}" xlink:href="#${P}-arc-${s.id}">${esc(ARC_LABEL[s.id].toUpperCase())}</textPath></text>`);
  }

  // the study's arrows, under the circles; a white casing keeps each one readable where it crosses another
  out.push(`<g fill="none" stroke-linecap="round" stroke-linejoin="round">`);
  for (const a of study.arrows) {
    const d = arrowPath(pos[a.from], pos[a.to], a);
    const tag = `data-from="${a.from}" data-to="${a.to}"`;
    const bold = a.kind === "handover";
    out.push(`<path ${tag} d="${d}" stroke="${PAPER}" stroke-width="${bold ? 10 : 6}"/>`);
    out.push(`<path class="sm-link" ${tag} d="${d}" stroke="${PATH}" stroke-width="${bold ? 5 : 2.6}"${bold ? "" : ` stroke-dasharray="7 6"`} marker-end="url(#${P}-arrow)"/>`);
  }
  out.push("</g>");
  out.push(...labels);

  // the shared result format ring and the connector at the centre
  out.push(`<circle cx="${C}" cy="${C}" r="${R_FORMAT}" fill="none" stroke="${GOLD}" stroke-width="9" stroke-opacity="0.5"/>`);
  const top = labelArc(R_FORMAT + 16, 200, 340, "SHARED RESULT FORMAT", 12.5, 1.2);
  out.push(`<path id="${P}-arc-ring" d="${top.d}" fill="none" stroke="none"/><text font-size="12.5" font-weight="700" letter-spacing="1.2" fill="${GOLD}"><textPath href="#${P}-arc-ring" xlink:href="#${P}-arc-ring">SHARED RESULT FORMAT</textPath></text>`);
  out.push(`<circle cx="${C}" cy="${C}" r="${R_CENTRE}" fill="${INK}"/>`);
  out.push(`<text x="${C}" y="${C - 2}" text-anchor="middle" font-size="15" font-weight="700" fill="#F7F5F1">{conductoR}</text>`);
  out.push(`<text x="${C}" y="${C + 20}" text-anchor="middle" font-size="11" fill="#E7D9AE">runs the</text>`);
  out.push(`<text x="${C}" y="${C + 33}" text-anchor="middle" font-size="11" fill="#E7D9AE">analysis plan</text>`);

  // member circles; a package the study did not use is faded
  for (const n of members) {
    const p = pos[n.id];
    const c = p.colour;
    const faded = !inStudy.has(n.id);
    out.push(`<g${faded ? ` opacity="0.22"` : ""}>`);
    out.push(`<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${NODE_R}" fill="${PAPER}" stroke="${c}" stroke-width="3"/>`);
    if (n.id === "janusplot" && opts.bust) {
      const s = 2 * (NODE_R - 3);
      out.push(`<image href="${opts.bust}" x="${f(p.x - s / 2)}" y="${f(p.y - s / 2)}" width="${s}" height="${s}" clip-path="url(#${P}-bust)" preserveAspectRatio="xMidYMid slice"/>`);
    } else {
      const motif = (motifs[n.motif] ?? "").replace(/'C'/g, `'${c}'`).replace(/fill='S'/g, `fill='${PAPER}'`);
      out.push(`<svg x="${f(p.x - 22)}" y="${f(p.y - 24)}" width="44" height="48" viewBox="44 34 72 78" color="${INK}">${motif}</svg>`);
    }
    const cos = Math.cos(rad(p.deg)), sin = Math.sin(rad(p.deg));
    const size = 19;
    const lx = p.x + cos * (NODE_R + 13) + (NUDGE[n.id] ?? 0), ly = p.y + sin * (NODE_R + 13);
    const anchor = cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
    const dy = sin > 0.6 ? size * 0.8 : sin < -0.6 ? -size * 0.15 : size * 0.35;
    out.push(`<text x="${f(lx)}" y="${f(ly + dy)}" text-anchor="${anchor}" font-size="${size}" font-weight="700" fill="${INK}" stroke="${PAPER}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${esc(braced(n.id))}</text>`);
    out.push("</g>");
  }

  // step numbers on their circles; conductoR's sits on the centre disc
  study.steps.forEach((s, i) => {
    for (const id of s.ids) {
      const p = id === "conductoR" ? { x: C, y: C, r: R_CENTRE } : pos[id];
      const at = id === "conductoR" ? -45 : BADGE_AT[id] ?? -45;
      const bx = p.x + Math.cos(rad(at)) * (p.r ?? NODE_R) * 1.047, by = p.y + Math.sin(rad(at)) * (p.r ?? NODE_R) * 1.047;
      out.push(`<circle cx="${f(bx)}" cy="${f(by)}" r="13" fill="${PATH}" stroke="${PAPER}" stroke-width="2.5"/>`);
      out.push(`<text x="${f(bx)}" y="${f(by + 5)}" text-anchor="middle" font-size="15" font-weight="800" fill="#FFFFFF">${i + 1}</text>`);
    }
  });

  out.push("</svg>");
  return out.join("\n");
}
