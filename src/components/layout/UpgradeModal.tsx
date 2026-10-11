"use client";

import { CircleCheck } from "lucide-react";
import { Button, Modal, toast } from "@/components/ui";
import { PLANS } from "@/data/misc";

/** Pro plan pitch, opened from the sidebar and Settings → Billing. */
export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upgrade to Pro"
      subtitle="More AI depth for busy practices"
      footer={
        <>
          <span className="text-[12.5px] text-faint">Pricing shown is sample data</span>
          <Button className="ml-auto" onClick={onClose}>
            Not now
          </Button>
          <Button
            variant="green"
            onClick={() => {
              onClose();
              toast("Pro trial started for this demo");
            }}
          >
            Start 14-day trial
          </Button>
        </>
      }
    >
      <div className="mb-4 flex items-baseline gap-1.5">
        <b className="text-[30px] font-bold tabular-nums">{PLANS.pro.price}</b>
        <span className="text-muted">per clinician / month</span>
      </div>
      {PLANS.pro.features.map((f) => (
        <div key={f} className="flex items-center gap-2.5 py-[7px]">
          <CircleCheck size={18} strokeWidth={1.8} aria-hidden className="shrink-0 text-green" />
          {f}
        </div>
      ))}
    </Modal>
  );
}
