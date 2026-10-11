import { ArrowRight, FileText, Mic } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Card, EmptyState, StatusPill } from "@/components/ui";
import { DOCTOR } from "@/data/misc";
import type { Note, Patient } from "@/data/types";
import { fmtDate, fmtTime } from "@/lib/format";
import type { Visit } from "@/lib/patient-record";

const linkClass = "inline-flex items-center gap-[5px] text-[12.5px] font-medium whitespace-nowrap text-blue hover:underline";

interface RowProps {
  date: Date;
  title: string;
  sub: string;
  children: ReactNode;
}

/** Date over time, a title over a muted line, then a status and a link. */
function Row({ date, title, sub, children }: RowProps) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-4 border-b border-line-2 px-5 py-3.5 last:border-b-0 max-sm:grid-cols-1 max-sm:gap-1.5">
      <span className="tabular-nums">
        {fmtDate(date)}
        <small className="block text-[12px] text-muted">{fmtTime(date)}</small>
      </span>
      <span className="min-w-0">
        <b className="block font-medium">{title}</b>
        <small className="block text-[12px] text-muted">{sub}</small>
      </span>
      <span className="flex items-center gap-2.5">{children}</span>
    </div>
  );
}

export function VisitHistory({ visits }: { visits: Visit[] }) {
  return (
    <Card>
      {visits.map((v, i) => (
        <Row key={v.noteId ?? `v${i}`} date={v.date} title={v.reason} sub={`${v.duration} min · ${DOCTOR.name}`}>
          <StatusPill status={v.status} />
          {v.noteId ? (
            <Link href={`/notes/${v.noteId}`} className={linkClass}>
              View note <ArrowRight size={13} strokeWidth={1.8} aria-hidden />
            </Link>
          ) : (
            <span className="text-[12.5px] text-faint">Archived note</span>
          )}
        </Row>
      ))}
    </Card>
  );
}

interface PatientNotesProps {
  notes: Note[];
  onStart: () => void;
}

export function PatientNotes({ notes, onStart }: PatientNotesProps) {
  return (
    <Card>
      {notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          action={
            <Button size="sm" variant="primary" icon={Mic} onClick={onStart}>
              Start Consultation
            </Button>
          }
        >
          No AI notes yet for this patient.
        </EmptyState>
      ) : (
        notes.map((n) => (
          <Row key={n.id} date={new Date(n.date)} title={n.dx} sub={`${n.soap.a.slice(0, 110)}…`}>
            <StatusPill status={n.status} />
            <Link href={`/notes/${n.id}`} className={linkClass}>
              Open <ArrowRight size={13} strokeWidth={1.8} aria-hidden />
            </Link>
          </Row>
        ))
      )}
    </Card>
  );
}

export function PatientDetails({ patient: p }: { patient: Patient }) {
  const fields = [
    ["Full name", p.name],
    ["Sex", p.sex],
    ["Allergies", p.allergies],
    ["Conditions", p.conditions.join(", ") || "None recorded"],
    ["Primary physician", DOCTOR.name],
    ["EMR record", `Epic · Patient ID EPC-${p.mrn.slice(2)}`],
  ];
  return (
    <Card className="px-5 py-[18px]">
      <dl className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {fields.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <dt className="text-[12.5px] font-medium text-ink-2">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
