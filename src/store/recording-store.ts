import { create } from "zustand";
import { CASES, timeCase } from "@/data/cases";
import type { CaseId, Reveal } from "@/data/types";
import { type ConsultSource, type LiveLine, type Summary, applyReveal, emptySummary } from "@/lib/consult";
import type { DraftInput } from "@/lib/generate-note";
import { useDemo } from "./demo-store";
import { toast, useUi } from "./ui-store";

export type RecStatus = "idle" | "recording" | "paused";
export type SummaryKey = keyof Summary;
export type FlashKey = keyof Reveal;

/** A script line that has started typing. */
export interface RecLine extends LiveLine {
  /** Index in the case script. */
  index: number;
  words: number;
  shown: number;
  done: boolean;
}

export interface RecCode {
  code: string;
  /** ms */
  addedAt: number;
}

interface RecordingState {
  status: RecStatus;
  caseId: CaseId | null;
  mrn: string | null;
  /** Seconds recorded, in script time. */
  t: number;
  /** ms */
  startedAt: number;
  lines: RecLine[];
  summary: Summary;
  /** The finished lines that set each summary key. */
  evidence: Partial<Record<SummaryKey, RecLine[]>>;
  codes: RecCode[];
  clinicianNotes: LiveLine[];
  /** The script has finished playing. */
  captured: boolean;
  /** An existing "In Progress" note for this patient, if any. */
  noteId: string | null;
  /** Last change time (ms) per revealed key. */
  flash: Partial<Record<FlashKey, number>>;
  openRows: Set<SummaryKey>;

  start: (caseId: CaseId, mrn: string) => void;
  togglePause: () => void;
  discard: () => void;
  /** Back to idle without a toast, after the note is drafted. */
  reset: () => void;
  addClinicianNote: (text: string) => void;
  toggleRow: (key: SummaryKey) => void;
  /** Advance the playback by `dt` seconds of script time. Called by the ticker. */
  tick: (dt: number) => void;
}

const idle = () => ({
  status: "idle" as RecStatus,
  caseId: null,
  mrn: null,
  t: 0,
  startedAt: 0,
  lines: [],
  summary: emptySummary(),
  evidence: {},
  codes: [],
  clinicianNotes: [],
  captured: false,
  noteId: null,
  flash: {},
  openRows: new Set<SummaryKey>(),
});

/** Timed scripts are computed once per case. */
const timed = Object.fromEntries(
  (Object.keys(CASES) as CaseId[]).map((id) => [id, timeCase(CASES[id])]),
) as Record<CaseId, ReturnType<typeof timeCase>>;

export const caseTotal = (id: CaseId) => timed[id].total;

const patientName = (mrn: string | null) => (mrn && useDemo.getState().patientByMrn(mrn)?.name) || "patient";

const SUMMARY_KEYS: SummaryKey[] = ["sym", "dx", "med", "plan", "all", "vit"];

