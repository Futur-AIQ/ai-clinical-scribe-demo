"use client";

import clsx from "clsx";
import type { ComponentProps } from "react";

interface SwitchProps extends Omit<ComponentProps<"button">, "onChange" | "children"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Needs an accessible name: pass aria-label or aria-labelledby. */
export function Switch({ checked, onChange, className, type = "button", ...rest }: SwitchProps) {
  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative h-[22px] w-[38px] shrink-0 rounded-[11px] transition-colors duration-200",
        "disabled:pointer-events-none disabled:opacity-45",
        checked ? "bg-blue" : "bg-[#d4d9e4]",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className={clsx(
          "absolute top-[3px] left-[3px] size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.2)] transition-transform duration-200",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}
