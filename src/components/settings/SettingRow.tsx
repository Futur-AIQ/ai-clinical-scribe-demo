"use client";

import { type ReactNode, useId } from "react";
import { Switch, toast } from "@/components/ui";

interface SettingRowProps {
  title: string;
  description: ReactNode;
  /** The control on the right. Receives the title's id for aria-labelledby. */
  control: (labelId: string) => ReactNode;
}

/** Bold title and muted description, control on the right. The control drops below the text on narrow screens. */
export function SettingRow({ title, description, control }: SettingRowProps) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-line-2 py-4 last:border-b-0">
      <div className="min-w-[200px] flex-1">
        <b id={id} className="block text-[13.5px] font-medium">
          {title}
        </b>
        <small className="mt-0.5 block text-[12.5px] text-muted">{description}</small>
      </div>
      {control(id)}
    </div>
  );
}

interface SwitchRowProps {
  title: string;
  description: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** A setting row with a switch that toasts "Setting saved". */
export function SwitchRow({ title, description, checked, onChange }: SwitchRowProps) {
  return (
    <SettingRow
      title={title}
      description={description}
      control={(id) => (
        <Switch
          aria-labelledby={id}
          checked={checked}
          onChange={(v) => {
            onChange(v);
            toast("Setting saved");
          }}
        />
      )}
    />
  );
}
