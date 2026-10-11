"use client";

import { CircleCheck, Pause } from "lucide-react";
import { useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { fmtTimeSec } from "@/lib/format";
import { useDemo } from "@/store/demo-store";
import {
  isSpeaking,
  liveSource,
  mergeTranscript,
  micAction,
  openEndConsult,
  useRecording,
} from "@/store/recording-store";
import { toast } from "@/store/ui-store";
import { CodesCard } from "./CodesCard";
import { FullSummaryModal } from "./FullSummaryModal";
import { RecordCard } from "./RecordCard";
import { SummaryCard } from "./SummaryCard";
import { Equalizer, TranscriptCard } from "./TranscriptCard";

// Cards bound to the live recording session. Each subscribes to only what it shows,
// so the 100ms ticks re-render the record card and the typing transcript, not the page.

export function SessionRecordCard({ variant = "dashboard" }: { variant?: "dashboard" | "live" }) {
  const status = useRecording((s) => s.status);
  const elapsed = useRecording((s) => s.t);
  const speaking = useRecording(isSpeaking);
  const mrn = useRecording((s) => s.mrn);
  const patientName = useDemo((s) => (mrn ? s.patientByMrn(mrn)?.name : undefined));
  return (
    <RecordCard
      variant={variant}
      status={status}
      elapsed={elapsed}
      speaking={speaking}
      patientName={patientName}
      onMic={micAction}
      onEnd={openEndConsult}
    />
  );
}

const SPEAKER_NAMES = { D: "Doctor", P: "Patient", N: "Note" } as const;

interface SessionTranscriptProps {
  /** Show only the last n lines (Dashboard). */
  max?: number;
  /** Consultation page: Copy button and a scrolling body. */
  full?: boolean;
}

export function SessionTranscript({ max, full = false }: SessionTranscriptProps) {
  const lines = useRecording((s) => s.lines);
  const notes = useRecording((s) => s.clinicianNotes);
  const transcript = useMemo(() => mergeTranscript(lines, notes), [lines, notes]);

  const copy = () => {
    if (!transcript.length) {
      toast("Nothing to copy yet.", "warn");
      return;
    }
    void copyText(transcript.map((l) => `[${fmtTimeSec(new Date(l.ts))}] ${SPEAKER_NAMES[l.speaker]}: ${l.text}`).join("\n"));
  };

  return (
    <TranscriptCard
      lines={transcript}
      max={max}
      animate
      scroll={full}
      onCopy={full ? copy : undefined}
      footer={<TranscriptStatus />}
    />
  );
}

function TranscriptStatus() {
  const status = useRecording((s) => s.status);
  const captured = useRecording((s) => s.captured);
  if (status === "recording" && captured) {
    return (
      <>
        <CircleCheck size={15} strokeWidth={1.8} aria-hidden className="shrink-0 text-blue" />
        <span>Conversation captured. Finish to generate the clinical note.</span>
      </>
    );
  }
  if (status === "recording") {
    return (
      <>
        <Equalizer active />
        <span>AI is listening and transcribing…</span>
      </>
    );
  }
  if (status === "paused") {
    return (
      <>
        <Pause size={15} strokeWidth={1.8} aria-hidden className="shrink-0" />
        <span>Recording paused</span>
      </>
    );
  }
  return (
    <>
      <Equalizer />
      <span>Waiting to start</span>
    </>
  );
}

/** AI Summary bound to the session, with its full summary modal. */
export function SessionSummary({ expandable = false }: { expandable?: boolean }) {
  const mrn = useRecording((s) => s.mrn);
  const summary = useRecording((s) => s.summary);
  const codes = useRecording((s) => s.codes);
  const evidence = useRecording((s) => s.evidence);
  const flash = useRecording((s) => s.flash);
  const openRows = useRecording((s) => s.openRows);
  const toggleRow = useRecording((s) => s.toggleRow);
  const startedAt = useRecording((s) => s.startedAt);
  const [fullOpen, setFullOpen] = useState(false);
  // The full summary shows the summary and codes only, so the transcript is left out.
  const source = useMemo(() => liveSource({ mrn, lines: [], clinicianNotes: [], summary, codes }), [mrn, summary, codes]);

  return (
    <>
      <SummaryCard
        key={startedAt}
        summary={summary}
        live
        flash={flash}
        expandable={expandable ? { evidence, flash, openRows, onToggle: toggleRow } : undefined}
        onViewFull={() => setFullOpen(true)}
      />
      <FullSummaryModal open={fullOpen} onClose={() => setFullOpen(false)} source={source} />
    </>
  );
}

export function SessionCodes({ live = false }: { live?: boolean }) {
  const codes = useRecording((s) => s.codes);
  const startedAt = useRecording((s) => s.startedAt);
  const list = useMemo(() => codes.map((c) => c.code), [codes]);
  // A new session remounts the card, so its codes flash again.
  return <CodesCard key={startedAt} codes={list} live={live} flash />;
}
