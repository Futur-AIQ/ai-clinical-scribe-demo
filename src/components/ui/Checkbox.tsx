"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

interface CheckboxProps extends Omit<ComponentProps<"input">, "type" | "onChange" | "checked"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label. Without one, pass aria-label. */
  label?: ReactNode;
  /** Fade when disabled (default). Off for read-only lists that should keep full contrast. */
  fadeDisabled?: boolean;
}

export function Checkbox({ checked, onChange, label, className, disabled, fadeDisabled = true, ...rest }: CheckboxProps) {
  return (
    <label
      className={clsx(
        "inline-flex items-center gap-2 text-[13px]",
        disabled ? fadeDisabled && "opacity-45" : "cursor-pointer",
        className,
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
      <span
        aria-hidden
        className={clsx(
          "inline-grid size-4 shrink-0 place-items-center rounded-[4px] border-[1.5px]",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue",
          checked ? "border-blue bg-blue text-white" : "border-[#c9d0de] bg-white",
        )}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}
