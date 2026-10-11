import clsx from "clsx";
import { ChevronDown, Search } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export const inputClass = clsx(
  "h-[38px] w-full rounded-[9px] border border-line bg-white px-3 text-[13.5px] placeholder:text-faint",
  "focus:border-[#9db6ff] focus:shadow-[0_0_0_3px_rgba(26,92,244,.12)] focus:outline-none",
  "disabled:bg-surface-2 disabled:text-muted",
);

export function Input({ className, type = "text", ...rest }: ComponentProps<"input">) {
  return <input type={type} className={clsx(inputClass, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={clsx(inputClass, "h-auto min-h-[90px] resize-y py-2.5 leading-[1.5]", className)}
      {...rest}
    />
  );
}

/** Native select with appearance reset and a custom chevron. Pass <option> children. */
export function Select({ className, ...rest }: ComponentProps<"select">) {
  return (
    <div className={clsx("relative", className)}>
      <select className={clsx(inputClass, "appearance-none pr-8")} {...rest} />
      <ChevronDown
        size={14}
        strokeWidth={2}
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/** Pass aria-label when there is no visible label. */
export function SearchInput({ className, ...rest }: Omit<ComponentProps<"input">, "type">) {
  return (
    <div className={clsx("relative flex items-center", className)}>
      <Search size={16} strokeWidth={1.8} aria-hidden className="pointer-events-none absolute left-3 text-muted" />
      <input type="text" className={clsx(inputClass, "pl-9")} {...rest} />
    </div>
  );
}

/** Label above a control, as in the prototype's forms. */
interface FieldProps {
  label: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, className, children }: FieldProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-ink-2">
        {label}
      </label>
      {children}
    </div>
  );
}
