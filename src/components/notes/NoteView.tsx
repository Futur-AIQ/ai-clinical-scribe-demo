"use client";

import { CircleCheck, Lock, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Avatar, Button, buttonClass, Pill, StatusPill } from "@/components/ui";
import type { Note, Patient } from "@/data/types";
import { fmtDate, fmtTime } from "@/lib/format";
import { useDemo } from "@/store/demo-store";
import { toast } from "@/store/ui-store";
import { NoteCard } from "./NoteCard";
import { NoteCodesCard } from "./NoteCodesCard";
import { AuditTrailCard, NotePatientCard } from "./NoteSideCards";
import { encounterFor, SyncModal } from "./SyncModal";

/** Note review: the SOAP note, billing codes, patient and audit trail, with the sticky approve bar. */
export function NoteView({ note: n, patient: p }: { note: Note; patient: Patient }) {
  const saveDraft = useDemo((s) => s.saveDraft);
  const [amending, setAmending] = useState(false);
  const [sync, setSync] = useState<{ encounterId: string; amend: boolean } | null>(null);
  const completed = n.status === "Completed";
  const editable = !completed || amending;
  const d = new Date(n.date);

  return (
    <>
      <PageHead
        title={completed ? "Clinical Note" : "Review Clinical Note"}
        subtitle={`${n.aiDraft ? "AI-generated from the consultation on" : "Consultation on"} ${fmtDate(d)} at ${fmtTime(d)} · ${n.duration} duration`}
        actions={
          <>
            <StatusPill status={n.aiDraft && n.status === "Draft" ? "AI Draft" : n.status} />
            {n.synced && (
              <Pill tone="green">
                <CircleCheck size={13} strokeWidth={1.8} aria-hidden />
                Synced to Epic
              </Pill>
            )}
            <Link href={`/patients/${p.mrn}`} className={buttonClass("secondary", "md")}>
              <Avatar name={p.name} size={22} />
              {p.name}
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
        <NoteCard note={n} patient={p} editable={editable} onAmend={completed && !amending ? () => setAmending(true) : undefined} />
        <div className="flex min-w-0 flex-col gap-5">
          <NoteCodesCard note={n} editable={editable} />
          <NotePatientCard patient={p} />
          <AuditTrailCard audit={n.audit} />
        </div>
      </div>
      {/* Below 900px the bar sits above the fixed demo badge, so it never covers the approve button. */}
      {editable && (
        <div className="sticky bottom-0 z-20 mt-5 flex flex-wrap items-center gap-2.5 rounded-card border border-line bg-white/97 px-[18px] py-3.5 shadow-[0_-4px_18px_rgba(15,32,80,.06)] max-md:bottom-[58px] max-sm:px-3.5 max-sm:[&>button]:flex-1">
          <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
            <Lock size={14} strokeWidth={1.8} aria-hidden />
            Only you can see this draft until it is approved.
          </span>
          <div className="flex-1" />
          {completed ? (
            <Button size="lg" onClick={() => setAmending(false)}>
              Cancel
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => {
                saveDraft(n.id);
                toast("Draft saved");
              }}
            >
              Save Draft
            </Button>
          )}
          <Button size="lg" variant="primary" icon={Send} onClick={() => setSync({ encounterId: encounterFor(n.encounterId), amend: completed })}>
            {completed ? "Save Amendment & Sync" : "Approve & Sync to EMR"}
          </Button>
        </div>
      )}
      {sync && (
        <SyncModal
          noteId={n.id}
          encounterId={sync.encounterId}
          amend={sync.amend}
          onDone={() => {
            setSync(null);
            setAmending(false);
          }}
        />
      )}
    </>
  );
}
