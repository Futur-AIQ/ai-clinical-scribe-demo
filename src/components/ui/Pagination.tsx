import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  /** "Showing 1 to 10 of 1,248 patients" on the left. */
  summary: ReactNode;
}

/** 1 2 3 … 125: the first and last page, the current page and its neighbours. */
export function pageNumbers(cur: number, pages: number): (number | "…")[] {
  if (pages <= 6) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  if (cur > 3) out.push("…");
  for (let i = Math.max(2, cur - 1); i <= Math.min(pages - 1, cur + 1); i++) out.push(i);
  if (cur < pages - 2) out.push("…");
  out.push(pages);
  return out;
}

const pg = "inline-grid h-[34px] min-w-[34px] place-items-center rounded-lg border px-1.5 text-[13px] tabular-nums";

export function Pagination({ page, pages, onChange, summary }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-2 border-t border-line-2 px-[18px] py-3.5">
      <span className="mr-auto text-[12.5px] text-muted">{summary}</span>
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={clsx(pg, "border-line text-ink-2 hover:bg-gray-50 disabled:opacity-45 disabled:hover:bg-transparent")}
      >
        <ChevronLeft size={15} strokeWidth={1.8} aria-hidden />
      </button>
      {pageNumbers(page, pages).map((n, i) =>
        n === "…" ? (
          <span key={`gap${i}`} aria-hidden className={clsx(pg, "border-transparent text-ink-2")}>
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            aria-label={`Page ${n}`}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onChange(n)}
            className={clsx(
              pg,
              n === page ? "border-blue-100 bg-blue-50 font-semibold text-blue" : "border-transparent text-ink-2 hover:bg-gray-50",
            )}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className={clsx(pg, "border-line text-ink-2 hover:bg-gray-50 disabled:opacity-45 disabled:hover:bg-transparent")}
      >
        <ChevronRight size={15} strokeWidth={1.8} aria-hidden />
      </button>
    </nav>
  );
}
