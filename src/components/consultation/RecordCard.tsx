"use client";

import clsx from "clsx";
import { ArrowRight, ChevronDown, Globe, Mic, Play, QrCode, Signal, Sparkles, Square, User } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Card, CardHeader, Menu, MenuItem } from "@/components/ui";
import { LanguageItems } from "@/components/layout/LanguageItems";
import { fmtDuration } from "@/lib/format";
import { useDemo } from "@/store/demo-store";
import { type RecordStatus, Waveform } from "./Waveform";

interface RecordCardProps {
  status: RecordStatus;
  /** Seconds recorded so far. */
  elapsed?: number;
  speaking?: boolean;
  /** The patient being recorded, shown under the mic on the Dashboard while live. */
  patientName?: string;
  /** Mic click: start when idle, pause or resume when live. */
  onMic: () => void;
  /** Consultation page layout: big timer, End Consultation and the language/speaker bar. */
  variant?: "dashboard" | "live";
  onEnd?: () => void;
}

const TIP = "Speak clearly and allow AI to capture the full conversation for best results.";

/** "Start New Consultation" card: mic, waveform and tip. */
export function RecordCard(props: RecordCardProps) {
  return props.variant === "live" ? <LiveRecordCard {...props} /> : <DashboardRecordCard {...props} />;
}

function DashboardRecordCard({ status, elapsed = 0, speaking = false, patientName, onMic }: RecordCardProps) {
  const live = status !== "idle";
  const paused = status === "paused";
  return (
    <Card>
      <CardHeader
        title="Start New Consultation"
        actions={
          live ? (
            <>
              <LiveTag status={status} />
              <span className="ml-[22px] text-[17px] font-medium tabular-nums">{fmtDuration(elapsed)}</span>
            </>
          ) : (
            <>
              <LiveTag status="idle" label="READY" />
              <span className="ml-[22px] text-[17px] font-medium text-faint tabular-nums">00:00</span>
            </>
          )
        }
      />
      <RecordBody
        left={
          <>
            <MicButton status={status} onClick={onMic} />
            <p className="text-[13px] leading-[1.55] text-muted">
              {live && patientName ? (
                <>
                  {paused ? "Paused" : "Recording"} · <b className="font-semibold text-ink">{patientName}</b>
                  <br />
                  <Link href="/consultation" className="inline-flex items-center gap-[5px] text-[12.5px] font-medium text-blue hover:underline">
                    Open consultation <ArrowRight size={13} strokeWidth={1.8} aria-hidden />
                  </Link>
                </>
              ) : (
                <IdleCaption />
              )}
            </p>
          </>
        }
        right={
          <>
            <Waveform status={status} speaking={speaking} />
            <p className="rounded-[10px] bg-blue-50 px-[15px] py-[13px] text-[13px] leading-[1.55] text-ink-2">
              <b className="font-medium text-blue">Tip:</b> {TIP}
            </p>
          </>
        }
      />
    </Card>
  );
}

function LiveRecordCard({ status, elapsed = 0, speaking = false, onMic, onEnd }: RecordCardProps) {
  const live = status !== "idle";
  const paused = status === "paused";
  return (
    <Card>
      <RecordBody
        left={
          <>
            <MicButton status={status} onClick={onMic} />
            <div className="mt-1 text-[26px] leading-none font-semibold text-blue tabular-nums">{fmtDuration(elapsed)}</div>
            <p className="text-[13px] leading-[1.55] text-muted">
              {!live ? <IdleCaption /> : paused ? "Paused · click to resume" : "Recording…"}
            </p>
            {live && (
              <Button variant="danger-outline" icon={Square} onClick={onEnd}>
                End Consultation
              </Button>
            )}
          </>
        }
        right={
          <>
            <span>
              <LiveTag status={status} label={live ? undefined : "READY TO RECORD"} />
            </span>
            <Waveform status={status} speaking={speaking} />
            <p className="flex gap-2.5 rounded-[10px] bg-blue-50 px-[15px] py-[13px] text-[13px] leading-[1.55] text-ink-2">
              <Sparkles size={16} strokeWidth={1.8} aria-hidden className="mt-0.5 shrink-0 text-blue" />
              <span>
                <b className="font-medium text-blue">Tip:</b> {TIP}
              </span>
            </p>
          </>
        }
      />
      <RecordBar />
    </Card>
  );
}

function RecordBody({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid grid-cols-[210px_minmax(0,1fr)] max-sm:grid-cols-1">
      <div className="my-4 flex flex-col items-center justify-center gap-3 border-r border-line-2 px-4 py-[22px] text-center max-sm:mx-4 max-sm:my-0 max-sm:border-r-0 max-sm:border-b">
        {left}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-4 p-[22px]">{right}</div>
    </div>
  );
}

