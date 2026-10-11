import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  iconSize?: number;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, iconSize = 24, children, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-2.5 px-5 py-[34px] text-center text-[13px] text-muted",
        className,
      )}
    >
      <Icon size={iconSize} strokeWidth={1.8} aria-hidden className="text-faint" />
      <span>{children}</span>
      {action}
    </div>
  );
}
