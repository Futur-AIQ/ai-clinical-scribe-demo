import clsx from "clsx";
import { CircleCheck } from "lucide-react";
import type { ReactNode } from "react";

export type PillTone = "green" | "blue" | "gray" | "amber" | "red" | "purple";

const tones: Record<PillTone, string> = {
  green: "bg-green-50 text-green",
  blue: "bg-blue-50 text-blue",
  gray: "bg-gray-50 text-ink-2",
  amber: "bg-amber-50 text-[#b86600]",
  red: "bg-red-50 text-[#c62828]",
  purple: "bg-purple-50 text-[#6d3fd9]",
};

interface PillProps {
  tone?: PillTone;
  className?: string;
  children: ReactNode;
}

export function Pill({ tone = "gray", className, children }: PillProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11.5px] leading-[1.5] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusTones: Record<string, PillTone> = {
  Completed: "green",
  "In Progress": "blue",
  Draft: "gray",
  "AI Draft": "purple",
  Active: "green",
  Inactive: "gray",
  Archived: "amber",
};

/** Note and patient statuses. Unknown statuses fall back to gray. */
export function StatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <Pill tone={statusTones[status] ?? "gray"} className={className}>
      {status}
      {status === "Completed" && <CircleCheck size={13} strokeWidth={1.8} aria-hidden />}
    </Pill>
  );
}
