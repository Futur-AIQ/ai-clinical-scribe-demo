import clsx from "clsx";
import type { ReactNode } from "react";

/** A keycap, for keyboard shortcuts. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={clsx(
        "rounded-md border border-b-2 border-line bg-white px-[7px] py-px font-mono text-[11.5px] text-ink-2",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
