"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IntegrationList } from "@/components/integrations/IntegrationList";
import { PageHead } from "@/components/layout/PageHead";
import { Card, type TabItem, Tabs } from "@/components/ui";
import { AiSettingsTab } from "./AiSettingsTab";
import { BillingTab } from "./BillingTab";
import { PracticeTab } from "./PracticeTab";
import { PreferencesTab } from "./PreferencesTab";
import { ProfileTab } from "./ProfileTab";

type Tab = "profile" | "practice" | "preferences" | "ai" | "billing" | "integrations";

const TABS: TabItem<Tab>[] = [
  { value: "profile", label: "Profile" },
  { value: "practice", label: "Practice" },
  { value: "preferences", label: "Preferences" },
  { value: "ai", label: "AI Settings" },
  { value: "billing", label: "Billing" },
  { value: "integrations", label: "Integrations" },
];

const isTab = (v: string | null): v is Tab => TABS.some((t) => t.value === v);

/** The tab lives in ?tab= so it survives a reload and can be linked to. Unknown values show Profile. */
export function SettingsView() {
  const router = useRouter();
  const pathname = usePathname();
  const param = useSearchParams().get("tab");
  const tab: Tab = isTab(param) ? param : "profile";

  return (
    <>
      <PageHead title="Settings" subtitle="Your profile, practice and how the AI scribe works" />
      <Tabs
        aria-label="Settings sections"
        items={TABS}
        value={tab}
        onChange={(t) => router.replace(`${pathname}?tab=${t}`, { scroll: false })}
      />
      {tab === "profile" && <ProfileTab />}
      {tab === "practice" && <PracticeTab />}
      {tab === "preferences" && <PreferencesTab />}
      {tab === "ai" && <AiSettingsTab />}
      {tab === "billing" && <BillingTab />}
      {tab === "integrations" && (
        <Card>
          <IntegrationList />
        </Card>
      )}
    </>
  );
}
