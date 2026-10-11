"use client";

import { ChevronDown, Globe } from "lucide-react";
import { LanguageItems } from "@/components/layout/LanguageItems";
import { Card, Menu, Segmented, toast } from "@/components/ui";
import { type Settings, useDemo } from "@/store/demo-store";
import { SettingRow, SwitchRow } from "./SettingRow";

const FORMATS: { value: Settings["format"]; label: string }[] = [
  { value: "SOAP", label: "SOAP" },
  { value: "H&P", label: "H&P" },
  { value: "DAP", label: "DAP" },
];

export function PreferencesTab() {
  const settings = useDemo((s) => s.settings);
  const update = useDemo((s) => s.updateSettings);
  const language = useDemo((s) => s.language);
  const offline = useDemo((s) => s.offline);
  const toggleOffline = useDemo((s) => s.toggleOffline);

  return (
    <Card className="px-5 py-[18px]">
      <SettingRow
        title="Default transcription language"
        description="Used when a consultation starts"
        control={(id) => (
          <Menu
            width={230}
            aria-label="Transcription language"
            trigger={(p) => (
              <button
                type="button"
                {...p}
                aria-labelledby={id}
                aria-describedby={`${id}-value`}
                className="inline-flex h-[34px] items-center gap-2 rounded-[9px] border border-line bg-white pr-2.5 pl-[11px] text-[12.5px] font-medium hover:bg-surface-2"
              >
                <Globe size={15} strokeWidth={1.8} aria-hidden className="text-[#4a5675]" />
                <span id={`${id}-value`}>{language}</span>
                <ChevronDown size={14} strokeWidth={1.8} aria-hidden className="text-[#4a5675]" />
              </button>
            )}
          >
            <LanguageItems />
          </Menu>
        )}
      />
      <SettingRow
        title="Note format"
        description="Structure the AI follows for new notes"
        control={(id) => (
          <Segmented
            aria-labelledby={id}
            items={FORMATS}
            value={settings.format}
            onChange={(format) => {
              update({ format });
              toast(`New notes use ${format} format`);
            }}
          />
        )}
      />
      <SwitchRow
        title="Auto-save consultations"
        description="Save the transcript every few seconds while recording"
        checked={settings.autoSave}
        onChange={(autoSave) => update({ autoSave })}
      />
      {/* The same state as the top bar's Offline Mode pill. */}
      <SwitchRow
        title="Offline capture"
        description="Keep recording on a weak connection and sync later"
        checked={offline}
        onChange={toggleOffline}
      />
      <SwitchRow
        title="Email me a daily summary"
        description="Notes awaiting review at 6:00 PM"
        checked={settings.emailSummary}
        onChange={(emailSummary) => update({ emailSummary })}
      />
    </Card>
  );
}
