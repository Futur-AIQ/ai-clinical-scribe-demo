"use client";

import { type ReactNode, useEffect } from "react";
import { Toaster } from "@/components/ui";
import { useRecordingEngine } from "@/lib/use-recording-engine";
import { useDemo } from "@/store/demo-store";
import { useUi } from "@/store/ui-store";
import { GlobalModals } from "./GlobalModals";
import { ContentSkeleton } from "./ShellSkeleton";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const ready = useDemo((s) => s.ready);
  const drawerOpen = useUi((s) => s.drawerOpen);
  const setDrawer = useUi((s) => s.setDrawer);
  const openModal = useUi((s) => s.openModal);
  useRecordingEngine();

  // Demo data is built from the browser's clock after mount, never during server rendering.
  useEffect(() => {
    void useDemo.getState().init(new Date());
  }, []);

  // Esc closes the drawer.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawer]);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar />
      {drawerOpen && (
        <div aria-hidden className="fixed inset-0 z-[35] animate-fade bg-[rgba(14,27,61,.35)] md:hidden" onClick={() => setDrawer(false)} />
      )}
      <div className="flex min-w-0 flex-col">
        <Topbar />
        <main className="min-w-0 px-7 pt-[26px] pb-12 max-md:px-4 max-md:pt-5 max-md:pb-[90px]">
          {ready ? children : <ContentSkeleton />}
        </main>
      </div>
      <button
        type="button"
        title="Presenter controls"
        onClick={() => openModal({ name: "presenter" })}
        className="fixed bottom-3.5 left-[18px] z-[60] flex items-center gap-2 rounded-full bg-toast py-2 pr-3.5 pl-2.5 text-[12px] font-medium text-white shadow-pop"
      >
        <i aria-hidden className="size-2 rounded-full bg-[#4ade80]" />
        Demo · Sample data
      </button>
      <GlobalModals />
      <Toaster />
    </div>
  );
}
