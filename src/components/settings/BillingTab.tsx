"use client";

import { useMemo } from "react";
import { Button, Card, CardHeader, Pill } from "@/components/ui";
import { PLANS } from "@/data/misc";
import { fmtMonthYear } from "@/lib/format";
import { useUi } from "@/store/ui-store";

/** The first of this month and the two before it. */
const lastThreeMonths = (now: Date) => [0, 1, 2].map((i) => new Date(now.getFullYear(), now.getMonth() - i, 1));

export function BillingTab() {
  const openModal = useUi((s) => s.openModal);
  const plan = PLANS.current;
  const months = useMemo(() => lastThreeMonths(new Date()), []);

  return (
    <div className="grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
      <Card className="px-5 py-[18px]">
        <Pill tone="gray">Current plan</Pill>
        <h2 className="mt-2.5 mb-1 text-[22px] font-semibold">{plan.name}</h2>
        <p className="text-muted">
          {plan.price} {plan.per}
        </p>
        <div className="mt-5 mb-2 flex justify-between text-[13px]">
          <span id="notes-usage">AI notes this month</span>
          <span className="tabular-nums">
            {plan.used} of {plan.limit}
          </span>
        </div>
        <div
          role="progressbar"
          aria-labelledby="notes-usage"
          aria-valuemin={0}
          aria-valuemax={plan.limit}
          aria-valuenow={plan.used}
          className="h-2 overflow-hidden rounded bg-gray-50"
        >
          <i className="block h-full bg-blue" style={{ width: `${(plan.used / plan.limit) * 100}%` }} />
        </div>
        <Button variant="primary" className="mt-[22px]" onClick={() => openModal({ name: "upgrade" })}>
          Upgrade to Pro
        </Button>
      </Card>
      <Card>
        <CardHeader title="Invoices" />
        <ul>
          {months.map((d) => (
            <li key={d.getTime()} className="flex items-center gap-4 border-b border-line-2 px-5 py-4 last:border-b-0">
              <div className="min-w-0 flex-1">
                <b className="block text-[13.5px] font-medium">{fmtMonthYear(d)}</b>
                <small className="text-[12.5px] text-muted">
                  {plan.name} · {plan.clinicians} clinicians
                </small>
              </div>
              <span className="tabular-nums">{plan.invoice}</span>
              <Pill tone="green">Paid</Pill>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
