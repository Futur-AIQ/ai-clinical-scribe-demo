"use client";

import clsx from "clsx";
import type { KeyboardEvent, ReactNode } from "react";

export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}

/** Moves focus and selection with the arrow keys, Home and End. */
export function rovingKeys<T extends string>(items: { value: T }[], value: T, onChange: (v: T) => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const i = items.findIndex((t) => t.value === value);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].value);
    const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>("button");
    buttons[next]?.focus();
  };
}

export function Tabs<T extends string>({ items, value, onChange, className, ...aria }: TabsProps<T>) {
  const onKeyDown = rovingKeys(items, value, onChange);
  return (
    <div
      role="tablist"
      className={clsx("mb-4 flex gap-1 overflow-x-auto border-b border-line", className)}
      onKeyDown={onKeyDown}
      {...aria}
    >
      {items.map((t) => {
        const on = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={clsx(
              "-mb-px whitespace-nowrap border-b-2 px-3.5 pt-2.5 pb-[11px] text-[13px] font-medium",
              on ? "border-blue text-blue" : "border-transparent text-ink-2 hover:text-ink",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
