import type { CaseId, ConsultCase, ScriptLine } from "./types";

// The three scripted consultations that play as a "live recording".
// Each line's `reveal` is applied to the live AI summary the moment that line finishes typing.

export const CASES: Record<CaseId, ConsultCase> = {
  fever: {
    id: "fever",
    specialty: "General Practice",
    tone: "blue",
    patientMrn: "11223344", // Emily Davis
    reason: "Fever, headache and body aches since yesterday evening",
    dxShort: "Acute viral infection",
    lines: [
      { speaker: "D", text: "Good morning, how are you feeling today?" },
      { speaker: "P", text: "I've been having a headache and fever since yesterday evening.", reveal: { sym: ["Fever", "Headache"], code: ["R50.9"] } },
      { speaker: "D", text: "I see. Can you tell me if you have any cough, sore throat, or body pain?" },
      { speaker: "P", text: "Yes, I have mild cough and body pain. No sore throat.", reveal: { sym: ["Body pain", "Mild cough"] } },
      { speaker: "D", text: "Do you have any other medical conditions or allergies?" },
      { speaker: "P", text: "No, I don't have any allergies. I'm generally healthy.", reveal: { all: "No known drug allergies" } },
      { speaker: "D", text: "Have you checked your temperature at home?" },
      { speaker: "P", text: "Yes, it was 100.4 this morning. And I've been feeling really tired.", reveal: { sym: ["Fatigue"], vit: ["Temperature 100.4°F (home reading)"] } },
      { speaker: "D", text: "Any shortness of breath, chest pain, or rash?" },
      { speaker: "P", text: "No, nothing like that. Just the body ache and tiredness." },
      { speaker: "D", text: "Your throat looks clear and your chest sounds normal. This looks like a viral infection.", reveal: { dx: "Acute Viral Infection\n(ICD-10: B34.9)", code: ["B34.9"], vit: ["Throat clear · chest clear on auscultation"] } },
      { speaker: "D", text: "I'll start you on paracetamol 500 milligrams three times a day, and cetirizine 10 milligrams once daily.", reveal: { med: ["Paracetamol 500mg – TID", "Cetirizine 10mg – OD"] } },
      { speaker: "D", text: "Rest, drink plenty of fluids, and come back in three days if you're not feeling better.", reveal: { plan: ["Rest, Hydration, Symptomatic treatment.", "Review in 3 days if no improvement."], code: ["99213"] } },
      { speaker: "P", text: "Okay, thank you, doctor." },
    ],
    soap: {
      s: "{AGE}-year-old {SEX} presents with fever and headache since yesterday evening, with mild cough, generalized body aches and fatigue. Home temperature 100.4°F this morning. Denies sore throat, shortness of breath, chest pain and rash. No known drug allergies. No significant past medical history.",
      o: "Temperature 100.4°F (patient-reported home reading this morning). Throat clear on examination. Chest clear to auscultation.",
      a: "Acute viral infection (B34.9) with fever (R50.9). No features suggesting bacterial infection or lower respiratory involvement.",
      p: "1. Paracetamol 500 mg PO three times daily as needed for fever and aches.\n2. Cetirizine 10 mg PO once daily.\n3. Rest and oral hydration.\n4. Return in 3 days if no improvement, or sooner for shortness of breath, persistent high fever or rash.",
    },
    finalCodes: [
      { code: "B34.9", confidence: 97 },
      { code: "R50.9", confidence: 94 },
      { code: "99213", confidence: 91 },
    ],
  },

  diabetes: {
    id: "diabetes",
    specialty: "Diabetes Follow-up",
    tone: "green",
    patientMrn: "87654321", // Robert Williams
    reason: "Quarterly type 2 diabetes review with new tingling in toes",
    dxShort: "Type 2 diabetes with polyneuropathy",
    lines: [
      { speaker: "D", text: "Good morning, Mr. Williams. How have your sugar levels been since your last visit?" },
      { speaker: "P", text: "Better, I think. My morning readings are mostly between 130 and 150 now.", reveal: { vit: ["Fasting glucose 130–150 mg/dL (home)"] } },
      { speaker: "D", text: "That's an improvement. Are you taking the metformin twice a day as prescribed?" },
      { speaker: "P", text: "Yes, 1000 milligrams with breakfast and dinner. Sometimes I forget the evening dose.", reveal: { med: ["Metformin 1000mg – BID"], sym: ["Missed evening doses"] } },
      { speaker: "D", text: "Any tingling in your feet, blurry vision, or feeling very thirsty?" },
      { speaker: "P", text: "Some tingling in my toes at night, mostly this past month. My eyes are fine.", reveal: { sym: ["Tingling in toes at night"] } },
      { speaker: "D", text: "Any allergies to medicines that I should know about?" },
      { speaker: "P", text: "Only sulfa drugs. They gave me a rash years ago.", reveal: { all: "Sulfa drugs (rash)" } },
      { speaker: "D", text: "Your HbA1c from last week came back at 7.4 percent, down from 8.1. Blood pressure today is 138 over 86.", reveal: { vit: ["HbA1c 7.4% (prev. 8.1%)", "BP 138/86 mmHg"], code: ["R03.0"] } },
      { speaker: "D", text: "With the tingling, this is type 2 diabetes with early nerve involvement. I'd like to add empagliflozin 10 milligrams once a day alongside metformin.", reveal: { dx: "Type 2 Diabetes with Polyneuropathy\n(ICD-10: E11.42)", med: ["Empagliflozin 10mg – OD"], code: ["E11.42"] } },
      { speaker: "P", text: "Should I change anything in my diet?" },
      { speaker: "D", text: "Cut back on rice and sweets at dinner, and try a 30-minute walk after meals.", reveal: { plan: ["Reduce rice and sweets at dinner; 30-min walk after meals."] } },
      { speaker: "D", text: "We'll do a foot exam today, order a urine albumin test, and review in three months.", reveal: { plan: ["Foot exam today; urine albumin test.", "Review in 3 months."], code: ["82043", "99214"] } },
      { speaker: "P", text: "Sounds good. Thank you, doctor." },
    ],
    soap: {
      s: "58-year-old male for type 2 diabetes follow-up. Reports fasting home glucose mostly 130–150 mg/dL. Taking metformin 1000 mg BID; occasionally misses the evening dose. New tingling in toes at night over the past month. Denies visual changes. Allergy: sulfa drugs (rash). Asked about dietary changes.",
      o: "HbA1c 7.4% (previously 8.1%). Blood pressure 138/86 mmHg. Diabetic foot examination to be completed today.",
      a: "Type 2 diabetes mellitus with diabetic polyneuropathy (E11.42), glycemic control improving. Elevated blood pressure reading without diagnosis of hypertension (R03.0).",
      p: "1. Continue metformin 1000 mg PO BID; set an evening reminder.\n2. Start empagliflozin 10 mg PO once daily.\n3. Diabetic foot exam today; order urine albumin (quantitative).\n4. Diet: reduce rice and sweets at dinner; 30-minute walk after meals.\n5. Recheck BP and review in 3 months.",
    },
    finalCodes: [
      { code: "E11.42", confidence: 95 },
      { code: "R03.0", confidence: 88 },
      { code: "99214", confidence: 92 },
      { code: "82043", confidence: 90 },
    ],
  },

  cardio: {
    id: "cardio",
    specialty: "Cardiology",
    tone: "red",
    patientMrn: "55443322", // David Wilson
    reason: "Referral for exertional chest tightness over six weeks",
    dxShort: "Angina pectoris, likely stable",
    lines: [
      { speaker: "D", text: "Mr. Wilson, your doctor referred you for chest discomfort. Tell me what happens." },
      { speaker: "P", text: "I get a tight feeling in my chest when I climb stairs or walk fast. It goes away after a few minutes of rest.", reveal: { sym: ["Exertional chest tightness", "Relieved by rest"] } },
      { speaker: "D", text: "Does the pain spread to your arm, jaw, or back? Any shortness of breath?" },
      { speaker: "P", text: "Sometimes to my left shoulder. And I get a bit short of breath on the stairs.", reveal: { sym: ["Radiates to left shoulder", "Exertional dyspnea"] } },
      { speaker: "D", text: "How long has this been going on? Do you smoke, and any heart problems in the family?" },
      { speaker: "P", text: "About six weeks. I quit smoking five years ago. My father had a heart attack at 62.", reveal: { sym: ["Onset ~6 weeks"], code: ["Z82.49"] } },
      { speaker: "D", text: "Any allergies to medicines?" },
      { speaker: "P", text: "No, none that I know of.", reveal: { all: "No known drug allergies" } },
      { speaker: "D", text: "Your ECG today shows normal sinus rhythm with no acute changes, and your blood pressure is 146 over 90.", reveal: { vit: ["ECG: normal sinus rhythm, no acute changes", "BP 146/90 mmHg"], code: ["93000", "R03.0"] } },
      { speaker: "D", text: "Your symptoms fit stable angina. I want to confirm it with a treadmill stress test.", reveal: { dx: "Angina Pectoris, likely stable\n(ICD-10: I20.9)", plan: ["Treadmill stress test."], code: ["I20.9"] } },
      { speaker: "D", text: "Start aspirin 81 milligrams daily and atorvastatin 40 milligrams at night. Keep nitroglycerin under the tongue for chest pain.", reveal: { med: ["Aspirin 81mg – OD", "Atorvastatin 40mg – HS", "Nitroglycerin 0.4mg SL – PRN"] } },
      { speaker: "D", text: "If the pain lasts more than 15 minutes or comes on at rest, call emergency services right away.", reveal: { plan: ["Call emergency services if pain >15 min or at rest."] } },
      { speaker: "P", text: "Understood. When should I come back?" },
      { speaker: "D", text: "Right after the stress test, within two weeks.", reveal: { plan: ["Follow-up within 2 weeks after stress test."], code: ["99214"] } },
    ],
    soap: {
      s: "60-year-old male referred for exertional chest tightness for about 6 weeks, brought on by stairs or brisk walking and relieved by rest within minutes. Occasional radiation to the left shoulder with exertional shortness of breath. Former smoker, quit 5 years ago. Father had a myocardial infarction at age 62. No known drug allergies.",
      o: "ECG: normal sinus rhythm, no acute ST-T changes. Blood pressure 146/90 mmHg.",
      a: "Angina pectoris, likely stable (I20.9). Elevated blood pressure reading without diagnosis of hypertension (R03.0). Family history of ischemic heart disease (Z82.49).",
      p: "1. Treadmill exercise stress test.\n2. Start aspirin 81 mg PO daily and atorvastatin 40 mg PO at bedtime.\n3. Nitroglycerin 0.4 mg SL as needed for chest pain.\n4. Call emergency services if pain lasts over 15 minutes or occurs at rest.\n5. Follow up within 2 weeks after the stress test.",
    },
    finalCodes: [
      { code: "I20.9", confidence: 93 },
      { code: "R03.0", confidence: 86 },
      { code: "Z82.49", confidence: 89 },
      { code: "93000", confidence: 97 },
      { code: "99214", confidence: 90 },
    ],
  },
};

/** Any patient without a dedicated case runs the general visit (fever) script. */
export const caseForPatient = (mrn: string): CaseId =>
  (Object.values(CASES).find((c) => c.patientMrn === mrn)?.id ?? "fever") as CaseId;

export interface TimedLine extends ScriptLine {
  at: number; // seconds from recording start when the line begins
  dur: number; // seconds the line takes to "type"
}

/**
 * Playback timing at 1× speed: a line takes words / 2.9 seconds (minimum 1.3 s),
 * with a 1.05 s pause between lines. First line starts at 1.2 s.
 * Returns the timed lines and the total length in seconds (about 70–80 s per case).
 */
export function timeCase(c: ConsultCase): { lines: TimedLine[]; total: number } {
  let at = 1.2;
  const lines = c.lines.map((l) => {
    const words = l.text.split(" ").length;
    const dur = Math.max(1.3, words / 2.9);
    const t: TimedLine = { ...l, at, dur };
    at += dur + 1.05;
    return t;
  });
  return { lines, total: at };
}
