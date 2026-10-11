import { Sparkles, TriangleAlert } from "lucide-react";
import { Avatar, Card, Pill, StatusPill } from "@/components/ui";
import { CASES } from "@/data/cases";
import { patientEmail } from "@/data/patients";
import type { Patient } from "@/data/types";
import { fmtDate } from "@/lib/format";
import { dateOfBirth } from "@/lib/patient-record";

const NO_ALLERGY = "No known drug allergies";

/** Avatar, name, chips, the sample-visit tip and the facts strip. */
export function PatientHero({ patient: p }: { patient: Patient }) {
  const sample = Object.values(CASES).find((c) => c.patientMrn === p.mrn);
  const facts = [
    { label: "Date of birth", value: fmtDate(dateOfBirth(p)), nums: true },
    { label: "Phone", value: p.phone, nums: true },
    { label: "Email", value: patientEmail(p) },
    { label: "Insurance", value: p.insurance },
  ];

  return (
    <Card className="mb-5 overflow-hidden">
      <div className="flex flex-wrap items-center gap-5 p-[22px]">
        <Avatar name={p.name} size={64} />
        <div className="min-w-[200px] flex-1">
          <h2 className="text-[20px] font-semibold">{p.name}</h2>
          <p className="mt-1 text-muted tabular-nums">
            {p.age} / {p.sex} · MRN-{p.mrn} · {p.visits} visits
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <StatusPill status={p.status} />
            {p.conditions.map((c) => (
              <span key={c} className="rounded-md bg-gray-50 px-2 py-[3px] text-[11.5px] text-ink-2">
                {c}
              </span>
            ))}
            {p.allergies !== NO_ALLERGY && (
              <Pill tone="red">
                <TriangleAlert size={12} strokeWidth={1.8} aria-hidden />
                Allergy: {p.allergies}
              </Pill>
            )}
          </div>
        </div>
        {sample && (
          <div className="flex max-w-[300px] gap-2.5 rounded-[10px] bg-blue-50 px-[15px] py-[13px] text-[13px] leading-[1.55] text-ink-2">
            <Sparkles size={16} strokeWidth={1.8} aria-hidden className="mt-0.5 shrink-0 text-blue" />
            <span>
              Sample visit available: <b className="font-medium text-blue">{sample.specialty}</b>. Start a consultation to
              play it.
            </span>
          </div>
        )}
      </div>
      <dl className="grid grid-cols-4 gap-px border-t border-line-2 bg-line-2 max-md:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="min-w-0 bg-white px-[22px] py-3.5">
            <dt className="text-[12px] text-muted">{f.label}</dt>
            <dd className={`mt-[3px] text-[13.5px] font-medium break-words ${f.nums ? "tabular-nums" : ""}`}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
