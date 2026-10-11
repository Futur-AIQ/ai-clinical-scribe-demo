import type { AuditEntry, Note } from "./types";
import { clinicDay } from "./dates";
import { CASES, timeCase } from "./cases";

// Seeded consultations/notes. The dashboard "Recent Consultations" table is the 4 newest notes.
// Build on the client: const notes = buildSeedNotes(new Date());

const audit = (start: Date, items: [minutesAfter: number, action: string][]): AuditEntry[] =>
  items.map(([m, action]) => ({ t: new Date(start.getTime() + m * 60000).toISOString(), action }));

const completedAudit = (start: Date, mins: number, enc: string) =>
  audit(start, [[0, "Recording started"], [mins, "AI note drafted"], [mins + 3, "Approved by Dr. Sarah Johnson"], [mins + 3, `Synced to Epic (${enc})`]]);

export function buildSeedNotes(now = new Date()): Note[] {
  const fever = CASES.fever;
  const emily = clinicDay(1, 16, 45, now);
  const timed = timeCase(fever).lines;

  const d1 = clinicDay(0, 10, 30, now), d2 = clinicDay(0, 9, 15, now), d4 = clinicDay(1, 11, 20, now);
  const d5 = clinicDay(2, 15, 30, now), d6 = clinicDay(3, 10, 0, now);

  return [
    {
      id: "n1001", mrn: "12345678", date: d1.toISOString(), duration: "14:32", status: "Completed", dx: "Seasonal allergic rhinitis", synced: true, encounterId: "E-482913",
      soap: {
        s: "34-year-old female with sneezing, nasal congestion and itchy eyes for 2 weeks, worse outdoors in the mornings. No fever. No known drug allergies.",
        o: "Nasal mucosa pale and boggy. No sinus tenderness. Conjunctivae mildly injected. Lungs clear.",
        a: "Seasonal allergic rhinitis (J30.2).",
        p: "1. Fluticasone nasal spray, 2 sprays each nostril once daily.\n2. Cetirizine 10 mg PO once daily.\n3. Limit outdoor exposure on high-pollen days.\n4. Follow up as needed.",
      },
      codes: [{ code: "J30.2", confidence: 96, included: true }, { code: "99213", confidence: 92, included: true }],
      audit: completedAudit(d1, 14, "E-482913"),
    },
    {
      id: "n1002", mrn: "87654321", date: d2.toISOString(), duration: "22:18", status: "Completed", dx: "Hyperlipidemia follow-up", synced: true, encounterId: "E-482877",
      soap: {
        s: "58-year-old male reviewing fasting lipid panel. Taking atorvastatin 20 mg nightly with no muscle aches. Walking 3 days a week.",
        o: "LDL 128 mg/dL, HDL 44 mg/dL, triglycerides 186 mg/dL. BP 134/84 mmHg.",
        a: "Hyperlipidemia (E78.5), LDL above goal for a patient with diabetes.",
        p: "1. Increase atorvastatin to 40 mg PO nightly.\n2. Repeat lipid panel in 8 weeks.\n3. Continue walking; aim for 5 days a week.",
      },
      codes: [{ code: "E78.5", confidence: 95, included: true }, { code: "99213", confidence: 90, included: true }],
      audit: completedAudit(d2, 22, "E-482877"),
    },
    {
      // In-progress fever visit. Its first lines + full summary are what the idle dashboard shows.
      id: "n1003", mrn: "11223344", date: emily.toISOString(), duration: "18:45", status: "In Progress", dx: "Acute viral infection", synced: false,
      transcript: timed.slice(0, 6).map((l) => ({ speaker: l.speaker, text: l.text, ts: new Date(emily.getTime() + 15000 + l.at * 1000).toISOString() })),
      soap: { ...fever.soap, s: fever.soap.s.replace("{AGE}", "28").replace("{SEX}", "female") },
      codes: fever.finalCodes.map((c) => ({ ...c, included: true })),
      audit: audit(emily, [[0, "Recording started"], [1, "Recording paused"]]),
    },
    {
      id: "n1004", mrn: "99887766", date: d4.toISOString(), duration: "12:05", status: "Draft", dx: "Acute low back pain", synced: false,
      soap: {
        s: "45-year-old male with low back pain for 3 days after lifting boxes. No radiation to the legs, numbness or bladder changes. Allergy: penicillin.",
        o: "Paraspinal tenderness at L4–L5. Straight-leg raise negative bilaterally. Normal gait.",
        a: "Acute mechanical low back pain (M54.50).",
        p: "1. Ibuprofen 400 mg PO three times daily with food for 5 days.\n2. Heat and gentle stretching; stay active as tolerated.\n3. Return for leg weakness, numbness or bladder changes.",
      },
      codes: [{ code: "M54.50", confidence: 94, included: true }, { code: "99213", confidence: 89, included: true }],
      audit: audit(d4, [[0, "Recording started"], [12, "AI note drafted"]]),
    },
    {
      id: "n1005", mrn: "66778899", date: d5.toISOString(), duration: "15:20", status: "Completed", dx: "Migraine without aura", synced: true, encounterId: "E-481554",
      soap: {
        s: "32-year-old female with recurrent throbbing headaches 2–3 times a month with light sensitivity and nausea. No aura.",
        o: "Neurological examination normal. BP 116/74 mmHg.",
        a: "Migraine without aura, not intractable (G43.009).",
        p: "1. Sumatriptan 50 mg PO at onset; may repeat once after 2 hours.\n2. Headache diary.\n3. Review in 6 weeks.",
      },
      codes: [{ code: "G43.009", confidence: 93, included: true }, { code: "99213", confidence: 91, included: true }],
      audit: completedAudit(d5, 15, "E-481554"),
    },
    {
      id: "n1006", mrn: "44332211", date: d6.toISOString(), duration: "10:15", status: "Completed", dx: "Urinary tract infection", synced: true, encounterId: "E-480720",
      soap: {
        s: "39-year-old female with dysuria and urinary frequency for 2 days. No fever or flank pain.",
        o: "Urinalysis positive for leukocyte esterase and nitrites. No CVA tenderness.",
        a: "Urinary tract infection, site not specified (N39.0).",
        p: "1. Nitrofurantoin 100 mg PO BID for 5 days.\n2. Increase fluid intake.\n3. Return if fever or flank pain develop.",
      },
      codes: [{ code: "N39.0", confidence: 96, included: true }, { code: "99212", confidence: 90, included: true }],
      audit: completedAudit(d6, 10, "E-480720"),
    },
  ];
}

/** Billing codes shown on the idle dashboard (exact order from the screenshot). */
export const DASHBOARD_IDLE_CODES = ["B34.9", "99213", "R50.9"];
