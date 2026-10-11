import type { Integration, Template, TeamMember } from "./types";
import { DOW, fmtDateShort, lastNDays, rng } from "./dates";

// ---------- Doctor & practice ----------
export const DOCTOR = {
  name: "Dr. Sarah Johnson",
  shortName: "Sarah Johnson, MD",
  specialty: "Family Medicine",
  email: "s.johnson@healthylife.example",
  phone: "(555) 010-2244",
  npi: "1093847562",
  initials: "SJ",
};
export const PRACTICES = [
  { name: "Healthy Life Clinic", id: "124578", address: "1450 Maple Avenue, Suite 210, Springfield, IL 62704" },
  { name: "Riverside Family Practice", id: "124611", address: "88 River Road, Springfield, IL 62702" },
];
export const LANGUAGES = ["English (US)", "English (UK)", "Spanish", "French", "Arabic", "Hindi"];

// ---------- Team ----------
export const TEAM: TeamMember[] = [
  { name: "Dr. Sarah Johnson", email: "s.johnson@healthylife.example", role: "Owner", area: "Family Medicine", status: "Active", notesThisMonth: 48 },
  { name: "Dr. Arjun Mehta", email: "a.mehta@healthylife.example", role: "Physician", area: "Internal Medicine", status: "Active", notesThisMonth: 41 },
  { name: "Dr. Lena Brooks", email: "l.brooks@healthylife.example", role: "Physician", area: "Pediatrics", status: "Active", notesThisMonth: 36 },
  { name: "Maria Gonzales", email: "m.gonzales@healthylife.example", role: "Nurse Practitioner", area: "Family Medicine", status: "Active", notesThisMonth: 22 },
  { name: "Tom Becker", email: "t.becker@healthylife.example", role: "Medical Assistant", area: "Front office", status: "Active", notesThisMonth: 0 },
  { name: "Priya Nair", email: "p.nair@healthylife.example", role: "Billing Specialist", area: "Revenue cycle", status: "Active", notesThisMonth: 0 },
];

// ---------- Templates ----------
export const TEMPLATES: Template[] = [
  { id: "t1", name: "SOAP – General Visit", description: "Standard subjective, objective, assessment and plan note for primary care visits.", tags: ["Primary care", "SOAP"], sections: ["Subjective", "Objective", "Assessment", "Plan"], uses: 212, isDefault: true },
  { id: "t2", name: "Diabetes Follow-up", description: "Glycemic review with home readings, HbA1c, foot exam and medication adherence.", tags: ["Chronic care", "Endocrine"], sections: ["Interval history", "Home glucose log", "Labs", "Foot exam", "Assessment", "Plan"], uses: 64, isDefault: false },
  { id: "t3", name: "Cardiology Consult", description: "Chest pain and cardiovascular risk workup with ECG and test ordering.", tags: ["Cardiology", "Consult"], sections: ["Reason for referral", "HPI", "Risk factors", "ECG / Vitals", "Impression", "Plan"], uses: 31, isDefault: false },
  { id: "t4", name: "Pediatric Well Visit", description: "Growth, development milestones, immunizations and anticipatory guidance.", tags: ["Pediatrics"], sections: ["Growth", "Development", "Immunizations", "Exam", "Guidance"], uses: 48, isDefault: false },
  { id: "t5", name: "Telehealth Visit", description: "Remote consultation with consent statement and limited-exam documentation.", tags: ["Telehealth", "SOAP"], sections: ["Consent", "Subjective", "Observed findings", "Assessment", "Plan"], uses: 57, isDefault: false },
  { id: "t6", name: "Procedure Note", description: "Indication, consent, technique, findings and post-procedure instructions.", tags: ["Procedures"], sections: ["Indication", "Consent", "Procedure", "Findings", "Aftercare"], uses: 12, isDefault: false },
];

// ---------- Integrations ----------
export const INTEGRATIONS: Integration[] = [
  { id: "epic", name: "Epic Systems", abbr: "EP", color: "#c8102e", bg: "#fdeef0", connected: true },
  { id: "athena", name: "athenahealth", abbr: "ah", color: "#5a2d82", bg: "#f3edf9", connected: true },
  { id: "ecw", name: "eClinicalWorks", abbr: "eCW", color: "#0072bc", bg: "#e8f3fb", connected: false },
  { id: "cerner", name: "Oracle Health (Cerner)", abbr: "OH", color: "#c74634", bg: "#fdf0ed", connected: false },
  { id: "allscripts", name: "Veradigm (Allscripts)", abbr: "VA", color: "#0a7f6f", bg: "#e6f5f2", connected: false },
];
/** Integrations page "Sync Activity": [action, detail, minutesAgo] */
export const SYNC_ACTIVITY: [string, string, number][] = [
  ["Note and 3 codes pushed to Epic", "Emily Davis · encounter E-482990", 12],
  ["Patient list refreshed", "1,248 patients · 0 conflicts", 55],
  ["Note and 2 codes pushed to Epic", "Sarah Johnson · encounter E-482913", 140],
  ["Appointments imported", "18 visits for today", 260],
];

// ---------- Notifications (bell shows 3 until "Mark all as read") ----------
export const NOTIFICATIONS = [
  { icon: "file-text", tone: "purple", title: "Note ready for review", detail: "Michael Brown · low back pain draft", href: "/notes/n1004", minutesAgo: 40 },
  { icon: "refresh-cw", tone: "green", title: "Epic sync completed", detail: "Patient list refreshed, 0 conflicts", href: "/integrations", minutesAgo: 55 },
  { icon: "sparkles", tone: "blue", title: "New: Cardiology template", detail: "Chest pain consult sections are ready", href: "/templates", minutesAgo: 300 },
] as const;

