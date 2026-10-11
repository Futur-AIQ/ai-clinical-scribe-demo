"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PatientRecord } from "@/components/patients/PatientRecord";
import { buttonClass, EmptyState } from "@/components/ui";
import { useDemo } from "@/store/demo-store";

export default function PatientRecordPage() {
  const { mrn } = useParams<{ mrn: string }>();
  const patient = useDemo((s) => s.patientByMrn(mrn));

  if (!patient) {
    return (
      <EmptyState
        icon={Search}
        iconSize={30}
        className="py-20"
        action={
          <Link href="/dashboard" className={buttonClass("secondary", "md")}>
            Back to Dashboard
          </Link>
        }
      >
        <b className="font-semibold text-ink">That patient could not be found.</b>
      </EmptyState>
    );
  }
  return <PatientRecord key={patient.mrn} patient={patient} />;
}
