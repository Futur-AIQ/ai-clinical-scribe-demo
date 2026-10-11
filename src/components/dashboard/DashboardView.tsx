"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CodesCard } from "@/components/consultation/CodesCard";
import { EmrCard } from "@/components/consultation/EmrCard";
import { FullSummaryModal } from "@/components/consultation/FullSummaryModal";
import { SessionCodes, SessionRecordCard, SessionSummary, SessionTranscript } from "@/components/consultation/SessionCards";
import { SummaryCard } from "@/components/consultation/SummaryCard";
import { Equalizer, TranscriptCard } from "@/components/consultation/TranscriptCard";
import { clinicDay } from "@/data";
import { idleSource } from "@/lib/consult";
import { useRecordingKeys } from "@/lib/use-shortcuts";
import { useDemo } from "@/store/demo-store";
import { useRecording } from "@/store/recording-store";
import { RecentConsultationsCard } from "./RecentConsultationsCard";
import { WeekAnalyticsCard } from "./WeekAnalyticsCard";

const LAST_SESSION_NOTE = "n1003";

/** Dashboard. While recording, the transcript, summary and codes follow the live session; otherwise the last session. */
export function DashboardView() {
  const live = useRecording((s) => s.status !== "idle");
  useRecordingKeys();

  return (
    <div className="grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
      <div className="flex min-w-0 flex-col gap-5">
        <SessionRecordCard />
        {live ? <SessionTranscript max={5} /> : <LastSessionTranscript />}
        <RecentConsultationsCard />
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        {live ? (
          <>
            <SessionSummary />
            <SessionCodes />
          </>
        ) : (
          <LastSessionCards />
        )}
        <EmrCard />
        <WeekAnalyticsCard />
      </div>
    </div>
  );
}

/** The last session (Emily Davis, fever case), shown while idle. */
function useLastSession() {
  const lastDate = useDemo((s) => s.notes.find((n) => n.id === LAST_SESSION_NOTE)?.date);
  return useMemo(() => idleSource(lastDate ? new Date(lastDate) : clinicDay(1, 16, 45)), [lastDate]);
}

function LastSessionTranscript() {
  const source = useLastSession();
  const patientName = useDemo((s) => s.patientByMrn(source.mrn)?.name);
  return (
    <TranscriptCard
      lines={source.lines}
      max={4}
      footer={
        <>
          <Equalizer />
          <span>
            Last session · {patientName} ·{" "}
            <Link href={`/notes/${LAST_SESSION_NOTE}`} className="font-medium text-blue hover:underline">
              Open note
            </Link>
          </span>
        </>
      }
    />
  );
}

function LastSessionCards() {
  const source = useLastSession();
  const [fullOpen, setFullOpen] = useState(false);
  return (
    <>
      <SummaryCard summary={source.summary} live={source.live} onViewFull={() => setFullOpen(true)} />
      <CodesCard codes={source.codes} live={source.live} />
      <FullSummaryModal open={fullOpen} onClose={() => setFullOpen(false)} source={source} />
    </>
  );
}
