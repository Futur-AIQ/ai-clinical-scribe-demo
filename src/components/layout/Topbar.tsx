"use client";

import clsx from "clsx";
import {
  Bell,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  FileText,
  Globe,
  Hospital,
  LogOut,
  Menu as MenuIcon,
  Plug,
  RefreshCw,
  Sparkles,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Avatar, Menu, MenuHeading, MenuItem, MenuSeparator, toast, useMenuClose } from "@/components/ui";
import { DOCTOR, NOTIFICATIONS } from "@/data/misc";
import { fmtTime } from "@/lib/format";
import { useDemo } from "@/store/demo-store";
import { useUi } from "@/store/ui-store";
import { LanguageItems } from "./LanguageItems";

const pill =
  "inline-flex h-[38px] shrink-0 items-center gap-[9px] whitespace-nowrap rounded-[10px] border border-line bg-white px-[13px] text-[13px] font-medium transition-colors duration-150 hover:bg-surface-2 max-md:px-2.5";
const pillIcon = "shrink-0 text-[#4a5675]";
/** Pill labels are icons only below 900px. */
const label = "max-md:hidden";

export function Topbar() {
  const drawerOpen = useUi((s) => s.drawerOpen);
  const setDrawer = useUi((s) => s.setDrawer);
  const ready = useDemo((s) => s.ready);
  return (
    <header className="sticky top-0 z-30 flex h-[62px] items-center gap-3 border-b border-line bg-white/96 px-6 backdrop-blur-[8px] max-md:gap-2 max-md:px-4">
      <button
        type="button"
        aria-label="Open menu"
        aria-controls="sidebar"
        aria-expanded={drawerOpen}
        onClick={() => setDrawer(true)}
        className="grid size-[38px] shrink-0 place-items-center rounded-[10px] border border-line md:hidden"
      >
        <MenuIcon size={20} strokeWidth={1.8} aria-hidden />
      </button>
      <div className="flex-1" />
      {/* Saved values are only known after init(); keep the layout, hide the text until then. */}
      <div className={clsx("flex items-center gap-3 max-md:gap-2", !ready && "invisible")}>
        <LanguageMenu />
        <OfflinePill />
        <EmrMenu />
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}

function LanguageMenu() {
  const lang = useDemo((s) => s.language);
  return (
    <Menu
      width={230}
      aria-label="Transcription language"
      trigger={(p) => (
        <button type="button" {...p} aria-label={`Transcription language: ${lang}`} className={pill}>
          <Globe size={17} strokeWidth={1.8} aria-hidden className={pillIcon} />
          <span className={label}>{lang}</span>
          <ChevronDown size={15} strokeWidth={1.8} aria-hidden className={pillIcon} />
        </button>
      )}
    >
      <LanguageItems />
    </Menu>
  );
}

function OfflinePill() {
  const offline = useDemo((s) => s.offline);
  const toggleOffline = useDemo((s) => s.toggleOffline);
  const text = offline ? "Offline Mode" : "Online only";
  return (
    <button
      type="button"
      title="Offline capture"
      aria-label={text}
      aria-pressed={offline}
      onClick={() => {
        toggleOffline();
        toast(
          offline
            ? "Offline capture off. Recording needs a connection."
            : "Offline capture on. Visits keep recording without a connection.",
          "info",
        );
      }}
      className={clsx(pill, "text-green")}
    >
      <i aria-hidden className={clsx("size-2 shrink-0 rounded-full", offline ? "bg-[#16a34a]" : "bg-[#b6bdcc]")} />
      <span className={label}>{text}</span>
    </button>
  );
}

function EmrMenu() {
  const lastSync = useDemo((s) => s.lastSync);
  const touchSync = useDemo((s) => s.touchSync);
  const epicConnected = useDemo((s) => s.integrations.find((i) => i.id === "epic")?.connected ?? false);
  return (
    <Menu
      width={250}
      aria-label="EMR"
      trigger={(p) => (
        <button type="button" {...p} aria-label="EMR Connected" className={clsx(pill, "max-sm:hidden")}>
          <Hospital size={17} strokeWidth={1.8} aria-hidden className={pillIcon} />
          <span className={label}>EMR Connected</span>
          {epicConnected && (
            <CircleCheck size={17} strokeWidth={2} aria-hidden fill="#16a34a" className="shrink-0 text-white" />
          )}
        </button>
      )}
    >
      <MenuHeading>EMR</MenuHeading>
      <div className="flex items-center gap-2.5 px-2.5 pt-1.5 pb-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#fdeef0] text-[13px] font-bold text-[#c8102e]">
          EP
        </span>
        <div>
          <b className="text-[13px]">Epic Systems</b>
          <small className="block text-[12px] text-muted tabular-nums">
            {epicConnected ? <>Last sync {lastSync && fmtTime(new Date(lastSync))}</> : "Not connected"}
          </small>
        </div>
      </div>
      <MenuSeparator />
      {/* No "Sync now" while Epic is disconnected: the demo never claims a sync it could not make. */}
      {epicConnected && (
        <MenuItem
          icon={RefreshCw}
          onSelect={() => {
            touchSync();
            toast("Sync complete · 0 conflicts");
          }}
        >
          Sync now
        </MenuItem>
      )}
      <MenuItem icon={Plug} href="/integrations">
        Manage integrations
      </MenuItem>
    </Menu>
  );
}

const notifIcons: Record<(typeof NOTIFICATIONS)[number]["icon"], LucideIcon> = {
  "file-text": FileText,
  "refresh-cw": RefreshCw,
  sparkles: Sparkles,
};
const notifTones = {
  purple: "bg-purple-50 text-purple",
  green: "bg-green-50 text-green",
  blue: "bg-blue-50 text-blue",
} as const;

const ago = (m: number) => (m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`);

function NotificationsMenu() {
  const read = useDemo((s) => s.notificationsRead);
  const markRead = useDemo((s) => s.markNotificationsRead);
  const unread = read ? 0 : NOTIFICATIONS.length;
  return (
    <Menu
      width={330}
      aria-label="Notifications"
      trigger={(p) => (
        <button
          type="button"
          {...p}
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          className="relative grid size-[38px] shrink-0 place-items-center rounded-[10px] border border-line bg-white transition-colors duration-150 hover:bg-surface-2"
        >
          <Bell size={19} strokeWidth={1.8} aria-hidden />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-[9px] border-2 border-white bg-red px-[3px] text-[10.5px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      <div className="flex items-center px-2.5 py-1.5">
        <b className="text-[14px]">Notifications</b>
        <MarkAllRead onRead={markRead} />
      </div>
      {NOTIFICATIONS.map((n) => (
        <NotificationRow key={n.title} n={n} unread={!read} />
      ))}
    </Menu>
  );
}

function MarkAllRead({ onRead }: { onRead: () => void }) {
  const close = useMenuClose();
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={() => {
        onRead();
        close();
      }}
      className="ml-auto text-[12.5px] font-medium whitespace-nowrap text-blue hover:underline"
    >
      Mark all as read
    </button>
  );
}

function NotificationRow({ n, unread }: { n: (typeof NOTIFICATIONS)[number]; unread: boolean }) {
  const close = useMenuClose();
  const Icon = notifIcons[n.icon];
  return (
    <Link
      href={n.href}
      role="menuitem"
      tabIndex={-1}
      onClick={close}
      className="flex w-full gap-[11px] rounded-[9px] p-2.5 text-left hover:bg-gray-50 focus-visible:bg-gray-50"
    >
      <span className={clsx("grid size-[34px] shrink-0 place-items-center rounded-[9px]", notifTones[n.tone])}>
        <Icon size={17} strokeWidth={1.8} aria-hidden />
      </span>
      <span className="min-w-0">
        <b className="block text-[13px] font-semibold">
          {n.title}
          {unread && (
            <span className="ml-1.5 inline-block size-[7px] rounded-full bg-blue align-[1px]">
              <span className="sr-only">(unread)</span>
            </span>
          )}
        </b>
        <small className="mt-0.5 block text-[12px] whitespace-normal text-muted">
          {n.detail} · {ago(n.minutesAgo)}
        </small>
      </span>
    </Link>
  );
}

function ProfileMenu() {
  const openModal = useUi((s) => s.openModal);
  return (
    <Menu
      width={250}
      aria-label="Profile"
      trigger={(p) => (
        <button
          type="button"
          {...p}
          aria-label={`${DOCTOR.name}, ${DOCTOR.specialty}`}
          className="flex shrink-0 items-center gap-2.5 rounded-[10px] px-1.5 py-1 text-left transition-colors duration-150 hover:bg-surface-2"
        >
          <Avatar name={DOCTOR.name} variant="doctor" size={38} />
          <span className={label}>
            <b className="block text-[13px] font-semibold">{DOCTOR.name}</b>
            <small className="block text-[12px] text-muted">{DOCTOR.specialty}</small>
          </span>
          <ChevronDown size={15} strokeWidth={1.8} aria-hidden className={clsx(pillIcon, label)} />
        </button>
      )}
    >
      <div className="flex items-center gap-2.5 px-2.5 pt-2 pb-2.5">
        <Avatar name={DOCTOR.name} variant="doctor" size={36} />
        <div className="min-w-0">
          <b className="block text-[13px]">{DOCTOR.name}</b>
          <small className="block truncate text-[12px] text-muted">{DOCTOR.email}</small>
        </div>
      </div>
      <MenuSeparator />
      <MenuItem icon={User} href="/settings?tab=profile">
        My profile
      </MenuItem>
      <MenuItem icon={CircleHelp} href="/help">
        Help &amp; Support
      </MenuItem>
      <MenuItem icon={Zap} onSelect={() => openModal({ name: "presenter" })}>
        Presenter controls
      </MenuItem>
      <MenuSeparator />
      <MenuItem icon={LogOut} danger onSelect={() => toast("Sign out is turned off in the demo.", "info")}>
        Sign out
      </MenuItem>
    </Menu>
  );
}
