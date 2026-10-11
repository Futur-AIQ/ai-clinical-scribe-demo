import type { ReactNode } from "react";

interface PageHeadProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Above the title, for example a "← Patients" back link. */
  eyebrow?: ReactNode;
  /** Buttons on the right. */
  actions?: ReactNode;
}

export function PageHead({ title, subtitle, eyebrow, actions }: PageHeadProps) {
  return (
    <div className="mb-[22px] flex flex-wrap items-start gap-4">
      <div className="min-w-0">
        {eyebrow}
        <h1 className="text-[23px] font-semibold max-sm:text-[20px]">{title}</h1>
        {subtitle && <p className="mt-[5px] text-[14px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="ml-auto flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
