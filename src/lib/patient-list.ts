import { patientEmail } from "@/data/patients";
import type { Patient } from "@/data/types";

export type PatientTab = "all" | "recent" | "frequent" | "new" | "archived";
export type StatusFilter = "any" | "Active" | "Inactive";
export type SexFilter = "any" | "Female" | "Male";
export type AgeFilter = "any" | "child" | "adult" | "senior";

export interface PatientFilters {
  status: StatusFilter;
  sex: SexFilter;
  age: AgeFilter;
}

export const NO_FILTERS: PatientFilters = { status: "any", sex: "any", age: "any" };

export const hasFilters = (f: PatientFilters) => f.status !== "any" || f.sex !== "any" || f.age !== "any";

/** Lower-cased text a search query is matched against, built once per patients array. */
export interface SearchRow {
  patient: Patient;
  name: string;
  phone: string;
  email: string;
}

export const searchRows = (patients: Patient[]): SearchRow[] =>
  patients.map((p) => ({ patient: p, name: p.name.toLowerCase(), phone: p.phone.replace(/\D/g, ""), email: patientEmail(p) }));

const DAY = 864e5;

/**
 * The prototype's filteredP(). Archived patients only show on the Archived tab.
 * The query matches the name, MRN digits, phone digits and the generated email.
 */
export function filterPatients(rows: SearchRow[], tab: PatientTab, f: PatientFilters, query: string): Patient[] {
  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");
  const now = Date.now();
  const out: Patient[] = [];
  for (const r of rows) {
    const p = r.patient;
    if ((tab === "archived") !== (p.status === "Archived")) continue;
    if (tab === "recent" && now - +new Date(p.lastVisit) > 30 * DAY) continue;
    if (tab === "frequent" && p.visits < 4) continue;
    if (tab === "new" && !p.isNew) continue;
    if (f.status !== "any" && p.status !== f.status) continue;
    if (f.sex !== "any" && p.sex !== f.sex) continue;
    if (f.age === "child" && p.age >= 18) continue;
    if (f.age === "adult" && (p.age < 18 || p.age >= 65)) continue;
    if (f.age === "senior" && p.age < 65) continue;
    if (
      q &&
      !(
        r.name.includes(q) ||
        (digits && (p.mrn.includes(digits) || r.phone.includes(digits))) ||
        r.email.includes(q)
      )
    )
      continue;
    out.push(p);
  }
  return out;
}
