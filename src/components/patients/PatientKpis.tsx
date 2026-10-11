"use client";

import { Calendar, Clock, UserPlus, Users } from "lucide-react";
import { useMemo } from "react";
import { KpiCard, KpiRow } from "@/components/ui";
import { fmtNumber } from "@/lib/format";
import { useDemo } from "@/store/demo-store";

/** Totals across every patient, archived included, as in the prototype. */
export function PatientKpis() {
  const patients = useDemo((s) => s.patients);
  const kpis = useMemo(() => {
    const total = patients.length;
    const visits = patients.reduce((sum, p) => sum + p.visits, 0);
    return [
      { icon: Users, tone: "blue", label: "Total Patients", value: fmtNumber(total), delta: "12%" },
      { icon: UserPlus, tone: "green", label: "New Patients", value: fmtNumber(patients.filter((p) => p.isNew).length), delta: "8%" },
      { icon: Calendar, tone: "amber", label: "Consultations", value: fmtNumber(visits), delta: "15%" },
      { icon: Clock, tone: "purple", label: "Avg. Visits / Patient", value: total ? (visits / total).toFixed(1) : "0.0", delta: "5%" },
    ] as const;
  }, [patients]);

  return (
    <KpiRow>
      {kpis.map((k) => (
        <KpiCard key={k.label} {...k} deltaLabel="vs last month" />
      ))}
    </KpiRow>
  );
}
