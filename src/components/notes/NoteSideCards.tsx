import { ShieldCheck, User } from "lucide-react";
import { Avatar, Card, CardBody, CardHeader, CardLink, Timeline, TimelineItem } from "@/components/ui";
import { DOCTOR } from "@/data/misc";
import type { AuditEntry, Patient } from "@/data/types";
import { fmtTimeSec, relDay } from "@/lib/format";

/** Who the note is for: allergies, insurance and conditions. */
export function NotePatientCard({ patient: p }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader
        title="Patient"
        icon={User}
        iconSize={19}
        actions={<CardLink href={`/patients/${p.mrn}`}>Open record</CardLink>}
      />
      <CardBody className="flex flex-col gap-2.5 text-[13px]">
        <div className="flex items-center gap-3">
          <Avatar name={p.name} size={40} />
          <span className="min-w-0">
            <b className="block text-[14px] font-medium">{p.name}</b>
            <small className="block text-[12px] text-muted">
              {p.age} / {p.sex} · MRN-{p.mrn}
            </small>
          </span>
        </div>
        <div>
          <span className="text-muted">Allergies:</span> {p.allergies}
        </div>
        <div>
          <span className="text-muted">Insurance:</span> {p.insurance}
        </div>
        {p.conditions.length > 0 && (
          <div>
            <span className="text-muted">Conditions:</span> {p.conditions.join(", ")}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/** Every action on the note, newest first, joined by a vertical line. */
export function AuditTrailCard({ audit }: { audit: AuditEntry[] }) {
  return (
    <Card>
      <CardHeader title="Audit Trail" icon={ShieldCheck} iconSize={19} />
      <Timeline>
        {[...audit].reverse().map((a, i) => {
          const d = new Date(a.t);
          return (
            <TimelineItem
              key={`${a.t}-${i}`}
              title={a.action}
              meta={
                <>
                  {relDay(d)}, {fmtTimeSec(d)} · {DOCTOR.name}
                </>
              }
            />
          );
        })}
      </Timeline>
    </Card>
  );
}
