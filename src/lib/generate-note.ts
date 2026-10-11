import { CASES } from "@/data/cases";
import type { CaseId, Note, Soap, TranscriptLine } from "@/data/types";
import { fmtDuration } from "@/data/dates";
import { useDemo } from "@/store/demo-store";

/** A snapshot of the finished recording, taken when Finish is clicked. */
export interface DraftInput {
  caseId: CaseId;
  mrn: string;
  /** ms */
  startedAt: number;
  /** Seconds recorded. */
  t: number;
  /** Every started line plus the clinician notes, in time order. */
  transcript: TranscriptLine[];
  clinicianNotes: string[];
  /** The patient's In Progress note, updated instead of creating a new one. */
  noteId: string | null;
}

/** The four steps of the generating modal, 650ms each. */
export const GENERATE_STEPS = (format: string) => [
  "Structuring the transcript",
  "Extracting findings and medications",
  "Matching ICD-10 and CPT codes",
  `Drafting the ${format} note`,
];

/** Writes the AI draft to the store, updates the patient and returns the note id. */
export function commitDraft(d: DraftInput): string {
  const store = useDemo.getState();
  const c = CASES[d.caseId];
  const p = store.patientByMrn(d.mrn);
  const fill = (text: string) =>
    p ? text.replace("{AGE}", String(p.age)).replace("{SEX}", p.sex.toLowerCase()) : text;
  const soap: Soap = { s: fill(c.soap.s), o: fill(c.soap.o), a: fill(c.soap.a), p: fill(c.soap.p) };

  const now = new Date().toISOString();
  const start = new Date(d.startedAt).toISOString();
  const duration = fmtDuration(d.t);
  const audit = [
    { t: start, action: "Recording started" },
    { t: now, action: `Transcript captured (${d.transcript.length} segments)` },
    { t: now, action: "AI note drafted" },
  ];

  const existing = d.noteId ? store.noteById(d.noteId) : undefined;
  const note: Note = {
    id: existing?.id ?? `n${Date.now()}`,
    mrn: d.mrn,
    date: start,
    duration,
    status: "Draft",
    aiDraft: true,
    dx: c.dxShort,
    synced: false,
    soap,
    codes: c.finalCodes.map((x) => ({ ...x, included: true })),
    transcript: d.transcript,
    clinicianNotes: d.clinicianNotes,
    edited: [],
    audit: [...(existing?.audit ?? []), ...audit],
  };
  store.upsertNote(note);

  if (p) {
    store.updatePatient(d.mrn, {
      lastVisit: now,
      visits: p.visits + (existing ? 0 : 1),
      status: "Active",
      lastDuration: duration,
    });
  }
  return note.id;
}
