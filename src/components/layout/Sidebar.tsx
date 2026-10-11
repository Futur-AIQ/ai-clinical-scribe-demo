"use client";

import clsx from "clsx";
import { ChevronDown, Hospital, House, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuHeading, MenuItem, toast } from "@/components/ui";
import { PRACTICES } from "@/data/misc";
import { useDemo } from "@/store/demo-store";
import { useUi } from "@/store/ui-store";
import { activeNavHref, NAV } from "./nav";

export function Sidebar() {
  const pathname = usePathname();
  const active = activeNavHref(pathname);
  const drawerOpen = useUi((s) => s.drawerOpen);
  const setDrawer = useUi((s) => s.setDrawer);
  const openModal = useUi((s) => s.openModal);
  const closeDrawer = () => setDrawer(false);

  return (
    <aside
      id="sidebar"
      aria-label="Main"
      className={clsx(
        "z-40 flex h-dvh flex-col overflow-y-auto border-r border-line bg-surface px-3 pb-16",
        "md:sticky md:top-0",
        // Below 900px: a slide-in drawer. Hidden drawers are invisible so their links are not focusable.
        "max-md:fixed max-md:top-0 max-md:left-0 max-md:w-[272px] max-md:shadow-pop max-md:transition-[translate,visibility] max-md:duration-250",
        drawerOpen ? "max-md:visible max-md:translate-x-0" : "max-md:invisible max-md:-translate-x-[102%]",
      )}
    >
      <Link
        href="/dashboard"
        onClick={closeDrawer}
        className="-mx-3 mb-3.5 flex shrink-0 items-center gap-3 border-b border-line pt-4 pr-2.5 pb-[15px] pl-5"
      >
        <Image src="/logo-mark.png" alt="Hansa Technologies" width={40} height={40} priority className="size-10 shrink-0" />
        <span>
          <b className="block text-[19px] leading-[1.15] font-bold tracking-[-.02em] text-navy">AI Clinical Scribe</b>
          <small className="block text-[12.5px] text-muted">Your AI Assistant</small>
        </span>
      </Link>

      <nav className="flex flex-col gap-[3px]">
        {NAV.map(({ href, label, icon: Icon }) => {
          const on = active === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={closeDrawer}
              aria-current={on ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3.5 rounded-[10px] px-3.5 py-[10.5px] text-[14.5px] transition-colors duration-150",
                on ? "bg-blue-50 font-semibold text-blue" : "font-medium text-ink-2 hover:bg-[#f4f6fb]",
              )}
            >
              {href === "/dashboard" && on ? (
                <FilledHome />
              ) : (
                <Icon size={21} strokeWidth={1.8} aria-hidden className={clsx("shrink-0", on ? "text-blue" : "text-[#4a5675]")} />
              )}
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-1 mt-[22px] shrink-0 rounded-xl border border-[#dfedf3] bg-[#f1f8fb] px-3.5 pt-4 pb-3.5">
        <h4 className="flex items-center gap-2 text-[14.5px] font-semibold text-navy">
          <Sparkles size={20} strokeWidth={1.8} aria-hidden className="text-blue" />
          Upgrade to Pro
        </h4>
        <p className="mt-2 mb-3.5 ml-[30px] text-[12.5px] leading-[1.55] text-ink-2">
          Unlock advanced AI insights, custom templates and more.
        </p>
        <button
          type="button"
          onClick={() => openModal({ name: "upgrade" })}
          className="h-[38px] w-full rounded-lg bg-green text-[13.5px] font-semibold text-white shadow-[0_2px_6px_rgba(16,145,94,.25)] transition-colors duration-150 hover:bg-green-600"
        >
          Upgrade Now
        </button>
      </div>

      <PracticeSwitcher />
    </aside>
  );
}

/** Lucide's house, solid, with the door cut out in the active background color. */
function FilledHome() {
  return (
    <House size={21} strokeWidth={1.8} fill="currentColor" aria-hidden className="shrink-0 text-blue">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" fill="var(--color-blue-50)" stroke="var(--color-blue-50)" />
    </House>
  );
}

function PracticeSwitcher() {
  const ready = useDemo((s) => s.ready);
  const current = useDemo((s) => s.practice);
  const setPractice = useDemo((s) => s.setPractice);
  return (
    <Menu
      align="left"
      width={250}
      aria-label="Switch practice"
      trigger={(p) => (
        <button
          type="button"
          {...p}
          aria-label={`Practice: ${current.name}. Switch practice`}
          className={clsx(
            "mx-1 mt-7 flex shrink-0 items-center gap-3 rounded-xl border border-line py-3 pr-3 pl-3.5 text-left transition-colors duration-150 hover:bg-surface-2",
            // The saved practice is only known after init(); keep the space, hide the text.
            !ready && "invisible",
          )}
        >
          <Hospital size={24} strokeWidth={1.8} aria-hidden className="shrink-0 text-[#5b6788]" />
          <span className="min-w-0 flex-1">
            <b className="block text-[13px] font-semibold">{current.name}</b>
            <small className="block text-[12px] text-muted">Practice ID: {current.id}</small>
          </span>
          <ChevronDown size={16} strokeWidth={1.8} aria-hidden className="shrink-0 text-[#5b6788]" />
        </button>
      )}
    >
      <MenuHeading>Switch practice</MenuHeading>
      {PRACTICES.map((pr) => (
        <MenuItem
          key={pr.id}
          icon={Hospital}
          checked={current.id === pr.id}
          onSelect={() => {
            setPractice({ name: pr.name, id: pr.id });
            toast(`Switched to ${pr.name}`, "info");
          }}
        >
          <b className="block font-medium">{pr.name}</b>
          <small className="text-muted">ID {pr.id}</small>
        </MenuItem>
      ))}
    </Menu>
  );
}
