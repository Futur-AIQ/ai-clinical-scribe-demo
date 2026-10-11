"use client";

import clsx from "clsx";
import { Check, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface MenuTriggerProps {
  ref: RefObject<HTMLButtonElement | null>;
  onClick: () => void;
  "aria-expanded": boolean;
  "aria-haspopup": "menu" | "dialog";
}

interface MenuProps {
  /** Render the trigger and spread these props onto a button. */
  trigger: (props: MenuTriggerProps) => ReactNode;
  /** Which trigger edge the panel lines up with. */
  align?: "left" | "right";
  width?: number;
  /** "dialog" for a small form (filters): Tab and the arrow keys work as usual inside it. */
  kind?: "menu" | "dialog";
  "aria-label"?: string;
  className?: string;
  children: ReactNode;
}

const MenuContext = createContext<() => void>(() => {});

/** Closes the surrounding menu, for custom rows that are not a MenuItem. */
export function useMenuClose() {
  return useContext(MenuContext);
}

const ITEMS = '[role^="menuitem"]';
const FIELDS = "button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])";

export function Menu({ trigger, align = "right", width, kind = "menu", className, children, ...aria }: MenuProps) {
  const pathname = usePathname();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // The path the menu was opened on. Navigating elsewhere closes it, reset during render
  // so it does not reopen when the user comes back to that path.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  if (openedAt !== null && openedAt !== pathname) setOpenedAt(null);
  const open = openedAt !== null && openedAt === pathname;

  const close = (refocus = false) => {
    setOpenedAt(null);
    if (refocus) anchorRef.current?.focus();
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  // Place the panel 6px below the trigger, flip it up when there is no room.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchorRef.current;
      const p = panelRef.current;
      if (!a || !p) return;
      const r = a.getBoundingClientRect();
      const fw = p.offsetWidth;
      const fh = p.offsetHeight;
      let left = align === "right" ? r.right - fw : r.left;
      left = Math.max(8, Math.min(left, window.innerWidth - fw - 8));
      let top = r.bottom + 6;
      if (top + fh > window.innerHeight - 8) top = Math.max(8, r.top - fh - 6);
      p.style.left = `${left}px`;
      p.style.top = `${top}px`;
      p.style.visibility = "visible";
    };
    place();
    panelRef.current?.querySelector<HTMLElement>(kind === "dialog" ? FIELDS : ITEMS)?.focus();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, align, kind]);

  // Outside click and Esc. Esc is caught first so an open modal underneath stays open.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      closeRef.current();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      closeRef.current(true);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (kind === "dialog") {
      // Tabbing past either end closes the panel and returns to the trigger.
      if (e.key !== "Tab") return;
      const fields = [...e.currentTarget.querySelectorAll<HTMLElement>(FIELDS)];
      const edge = e.shiftKey ? fields[0] : fields[fields.length - 1];
      if (document.activeElement !== edge) return;
      e.preventDefault();
      return close(true);
    }
    if (e.key === "Tab") return close();
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>(ITEMS)];
    if (items.length === 0) return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "Home" ? 0
      : e.key === "End" ? items.length - 1
      : e.key === "ArrowDown" ? (i + 1) % items.length
      : (i - 1 + items.length) % items.length;
    items[next].focus();
  };

  return (
    <>
      {trigger({
        ref: anchorRef,
        onClick: () => (open ? close() : setOpenedAt(pathname)),
        "aria-expanded": open,
        "aria-haspopup": kind,
      })}
      {open &&
        createPortal(
          <MenuContext.Provider value={() => close(true)}>
            <div
              ref={panelRef}
              role={kind}
              onKeyDown={onPanelKey}
              style={{ width, left: 0, top: 0, visibility: "hidden" }}
              className={clsx(
                "fixed z-[80] min-w-[200px] animate-pop rounded-xl border border-line bg-white p-1.5 shadow-pop",
                className,
              )}
              {...aria}
            >
              {children}
            </div>
          </MenuContext.Provider>,
          document.body,
        )}
    </>
  );
}

interface MenuItemProps {
  icon?: LucideIcon;
  /** Shows a blue check at the end of the row when true. Leave undefined for plain action rows. */
  checked?: boolean;
  danger?: boolean;
  onSelect?: () => void;
  /** Renders a link instead of a button. */
  href?: string;
  className?: string;
  children: ReactNode;
}

export function MenuItem({ icon: Icon, checked, danger, onSelect, href, className, children }: MenuItemProps) {
  const close = useContext(MenuContext);
  const cls = clsx(
    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-left text-[13px] hover:bg-gray-50 focus-visible:bg-gray-50",
    danger && "text-[#d93636]",
    className,
  );
  const body = (
    <>
      {Icon && (
        <Icon size={16} strokeWidth={1.8} aria-hidden className={clsx("shrink-0", danger ? "text-[#d93636]" : "text-[#5b6788]")} />
      )}
      <span className="min-w-0 flex-1">{children}</span>
      {checked && <Check size={16} strokeWidth={1.8} aria-hidden className="ml-auto shrink-0 text-blue" />}
    </>
  );
  // Rows that can carry a check mark are radio items, so screen readers announce the choice.
  const role = checked === undefined ? "menuitem" : "menuitemradio";
  const select = () => {
    onSelect?.();
    close();
  };
  if (href) {
    return (
      <Link href={href} role={role} aria-checked={checked} tabIndex={-1} className={cls} onClick={select}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" role={role} tabIndex={-1} aria-checked={checked} className={cls} onClick={select}>
      {body}
    </button>
  );
}

export function MenuHeading({ children }: { children: ReactNode }) {
  return (
    <div role="presentation" className="px-2.5 pt-2 pb-1.5 text-[11.5px] font-medium tracking-[.04em] text-muted uppercase">
      {children}
    </div>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="mx-1 my-[5px] h-px bg-line-2" />;
}
