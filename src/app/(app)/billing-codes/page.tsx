import type { Metadata } from "next";
import { BillingView } from "@/components/billing/BillingView";

export const metadata: Metadata = { title: "Billing Codes" };

export default function BillingCodesPage() {
  return <BillingView />;
}
