import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

export function Card({ className, ...rest }: ComponentProps<"section">) {
  return (
    <section
      className={clsx("min-w-0 rounded-card border border-line bg-surface shadow-card", className)}
      {...rest}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  icon?: LucideIcon;
  iconSize?: number;
  iconClassName?: string;
  /** Small regular-weight suffix after the title, for example "(Live)". */
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({ title, icon: Icon, iconSize = 18, iconClassName, subtitle, actions, className }: CardHeaderProps) {
  return (
    <div
      className={clsx(
        "flex min-h-[58px] items-center gap-2.5 border-b border-line-2 px-5 py-4",
        className,
      )}
    >
      {Icon && <Icon size={iconSize} strokeWidth={1.8} className={clsx("shrink-0 text-blue", iconClassName)} aria-hidden />}
      <h3 className="min-w-0 text-[15.5px] font-semibold">
        {title}
        {subtitle && <small className="ml-1.5 text-[12.5px] font-normal whitespace-nowrap text-ink-2">{subtitle}</small>}
      </h3>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: ComponentProps<"div">) {
  return <div className={clsx("px-5 py-[18px]", className)} {...rest} />;
}

const cardLinkClass =
  "inline-flex shrink-0 items-center gap-[5px] text-[12.5px] font-medium whitespace-nowrap text-blue hover:underline";

interface CardLinkProps {
  /** A link when set, otherwise a button. */
  href?: string;
  onClick?: () => void;
  /** Trailing arrow, as on the dashboard links. */
  arrow?: boolean;
  children: ReactNode;
}

/** The blue "View All →" link on the right of a card header. */
export function CardLink({ href, onClick, arrow = true, children }: CardLinkProps) {
  const body = (
    <>
      {children}
      {arrow && <ArrowRight size={14} strokeWidth={1.8} aria-hidden />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cardLinkClass} onClick={onClick}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" className={cardLinkClass} onClick={onClick}>
      {body}
    </button>
  );
}
