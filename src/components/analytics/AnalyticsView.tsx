"use client";

import { ArrowUp, CircleCheck, Clock, FileText, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";
import { Donut } from "@/components/charts/Donut";
import { Gauge } from "@/components/charts/Gauge";
import { LineChart } from "@/components/charts/LineChart";
import { PageHead } from "@/components/layout/PageHead";
import { PracticeName } from "@/components/layout/PracticeName";
import { Card, CardBody, CardHeader, KpiCard, KpiRow, Segmented, type TabItem } from "@/components/ui";
import {
  ENCOUNTER_TYPES,
  MINUTES_SAVED_PER_NOTE,
  QUALITY_BARS,
  type Range,
  SATISFACTION,
  TOP_DIAGNOSES,
  analyticsFor,
} from "@/data";
import { fmtNumber } from "@/lib/format";
import { BarRow } from "./BarRow";

const RANGES: TabItem<Range>[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

function Delta({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-[3px] text-[11.5px] font-medium text-green">
      <ArrowUp size={12} strokeWidth={2} aria-hidden />
      {children}
    </span>
  );
}

export function AnalyticsView() {
  const [range, setRange] = useState<Range>("30");
  // Rendered after the store is ready, so `now` is the browser's clock.
  const a = useMemo(() => analyticsFor(range, new Date()), [range]);

  const dx = TOP_DIAGNOSES.map(([label, n]) => [label, Math.round(n * a.factor)] as const);
  const top = dx[0][1];

  return (
    <>
      <PageHead
        title="Analytics"
        subtitle={
          <>
            Documentation volume, coding and quality across <PracticeName />
          </>
        }
        actions={<Segmented aria-label="Date range" items={RANGES} value={range} onChange={setRange} />}
      />

      <KpiRow>
        <KpiCard icon={Stethoscope} tone="blue" label="Total Consultations" value={fmtNumber(a.cons)} delta={a.deltas[0]} deltaLabel="vs previous period" />
        <KpiCard icon={Clock} tone="green" label="Avg. Duration" value={a.dur} delta={a.deltas[1]} deltaLabel="vs previous period" />
        <KpiCard icon={CircleCheck} tone="purple" label="Completion Rate" value={a.comp} delta={a.deltas[2]} deltaLabel="vs previous period" />
        <KpiCard icon={FileText} tone="amber" label="Notes Generated" value={fmtNumber(a.notes)} delta={a.deltas[3]} deltaLabel="vs previous period" />
      </KpiRow>

      <div className="mb-5 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 max-lg:grid-cols-1">
        <Card>
          <CardHeader title="Consultations Over Time" actions={<span className="text-[12.5px] text-faint">{a.unit}</span>} />
          <div className="px-4 pt-3 pb-3.5">
            <LineChart
              values={a.series}
              labels={a.labels}
              width={640}
              height={220}
              labelEvery={a.labelEvery}
              label={`Consultations ${a.unit} over the last ${range} days`}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="By Encounter Type" />
          <CardBody className="flex flex-wrap items-center gap-[18px]">
            <Donut parts={ENCOUNTER_TYPES} label="Consultations by encounter type" />
            <ul className="flex min-w-[140px] flex-1 flex-col gap-[9px] text-[12.5px]">
              {ENCOUNTER_TYPES.map(([label, v, color]) => (
                <li key={label} className="flex items-center gap-2">
                  <i className="size-[9px] shrink-0 rounded-full" style={{ background: color }} aria-hidden />
                  {label}
                  <span className="ml-auto text-ink-2 tabular-nums">{v}%</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <Card>
          <CardHeader title="Top Diagnoses" />
          <div className="flex flex-col gap-3.5 px-5 py-[18px]">
            {dx.map(([label, n]) => (
              <BarRow key={label} label={label} value={`${n} (${Math.round((n / a.cons) * 100)}%)`} percent={(n / top) * 100} />
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Satisfaction Score" />
          <CardBody className="flex flex-col items-center gap-1.5">
            <Gauge value={SATISFACTION.score} label={`Satisfaction ${SATISFACTION.score} of 5`} />
            <Delta>{`${SATISFACTION.delta} vs previous period`}</Delta>
            <span className="text-[12.5px] text-faint">From {SATISFACTION.ratings} post-visit clinician ratings</span>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Time Saved" />
          <CardBody className="flex flex-col gap-3.5">
            <div>
              <b className="text-[28px] font-semibold tabular-nums">{((a.notes * MINUTES_SAVED_PER_NOTE) / 60).toFixed(1)} h</b>
              <p className="text-[12.5px] text-muted">
                Estimated documentation time saved, at {MINUTES_SAVED_PER_NOTE} minutes per note
              </p>
            </div>
            {QUALITY_BARS.map(([label, v]) => (
              <BarRow key={label} label={label} value={`${v}%`} percent={v} tone="green" />
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
