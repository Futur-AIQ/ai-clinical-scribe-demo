"use client";

import { ChevronRight, CircleHelp, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { Button, Card, CardBody, CardHeader, Kbd } from "@/components/ui";
import { FAQ, SHORTCUTS, SUPPORT } from "@/data/misc";
import { TicketModal } from "./TicketModal";

export function HelpView() {
  const [messaging, setMessaging] = useState(false);
  return (
    <>
      <PageHead title="Help & Support" subtitle="Answers, shortcuts and ways to reach the support team" />
      <div className="grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
        <Card>
          <CardHeader title="Frequently asked questions" />
          {FAQ.map(([q, a]) => (
            <details key={q} className="group border-b border-line-2 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                <CircleHelp size={17} strokeWidth={1.8} aria-hidden className="shrink-0 text-blue" />
                {q}
                <ChevronRight
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden
                  className="ml-auto shrink-0 text-muted transition-transform duration-200 group-open:rotate-90"
                />
              </summary>
              <p className="max-w-[70ch] px-5 pb-[18px] text-[13.5px] leading-[1.65] text-ink-2">{a}</p>
            </details>
          ))}
        </Card>
        <div className="flex min-w-0 flex-col gap-5">
          <Card>
            <CardHeader title="Keyboard shortcuts" />
            <CardBody className="flex flex-col gap-3 text-[13px]">
              {SHORTCUTS.map(([key, action]) => (
                <div key={key} className="flex items-center gap-3">
                  <Kbd>{key}</Kbd>
                  <span>{action}</span>
                </div>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Contact support" />
            <CardBody className="flex flex-col gap-3.5 text-[13px]">
              {/* Selectable text, not mailto/tel links: the demo never opens another app. */}
              <div className="flex items-center gap-2.5">
                <Mail size={18} strokeWidth={1.8} aria-hidden className="shrink-0 text-blue" />
                <span className="select-all">{SUPPORT.email}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Phone size={18} strokeWidth={1.8} aria-hidden className="shrink-0 text-blue" />
                <span className="select-all tabular-nums">{SUPPORT.phone}</span>
                <span className="text-faint">{SUPPORT.hours}</span>
              </div>
              <Button icon={Send} className="self-start" onClick={() => setMessaging(true)}>
                Send a message
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
      <TicketModal open={messaging} onClose={() => setMessaging(false)} />
    </>
  );
}
