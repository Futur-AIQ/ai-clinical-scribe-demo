"use client";

import clsx from "clsx";
import { type TabItem, rovingKeys } from "./Tabs";

interface SegmentedProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Segmented<T extends string>({ items, value, onChange, className, ...aria }: SegmentedProps<T>) {
  const onKeyDown = rovingKeys(items, value, onChange);
  return (
    <div
      role="radiogroup"
      className={clsx("inline-flex gap-0.5 rounded-[9px] bg-gray-50 p-[3px]", className)}
      onKeyDown={onKeyDown}
      {...aria}
    >
      {items.map((t) => {
        const on = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={clsx(
              "rounded-[7px] px-3 py-[5px] text-[12.5px] font-medium whitespace-nowrap transition-colors duration-150",
              on ? "bg-white text-ink shadow-[0_1px_3px_rgba(15,32,80,.1)]" : "text-ink-2 hover:text-ink",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
