// The hex roster: one hexagon per orchestra package, as on the poster
// (ORCHESTRA_dev/poster/build_hexes_v10_5.mjs), drawn from the map source so a
// hex matches its node on the map. Each hex links to its place on the map on
// /members. Charcoal face, a border in the section colour, the name in mono.
import { sections, nodes, motifs } from "../data/orchestraMap.mjs";

const FACE = "#414042";
const LIGHT = "#F2F2F2";
const CONDUCTOR = "#F0E442";
const MONO = "'JetBrains Mono', Menlo, Consolas, monospace";

// the poster's order (the map's ring order), with janusplot (enrolled 2026-10-20) beside koine
const ORDER = ["masque", "terroir", "DataHub", "apsimR", "PESTO", "cdzoo", "bacipair", "kalmix", "kernR", "gpfield",
  "koine", "janusplot", "flexyBayes", "quorum", "survkit", "decideR", "grainPlan", "optimix", "proxymix", "conductoR"];

// a baton over three steps run in order, in the 44 34 72 78 box of the member motifs
const CONDUCTOR_MOTIF = "<circle cx='58' cy='92' r='6' fill='none' stroke='currentColor' stroke-width='2.2'/><circle cx='80' cy='92' r='6' fill='none' stroke='currentColor' stroke-width='2.2'/><circle cx='102' cy='92' r='6' fill='none' stroke='currentColor' stroke-width='2.2'/><path d='M64 92 h10 M86 92 h10' stroke='currentColor' stroke-width='2.2'/><path d='M60 70 L104 46' stroke='C' stroke-width='3.2' stroke-linecap='round'/><circle cx='60' cy='70' r='3.6' fill='C'/>";

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const colourOf = Object.fromEntries(sections.map((s) => [s.id, s.color]));
const labelOf = Object.fromEntries(sections.map((s) => [s.id, s.label]));
const onMap = nodes.filter((n) => ["member", "centre"].includes(n.kind)).map((n) => n.id);
if (onMap.length !== ORDER.length || onMap.some((id) => !ORDER.includes(id))) {
  throw new Error(`hex roster and map disagree: ${onMap.filter((id) => !ORDER.includes(id)).join(", ")}`);
}

// the name is the section colour mixed 40 % towards white, so dark sections stay readable on the charcoal face
const tint = (hex) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * 0.6 + 255 * 0.4)
  .toString(16).padStart(2, "0")).join("");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// pointy-top hex in a 200 x 231 box
const HEX = "100,4 196,59.5 196,171.5 100,227 4,171.5 4,59.5";

function hexBody(id) {
  const n = byId[id];
  const col = n.section ? colourOf[n.section] : CONDUCTOR;
  const motif = (n.motif ? motifs[n.motif] : CONDUCTOR_MOTIF).replace(/'C'/g, `'${col}'`).replace(/fill='S'/g, `fill='${FACE}'`);
  const size = Math.min(34, 160 / (0.6 * id.length));
  return `<polygon class="hx-face" points="${HEX}" fill="${FACE}" stroke="${col}" stroke-width="7" stroke-linejoin="round"/>` +
    `<svg x="52" y="24" width="96" height="104" viewBox="44 34 72 78" color="${LIGHT}">${motif}</svg>` +
    `<text x="100" y="162" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="${size.toFixed(1)}" fill="${tint(col)}">${id}</text>`;
}

/**
 * The roster as one SVG string: rows of 7, 6 and 7, the middle row half a hex in.
 * @param {{ base?: string }} opts base is the site root for the links.
 */
export function renderHexRoster(opts = {}) {
  const base = (opts.base ?? "/").replace(/\/$/, "");
  const ROWS = [ORDER.slice(0, 7), ORDER.slice(7, 13), ORDER.slice(13)];
  const DX = 212, DY = 184;
  const W = 7 * DX, H = 231 + DY * (ROWS.length - 1);
  const cells = [];
  ROWS.forEach((row, r) => row.forEach((id, c) => {
    const x = c * DX + (r === 1 ? DX / 2 : 0) + (DX - 200) / 2;
    const n = byId[id];
    const what = n.section ? labelOf[n.section] : "The connector";
    cells.push(`<a class="hx" href="${base}/members/#map-${encodeURIComponent(id)}" aria-label="${esc(`${id}: ${what}. ${n.purpose}`)}">` +
      `<title>${esc(`${id} · ${what}\n${n.purpose}`)}</title><g transform="translate(${x},${r * DY})">${hexBody(id)}</g></a>`);
  }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="hx-roster" role="group" ` +
    `aria-label="The ${ORDER.length} packages of the orchestra, one hexagon each, coloured by role">${cells.join("")}</svg>`;
}

/** Sections with the packages in each, in roster order, for the legend under the roster. */
export const rosterLegend = [
  ...sections.map((s) => ({ id: s.id, label: s.label, color: s.color,
    members: ORDER.filter((id) => byId[id].section === s.id) })),
  { id: "centre", label: "At the centre", color: CONDUCTOR, members: ["conductoR"] },
];
