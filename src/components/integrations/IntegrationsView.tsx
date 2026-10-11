"use client";

import { ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Card, CardBody, CardHeader, Timeline, TimelineItem } from "@/components/ui";
import { SYNC_ACTIVITY } from "@/data/misc";
import { fmtTime, relDay } from "@/lib/format";
import { IntegrationList } from "./IntegrationList";

export function IntegrationsView() {
  return (
    <>
      <PageHead title="Integrations" subtitle="Connect your EMR so approved notes and codes sync to the chart automatically" />
      <div className="grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
        <Card>
          <CardHeader title="EMR Systems" />
          <IntegrationList />
        </Card>
        <div className="flex min-w-0 flex-col gap-5">
          <SyncActivityCard />
          <Card>
            <CardBody className="flex gap-3">
              <ShieldCheck size={22} strokeWidth={1.8} aria-hidden className="shrink-0 text-blue" />
              <div>
                <b className="font-semibold">HIPAA-aligned data handling</b>
                <p className="mt-1 text-[13px] leading-[1.6] text-muted">
                  Audio is processed for transcription and then discarded by default. Notes sync over encrypted FHIR R4
                  connections with a full audit trail.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

const syncEvents = (now: Date) =>
  SYNC_ACTIVITY.map(([title, detail, minutesAgo]) => ({ title, detail, at: new Date(now.getTime() - minutesAgo * 60000) }));

function SyncActivityCard() {
  const events = useMemo(() => syncEvents(new Date()), []);
  return (
    <Card>
      <CardHeader title="Sync Activity" />
      <Timeline>
        {events.map((e) => (
          <TimelineItem
            key={e.title + e.detail}
            title={e.title}
            meta={
              <>
                {e.detail} · {relDay(e.at)}, {fmtTime(e.at)}
              </>
            }
          />
        ))}
      </Timeline>
    </Card>
  );
}
