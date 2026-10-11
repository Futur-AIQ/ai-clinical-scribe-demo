"use client";

import { Copy, EllipsisVertical, FileText, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, Card, CardHeader, CardLink, IconButton, Menu, MenuItem, StatusPill } from "@/components/ui";
import type { Note, Patient } from "@/data/types";
import { fmtDate, fmtTime } from "@/lib/format";
import { copyText, noteText } from "@/lib/note-text";
import { useDemo } from "@/store/demo-store";

const TH = "border-b border-line bg-surface-2 px-4 py-2.5 text-left text-[12px] font-medium whitespace-nowrap text-ink-2";
const TD = "border-b border-line-2 px-4 py-3 align-middle whitespace-nowrap group-last:border-b-0";

/** The 4 newest notes. A row click opens the note. */
export function RecentConsultationsCard() {
  const sorted = useDemo((s) => s.sortedNotes());
  // Subscribed so rows update when a patient changes; lookups go through the store's index.
  useDemo((s) => s.patients);
  const patientByMrn = useDemo((s) => s.patientByMrn);
  const rows = sorted.slice(0, 4);

  return (
    <Card>
      <CardHeader title="Recent Consultations" actions={<CardLink href="/notes">View All</CardLink>} />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className={TH}>Patient</th>
              <th className={TH}>Date</th>
              <th className={TH}>Duration</th>
              <th className={TH}>Status</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => {
              const p = patientByMrn(n.mrn);
              return p ? <Row key={n.id} note={n} patient={p} /> : null;
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Row({ note: n, patient: p }: { note: Note; patient: Patient }) {
  const router = useRouter();
  const redact = useDemo((s) => s.settings.redactExports);
  const href = `/notes/${n.id}`;
  const d = new Date(n.date);
  return (
    <tr className="group cursor-pointer transition-colors duration-100 hover:bg-[#f8faff]" onClick={() => router.push(href)}>
      <td className={TD}>
        <div className="flex items-center gap-3">
          <Avatar name={p.name} size={36} />
          <span>
            <b className="block text-[13px] font-medium">{p.name}</b>
            <small className="block text-[12px] text-muted">MRN: {p.mrn}</small>
          </span>
        </div>
      </td>
      <td className={TD}>
        {fmtDate(d)}
        <small className="block text-[12px] text-muted">{fmtTime(d)}</small>
      </td>
      <td className={`${TD} tabular-nums`}>{n.duration}</td>
      <td className={TD}>
        <StatusPill status={n.status} />
      </td>
      {/* Clicks here, including inside the portaled menu, must not reach the row. */}
      <td className={TD} onClick={(e) => e.stopPropagation()}>
        <IconButton icon={FileText} iconSize={17} aria-label={`Open note for ${p.name}`} onClick={() => router.push(href)} />
        <Menu
          aria-label="Note actions"
          trigger={(t) => <IconButton icon={EllipsisVertical} iconSize={17} aria-label={`More actions for ${p.name}`} {...t} />}
        >
          <MenuItem icon={FileText} href={href}>
            Open note
          </MenuItem>
          <MenuItem icon={User} href={`/patients/${p.mrn}`}>
            Open patient
          </MenuItem>
          <MenuItem icon={Copy} onSelect={() => void copyText(noteText(n, p, redact))}>
            Copy note text
          </MenuItem>
        </Menu>
      </td>
    </tr>
  );
}
