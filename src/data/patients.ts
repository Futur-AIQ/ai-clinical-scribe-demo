import type { Patient } from "./types";
import { clinicDay, rng } from "./dates";

// 7 named patients from the screenshots + 1,241 generated = 1,248 total (matches the Patients KPI).
// Build on the client: const patients = buildPatients(new Date());

interface SeedPatient extends Omit<Patient, "lastVisit"> {
  last: [dayOffset: number, hour: number, minute: number];
}

export const SEED_PATIENTS: SeedPatient[] = [
  { name: "Sarah Johnson", age: 34, sex: "Female", mrn: "12345678", phone: "(555) 123-4567", visits: 6, status: "Active", last: [0, 10, 30], lastDuration: "14:32", conditions: ["Seasonal allergies"], allergies: "No known drug allergies", insurance: "Aetna PPO" },
  { name: "Robert Williams", age: 58, sex: "Male", mrn: "87654321", phone: "(555) 987-6543", visits: 8, status: "Active", last: [0, 9, 15], lastDuration: "22:18", conditions: ["Type 2 diabetes", "Hyperlipidemia"], allergies: "Sulfa drugs", insurance: "Medicare Part B" },
  { name: "Emily Davis", age: 28, sex: "Female", mrn: "11223344", phone: "(555) 234-5678", visits: 3, status: "Active", last: [1, 16, 45], lastDuration: "18:45", conditions: [], allergies: "No known drug allergies", insurance: "Blue Cross Blue Shield" },
  { name: "Michael Brown", age: 45, sex: "Male", mrn: "99887766", phone: "(555) 345-6789", visits: 5, status: "Active", last: [1, 11, 20], lastDuration: "12:05", conditions: [], allergies: "Penicillin", insurance: "UnitedHealthcare" },
  { name: "Jessica Taylor", age: 32, sex: "Female", mrn: "66778899", phone: "(555) 456-7890", visits: 4, status: "Active", last: [2, 15, 30], lastDuration: "15:20", conditions: ["Migraine"], allergies: "No known drug allergies", insurance: "Cigna" },
  { name: "David Wilson", age: 60, sex: "Male", mrn: "55443322", phone: "(555) 567-8901", visits: 7, status: "Inactive", last: [2, 13, 10], lastDuration: "20:30", conditions: ["Former smoker"], allergies: "No known drug allergies", insurance: "Humana Medicare" },
  { name: "Lisa Anderson", age: 39, sex: "Female", mrn: "44332211", phone: "(555) 678-9012", visits: 2, status: "Active", last: [3, 10, 0], lastDuration: "10:15", conditions: [], allergies: "No known drug allergies", insurance: "Aetna HMO" },
];