/** The single live recording session, shared by the Dashboard and the Consultation page. Not persisted. */
export const useRecording = create<RecordingState>((set, get) => ({
  ...idle(),

  start: (caseId, mrn) => {
    const inProgress = useDemo.getState().notes.find((n) => n.mrn === mrn && n.status === "In Progress");
    set({ ...idle(), status: "recording", caseId, mrn, startedAt: Date.now(), noteId: inProgress?.id ?? null });
    toast(`Recording started · ${patientName(mrn)}`, "info");
  },

  togglePause: () => {
    const { status } = get();
    if (status === "recording") {
      set({ status: "paused" });
      toast("Recording paused", "info");
    } else if (status === "paused") {
      set({ status: "recording" });
      toast("Recording resumed", "info");
    }
  },

  discard: () => {
    const name = patientName(get().mrn);
    set(idle());
    toast(`Recording for ${name} discarded`, "warn");
  },

  reset: () => set(idle()),

  addClinicianNote: (text) => {
    const { status, startedAt, t, clinicianNotes } = get();
    if (status === "idle" || !text.trim()) return;
    const note: LiveLine = { id: `n${clinicianNotes.length}`, speaker: "N", text: text.trim(), ts: new Date(startedAt + t * 1000).toISOString() };
    set({ clinicianNotes: [...clinicianNotes, note] });
  },

  toggleRow: (key) =>
    set((s) => {
      const openRows = new Set(s.openRows);
      if (!openRows.delete(key)) openRows.add(key);
      return { openRows };
    }),

  tick: (dt) => {
    const s = get();
    if (s.status !== "recording" || !s.caseId) return;
    const { lines: script, total } = timed[s.caseId];
    const t = s.t + dt;
    const now = Date.now();

    let { summary, evidence, codes, flash } = s;
    let lines = s.lines;
    let changed = false;

    script.forEach((l, i) => {
      if (t < l.at) return;
      const prev = lines.find((x) => x.index === i);
      if (prev?.done) return;
      const words = l.text.split(" ").length;
      const shown = Math.min(words, Math.max(1, Math.ceil(((t - l.at) / l.dur) * words)));
      const line: RecLine = {
        id: `s${i}`,
        index: i,
        speaker: l.speaker,
        text: l.text,
        ts: new Date(s.startedAt + l.at * 1000).toISOString(),
        words,
        shown,
        done: shown >= words,
      };
      if (prev && prev.shown === line.shown) return;
      lines = prev ? lines.map((x) => (x === prev ? line : x)) : [...lines, line];
      changed = true;

      if (line.done && l.reveal) {
        const r = l.reveal;
        summary = applyReveal(summary, r);
        evidence = { ...evidence };
        for (const k of SUMMARY_KEYS) if (r[k]) evidence[k] = [...(evidence[k] ?? []), line];
        const fresh = (r.code ?? []).filter((c) => !codes.some((x) => x.code === c));
        if (fresh.length) codes = [...codes, ...fresh.map((code) => ({ code, addedAt: now }))];
        flash = { ...flash };
        for (const k of Object.keys(r) as FlashKey[]) flash[k] = now;
      }
    });

    const captured = s.captured || t > total + 0.6;
    set(changed ? { t, lines, summary, evidence, codes, flash, captured } : { t, captured });

    if (captured && !s.captured) {
      toast("Conversation captured. Review the summary, then click Finish & Generate Note.", "info");
    }
  },
}));

/** Someone is mid-sentence: the waveform reacts to speech. */
export const isSpeaking = (s: Pick<RecordingState, "status" | "lines">) =>
  s.status === "recording" && s.lines.some((l) => !l.done);

/** Script lines with the clinician notes merged in, in time order. */
export const mergeTranscript = (lines: LiveLine[], notes: LiveLine[]) =>
  [...lines, ...notes].sort((a, b) => a.ts.localeCompare(b.ts));

/** The live session for the transcript, summary and codes cards. */
export function liveSource(s: Pick<RecordingState, "mrn" | "lines" | "clinicianNotes" | "summary" | "codes">): ConsultSource {
  return {
    mrn: s.mrn ?? "",
    lines: mergeTranscript(s.lines, s.clinicianNotes),
    summary: s.summary,
    codes: s.codes.map((c) => c.code),
    live: true,
  };
}

/** Mic button and Space key: idle opens the case picker, otherwise pause or resume. */
export function micAction() {
  const { status, togglePause } = useRecording.getState();
  if (status === "idle") useUi.getState().openModal({ name: "picker" });
  else togglePause();
}

/** "Add Note" button and the N key. */
export function openAddNote() {
  if (useRecording.getState().status !== "idle") useUi.getState().openModal({ name: "addNote" });
}

/** "End Consultation" button. */
export function openEndConsult() {
  if (useRecording.getState().status !== "idle") useUi.getState().openModal({ name: "endConsult" });
}

/** "Finish & Generate Note" (page, End modal) and the F key: pauses, then opens the generating modal. */
export function finishConsultation() {
  const { status, lines, clinicianNotes, caseId, mrn, startedAt, t, noteId } = useRecording.getState();
  if (status === "idle" || !caseId || !mrn) return;
  if (!lines.some((l) => l.done)) {
    toast("Let the conversation run a little longer first.", "warn");
    return;
  }
  useRecording.setState({ status: "paused" });
  const draft: DraftInput = {
    caseId,
    mrn,
    startedAt,
    t,
    transcript: mergeTranscript(lines, clinicianNotes).map(({ speaker, text, ts }) => ({ speaker, text, ts })),
    clinicianNotes: clinicianNotes.map((n) => n.text),
    noteId,
  };
  useUi.getState().openModal({ name: "generating", draft });
}
