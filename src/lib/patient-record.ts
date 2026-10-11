import { generatedVisits } from "@/data/patients";
import type { Note, NoteStatus, Patient } from "@/data/types";

/** Derived from the age and the MRN digits, as in the prototype: Robert Williams is Jul 1, 1968. */
export function dateOfBirth(p: Patient, now = new Date()): Date {
  const d = new Date(now);
  d.setFullYear(d.getFullYear() - p.age);
  d.setMonth((Number(p.mrn[2]) || 3) % 12, 1 + (Number(p.mrn.slice(3, 5)) % 27));
  return d;
}

export interface Visit {
  date: Date;
  reason: string;
  duration: string;
  status: NoteStatus;
  /** Set for visits that have an AI note. */
  noteId?: string;
}

/**
 * The patient's notes plus generated older visits, newest first. The generated list
 * drops as many visits as there are notes, so the total stays near the visit count.
 */
export function visitHistory(p: Patient, notes: Note[]): Visit[] {
  const fromNotes: Visit[] = notes.map((n) => ({
    date: new Date(n.date),
    reason: n.dx,
    duration: n.duration,
    status: n.status,
    noteId: n.id,
  }));
  const older: Visit[] = generatedVisits(p)
    .slice(notes.length)
    .map((v) => ({ ...v, status: "Completed" }));
  return [...fromNotes, ...older].sort((a, b) => +b.date - +a.date);
}
