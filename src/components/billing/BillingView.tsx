"use client";

import { CircleCheck, List, type LucideIcon, ReceiptText, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Card, KpiCard, KpiRow, SearchInput, type TabItem, Tabs } from "@/components/ui";
import { BILLING_KPIS, BILLING_USAGE, type CodeType, codeDesc, codeType } from "@/data";
import { BillingTable } from "./BillingTable";

type BillingTab = "all" | CodeType;

const TABS: TabItem<BillingTab>[] = [
  { value: "all", label: "All codes" },
  { value: "ICD-10", label: "ICD-10" },
  { value: "CPT", label: "CPT" },
];

const ICONS: Record<(typeof BILLING_KPIS)[number]["icon"], LucideIcon> = {
  receipt: ReceiptText,
  "check-circle": CircleCheck,
  list: List,
  "alert-triangle": TriangleAlert,
};

export function BillingView() {
  const [tab, setTab] = useState<BillingTab>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BILLING_USAGE.filter(
      ([c]) =>
        (tab === "all" || codeType(c) === tab) &&
        (!q || c.toLowerCase().includes(q) || codeDesc(c).toLowerCase().includes(q)),
    );
  }, [tab, query]);

  return (
    <>
      <PageHead
        title="Billing Codes"
        subtitle="ICD-10 and CPT codes suggested by the AI in the last 30 days"
        actions={
          <SearchInput
            className="w-[280px] max-w-full max-sm:w-full"
            placeholder="Search code or description…"
            aria-label="Search codes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        }
      />
      <KpiRow>
        {BILLING_KPIS.map((k) => (
          <KpiCard key={k.label} icon={ICONS[k.icon]} tone={k.tone} label={k.label} value={k.value} />
        ))}
      </KpiRow>
      <Tabs aria-label="Code type" items={TABS} value={tab} onChange={setTab} />
      <Card>
        <BillingTable rows={rows} />
      </Card>
    </>
  );
}
