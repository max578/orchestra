// The study buttons above the introduction's map. Each study's map and steps are drawn at build time; the first is
// shown and the others are hidden, so the page without JavaScript shows the first study. Here the buttons are revealed,
// a choice swaps the panel, and #study=<id> opens a study directly (and is kept in the address on each choice).
export function initStudyPicker() {
  const root = document.querySelector<HTMLElement>("[data-study-picker]");
  if (!root) return;
  const bar = root.querySelector<HTMLElement>("[data-study-bar]");
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-study]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-study-panel]")];
  if (!bar || !buttons.length || !panels.length) return;
  const ids = buttons.map((b) => b.dataset.study ?? "");

  const show = (id: string, keepHash = false) => {
    if (!ids.includes(id)) id = ids[0];
    for (const b of buttons) b.setAttribute("aria-pressed", String(b.dataset.study === id));
    for (const p of panels) p.hidden = p.dataset.studyPanel !== id;
    if (!keepHash) history.replaceState(null, "", `#study=${id}`);
  };
  const fromHash = () => /^#study=([\w-]+)$/.exec(location.hash)?.[1];

  bar.hidden = false;
  for (const b of buttons) b.addEventListener("click", () => show(b.dataset.study ?? ids[0]));
  window.addEventListener("hashchange", () => { const id = fromHash(); if (id) show(id, true); });
  const first = fromHash();
  if (first) { show(first, true); root.scrollIntoView(); }
}
