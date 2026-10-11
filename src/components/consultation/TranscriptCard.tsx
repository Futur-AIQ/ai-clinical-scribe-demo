"use client";

import clsx from "clsx";
import { AudioLines, Copy } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import { Button, Card, CardHeader, EmptyState, Pill } from "@/components/ui";
import type { Speaker } from "@/data/types";
import type { LiveLine } from "@/lib/consult";
import { fmtTimeSec } from "@/lib/format";

const SPEAKERS: Record<Speaker, { label: string; className: string }> = {
  D: { label: "Doctor:", className: "text-blue" },
  P: { label: "Patient:", className: "text-green" },
  N: { label: "Note:", className: "text-[#b86600]" },
};

interface TranscriptCardProps {
  lines: LiveLine[];
  /** Show only the last n lines. */
  max?: number;
  /** Status line under the transcript, usually with an <Equalizer />. */
  footer?: ReactNode;
  /** Shows a Copy button. */
  onCopy?: () => void;
  /** Scrolls at 360px and follows the newest line. */
  scroll?: boolean;
  /** New rows fade in (live sessions). */
  animate?: boolean;
}

export function TranscriptCard({ lines, max, footer, onCopy, scroll = false, animate = false }: TranscriptCardProps) {
  const shown = max ? lines.slice(-max) : lines;
  const scrollRef = useRef<HTMLDivElement>(null);
  const last = shown.at(-1);
  const progress = `${shown.length}:${last?.shown ?? 0}`;

  // Follow the line being typed.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [progress]);

  return (
    <Card>
      <CardHeader
        title="Live Transcription"
        icon={AudioLines}
        iconSize={19}
        actions={
          <>
            <Pill tone="green">Real-time</Pill>
            {onCopy && (
              <Button size="sm" icon={Copy} onClick={onCopy}>
                Copy
              </Button>
            )}
          </>
        }
      />
      {shown.length === 0 ? (
        <EmptyState icon={AudioLines} iconSize={26}>
          The transcript appears here as the conversation happens.
        </EmptyState>
      ) : (
        <div ref={scrollRef} className={clsx(scroll && "max-h-[360px] overflow-y-auto scroll-smooth")}>
          <div className="px-5 pt-2.5 pb-1">
            {shown.map((l) => (
              <TranscriptRow key={l.id ?? `${l.ts}-${l.speaker}`} line={l} animate={animate} />
            ))}
          </div>
        </div>
      )}
      {footer && <div className="flex items-center gap-[9px] px-5 pt-1.5 pb-4 text-[12.5px] text-muted">{footer}</div>}
    </Card>
  );
}

/** One transcript row: speaker, text and time. Also used read-only on the note page. */
export function TranscriptRow({ line, animate = false }: { line: LiveLine; animate?: boolean }) {
  const sp = SPEAKERS[line.speaker];
  const words = line.text.split(" ");
  const typing = line.shown !== undefined && line.shown < words.length;
  return (
    <div
      className={clsx(
        "grid grid-cols-[56px_minmax(0,1fr)_auto] items-baseline gap-3.5 py-2 text-[13.5px] max-sm:grid-cols-[52px_minmax(0,1fr)]",
        animate && "animate-fadein",
      )}
    >
      <span className={clsx("font-medium", sp.className)}>{sp.label}</span>
      <span className={clsx(line.speaker === "N" && "-my-1 rounded-lg bg-amber-50 px-[9px] py-1")}>
        {typing ? words.slice(0, line.shown).join(" ") : line.text}
        {typing && (
          <span aria-hidden className="ml-[3px] inline-block h-3.5 w-0.5 animate-[blink_1s_infinite] bg-blue align-[-2px]" />
        )}
      </span>
      <span className="text-[12px] whitespace-nowrap text-muted tabular-nums max-sm:col-start-2 max-sm:-mt-1.5">
        {fmtTimeSec(new Date(line.ts))}
      </span>
    </div>
  );
}

/** The small teal 4-bar equalizer in the transcript footer. Animates when active. */
export function Equalizer({ active = false }: { active?: boolean }) {
  return (
    <span aria-hidden className="inline-flex h-3 items-center gap-0.5">
      {[0, 0.15, 0.3, 0.45].map((delay) => (
        <i
          key={delay}
          className={clsx("h-[5px] w-[2.5px] rounded-[2px] bg-teal", active && "animate-eq")}
          style={active ? { animationDelay: `${delay}s` } : undefined}
        />
      ))}
    </span>
  );
}
