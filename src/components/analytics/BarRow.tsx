import clsx from "clsx";

interface BarRowProps {
  label: string;
  /** Right-aligned figure, for example "28 (18%)". */
  value: string;
  /** Fill width, 0–100. */
  percent: number;
  tone?: "blue" | "green";
}

/** Label and figure over a 7px track, as in the prototype's .bar-r. */
export function BarRow({ label, value, percent, tone = "blue" }: BarRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_70px] items-center gap-x-3 gap-y-1 text-[13px]">
      <span className="min-w-0">{label}</span>
      <span className="text-right text-ink-2 tabular-nums">{value}</span>
      <span className="col-span-full h-[7px] overflow-hidden rounded bg-gray-50" aria-hidden>
        <i className={clsx("block h-full rounded", tone === "green" ? "bg-green" : "bg-blue")} style={{ width: `${percent}%` }} />
      </span>
    </div>
  );
}
