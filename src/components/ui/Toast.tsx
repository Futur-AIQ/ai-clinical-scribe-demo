"use client";

import clsx from "clsx";
import { CircleCheck, Sparkles, TriangleAlert } from "lucide-react";
import { useUi } from "@/store/ui-store";

export { toast, type ToastType } from "@/store/ui-store";

const icons = {
  ok: { Icon: CircleCheck, className: "text-[#4ade80]" },
  info: { Icon: Sparkles, className: "text-[#93b4ff]" },
  warn: { Icon: TriangleAlert, className: "text-[#fbbf24]" },
} as const;

/** Mount once (AppShell). Toasts stack at the bottom center. */
export function Toaster() {
  const toasts = useUi((s) => s.toasts);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[22px] left-1/2 z-[100] flex w-[min(520px,calc(100%-32px))] -translate-x-1/2 flex-col items-center gap-2"
    >
      {toasts.map((t) => {
        const { Icon, className } = icons[t.type];
        return (
          <div
            key={t.id}
            className={clsx(
              "pointer-events-auto flex max-w-full animate-[pop_.2s_ease] items-center gap-2.5 rounded-[11px] bg-toast px-4 py-[11px] text-[13px] text-white shadow-pop transition-opacity duration-300",
              t.leaving && "opacity-0",
            )}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden className={clsx("shrink-0", className)} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
