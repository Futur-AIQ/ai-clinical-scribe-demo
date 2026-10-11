"use client";

import clsx from "clsx";
import { Check, ChevronDown, FileCheck, FileText, UserPlus } from "lucide-react";
import { PageHead } from "@/components/layout/PageHead";
import { Avatar, Button, Card } from "@/components/ui";
import { useRecordingKeys } from "@/lib/use-shortcuts";
import { useDemo } from "@/store/demo-store";
import { finishConsultation, openAddNote, useRecording } from "@/store/recording-store";
import { useUi } from "@/store/ui-store";
import { EmrCard } from "./EmrCard";
import { SessionCodes, SessionRecordCard, SessionSummary, SessionTranscript } from "./SessionCards";

/** /consultation: the live recording, transcript, summary and codes. */
export function ConsultationView() {
  const live = useRecording((s) => s.status !== "idle");
  useRecordingKeys();

  return (
    <>
      <PageHead
        title={live ? "Consultation in Progress" : "New Consultation"}
        subtitle={live ? "Recording and transcribing the conversation in real time" : "Choose a patient, then start recording"}
        actions={<PatientChip />}
      />
      <div className="grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-5">
          <SessionRecordCard variant="live" />
          <SessionTranscript full />
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <SessionSummary expandable />
          <SessionCodes live />
          <EmrCard />
        </div>
      </div>
      <SaveBar live={live} />
    </>
  );
}

const chipClass = "flex items-center gap-2.5 rounded-xl border border-line bg-white py-[7px] pr-3 pl-2 text-left";

/** The patient being recorded; when idle, a button that opens the case picker. */
function PatientChip() {
  const mrn = useRecording((s) => s.mrn);
  const patient = useDemo((s) => (mrn ? s.patientByMrn(mrn) : undefined));
  const openModal = useUi((s) => s.openModal);

  if (patient) {
    return (
      <div className={chipClass}>
        <Avatar name={patient.name} size={34} />
        <span>
          <b className="block text-[13px] font-semibold">{patient.name}</b>
          <small className="block text-[12px] text-muted">
            {patient.age} / {patient.sex} · MRN-{patient.mrn}
          </small>
        </span>
      </div>
    );
  }
  return (
    <button type="button" className={clsx(chipClass, "hover:bg-surface-2")} onClick={() => openModal({ name: "picker" })}>
      <span className="grid size-[34px] place-items-center text-blue">
        <UserPlus size={20} strokeWidth={1.8} aria-hidden />
      </span>
      <span>
        <b className="block text-[13px] font-semibold">Select patient</b>
        <small className="block text-[12px] text-muted">Pick a sample visit</small>
      </span>
      <ChevronDown size={16} strokeWidth={1.8} aria-hidden className="ml-1 text-muted" />
    </button>
  );
}

function SaveBar({ live }: { live: boolean }) {
  const offline = useDemo((s) => s.offline);
  return (
    <Card className="mt-5 flex flex-wrap items-center gap-3 bg-[#f7f9fe] px-[22px] py-4">
      <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-[#22a565] text-white">
        <Check size={14} strokeWidth={2.4} aria-hidden />
      </span>
      <span className="text-[12.5px] text-ink-2">
        {live ? "This consultation is being saved automatically" : "Recordings are saved automatically once started"}
        {offline && " · offline capture on"}
      </span>
      <div className="flex-1" />
      <Button size="lg" icon={FileText} disabled={!live} onClick={openAddNote}>
        Add Note
      </Button>
      <Button size="lg" variant="primary" icon={FileCheck} disabled={!live} onClick={finishConsultation}>
        Finish &amp; Generate Note
      </Button>
    </Card>
  );
}
