// Interaction for the orchestra map: choose a node to light its links and
// open its panel; play the worked example; show every link; deep link with
// #map-<id>. Panel text is set with textContent only.
import { sections, nodes, edges, workedExample, formatWriters, formatReaders } from "../data/orchestraMap.mjs";

type MapNode = (typeof nodes)[number] & { similar?: string[]; similarNote?: string; status?: string; section?: string | null };

const MEMBER_PAGES = new Set(nodes.filter((n) => n.kind !== "source").map((n) => n.id));
const sectionOf = Object.fromEntries(sections.map((s) => [s.id, s]));
const byId = Object.fromEntries(nodes.map((n) => [n.id, n as MapNode]));

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

export function initOrchestraMap() {
  const root = document.querySelector<HTMLElement>("[data-om]");
  if (!root) return;
  const stage = root.querySelector<HTMLElement>("[data-om-stage]")!;
  const svg = stage.querySelector("svg")!;
  const panel = root.querySelector<HTMLElement>("[data-om-panel]")!;
  const tip = root.querySelector<HTMLElement>("[data-om-tip]")!;
  const empty = panel.innerHTML;
  const base = (root.dataset.base ?? "/").replace(/\/$/, "");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nodeEls = [...svg.querySelectorAll<SVGGElement>(".om-node")];
  const edgeEls = [...svg.querySelectorAll<SVGPathElement>(".om-edge")];
  let selected: string | null = null;
  let timers: number[] = [];

  const stopPlay = () => { timers.forEach(clearTimeout); timers = []; svg.classList.remove("is-playing");
    nodeEls.forEach((n) => { n.classList.remove("is-step"); const t = n.querySelector(".om-step"); if (t) t.textContent = ""; });
    edgeEls.forEach((e) => e.classList.remove("is-lit-score")); };

  const neighbours = (id: string) => {
    const set = new Set<string>([id]);
    for (const e of edges) { if (e.from === id) set.add(e.to); if (e.to === id) set.add(e.from); }
    if (id === "orchestraManifest") [...formatWriters, ...formatReaders].forEach((m) => set.add(m));
    if (id === "cropOrchestra") nodes.filter((n) => n.kind !== "source").forEach((n) => set.add(n.id));
    return set;
  };

  function clearSelection() {
    selected = null;
    svg.classList.remove("has-sel");
    nodeEls.forEach((n) => n.classList.remove("is-sel", "is-near"));
    edgeEls.forEach((e) => e.classList.remove("is-on"));
    panel.innerHTML = empty;
    if (location.hash.startsWith("#map-")) history.replaceState(null, "", location.pathname + location.search);
  }

  function select(id: string, opts: { scroll?: boolean } = {}) {
    if (!byId[id]) return;
    stopPlay();
    selected = id;
    const near = neighbours(id);
    svg.classList.add("has-sel");
    nodeEls.forEach((n) => {
      const nid = n.dataset.id!;
      n.classList.toggle("is-sel", nid === id);
      n.classList.toggle("is-near", nid !== id && near.has(nid));
    });
    edgeEls.forEach((e) => e.classList.toggle("is-on", e.dataset.from === id || e.dataset.to === id));
    renderPanel(id);
    history.replaceState(null, "", `#map-${encodeURIComponent(id)}`);
    if (opts.scroll && window.matchMedia("(max-width: 1000px)").matches) {
      panel.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  }

  function jump(id: string) {
    const b = el("button", "om-jump", id);
    b.type = "button";
    b.addEventListener("click", () => { select(id); svg.querySelector<SVGGElement>(`.om-node[data-id="${CSS.escape(id)}"]`)?.focus(); });
    return b;
  }

  function renderPanel(id: string) {
    const n = byId[id];
    panel.innerHTML = "";
    const close = el("button", "om-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", clearSelection);
    panel.append(close);

    const sec = n.section ? sectionOf[n.section] : null;
    const kicker = el("p", "om-kicker", sec ? sec.label
      : n.kind === "source" ? "Outside source" : n.kind === "centre" ? "The connector"
      : n.kind === "format" ? "The shared result format" : "The entry point");
    if (sec) kicker.dataset.c = sec.id;
    panel.append(kicker, el("h2", "om-title om-mono", n.id));

    const block = (title: string, ...kids: (Node | string)[]) => {
      const s = el("div", "om-block");
      s.append(el("h3", undefined, title), ...kids);
      panel.append(s);
    };

    block("What it does", el("p", undefined, n.purpose));
    if (n.kind === "source") {
      const users = edges.filter((e) => e.from === id);
      const p = el("p", undefined, "Not part of the orchestra. ");
      p.append(users.length ? "Used through " : "", ...users.flatMap((e, i) => [i ? (i === users.length - 1 ? " and " : ", ") : "", jump(e.to)]), users.length ? "." : "");
      block("Its place", p);
    } else {
      block("Its character", el("p", undefined, n.character ?? ""));
      const sim = el("div");
      if (n.similar?.length) {
        const ul = el("ul", "om-chips");
        n.similar.forEach((s) => ul.append(el("li", undefined, s)));
        sim.append(ul);
      }
      if (n.similarNote) sim.append(el("p", "om-note", n.similarNote));
      block("Similar tools", sim);
    }

    const rel = el("ul", "om-rel");
    const add = (dir: string, other: string, text: string) => {
      const li = el("li");
      li.append(el("span", "om-dir", dir), jump(other), el("span", "om-reltext", text));
      rel.append(li);
    };
    for (const e of edges) {
      if (e.from === id) add("→", e.to, e.text);
      else if (e.to === id) add("←", e.from, e.text);
    }
    if (formatWriters.includes(id)) add("→", "orchestraManifest", `${id} writes its results in the shared format.`);
    if (formatReaders.includes(id) && id !== "conductoR") add("←", "orchestraManifest", `${id} reads results in the shared format.`);
    if (id === "orchestraManifest") {
      formatWriters.forEach((m) => add("←", m, `${m} writes its results in this format.`));
      formatReaders.filter((m) => m !== "conductoR").forEach((m) => add("→", m, `${m} reads results in this format.`));
    }
    if (id === "cropOrchestra") {
      const li = el("li");
      li.append(el("span", "om-reltext", "Installs and checks every member of the orchestra."));
      rel.append(li);
    }
    if (rel.children.length) block("Works with", rel);

    if (n.status) panel.append(el("p", "om-note", n.status));
    if (MEMBER_PAGES.has(id)) {
      const a = el("a", "om-more", "Full page and installation →");
      a.href = `${base}/members/${encodeURIComponent(id)}/`;
      panel.append(a);
    }
  }

  function playExample() {
    clearSelection();
    svg.classList.add("has-sel", "is-playing");
    panel.innerHTML = "";
    panel.append(el("p", "om-kicker", "Worked example (Study A0)"), el("h2", "om-title", "From weather and soil records to a nitrogen plan"));
    const ol = el("ol", "om-steps");
    workedExample.forEach((s) => { const li = el("li"); li.append(jump(s.id), el("span", undefined, " " + s.text)); ol.append(li); });
    panel.append(ol);
    const a = el("a", "om-more", "The full study →");
    a.href = `${base}/a0/`;
    panel.append(a);
    const stepMs = reduced ? 0 : 900;
    workedExample.forEach((s, i) => {
      timers.push(window.setTimeout(() => {
        const n = svg.querySelector<SVGGElement>(`.om-node[data-id="${CSS.escape(s.id)}"]`);
        n?.classList.add("is-step");
        const t = n?.querySelector(".om-step"); if (t) t.textContent = String(i + 1);
        ol.children[i]?.classList.add("is-on");
        if (i > 0) edgeEls.find((e) => e.dataset.from === workedExample[i - 1].id && e.dataset.to === s.id)?.classList.add("is-lit-score");
      }, i * stepMs));
    });
  }

  nodeEls.forEach((n) => {
    const id = n.dataset.id!;
    n.addEventListener("click", (ev) => { ev.stopPropagation(); selected === id ? clearSelection() : select(id, { scroll: true }); });
    n.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(id, { scroll: true }); }
    });
    n.addEventListener("pointerenter", () => {
      if (!matchMedia("(hover: hover)").matches) return;
      tip.textContent = "";
      tip.append(el("b", undefined, id), el("span", undefined, byId[id].purpose));
      tip.classList.add("show");
    });
    n.addEventListener("pointermove", (ev) => {
      const r = root.getBoundingClientRect();
      tip.style.setProperty("--tx", `${ev.clientX - r.left + 14}px`);
      tip.style.setProperty("--ty", `${ev.clientY - r.top + 14}px`);
    });
    n.addEventListener("pointerleave", () => tip.classList.remove("show"));
  });
  svg.addEventListener("click", () => { if (selected) clearSelection(); });
  document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && (selected || timers.length)) { stopPlay(); clearSelection(); } });

  root.querySelector("[data-om-play]")?.addEventListener("click", playExample);
  const allBtn = root.querySelector<HTMLButtonElement>("[data-om-all]");
  allBtn?.addEventListener("click", () => {
    const on = svg.classList.toggle("show-all");
    allBtn.setAttribute("aria-pressed", String(on));
    allBtn.textContent = on ? "Hide links" : "Show all links";
  });

  const m = location.hash.match(/^#map-(.+)$/);
  if (m) select(decodeURIComponent(m[1]));
}
