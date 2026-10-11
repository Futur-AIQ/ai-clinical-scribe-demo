"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StepListProps {
  steps: string[];
  /** How long each step runs. */
  stepMs: number;
  /** Pause after the last step before `onDone`. */
  tailMs?: number;
  onDone: () => void;
}

/** Progress steps for locked modals: waiting → running (spinning ring) → done (green check). Runs on mount. */
export function StepList({ steps, stepMs, tailMs = 300, onDone }: StepListProps) {
  const [done, setDone] = useState(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (done < steps.length) {
      const t = window.setTimeout(() => setDone((d) => d + 1), stepMs);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => onDoneRef.current(), tailMs);
    return () => window.clearTimeout(t);
  }, [done, steps.length, stepMs, tailMs]);

  return (
    <ol className="flex flex-col gap-3.5 pt-1.5 pb-1" aria-live="polite">
      {steps.map((label, i) => {
        const state = i < done ? "done" : i === done ? "run" : "wait";
        return (
          <li
            key={label}
            className={clsx(
              "flex items-center gap-3 text-[13.5px] transition-colors duration-200",
              state === "wait" && "text-faint",
              state === "run" && "text-ink",
              state === "done" && "text-ink-2",
            )}
          >
            <span
              aria-hidden
              className={clsx(
                "grid size-[26px] shrink-0 place-items-center rounded-full border-2",
                state === "wait" && "border-line",
                state === "run" && "animate-spin border-blue border-t-transparent",
                state === "done" && "border-green bg-green text-white",
              )}
            >
              {state === "done" && <Check size={13} strokeWidth={3} />}
            </span>
            {label}
            <span className="sr-only">{state === "done" ? "(done)" : state === "run" ? "(in progress)" : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}
