"use client";

import { ChevronLeft, Ellipsis, Mic } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Button, type TabItem, Tabs } from "@/components/ui";
import type { Patient } from "@/data/types";
import { visitHistory } from "@/lib/patient-record";
import { useStartConsultation } from "@/lib/use-start-consultation";
import { useDemo } from "@/store/demo-store";
import { PatientHero } from "./PatientHero";
import { PatientMenu } from "./PatientMenu";
import { PatientDetails, PatientNotes, VisitHistory } from "./PatientRecordTabs";

type RecordTab = "visits" | "notes" | "details";

/** /patients/[mrn]. Key it by MRN so the tab resets for each patient. */
export function PatientRecord({ patient: p }: { patient: Patient }) {
  const notes = useDemo((s) => s.notesForPatient(p.mrn));
  const startFor = useStartConsultation();
  const [tab, setTab] = useState<RecordTab>("visits");
  const visits = useMemo(() => visitHistory(p, notes), [p, notes]);

  const tabs: TabItem<RecordTab>[] = [
    { value: "visits", label: "Visit History" },
    { value: "notes", label: `Notes (${notes.length})` },
    { value: "details", label: "Details" },
  ];

  return (
    <>
      <PageHead
        eyebrow={
          <Link
            href="/patients"
            className="mb-1.5 flex w-fit items-center gap-[5px] text-[12.5px] font-medium text-blue hover:underline"
          >
            <ChevronLeft size={14} strokeWidth={1.8} aria-hidden />
            Patients
          </Link>
        }
        title="Patient Record"
        actions={
          <>
            <PatientMenu
              patient={p}
              trigger={(t) => (
                <Button icon={Ellipsis} {...t}>
                  More
                </Button>
              )}
            />
            <Button variant="primary" icon={Mic} onClick={() => startFor(p.mrn)}>
              Start Consultation
            </Button>
          </>
        }
      />
      <PatientHero patient={p} />
      <Tabs aria-label="Patient record" items={tabs} value={tab} onChange={setTab} />
      {tab === "visits" && <VisitHistory visits={visits} />}
      {tab === "notes" && <PatientNotes notes={notes} onStart={() => startFor(p.mrn)} />}
      {tab === "details" && <PatientDetails patient={p} />}
    </>
  );
}
