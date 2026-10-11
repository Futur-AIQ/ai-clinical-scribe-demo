"use client";

import clsx from "clsx";
import { Receipt } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardLink, EmptyState } from "@/components/ui";
import { codeDesc, codeType } from "@/data";

interface CodesCardProps {
  codes: string[];
  /** Consultation page: "(Live Suggestions)". */
  live?: boolean;
  /** New codes flash as they arrive. */
  flash?: boolean;
}

export function CodesCard({ codes, live = false, flash = live }: CodesCardProps) {
  // Codes that arrive after mount flash; the ones already there when the page opens do not.
  const [initial] = useState(() => new Set(codes));
  return (
    <Card>
      <CardHeader
        title="Billing Codes"
        icon={Receipt}
        iconSize={19}
        subtitle={live ? "(Live Suggestions)" : undefined}
        actions={
          <CardLink href="/billing-codes" arrow={!live}>
            View All Codes
          </CardLink>
        }
      />
      {codes.length === 0 ? (
        <EmptyState icon={Receipt} iconSize={22} className="py-[22px]">
          Codes are suggested as the diagnosis and services come up.
        </EmptyState>
      ) : (
        <div className="pt-2 pb-2.5">
          {codes.map((c) => (
            <div
              key={c}
              className={clsx(
                "grid grid-cols-[52px_74px_minmax(0,1fr)] items-center gap-3 px-5 py-[9px] text-[13px]",
                flash && !initial.has(c) && "animate-flash",
              )}
            >
              <span className="font-medium">{codeType(c)}</span>
              <span className="rounded-[7px] bg-blue-50 py-1 text-center text-[12.5px] font-semibold text-blue tabular-nums">{c}</span>
              <span className="text-[12px] text-ink-2">{codeDesc(c)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