function IdleCaption() {
  return (
    <>
      Click to start recording
      <br />
      or press the space bar
    </>
  );
}

const selClass =
  "inline-flex h-[34px] items-center gap-2 rounded-[9px] border border-line bg-white pr-2.5 pl-[11px] text-[12.5px] font-medium hover:bg-surface-2";
const selIcon = "shrink-0 text-[#4a5675]";

/** Language and speaker selects, and the connection chip. */
function RecordBar() {
  const lang = useDemo((s) => s.language);
  const autoSpeaker = useDemo((s) => s.settings.autoSpeaker);
  const updateSettings = useDemo((s) => s.updateSettings);
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-t border-line-2 px-5 pt-3 pb-3.5">
      <Menu
        align="left"
        width={230}
        aria-label="Transcription language"
        trigger={(p) => (
          <button type="button" {...p} aria-label={`Transcription language: ${lang}`} className={selClass}>
            <Globe size={16} strokeWidth={1.8} aria-hidden className={selIcon} />
            {lang}
            <ChevronDown size={14} strokeWidth={1.8} aria-hidden className={selIcon} />
          </button>
        )}
      >
        <LanguageItems />
      </Menu>
      <Menu
        align="left"
        width={240}
        aria-label="Speaker labels"
        trigger={(p) => (
          <button type="button" {...p} className={selClass}>
            <QrCode size={16} strokeWidth={1.8} aria-hidden className={selIcon} />
            {autoSpeaker ? "Auto Detect Speaker" : "Manual Speaker Labels"}
            <ChevronDown size={14} strokeWidth={1.8} aria-hidden className={selIcon} />
          </button>
        )}
      >
        <MenuItem icon={QrCode} checked={autoSpeaker} onSelect={() => updateSettings({ autoSpeaker: true })}>
          Auto Detect Speaker
        </MenuItem>
        <MenuItem icon={User} checked={!autoSpeaker} onSelect={() => updateSettings({ autoSpeaker: false })}>
          Manual speaker labels
        </MenuItem>
      </Menu>
      <span className="ml-auto inline-flex items-center gap-[7px] rounded-full border border-line px-3 py-[5px] text-[12px] text-ink-2">
        <Signal size={15} strokeWidth={1.8} aria-hidden className="text-[#16a34a]" />
        Good Connection
      </span>
    </div>
  );
}

/** "LIVE RECORDING" with a blinking red dot, "PAUSED", or a gray idle label. */
function LiveTag({ status, label }: { status: RecordStatus; label?: string }) {
  const idle = status === "idle";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[.04em]",
        idle ? "text-muted" : "text-ink",
      )}
    >
      <i aria-hidden className={clsx("size-2 rounded-full", idle ? "bg-faint" : "bg-red", status === "recording" && "animate-blink")} />
      {label ?? (status === "paused" ? "PAUSED" : "LIVE RECORDING")}
    </span>
  );
}

function MicButton({ status, onClick }: { status: RecordStatus; onClick: () => void }) {
  const paused = status === "paused";
  const label = status === "idle" ? "Start recording" : paused ? "Resume recording" : "Pause recording";
  return (
    <div
      className={clsx(
        "relative grid size-[142px] shrink-0 place-items-center rounded-full",
        "bg-[radial-gradient(circle,rgba(26,92,244,.09)_0_60%,rgba(26,92,244,.045)_60%_100%)]",
      )}
    >
      {status === "recording" && (
        <>
          <span aria-hidden className="absolute inset-2 animate-ring rounded-full motion-reduce:hidden border-2 border-[rgba(26,92,244,.25)]" />
          <span aria-hidden className="absolute inset-2 animate-ring rounded-full motion-reduce:hidden border-2 border-[rgba(26,92,244,.25)] [animation-delay:1s]" />
        </>
      )}
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={clsx(
          "relative z-[1] grid size-[94px] place-items-center rounded-full text-white transition-transform duration-150 hover:scale-[1.04]",
          "shadow-[0_0_0_7px_#fff,0_0_0_9px_rgba(26,92,244,.32),0_12px_26px_rgba(26,92,244,.32)]",
          paused
            ? "bg-[radial-gradient(circle_at_50%_35%,#5b8cff,#3a6ff0)]"
            : "bg-[radial-gradient(circle_at_50%_35%,#2f74ff,#1450e6)]",
        )}
      >
        {paused ? <Play size={38} strokeWidth={1.8} aria-hidden /> : <Mic size={38} strokeWidth={1.8} aria-hidden />}
      </button>
    </div>
  );
}
