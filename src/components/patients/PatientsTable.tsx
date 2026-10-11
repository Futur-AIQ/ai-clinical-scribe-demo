"use client";

import { Ellipsis, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Checkbox, EmptyState, IconButton, Pagination, StatusPill } from "@/components/ui";
import type { Patient } from "@/data/types";
import { fmtDate, fmtNumber, fmtTime } from "@/lib/format";
import { PatientMenu } from "./PatientMenu";

export const PER_PAGE = 10;

const TH = "border-b border-line bg-surface-2 px-4 py-2.5 text-left text-[12px] font-medium whitespace-nowrap text-ink-2";
const TD = "border-b border-line-2 px-4 py-3 align-middle whitespace-nowrap group-last:border-b-0";

interface PatientsTableProps {
  /** Every patient that matches, in order. Only the current page is rendered. */
  list: Patient[];
  page: number;
  onPage: (page: number) => void;
  selected: string[];
  onSelect: (selected: string[]) => void;
  onArchiveSelected: () => void;
  onClearFilters: () => void;
}

export function PatientsTable({ list, page, onPage, selected, onSelect, onArchiveSelected, onClearFilters }: PatientsTableProps) {
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const rows = list.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const sel = new Set(selected);
  const allOnPage = rows.length > 0 && rows.every((p) => sel.has(p.mrn));

  const toggle = (mrn: string, on: boolean) => onSelect(on ? [...selected, mrn] : selected.filter((m) => m !== mrn));
  const togglePage = () => {
    const mrns = new Set(rows.map((p) => p.mrn));
    onSelect(allOnPage ? selected.filter((m) => !mrns.has(m)) : [...selected, ...rows.filter((p) => !sel.has(p.mrn)).map((p) => p.mrn)]);
  };

  const from = list.length ? (cur - 1) * PER_PAGE + 1 : 0;
  const to = Math.min(cur * PER_PAGE, list.length);

  return (
    <>
      {selected.length > 0 && (
        <div className="flex items-center gap-2.5 rounded-t-card border-b border-blue-100 bg-blue-50 px-4 py-2.5 text-[13px]">
          <b className="mr-auto font-semibold">{selected.length} selected</b>
          <Button size="sm" icon={Trash2} onClick={onArchiveSelected}>
            Archive
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onSelect([])}>
            Clear
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className={`${TH} w-11`}>
                <Checkbox checked={allOnPage} onChange={togglePage} disabled={rows.length === 0} aria-label="Select all on page" />
              </th>
              <th className={TH}>Patient</th>
              <th className={TH}>MRN</th>
              <th className={TH}>Last Visit</th>
              <th className={TH}>Last Consultation</th>
              <th className={`${TH} text-center`}>Total Visits</th>
              <th className={TH}>Phone</th>
              <th className={TH}>Status</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((p) => <Row key={p.mrn} patient={p} checked={sel.has(p.mrn)} onCheck={(on) => toggle(p.mrn, on)} />)
            ) : (
              <tr>
                <td colSpan={9}>
                  <EmptyState
                    icon={Search}
                    action={
                      <Button size="sm" onClick={onClearFilters}>
                        Clear search and filters
                      </Button>
                    }
                  >
                    No patients match these filters.
                  </EmptyState>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={cur}
        pages={pages}
        onChange={onPage}
        summary={`Showing ${from} to ${to} of ${fmtNumber(list.length)} patients`}
      />
    </>
  );
}

interface RowProps {
  patient: Patient;
  checked: boolean;
  onCheck: (on: boolean) => void;
}

function Row({ patient: p, checked, onCheck }: RowProps) {
  const router = useRouter();
  const last = new Date(p.lastVisit);
  return (
    <tr
      className="group cursor-pointer transition-colors duration-100 hover:bg-[#f8faff]"
      onClick={() => router.push(`/patients/${p.mrn}`)}
    >
      {/* Clicks here must not open the record. */}
      <td className={TD} onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={checked} onChange={onCheck} aria-label={`Select ${p.name}`} />
      </td>
      <td className={TD}>
        <div className="flex items-center gap-3">
          <Avatar name={p.name} size={38} />
          <span>
            <b className="block text-[13px] font-medium">{p.name}</b>
            <small className="block text-[12px] text-muted">
              {p.age} / {p.sex}
            </small>
          </span>
        </div>
      </td>
      <td className={`${TD} text-muted tabular-nums`}>MRN-{p.mrn}</td>
      <td className={`${TD} tabular-nums`}>{fmtDate(last)}</td>
      <td className={`${TD} tabular-nums`}>
        {fmtDate(last)}
        <small className="block text-[12px] text-muted">
          {fmtTime(last)} • {p.lastDuration} min
        </small>
      </td>
      <td className={`${TD} text-center tabular-nums`}>{p.visits}</td>
      <td className={`${TD} tabular-nums`}>{p.phone}</td>
      <td className={TD}>
        <StatusPill status={p.status} />
      </td>
      {/* The menu is portaled, but React still bubbles its clicks through this cell. */}
      <td className={TD} onClick={(e) => e.stopPropagation()}>
        <PatientMenu
          patient={p}
          trigger={(t) => <IconButton icon={Ellipsis} aria-label={`More actions for ${p.name}`} {...t} />}
        />
      </td>
    </tr>
  );
}
