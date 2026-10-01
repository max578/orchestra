// The Concord of Long Fields — the delegates layer.
//
// A NARRATIVE DEVICE for teaching, confined to the site (never in any
// GRDC/AAGI deliverable): far from here, a compact of peoples formed around
// one sentence — *to benefit as many living beings as possible, for as
// long as possible*. Each people walked its own road to a mathematical
// frontier and sends its foremost specialist in that frontier as a delegate.
// Every delegate knows the others' knowledge; none acts on an unchecked
// fact. The delegates are the released members; the science is on the
// member pages. Peoples and names are invented (no real-world culture is
// referenced); delegates are they/them throughout.
//
// One motif per people: the geometry IS the method. Rendered by
// components/Avatar.astro.

export interface Delegate {
  id: string;          // member package id (join key)
  people: string;      // the people and their world, one breath
  frontier: string;    // their mathematical frontier = the member's method family
  name: string;        // the delegate (invented, gender-neutral, they/them)
  title: string;       // their office
  creed: string;       // the refusal rule, spoken as law
  motif: string;       // Avatar.astro renderer key
}

export const delegates: Delegate[] = [
  {
    id: "flexyBayes",
    people:
      "The Chorum, of a canyon world where every call returns as three echoes; their parliament is three assemblies that deliberate apart.",
    frontier: "Hierarchical belief held with width; agreement across independent engines of inference.",
    name: "Veya Chorum-Ashe",
    title: "Speaker of the Three Assemblies",
    creed: "One voice is an opinion; three in accord are a law; three in discord are a question.",
    motif: "echoes",
  },
  {
    id: "PESTO",
    people:
      "The Delta-Readers of Oruun, of a braided-river world; they learned to infer the unseen mountain from the shape of its delta.",
    frontier: "Inverse problems under an ensemble of possible mountains.",
    name: "Tesh Oranu",
    title: "Reader of the Ninth Braid",
    creed: "I will not name the mountain from one braid.",
    motif: "braids",
  },
  {
    id: "kernR",
    people:
      "The Vell, whose language has no nouns, only relations; two things are equal exactly when no witness can tell them apart.",
    frontier: "Measuring how far two sets of observations differ; the witness that lights up where two worlds disagree.",
    name: "Ione Vell-Tarra",
    title: "Witness of Discrepancies",
    creed: "Where I cannot see a difference, I say so — and I say how many eyes I had.",
    motif: "discs",
  },
  {
    id: "apsimR",
    people:
      "The Worldwrights of Sember, who grow a whole season in glass before they sow one seed in soil.",
    frontier: "Mechanistic simulation; the causal test-bench where the truth is planted and known.",
    name: "Corin Sember-Yal",
    title: "Keeper of the Bottled Seasons",
    creed: "Every promise I make has already failed a thousand times in glass.",
    motif: "vessel",
  },
  {
    id: "quorum",
    people:
      "The Understudies of Lirren, apprentice mimics who learn a master's hand so a performance can be rehearsed a thousand times cheaply — and who convene the masters to hear where they disagree.",
    frontier: "Fast imitation of a slow model, with its error stated; a quorum of methods before an answer is carried.",
    name: "Pell Lirren-Sa",
    title: "First Understudy",
    creed: "I am not the world; I am its fastest faithful imitation, and I say where I differ.",
    motif: "mirror",
  },
  {
    id: "terroir",
    people:
      "The Cartouche, cartographer-notaries; every mark on their maps carries the surveyor's seal and date, and an unsealed mark is scraped off by law.",
    frontier: "Provenance-stamped measurement; the registry of where every number came from.",
    name: "Amance Carto-Veil",
    title: "Notary of Grounds",
    creed: "A measurement without its seal is a rumour.",
    motif: "seal",
  },
  {
    id: "masque",
    people:
      "The Envoys of Vale-Behind-Glass, who send delegates wearing masks faithful in structure, never in face; treaties hold because the mask moves exactly as the face moves.",
    frontier: "Structure-preserving disguise; analysis on the mask that transfers to the face.",
    name: "Sile Vale-Imre",
    title: "Envoy of the True Mask",
    creed: "You may study my mask as if it were my face; you may never see my face.",
    motif: "mask",
  },
  {
    id: "decideR",
    people:
      "The Ledger-Keepers of Sarn, whose law forbids acting on an unchecked fact; every loss their people ever suffered is carved in a public table.",
    frontier: "Expected loss under stated ignorance; the price of one more test.",
    name: "Maru Sarn-Idris",
    title: "Keeper of the Loss Table",
    creed: "If the fact is unverified, the answer is no rate.",
    motif: "table",
  },
  {
    id: "grainPlan",
    people:
      "The Tablewrights of Homefield, who set the table between the council and the field; nothing is served whose provenance the kitchen refused.",
    frontier: "Translation of verdicts into work a grower can do tomorrow morning.",
    name: "Bren Homefield-Ora",
    title: "Setter of Tables",
    creed: "Nothing reaches the table that the kitchen would not sign.",
    motif: "hearth",
  },
  {
    id: "gpfield",
    people:
      "The Continuum Weavers of Ess, who see land as one woven cloth and can re-weave a point into a parcel — saying, each time, how far the weave may stretch.",
    frontier: "Random fields and the step from a point to a parcel; the uncertainty a parcel truly carries.",
    name: "Nia Essa-Loom",
    title: "Weaver of Supports",
    creed: "Ask me for a field and I will tell you the thread — and where the cloth will not hold.",
    motif: "weave",
  },
  {
    id: "kalmix",
    people:
      "The Tidewrights of Maren, of a tidal world; they read the true water beneath the chop, and they mark in stone the day the tide turned.",
    frontier: "The hidden state beneath noisy readings; the turning point declared with its evidence.",
    name: "Osk Maren-Tay",
    title: "Reader of the Underwater",
    creed: "The surface lies politely; I answer for the current, and I mark the day it turned.",
    motif: "tide",
  },
  {
    id: "koine",
    people:
      "The Second-Tongue of Aveny, for whom a truth counts only when it survives translation into a second, unrelated language.",
    frontier: "The independent fourth opinion; corroboration as a gate, not a courtesy.",
    name: "Rho Aveny-Kai",
    title: "Translator of Verdicts",
    creed: "Say it again in my language; if it breaks in translation, it was not yet true.",
    motif: "tongues",
  },
  {
    id: "proxymix",
    people:
      "The Sumfolk of Alloy, who keep memory as a weighted blend of a few declared shapes, and who own the algebra of blending.",
    frontier: "The algebra of blends; compression with the cost of compression stated.",
    name: "Etta Alloy-Nine",
    title: "Keeper of the Nine Shapes",
    creed: "I remember everything as a few declared shapes, and I can tell you what the blending cost.",
    motif: "blend",
  },
  {
    id: "optimix",
    people:
      "The Wayfarers of Skell, who race many routes under one fair fuel budget and honour the race by publishing the budget.",
    frontier: "Search routed to the right engine; the best point found, with the map of other maybe-bests admitted.",
    name: "Juno Skell-Aris",
    title: "Marshal of Races",
    creed: "I name the best path I found, the fuel it took, and whether other summits may stand unclimbed.",
    motif: "paths",
  },
  {
    id: "cdzoo",
    people:
      "The Arrowsmiths of Quill, sixteen schools who draw the arrows of cause; their council recommends and explains, and never decrees — no one alive has seen the true arrows.",
    frontier: "Causal structure from observation; consensus with its confidence and its dissent on the record.",
    name: "Fen Quill-Ondre",
    title: "Convener of the Sixteen Schools",
    creed: "The record alone shows no arrow flying; I tell you which schools agree, why, and what that is worth.",
    motif: "arrows",
  },
];

export const delegateById = new Map(delegates.map((d) => [d.id, d]));

// The compact, spoken once (used by the gallery page header).
export const concordCharter =
  "To benefit as many living beings as possible, for as long as possible.";
