"use client";

import clsx from "clsx";
import { ChevronRight, ClipboardPlus, FileText, type LucideIcon, Pill, Sparkles, Stethoscope } from "lucide-react";
import { Fragment, type ReactNode, useState } from "react";
import { Card, CardHeader, CardLink } from "@/components/ui";
import type { LiveLine, Summary } from "@/lib/consult";
import { fmtTimeSec } from "@/lib/format";

type RowKey = "sym" | "dx" | "med" | "plan";

const ROWS: { key: RowKey; title: string; icon: LucideIcon; tile: string; filled?: boolean }[] = [
  { key: "sym", title: "Key Symptoms", icon: Stethoscope, tile: "bg-blue-50 text-blue" },
  { key: "dx", title: "Probable Diagnosis", icon: ClipboardPlus, tile: "bg-green-50 text-green" },
  { key: "med", title: "Medications", icon: Pill, tile: "bg-purple-50 text-purple", filled: true },
  { key: "plan", title: "Treatment Plan", icon: FileText, tile: "bg-amber-50 text-amber" },
];

/** One value per line. */
const lines = (items: string[]) =>
  items.map((v, i) => (
    <Fragment key={v}>
      {i > 0 && <br />}
      {v}
    </Fragment>
  ));

function rowValue(s: Summary, key: RowKey): ReactNode {
  if (key === "sym") return s.sym.join(", ");
  if (key === "dx") return s.dx ? lines(s.dx.split("\n")) : null;
  if (key === "med") return s.med.length ? lines(s.med) : null;
  return s.plan.join(" ");
}

/** The live session's extras: expandable evidence rows and flashes. */
export interface SummaryLive {
  evidence: Partial<Record<RowKey, LiveLine[]>>;
  /** Last change time (ms) per key. */
  flash: Partial<Record<string, number>>;
  openRows: ReadonlySet<string>;
  onToggle: (key: RowKey) => void;
}

interface SummaryCardProps {
  summary: Summary;
  /** Empty rows read "Listening…" instead of "Not captured", and changed rows flash. */
  live?: boolean;
  /** Consultation page: "(Live)" title, dividers, and rows that expand to show their evidence. */
  expandable?: SummaryLive;
  /** Last change time per key, for the flash on the Dashboard. */
  flash?: Partial<Record<string, number>>;
  onViewFull: () => void;
}

/** AI Summary: four tiles with what the AI has captured so far. */
export function SummaryCard({ summary, live = false, expandable, flash, onViewFull }: SummaryCardProps) {
  const flashes = expandable?.flash ?? flash ?? {};
  // Only changes after mount flash, so opening a page mid-visit does not replay old ones.
  const [mountFlash] = useState(flashes);
  return (
    <Card>
      <CardHeader
        title="AI Summary"
        subtitle={expandable ? "(Live)" : undefined}
        icon={Sparkles}
        iconSize={21}
        actions={
          <CardLink onClick={onViewFull} arrow={!expandable}>
            View Full Summary
          </CardLink>
        }
      />
      <div className="py-1.5">
        {ROWS.map((row) => {
          const at = flashes[row.key];
          const fresh = live && at !== undefined && at !== mountFlash[row.key];
          // Keyed by the change time so each change restarts the flash.
          const key = `${row.key}-${fresh ? at : 0}`;
          const value = rowValue(summary, row.key) || (
            <span className="text-faint italic">{live ? "Listening…" : "Not captured"}</span>
          );
          return expandable ? (
            <ExpandableRow
              key={key}
              row={row}
              value={value}
              fresh={fresh}
              open={expandable.openRows.has(row.key)}
              evidence={expandable.evidence[row.key] ?? []}
              onToggle={() => expandable.onToggle(row.key)}
            />
          ) : (
            <div key={key} className={clsx(rowGrid, "grid-cols-[44px_minmax(0,1fr)]", fresh && "animate-flash")}>
              <Tile row={row} />
              <div className="min-w-0">
                <h4 className="mb-[3px] text-[13.5px] font-semibold">{row.title}</h4>
                <div className={valueClass}>{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

const rowGrid = "grid items-start gap-3.5 px-5 py-[13px]";
const valueClass = "text-[12.8px] leading-[1.6] text-ink-2";

function Tile({ row }: { row: (typeof ROWS)[number] }) {
  const Icon = row.icon;
  return (
    <span className={`grid size-11 place-items-center rounded-[11px] ${row.tile}`}>
      <Icon size={22} strokeWidth={1.8} aria-hidden fill={row.filled ? "currentColor" : "none"} fillOpacity={row.filled ? 0.18 : undefined} />
    </span>
  );
}

interface ExpandableRowProps {
  row: (typeof ROWS)[number];
  value: ReactNode;
  fresh: boolean;
  open: boolean;
  evidence: LiveLine[];
  onToggle: () => void;
}

function ExpandableRow({ row, value, fresh, open, evidence, onToggle }: ExpandableRowProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={clsx(
        rowGrid,
        "w-full grid-cols-[44px_minmax(0,1fr)_auto] border-b border-line-2 text-left last:border-b-transparent hover:bg-surface-2",
        fresh && "animate-flash",
      )}
    >
      <Tile row={row} />
      <span className="block min-w-0">
        <span className="mb-[3px] block text-[13.5px] font-semibold">{row.title}</span>
        <span className={clsx("block", valueClass)}>{value}</span>
      </span>
      <ChevronRight
        size={18}
        strokeWidth={1.8}
        aria-hidden
        className={clsx("mt-3 text-muted transition-transform duration-200", open && "rotate-90")}
      />
      {open && (
        <span className="col-start-2 col-end-4 mt-0.5 block border-l-2 border-blue-100 py-0.5 pl-3 text-[12px] text-muted">
          {evidence.length
            ? evidence.map((l) => (
                <span key={l.id ?? l.ts} className="my-[3px] block">
                  <span className="tabular-nums">{fmtTimeSec(new Date(l.ts))}</span> ·{" "}
                  <span className="text-ink-2">“{l.text}”</span>
                </span>
              ))
            : "No supporting lines captured yet."}
        </span>
      )}
    </button>
  );
}
