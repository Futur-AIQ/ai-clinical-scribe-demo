// Shared types for all demo data. Copy this folder to src/data/ in Phase 2.

export type Speaker = "D" | "P" | "N"; // Doctor, Patient, clinician Note
export type Sex = "Female" | "Male";
export type PatientStatus = "Active" | "Inactive" | "Archived";
export type NoteStatus = "Draft" | "In Progress" | "Completed";
export type CodeType = "ICD-10" | "CPT" | "CPT II";
export type CaseId = "fever" | "diabetes" | "cardio";
export type Tone = "blue" | "green" | "purple" | "amber" | "red" | "gray";

export interface Patient {
  name: string;
  age: number;
  sex: Sex;
  mrn: string; // 8 digits, shown as "MRN-12345678" or "MRN: 12345678"
  phone: string;
  visits: number;
  status: PatientStatus;
  lastVisit: string; // ISO date-time
  lastDuration: string; // "mm:ss"
  conditions: string[];
  allergies: string; // "No known drug allergies" when none
  insurance: string;
  isNew?: boolean;
  generated?: boolean;
}

/** What a finished script line adds to the live AI summary. */
export interface Reveal {
  sym?: string[]; // Key Symptoms
  dx?: string; // Probable Diagnosis ("\n" splits the ICD-10 line)
  med?: string[]; // Medications
  plan?: string[]; // Treatment Plan
  all?: string; // Allergies
  vit?: string[]; // Vitals and findings
  code?: string[]; // Billing codes suggested at this moment
}

export interface ScriptLine {
  speaker: "D" | "P";
  text: string;
  reveal?: Reveal;
}

export interface Soap {
  s: string;
  o: string;
  a: string;
  p: string;
}

export interface ConsultCase {
  id: CaseId;
  specialty: string;
  tone: Tone;
  patientMrn: string;
  reason: string;
  dxShort: string;
  lines: ScriptLine[];
  /** SOAP note drafted on Finish. {AGE} and {SEX} are replaced with the patient's values. */
  soap: Soap;
  finalCodes: { code: string; confidence: number }[];
}

export interface NoteCode {
  code: string;
  confidence: number; // 0 = added manually
  included: boolean;
}

export interface TranscriptLine {
  speaker: Speaker;
  text: string;
  ts: string; // ISO
}

export interface AuditEntry {
  t: string; // ISO
  action: string;
}

export interface Note {
  id: string;
  mrn: string;
  date: string; // ISO start of consultation
  duration: string; // "mm:ss"
  status: NoteStatus;
  aiDraft?: boolean; // true while an AI-generated note awaits approval
  dx: string; // short title, e.g. "Acute viral infection"
  synced: boolean;
  encounterId?: string; // e.g. "E-482913"
  soap: Soap;
  codes: NoteCode[];
  transcript?: TranscriptLine[];
  clinicianNotes?: string[];
  edited?: (keyof Soap)[];
  audit: AuditEntry[];
}

export interface TeamMember {
  name: string;
  email: string;
  role: string;
  area: string;
  status: "Active" | "Invited";
  notesThisMonth: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sections: string[];
  uses: number;
  isDefault: boolean;
}

export interface Integration {
  id: "epic" | "athena" | "ecw" | "cerner" | "allscripts";
  name: string;
  abbr: string;
  color: string;
  bg: string;
  connected: boolean;
}
