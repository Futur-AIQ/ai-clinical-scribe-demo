import { codeDesc, DOCTOR, fmtDate, fmtTime } from "@/data";
import type { Note, Patient } from "@/data/types";

export { copyText } from "./clipboard";

/** Plain-text export of a note, as the prototype's "Copy note text". */
export function noteText(n: Note, p: Patient, redact: boolean): string {
  const d = new Date(n.date);
  const head = redact ? `Patient: [redacted] · ${p.age} / ${p.sex}` : `Patient: ${p.name} · MRN-${p.mrn}`;
  const codes = n.codes
    .filter((c) => c.included)
    .map((c) => `${c.code} – ${codeDesc(c.code)}`)
    .join("\n");
  return [
    head,
    `Date: ${fmtDate(d)} ${fmtTime(d)}`,
    "",
    "SUBJECTIVE",
    n.soap.s,
    "",
    "OBJECTIVE",
    n.soap.o,
    "",
    "ASSESSMENT",
    n.soap.a,
    "",
    "PLAN",
    n.soap.p,
    "",
    "CODES",
    codes,
    "",
    DOCTOR.shortName,
  ].join("\n");
}
