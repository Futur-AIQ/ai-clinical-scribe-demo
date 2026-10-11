"use client";

import clsx from "clsx";
import { Plus, Receipt } from "lucide-react";
import { useState } from "react";
import { Button, Card, CardHeader, Checkbox, Select } from "@/components/ui";
import { CODES, codeDesc, codeType } from "@/data/codes";
import type { Note } from "@/data/types";
import { useDemo } from "@/store/demo-store";
import { toast } from "@/store/ui-store";

/** Billing codes on the note: include or remove each, and add codes from the library while editable. */
export function NoteCodesCard({ note: n, editable }: { note: Note; editable: boolean }) {
  const setIncluded = useDemo((s) => s.setCodeIncluded);
  const addCode = useDemo((s) => s.addCode);
  const [choice, setChoice] = useState("");
  const selected = n.codes.filter((c) => c.included).length;
  const available = Object.keys(CODES).filter((k) => !n.codes.some((c) => c.code === k));

  const add = () => {
    if (!choice) {
      toast("Choose a code to add.", "warn");
      return;
    }
    addCode(n.id, choice);
    setChoice("");
  };

  return (
    <Card>
      <CardHeader
        title="Billing Codes"
        icon={Receipt}
        iconSize={19}
        actions={<span className="text-[12.5px] text-faint">{selected} selected</span>}
      />
      <div className={clsx("pt-2", editable ? "pb-1" : "pb-3")}>
        {n.codes.map((c, i) => (
          <div
            key={c.code}
            className={clsx(
              "grid grid-cols-[20px_52px_74px_minmax(0,1fr)_auto] items-center gap-2.5 px-5 py-[9px] text-[13px]",
              !c.included && "opacity-45",
            )}
          >
            <Checkbox
              checked={c.included}
              onChange={(on) => setIncluded(n.id, i, on)}
              disabled={!editable}
              fadeDisabled={false}
              aria-label={`Include ${c.code}`}
            />
            <span className="text-[12.5px] font-medium">{codeType(c.code)}</span>
            <span
              className={clsx(
                "rounded-[7px] bg-blue-50 py-1 text-center text-[12.5px] font-semibold text-blue tabular-nums",
                !c.included && "line-through",
              )}
            >
              {c.code}
            </span>
            <span className="text-[12px] text-ink-2">{codeDesc(c.code)}</span>
            <span className="text-[11.5px] text-muted tabular-nums">{c.confidence ? `${c.confidence}%` : "manual"}</span>
          </div>
        ))}
      </div>
      {editable && (
        <div className="flex gap-2 px-5 pt-1.5 pb-[18px]">
          <Select aria-label="Add a code" value={choice} onChange={(e) => setChoice(e.target.value)} className="min-w-0 flex-1">
            <option value="">Add a code…</option>
            {available.map((k) => (
              <option key={k} value={k}>
                {k} · {codeDesc(k)}
              </option>
            ))}
          </Select>
          <Button icon={Plus} onClick={add}>
            Add
          </Button>
        </div>
      )}
    </Card>
  );
}
