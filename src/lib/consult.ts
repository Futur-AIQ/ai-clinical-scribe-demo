import { CASES, DASHBOARD_IDLE_CODES, timeCase } from "@/data";
import type { Reveal, Speaker } from "@/data/types";

/** The AI summary as it builds up during a visit. */
export interface Summary {
  sym: string[];
  dx: string;
  med: string[];
  plan: string[];
  all: string;
  vit: string[];
}

export const emptySummary = (): Summary => ({ sym: [], dx: "", med: [], plan: [], all: "", vit: [] });

/** Adds what a finished script line reveals. List items are added once; dx and allergies are replaced. */
export function applyReveal(sum: Summary, r: Reveal): Summary {
  const add = (list: string[], items?: string[]) => (items ? [...list, ...items.filter((v) => !list.includes(v))] : list);
  return {
    sym: add(sum.sym, r.sym),
    dx: r.dx ?? sum.dx,
    med: add(sum.med, r.med),
    plan: add(sum.plan, r.plan),
    all: r.all ?? sum.all,
    vit: add(sum.vit, r.vit),
  };
}

/** One transcript row. While live, `shown` is the number of words typed so far. */
export interface LiveLine {
  /** Stable row key: "s{index}" for script lines, "n{index}" for clinician notes. */
  id?: string;
  speaker: Speaker;
  text: string;
  /** ISO */
  ts: string;
  shown?: number;
}

/** Everything the transcript, summary and codes cards show for one visit. */
export interface ConsultSource {
  mrn: string;
  lines: LiveLine[];
  summary: Summary;
  codes: string[];
  live: boolean;
}

/**
 * The idle dashboard: the last session (Emily Davis, fever case). Its first 4 lines,
 * the full summary and the codes in screenshot order. `start` is note n1003's date.
 */
export function idleSource(start: Date): ConsultSource {
  const c = CASES.fever;
  const lines = timeCase(c).lines;
  return {
    mrn: c.patientMrn,
    lines: lines.slice(0, 4).map((l) => ({
      speaker: l.speaker,
      text: l.text,
      ts: new Date(start.getTime() + 15000 + l.at * 1000).toISOString(),
    })),
    summary: lines.reduce((s, l) => (l.reveal ? applyReveal(s, l.reveal) : s), emptySummary()),
    codes: DASHBOARD_IDLE_CODES,
    live: false,
  };
}
