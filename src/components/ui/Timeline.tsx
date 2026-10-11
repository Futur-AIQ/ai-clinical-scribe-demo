import type { ReactNode } from "react";

/** A vertical list of events, each on a blue dot joined by a line. Holds TimelineItems. */
export function Timeline({ children }: { children: ReactNode }) {
  return <ol className="px-5 pt-2 pb-4">{children}</ol>;
}

export function TimelineItem({ title, meta }: { title: ReactNode; meta: ReactNode }) {
  return (
    <li className="relative grid grid-cols-[14px_minmax(0,1fr)] gap-3 py-2 before:absolute before:top-[22px] before:-bottom-2 before:left-1.5 before:w-[1.5px] before:bg-line last:before:hidden">
      <i aria-hidden className="mt-1 size-[13px] rounded-full border-[3px] border-blue-100 bg-blue" />
      <div>
        <b className="block text-[13px] font-medium">{title}</b>
        <small className="text-[12px] text-muted tabular-nums">{meta}</small>
      </div>
    </li>
  );
}
