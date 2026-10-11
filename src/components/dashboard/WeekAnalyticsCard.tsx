"use client";

import clsx from "clsx";
import { ArrowUp } from "lucide-react";
import { useMemo } from "react";
import { LineChart } from "@/components/charts/LineChart";
import { Card, CardHeader, CardLink } from "@/components/ui";
import { DOW, lastNDays, WEEK_SERIES, WEEK_STATS } from "@/data";

/** Dashboard "Consultation Analytics (This Week)". */
export function WeekAnalyticsCard() {
  // Weekday labels for the last 7 days ending today. Rendered after the store is ready, so on the client only.
  const labels = useMemo(() => lastNDays(7).map((d) => DOW[d.getDay()]), []);
  return (
    <Card>
      <CardHeader
        title="Consultation Analytics"
        subtitle="(This Week)"
        actions={<CardLink href="/analytics">View Analytics</CardLink>}
      />
      <div className="grid grid-cols-4 gap-1 px-[18px] pt-3.5 pb-1.5 max-sm:grid-cols-2 max-sm:gap-3">
        {WEEK_STATS.map((s) => (
          <div key={s.label} className="min-w-0">
            <small className="block text-[11.5px] text-ink-2">{s.label}</small>
            <b className="my-0.5 block text-[17px] font-semibold tabular-nums">{s.value}</b>
            <span
              className={clsx(
                "inline-flex items-center gap-[3px] text-[11.5px] font-medium",
                s.warm ? "text-amber" : "text-green",
              )}
            >
              <ArrowUp size={12} strokeWidth={2} aria-hidden />
              {s.delta}
            </span>
          </div>
        ))}
      </div>
      <div className="px-3 pt-1 pb-3">
        <LineChart values={WEEK_SERIES} labels={labels} height={140} label="Consultations per day this week" />
      </div>
    </Card>
  );
}