const FN_F = ["Olivia", "Emma", "Ava", "Sophia", "Mia", "Isabella", "Grace", "Chloe", "Hannah", "Natalie", "Rachel", "Megan", "Laura", "Anna", "Nora", "Zoe", "Maya", "Priya", "Aisha", "Fatima", "Leah", "Claire", "Diana", "Rosa", "Ella", "Julia"];
const FN_M = ["James", "John", "Daniel", "Matthew", "Anthony", "Mark", "Steven", "Paul", "Kevin", "Brian", "Jason", "Ryan", "Eric", "Jacob", "Ethan", "Noah", "Omar", "Raj", "Carlos", "Luis", "Henry", "Samuel", "Peter", "Victor", "Adam", "Leo"];
const LN = ["Smith", "Miller", "Garcia", "Martinez", "Lee", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Hill", "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans", "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart", "Morris", "Murphy", "Cook", "Rogers", "Patel", "Khan", "Nguyen", "Kim", "Reed", "Bennett", "Hughes"];
const INS = ["Aetna PPO", "Cigna", "UnitedHealthcare", "Blue Cross Blue Shield", "Medicaid", "Kaiser"];
const p2 = (n: number) => String(n).padStart(2, "0");

/** Reasons used for older generated visits on the patient detail page. */
export const VISIT_REASONS = ["Annual physical", "Follow-up visit", "Upper respiratory infection", "Hypertension check", "Medication review", "Low back pain", "Allergy symptoms", "Lab results review", "Flu vaccination", "Skin rash", "Sinus congestion", "Sprained ankle"];

export function buildPatients(now = new Date()): Patient[] {
  const seeded: Patient[] = SEED_PATIENTS.map(({ last, ...p }) => ({
    ...p,
    lastVisit: clinicDay(last[0], last[1], last[2], now).toISOString(),
  }));

  const r = rng(20261011);
  const used = new Set(seeded.map((p) => p.mrn));
  const base = now.getHours() < 12 ? 1 : 0;
  const generated: Patient[] = [];
  for (let i = 0; i < 1241; i++) {
    const female = r() < 0.52;
    const first = (female ? FN_F : FN_M)[Math.floor(r() * 26)];
    const last = LN[Math.floor(r() * LN.length)];
    let mrn: string;
    do mrn = String(10000000 + Math.floor(r() * 89999999));
    while (used.has(mrn));
    used.add(mrn);
    const offset = 3 + i * 0.34 + r() * 0.3;
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(offset) - base);
    d.setHours(8 + Math.floor(r() * 9), [0, 15, 30, 45][Math.floor(r() * 4)], 0, 0);
    const roll = r();
    const status = i > 300 && roll < 0.05 ? "Archived" : roll < 0.13 ? "Inactive" : "Active";
    const visits = 1 + Math.floor(3.4 * r() * r());
    const dm = 8 + Math.floor(r() * 17), ds = Math.floor(r() * 60);
    generated.push({
      name: `${first} ${last}`,
      age: 4 + Math.floor(r() * 84),
      sex: female ? "Female" : "Male",
      mrn,
      phone: `(555) ${100 + Math.floor(r() * 899)}-${1000 + Math.floor(r() * 8999)}`,
      visits,
      status,
      lastVisit: d.toISOString(),
      lastDuration: `${p2(dm)}:${p2(ds)}`,
      conditions: [],
      allergies: "No known drug allergies",
      insurance: INS[Math.floor(r() * INS.length)],
      isNew: i < 172 && i % 2 === 0, // exactly 86 new patients
      generated: true,
    });
  }
  return [...seeded, ...generated].sort((a, b) => +new Date(b.lastVisit) - +new Date(a.lastVisit));
}

/** Older visit history for a patient (deterministic per MRN). Newest first. */
export function generatedVisits(p: Patient) {
  const r = rng(Number(p.mrn.slice(0, 7)));
  const out: { date: Date; reason: string; duration: string }[] = [];
  let d = new Date(p.lastVisit);
  for (let i = 0; i < p.visits; i++) {
    out.push({ date: new Date(d), reason: VISIT_REASONS[Math.floor(r() * VISIT_REASONS.length)], duration: `${p2(8 + Math.floor(r() * 16))}:${p2(Math.floor(r() * 60))}` });
    d = new Date(d.getTime() - (30 + Math.floor(r() * 120)) * 864e5);
  }
  return out;
}

/** "sarah.johnson@email.com" */
export const patientEmail = (p: Patient) => `${p.name.toLowerCase().replace(/ /g, ".")}@email.com`;

/** Avatar colors: [background, text]. Pick by a hash of the name. */
export const AVATAR_PALETTE: [string, string][] = [
  ["#e8efff", "#2450c8"], ["#e6f6ee", "#0d7a4f"], ["#f2edff", "#6a3fd1"], ["#fff1e3", "#b05e00"],
  ["#ffecef", "#c0304a"], ["#e5f6f8", "#0b7380"], ["#f3f0e8", "#6e5a2c"],
];
export function avatarColors(name: string): [string, string] {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}
export const initials = (name: string) =>
  name.replace(/^Dr\.\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");
