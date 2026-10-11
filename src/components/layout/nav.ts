import {
  ChartColumn,
  CircleHelp,
  ClipboardList,
  FileText,
  House,
  Plug,
  ReceiptText,
  Settings,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: House },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/templates", label: "Templates", icon: ClipboardList },
  { href: "/analytics", label: "Analytics", icon: ChartColumn },
  { href: "/billing-codes", label: "Billing Codes", icon: ReceiptText },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/team", label: "Team", icon: UsersRound },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: CircleHelp },
];

/** The nav item that is active for a path. /consultation belongs to Dashboard. */
export function activeNavHref(pathname: string): string | null {
  if (pathname === "/consultation" || pathname.startsWith("/consultation/")) return "/dashboard";
  const hit = NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  return hit?.href ?? null;
}
