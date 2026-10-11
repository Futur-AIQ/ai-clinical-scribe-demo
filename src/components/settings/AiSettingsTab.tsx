"use client";

import { Card, Segmented, Select, toast } from "@/components/ui";
import { type Settings, useDemo } from "@/store/demo-store";
import { SettingRow, SwitchRow } from "./SettingRow";

const DETAILS: { value: Settings["detail"]; label: string }[] = [
  { value: "Concise", label: "Concise" },
  { value: "Standard", label: "Standard" },
  { value: "Detailed", label: "Detailed" },
];
const VOCABULARIES = ["Family Medicine", "Internal Medicine", "Cardiology", "Pediatrics", "Endocrinology"];

export function AiSettingsTab() {
  const s = useDemo((st) => st.settings);
  const update = useDemo((st) => st.updateSettings);

  return (
    <Card className="px-5 py-[18px]">
      <SwitchRow
        title="Auto speaker detection"
        description="Label each line as doctor or patient automatically"
        checked={s.autoSpeaker}
        onChange={(autoSpeaker) => update({ autoSpeaker })}
      />
      <SwitchRow
        title="Suggest billing codes"
        description="ICD-10 and CPT suggestions while the visit is recorded"
        checked={s.suggestCodes}
        onChange={(suggestCodes) => update({ suggestCodes })}
      />
      <SettingRow
        title="Summary detail"
        description="How much the AI writes in each section"
        control={(id) => (
          <Segmented
            aria-labelledby={id}
            items={DETAILS}
            value={s.detail}
            onChange={(detail) => {
              update({ detail });
              toast(`Summary detail set to ${detail}`);
            }}
          />
        )}
      />
      <SettingRow
        title="Specialty vocabulary"
        description="Improves recognition of drug names and terms"
        control={(id) => (
          <Select
            aria-labelledby={id}
            className="w-[200px]"
            value={s.vocabulary}
            onChange={(e) => {
              update({ vocabulary: e.target.value });
              toast("Vocabulary updated");
            }}
          >
            {VOCABULARIES.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        )}
      />
      <SettingRow
        title="Code confidence threshold"
        description={<>Hide suggestions below {s.threshold}%</>}
        control={(id) => (
          <input
            type="range"
            aria-labelledby={id}
            aria-valuetext={`${s.threshold}%`}
            min={50}
            max={95}
            step={5}
            value={s.threshold}
            onChange={(e) => update({ threshold: Number(e.target.value) })}
            className="w-[200px] accent-blue"
          />
        )}
      />
      <SwitchRow
        title="Require approval before EMR sync"
        description="Notes stay as drafts until a clinician approves"
        checked={s.requireApproval}
        onChange={(requireApproval) => update({ requireApproval })}
      />
      <SwitchRow
        title="Redact identifiers in exports"
        description="Remove names and MRNs from copied text"
        checked={s.redactExports}
        onChange={(redactExports) => update({ redactExports })}
      />
    </Card>
  );
}
