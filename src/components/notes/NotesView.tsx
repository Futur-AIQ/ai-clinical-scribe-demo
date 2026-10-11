"use client";

import { Mic } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Card, SearchInput, type TabItem, Tabs, buttonClass } from "@/components/ui";
import type { NoteStatus } from "@/data/types";
import { useDemo } from "@/store/demo-store";
import { NotesTable } from "./NotesTable";

type NoteTab = "all" | NoteStatus;

const TABS: [NoteTab, string][] = [
  ["all", "All"],
  ["Draft", "Draft"],
  ["In Progress", "In Progress"],
  ["Completed", "Completed"],
];

export function NotesView() {
  const notes = useDemo((s) => s.sortedNotes());
  const patients = useDemo((s) => s.patients);
  const [tab, setTab] = useState<NoteTab>("all");
  const [query, setQuery] = useState("");

  const tabs = useMemo<TabItem<NoteTab>[]>(
    () =>
      TABS.map(([value, label]) => {
        const n = value === "all" ? notes.length : notes.filter((x) => x.status === value).length;
        return {
          value,
          label: (
            <>
              {label} <span className="font-normal text-faint tabular-nums">{n}</span>
            </>
          ),
        };
      }),
    [notes],
  );

  // Patient name, diagnosis and codes, as in the prototype's ntableHTML().
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const names = new Map(patients.map((p) => [p.mrn, p.name.toLowerCase()]));
    return notes.filter(
      (n) =>
        (tab === "all" || n.status === tab) &&
        (!q ||
          names.get(n.mrn)?.includes(q) ||
          n.dx.toLowerCase().includes(q) ||
          n.codes.some((c) => c.code.toLowerCase().includes(q))),
    );
  }, [notes, patients, tab, query]);

  return (
    <>
      <PageHead
        title="Notes"
        subtitle="Every AI-drafted and approved clinical note"
        actions={
          <>
            <SearchInput
              className="w-[300px] max-w-full max-sm:w-full"
              placeholder="Search notes…"
              aria-label="Search notes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Link href="/consultation" className={buttonClass("primary")}>
              <Mic size={16} strokeWidth={1.8} aria-hidden className="shrink-0" />
              New Consultation
            </Link>
          </>
        }
      />
      <Tabs aria-label="Note status" items={tabs} value={tab} onChange={setTab} />
      <Card>
        <NotesTable list={list} />
      </Card>
    </>
  );
}
