"use client";

import { RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { Button, Menu, MenuItem, Pill, toast } from "@/components/ui";
import type { Integration } from "@/data/types";
import { useDemo } from "@/store/demo-store";

const CONNECT_MS = 1500;

/** One row per EMR: letter tile, name and state, then Connected + Manage, or Connect. */
export function IntegrationList() {
  const integrations = useDemo((s) => s.integrations);
  return (
    <ul>
      {integrations.map((i) => (
        <IntegrationRow key={i.id} integration={i} />
      ))}
    </ul>
  );
}

function IntegrationRow({ integration: i }: { integration: Integration }) {
  const setConnected = useDemo((s) => s.setConnected);
  const touchSync = useDemo((s) => s.touchSync);
  const [connecting, setConnecting] = useState(false);

  // Finishes even if the user leaves the page, as a real connection would.
  const connect = () => {
    setConnecting(true);
    window.setTimeout(() => {
      setConnected(i.id, true);
      setConnecting(false);
      toast(`${i.name} connected`);
    }, CONNECT_MS);
  };

  return (
    <li className="flex items-center gap-4 border-b border-line-2 px-5 py-4 last:border-b-0">
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-[11px] border text-[13px] font-bold"
        style={{ color: i.color, background: i.bg, borderColor: i.bg }}
      >
        {i.abbr}
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-[14px] font-semibold">{i.name}</b>
        <small className="text-[12.5px] text-muted">
          {i.connected ? "Connected · two-way sync of notes, codes and patient list" : "Not connected"}
        </small>
      </div>
      {i.connected ? (
        <>
          {/* The line above already says Connected; phones keep the room for the name. */}
          <Pill tone="green" className="max-sm:hidden">
            Connected
          </Pill>
          <Menu
            aria-label={`Manage ${i.name}`}
            trigger={(p) => (
              <Button size="sm" {...p}>
                Manage
              </Button>
            )}
          >
            <MenuItem
              icon={RefreshCw}
              onSelect={() => {
                touchSync();
                toast("Sync complete · 0 conflicts");
              }}
            >
              Sync now
            </MenuItem>
            <MenuItem
              icon={X}
              danger
              onSelect={() => {
                setConnected(i.id, false);
                toast(`${i.name} disconnected`, "warn");
              }}
            >
              Disconnect {i.name}
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button size="sm" className="text-blue" disabled={connecting} onClick={connect}>
          {connecting ? (
            <>
              <RefreshCw size={14} strokeWidth={1.8} aria-hidden className="animate-spin" />
              Connecting
            </>
          ) : (
            "Connect"
          )}
        </Button>
      )}
    </li>
  );
}
