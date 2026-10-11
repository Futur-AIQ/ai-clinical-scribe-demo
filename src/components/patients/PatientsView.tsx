"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Button, Card, SearchInput, type TabItem, Tabs, toast } from "@/components/ui";
import { NO_FILTERS, type PatientTab, filterPatients, searchRows } from "@/lib/patient-list";
import { useDemo } from "@/store/demo-store";
import { useUi } from "@/store/ui-store";
import { NewPatientModal } from "./NewPatientModal";
import { PatientFiltersMenu } from "./PatientFiltersMenu";
import { PatientKpis } from "./PatientKpis";
import { PatientsTable } from "./PatientsTable";

const TABS: TabItem<PatientTab>[] = [
  { value: "all", label: "All Patients" },
  { value: "recent", label: "Recent" },
  { value: "frequent", label: "Frequent Visitors" },
  { value: "new", label: "New Patients" },
  { value: "archived", label: "Archived" },
];

export function PatientsView() {
  const patients = useDemo((s) => s.patients);
  const archivePatients = useDemo((s) => s.archivePatients);
  const view = useUi((s) => s.patientList);
  const setView = useUi((s) => s.setPatientList);
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => searchRows(patients), [patients]);
  const list = useMemo(
    () => filterPatients(rows, view.tab, view.filters, view.query),
    [rows, view.tab, view.filters, view.query],
  );

  const clearFilters = () => setView({ query: "", filters: NO_FILTERS, page: 1 });
  const archiveSelected = () => {
    const n = view.selected.length;
    archivePatients(view.selected);
    setView({ selected: [] });
    toast(`${n} patient${n > 1 ? "s" : ""} archived`);
  };

  return (
    <>
      <PageHead
        title="Patients"
        subtitle="Manage and view all your patients"
        actions={
          <>
            <SearchInput
              className="w-[340px] max-w-full max-sm:w-full"
              placeholder="Search patients by name, MRN, phone or email…"
              aria-label="Search patients"
              value={view.query}
              onChange={(e) => setView({ query: e.target.value, page: 1 })}
            />
            <PatientFiltersMenu
              filters={view.filters}
              onChange={(filters) => setView({ filters, page: 1 })}
              onReset={clearFilters}
            />
            <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
              New Patient
            </Button>
          </>
        }
      />
      <PatientKpis />
      <Tabs
        aria-label="Patient lists"
        items={TABS}
        value={view.tab}
        onChange={(tab) => setView({ tab, page: 1, selected: [] })}
      />
      <Card>
        <PatientsTable
          list={list}
          page={view.page}
          onPage={(page) => setView({ page })}
          selected={view.selected}
          onSelect={(selected) => setView({ selected })}
          onArchiveSelected={archiveSelected}
          onClearFilters={clearFilters}
        />
      </Card>
      <NewPatientModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={() => setView({ tab: "all", page: 1 })}
      />
    </>
  );
}
