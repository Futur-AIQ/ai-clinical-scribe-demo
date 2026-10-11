import clsx from "clsx";
import { Search } from "lucide-react";
import { EmptyState, Pill } from "@/components/ui";
import { codeDesc, codeType } from "@/data";

const TH = "border-b border-line bg-surface-2 px-4 py-2.5 text-left text-[12px] font-medium whitespace-nowrap text-ink-2";
const TD = "border-b border-line-2 px-4 py-3 align-middle whitespace-nowrap group-last:border-b-0";

/** Acceptance under this percentage is flagged for review. */
const REVIEW_BELOW = 88;

/** Rows are [code, timesUsed, acceptancePercent] from BILLING_USAGE. */
export function BillingTable({ rows }: { rows: [string, number, number][] }) {
  return (
    // Relative so the sr-only header label stays inside the scroll box instead of widening the page.
    <div className="relative overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className={TH}>Code</th>
            <th className={TH}>Type</th>
            <th className={TH}>Description</th>
            <th className={TH}>Times Used</th>
            <th className={TH}>Acceptance</th>
            <th className={TH}>
              <span className="sr-only">Review</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map(([code, used, acc]) => {
              const low = acc < REVIEW_BELOW;
              return (
                <tr key={code} className="group">
                  <td className={TD}>
                    <span className="rounded-[7px] bg-blue-50 px-[9px] py-[3px] text-[12.5px] font-semibold text-blue tabular-nums">
                      {code}
                    </span>
                  </td>
                  <td className={TD}>{codeType(code)}</td>
                  <td className={`${TD} min-w-[220px] whitespace-normal`}>{codeDesc(code)}</td>
                  <td className={`${TD} tabular-nums`}>{used}</td>
                  <td className={TD}>
                    <div className="flex items-center gap-2.5">
                      <span className="w-[34px] tabular-nums">{acc}%</span>
                      <span className="h-1.5 w-[90px] overflow-hidden rounded-[3px] bg-gray-50" aria-hidden>
                        <i className={clsx("block h-full", low ? "bg-amber" : "bg-green")} style={{ width: `${acc}%` }} />
                      </span>
                    </div>
                  </td>
                  <td className={TD}>{low && <Pill tone="amber">Review</Pill>}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>
                <EmptyState icon={Search}>No codes match.</EmptyState>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
