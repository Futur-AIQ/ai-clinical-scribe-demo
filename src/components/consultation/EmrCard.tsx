"use client";

import clsx from "clsx";
import { CircleCheck, CloudUpload, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, Pill, toast } from "@/components/ui";
import { fmtTime, relDay } from "@/lib/format";
import { useDemo } from "@/store/demo-store";

const SYNC_MS = 1500;

export function EmrCard() {
  const connected = useDemo((s) => s.integrations.find((i) => i.id === "epic")?.connected ?? false);
  const lastSync = useDemo((s) => s.lastSync);
  const touchSync = useDemo((s) => s.touchSync);
  const [syncing, setSyncing] = useState(false);

  const sync = () => {
    if (syncing) return;
    setSyncing(true);
    // Not cleared on unmount: leaving the page mid-sync still finishes it.
    window.setTimeout(() => {
      touchSync();
      setSyncing(false);
      toast("Synced with Epic · 0 conflicts");
    }, SYNC_MS);
  };

  const last = new Date(lastSync);
  return (
    <Card>
      <div className="flex items-start gap-3 px-5 py-4">
        <CloudUpload size={30} strokeWidth={1.8} aria-hidden className="shrink-0 text-green" />
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-semibold">EMR Integration</h3>
          <p className="text-[12.5px] text-ink-2">
            {connected ? (
              <>
                Connected to <strong className="font-medium text-ink">Epic Systems</strong>
              </>
            ) : (
              "No EMR connected"
            )}
          </p>
        </div>
        <div className="ml-auto shrink-0">
          {!connected ? (
            <Pill tone="gray">Off</Pill>
          ) : syncing ? (
            <Pill tone="blue">Syncing…</Pill>
          ) : (
            <Pill tone="green">
              <CircleCheck size={13} strokeWidth={1.8} aria-hidden />
              Synced
            </Pill>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2.5 border-t border-line-2 px-5 pt-3 pb-3.5 text-[12.5px] text-ink-2">
        <span>
          Last sync: {relDay(last)}, {fmtTime(last)}
        </span>
        {connected ? (
          <Button size="sm" onClick={sync} aria-busy={syncing} className="text-blue">
            <RefreshCw size={14} strokeWidth={1.8} aria-hidden className={clsx(syncing && "animate-spin")} />
            {syncing ? "Syncing" : "Sync Now"}
          </Button>
        ) : (
          <Link href="/integrations" className="text-[12.5px] font-medium text-blue hover:underline">
            Connect
          </Link>
        )}
      </div>
    </Card>
  );
}
