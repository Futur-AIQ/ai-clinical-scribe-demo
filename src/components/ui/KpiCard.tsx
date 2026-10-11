import { ArrowUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "./Card";

const tiles = {
  blue: "bg-blue-50 text-blue",
  green: "bg-green-50 text-green",
  amber: "bg-amber-50 text-amber",
  purple: "bg-purple-50 text-purple",
};

export type KpiTone = keyof typeof tiles;

interface KpiCardProps {
  icon: LucideIcon;
  tone: KpiTone;
  label: string;
  value: string;
  /** "↑ {delta} {deltaLabel}" under the value, when given. */
  delta?: string;
  deltaLabel?: string;
}

export function KpiCard({ icon: Icon, tone, label, value, delta, deltaLabel }: KpiCardProps) {
  return (
    <Card className="flex items-start gap-4 p-5 max-sm:flex-col max-sm:gap-2.5 max-sm:p-4">
      <span className={`grid size-12 shrink-0 place-items-center rounded-[11px] max-sm:size-10 ${tiles[tone]}`}>
        <Icon size={24} strokeWidth={1.8} aria-hidden className="max-sm:size-5" />
      </span>
      <div className="min-w-0">
        <small className="block text-[12.5px] text-ink-2">{label}</small>
        <b className="mt-1 mb-[3px] block text-[22px] font-semibold tabular-nums max-sm:text-[20px]">{value}</b>
        {delta && (
          <span className="inline-flex flex-wrap items-center gap-x-[3px] text-[11.5px] font-medium text-green">
            <ArrowUp size={12} strokeWidth={2} aria-hidden />
            {delta}
            {deltaLabel && <span className="ml-[3px] font-normal whitespace-nowrap text-muted">{deltaLabel}</span>}
          </span>
        )}
      </div>
    </Card>
  );
}

/** The 4-up KPI row above a page's table or charts. Two columns below 1200px, phones included. */
export function KpiRow({ children }: { children: ReactNode }) {
  return <div className="mb-[22px] grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:gap-3">{children}</div>;
}
