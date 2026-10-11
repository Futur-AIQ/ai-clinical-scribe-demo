import type { CodeType } from "./types";

// Code library used for live suggestions, note review ("Add a code…") and the Billing Codes page.
// Descriptions are shortened for display, as in the screenshots.
export const CODES: Record<string, { type: CodeType; desc: string }> = {
  "B34.9": { type: "ICD-10", desc: "Viral infection, unspecified" },
  "R50.9": { type: "ICD-10", desc: "Fever, unspecified" },
  "R51.9": { type: "ICD-10", desc: "Headache, unspecified" },
  "R05.9": { type: "ICD-10", desc: "Cough, unspecified" },
  "R53.83": { type: "ICD-10", desc: "Other fatigue" },
  "J06.9": { type: "ICD-10", desc: "Acute upper respiratory infection, unsp." },
  "J30.2": { type: "ICD-10", desc: "Other seasonal allergic rhinitis" },
  "E11.9": { type: "ICD-10", desc: "Type 2 diabetes mellitus w/o complications" },
  "E11.42": { type: "ICD-10", desc: "Type 2 diabetes w/ diabetic polyneuropathy" },
  "E78.5": { type: "ICD-10", desc: "Hyperlipidemia, unspecified" },
  "R03.0": { type: "ICD-10", desc: "Elevated BP reading, w/o dx of hypertension" },
  I10: { type: "ICD-10", desc: "Essential (primary) hypertension" },
  "I20.9": { type: "ICD-10", desc: "Angina pectoris, unspecified" },
  "R07.89": { type: "ICD-10", desc: "Other chest pain" },
  "Z82.49": { type: "ICD-10", desc: "Family hx of ischemic heart disease" },
  "Z87.891": { type: "ICD-10", desc: "Personal hx of nicotine dependence" },
  "M54.50": { type: "ICD-10", desc: "Low back pain, unspecified" },
  "G43.009": { type: "ICD-10", desc: "Migraine w/o aura, not intractable" },
  "N39.0": { type: "ICD-10", desc: "Urinary tract infection, site not specified" },
  "Z00.00": { type: "ICD-10", desc: "General adult exam w/o abnormal findings" },
  "99212": { type: "CPT", desc: "Office/outpatient visit, est., straightforward" },
  "99213": { type: "CPT", desc: "Office/outpatient visit, est." },
  "99214": { type: "CPT", desc: "Office/outpatient visit, est., moderate" },
  "99204": { type: "CPT", desc: "Office/outpatient visit, new, moderate" },
  "93000": { type: "CPT", desc: "Electrocardiogram, complete" },
  "93015": { type: "CPT", desc: "Cardiovascular stress test" },
  "83036": { type: "CPT", desc: "Hemoglobin A1c" },
  "82043": { type: "CPT", desc: "Urine albumin, quantitative" },
  "2028F": { type: "CPT II", desc: "Foot examination performed" },
};

export const codeType = (c: string): CodeType => CODES[c]?.type ?? "ICD-10";
export const codeDesc = (c: string): string => CODES[c]?.desc ?? "Custom code";

/** Billing Codes page: [code, timesUsed30d, acceptancePercent]. Acceptance under 88% shows a "Review" pill. */
export const BILLING_USAGE: [string, number, number][] = [
  ["99213", 148, 96], ["99214", 92, 93], ["B34.9", 41, 97], ["R50.9", 38, 94], ["I10", 33, 95],
  ["E11.9", 29, 92], ["E11.42", 12, 88], ["J06.9", 26, 95], ["M54.50", 21, 91], ["J30.2", 18, 96],
  ["R03.0", 17, 86], ["E78.5", 16, 94], ["99212", 15, 92], ["93000", 11, 98], ["I20.9", 6, 90],
  ["N39.0", 9, 97], ["G43.009", 8, 93], ["82043", 7, 95], ["Z82.49", 5, 84],
];

export const BILLING_KPIS = [
  { label: "Codes Suggested", value: "412", icon: "receipt", tone: "blue" },
  { label: "Acceptance Rate", value: "94%", icon: "check-circle", tone: "green" },
  { label: "Avg. Codes / Note", value: "2.6", icon: "list", tone: "purple" },
  { label: "Flagged for Review", value: "7", icon: "alert-triangle", tone: "amber" },
] as const;
