"use client";

import { CircleCheck, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, EmptyState, Pill, StatusPill } from "@/components/ui";
import type { Note, Patient } from "@/data/types";
import { fmtDate, fmtTime } from "@/lib/format";
import { useDemo } from "@/store/demo-store";

const TH = "border-b border-line bg-surface-2 px-4 py-2.5 text-left text-[12px] font-medium whitespace-nowrap text-ink-2";
const TD = "border-b border-line-2 px-4 py-3 align-middle whitespace-nowrap group-last:border-b-0";
const MAX_CODES = 3;

/** Every note that matches the tab and search. A row click opens the note. */
export function NotesTable({ list }: { list: Note[] }) {
  // Subscribed so rows update when a patient changes; lookups go through the store's index.
  useDemo((s) => s.patients);
  const patientByMrn = useDemo((s) => s.patientByMrn);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className={TH}>Patient</th>
            <th className={TH}>Note</th>
            <th className={TH}>Date</th>
            <th className={TH}>Duration</th>
            <th className={TH}>Codes</th>
            <th className={TH}>EMR</th>
            <th className={TH}>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((n) => {
              const p = patientByMrn(n.mrn);
              return p ? <Row key={n.id} note={n} patient={p} /> : null;
            })
          ) : (
            <tr>
              <td colSpan={7}>
                <EmptyState icon={FileText}>No notes match.</EmptyState>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Row({ note: n, patient: p }: { note: Note; patient: Patient }) {
  const router = useRouter();
  const href = `/notes/${n.id}`;
  const d = new Date(n.date);
  const codes = n.codes.filter((c) => c.included).map((c) => c.code);
  return (
    <tr className="group cursor-pointer transition-colors duration-100 hover:bg-[#f8faff]" onClick={() => router.push(href)}>
      <td className={TD}>
        <div className="flex items-center gap-3">
          <Avatar name={p.name} size={36} />
          <span>
            {/* The keyboard path to the note; the row click covers the rest of the row. */}
            <Link href={href} onClick={(e) => e.stopPropagation()} className="block text-[13px] font-medium">
              {p.name}
            </Link>
            <small className="block text-[12px] text-muted">MRN: {p.mrn}</small>
          </span>
        </div>
      </td>
      <td className={`${TD} font-medium`}>{n.dx}</td>
      <td className={`${TD} tabular-nums`}>
        {fmtDate(d)}
        <small className="block text-[12px] text-muted">{fmtTime(d)}</small>
      </td>
      <td className={`${TD} tabular-nums`}>{n.duration}</td>
      <td className={TD}>
        <div className="flex flex-wrap items-center gap-1.5">
          {codes.slice(0, MAX_CODES).map((c) => (
            <span key={c} className="rounded-[7px] bg-blue-50 px-[7px] py-0.5 text-[12.5px] font-semibold text-blue tabular-nums">
              {c}
            </span>
          ))}
          {codes.length > MAX_CODES && <span className="text-[12px] text-faint">+{codes.length - MAX_CODES}</span>}
        </div>
      </td>
      <td className={TD}>
        {n.synced ? (
          <Pill tone="green">
            <CircleCheck size={13} strokeWidth={1.8} aria-hidden />
            Synced
          </Pill>
        ) : (
          <Pill tone="gray">Not sent</Pill>
        )}
      </td>
      <td className={TD}>
        <StatusPill status={n.status} />
      </td>
    </tr>
  );
}