// ---------- Analytics ----------
/** Dashboard "Consultation Analytics (This Week)": per-day counts for the last 7 days (sum 48). */
export const WEEK_SERIES = [5, 7, 8, 6, 5, 7, 10];
export const WEEK_STATS = [
  { label: "Consultations", value: "48", delta: "12%" },
  { label: "Avg. Duration", value: "18m 24s", delta: "8%" },
  { label: "Completion Rate", value: "92%", delta: "5%" },
  { label: "Notes Generated", value: "48", delta: "10%", warm: true }, // amber delta in the screenshot
];

export type Range = "7" | "30" | "90";
/**
 * Analytics page data for a range, with chart labels.
 * 7 days: weekday labels. 30 days: daily values summing to 156 (Sundays 1, Saturdays 3), "Oct 3" labels.
 * 90 days: 13 weekly values, "Jul 20" labels.
 */
export function analyticsFor(range: Range, now = new Date()) {
  const r = rng(77);
  const days = (n: number) => lastNDays(n, now);
  if (range === "7")
    return { cons: 48, dur: "18m 24s", comp: "92%", notes: 48, deltas: ["12%", "8%", "5%", "10%"], series: WEEK_SERIES, labels: days(7).map((d) => DOW[d.getDay()]), factor: 48 / 156, labelEvery: 1, unit: "per day" };
  if (range === "30") {
    const ds = days(30);
    const series = ds.map((d) => (d.getDay() === 0 ? 1 : d.getDay() === 6 ? 3 : 4 + Math.round(r() * 4)));
    const sum = series.reduce((a, b) => a + b, 0);
    series[series.length - 1] = Math.max(1, series[series.length - 1] + 156 - sum);
    return { cons: 156, dur: "18m 24s", comp: "92%", notes: 156, deltas: ["12%", "8%", "5%", "10%"], series, labels: ds.map(fmtDateShort), factor: 1, labelEvery: 5, unit: "per day" };
  }
  const weeks: Date[] = [];
  for (let i = 12; i >= 0; i--) { const d = new Date(now); d.setDate(d.getDate() - i * 7); weeks.push(d); }
  const series = weeks.map(() => 30 + Math.round(r() * 12));
  const sum = series.reduce((a, b) => a + b, 0);
  return { cons: sum, dur: "17m 52s", comp: "91%", notes: sum - 6, deltas: ["9%", "4%", "3%", "11%"], series, labels: weeks.map(fmtDateShort), factor: 3, labelEvery: 3, unit: "per week" };
}
/** Top diagnoses at the 30-day scale; multiply counts by `factor`. */
export const TOP_DIAGNOSES: [string, number][] = [
  ["Acute Viral Infection", 28], ["Hypertension", 22], ["Type 2 Diabetes", 18], ["Upper Respiratory Infection", 16], ["Back Pain", 14],
];
export const ENCOUNTER_TYPES: [string, number, string][] = [
  ["Office Visit", 62, "#1a5cf4"], ["Follow Up", 20, "#14b8a6"], ["Telehealth", 12, "#8b5cf6"], ["Procedure", 6, "#f08c00"],
];
export const SATISFACTION = { score: 4.7, delta: "0.3", ratings: 214 };
/** Minutes of documentation saved per AI note (Time Saved card). */
export const MINUTES_SAVED_PER_NOTE = 6.4;
export const QUALITY_BARS: [string, number][] = [
  ["AI codes accepted", 94], ["Notes approved without edits", 71], ["Synced to EMR same day", 98],
];

// ---------- Plans (Upgrade modal, Settings → Billing) ----------
export const PLANS = {
  current: { name: "Starter", price: "$149", per: "per clinician per month · billed monthly", used: 48, limit: 100, clinicians: 6, invoice: "$894.00" },
  pro: { name: "Pro", price: "$249", features: ["Unlimited AI notes", "Custom templates and specialty vocabularies", "Advanced analytics and coding audit reports", "Priority EMR sync and dedicated support", "Multi-location practices"] },
};

// ---------- Help ----------
export const FAQ: [string, string][] = [
  ["How does the AI scribe capture a visit?", "Start a consultation and the microphone records the conversation. Speech is transcribed in real time and each line is labelled as doctor or patient. The AI builds the summary and billing suggestions as the visit goes, and drafts a full note when you click Finish."],
  ["Does a note go to the EMR automatically?", "No. Every note stays a draft until a clinician reviews and approves it. Approval sends the note and the selected codes to the connected EMR and records the step in the audit trail."],
  ["Can I edit what the AI wrote?", "Yes. Click any section of the note to edit it before approval. Edited sections are marked, and approved notes can be amended later with a new audit entry."],
  ["What happens on a weak connection?", "With offline capture on, the recording continues on the device and uploads when the connection recovers. Nothing is lost if the network drops mid-visit."],
  ["Which languages are supported?", "English (US and UK), Spanish, French, Arabic and Hindi are available for transcription. Notes are written in the clinic’s chosen documentation language."],
];
export const SHORTCUTS: [string, string][] = [
  ["Space", "Start, pause or resume recording"], ["F", "Finish and generate note"], ["N", "Add a note during a visit"], ["Esc", "Close a dialog"],
];
export const SUPPORT = { email: "support@aiclinicalscribe.example", phone: "(555) 010-0199", hours: "Mon–Fri, 7 AM – 9 PM CT" };
