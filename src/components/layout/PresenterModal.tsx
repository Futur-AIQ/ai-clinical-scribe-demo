"use client";

import { Mic } from "lucide-react";
import { useState } from "react";
import { SettingRow } from "@/components/settings/SettingRow";
import { Button, Kbd, Modal, Segmented, toast } from "@/components/ui";
import { type Speed, useDemo } from "@/store/demo-store";
import { useUi } from "@/store/ui-store";

const SPEEDS = [1, 2, 4].map((s) => ({ value: String(s), label: `${s}×` }));

/** Presenter controls: playback speed, a sample visit, shortcuts and reset. Opened from the demo badge. */
export function PresenterModal({ onClose }: { onClose: () => void }) {
  const speed = useDemo((s) => s.speed);
  const setSpeed = useDemo((s) => s.setSpeed);
  const resetDemo = useDemo((s) => s.resetDemo);
  const openModal = useUi((s) => s.openModal);
  const [confirming, setConfirming] = useState(false);

  const onSpeed = (v: string) => {
    setSpeed(Number(v) as Speed);
    toast(`Playback speed ${v}×`, "info");
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Presenter controls"
      subtitle="Settings for running the live demo. Your client never sees this panel unless you open it."
      footer={
        <>
          <span className="text-[12.5px] text-faint">All names, records and codes in this demo are fictional.</span>
          <div className="flex-1" />
          <Button onClick={onClose}>Close</Button>
        </>
      }
    >
      <SettingRow
        title="Playback speed"
        description="How fast the scripted conversation plays"
        control={(id) => <Segmented items={SPEEDS} value={String(speed)} onChange={onSpeed} aria-labelledby={id} />}
      />
      <SettingRow
        title="Run a sample visit"
        description="Fever (GP), diabetes follow-up or cardiology"
        control={() => (
          <Button size="sm" variant="primary" icon={Mic} onClick={() => openModal({ name: "picker" })}>
            Choose visit
          </Button>
        )}
      />
      <SettingRow
        title="Keyboard"
        description={
          <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <Kbd>Space</Kbd> start or pause · <Kbd>F</Kbd> finish · <Kbd>N</Kbd> add note
          </span>
        }
        control={() => null}
      />
      <SettingRow
        title="Reset demo data"
        description="Removes notes, patients and settings created in this browser"
        control={() =>
          confirming ? (
            <span className="flex gap-1.5">
              <Button size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger-outline" onClick={resetDemo}>
                Confirm reset
              </Button>
            </span>
          ) : (
            <Button size="sm" variant="danger-outline" onClick={() => setConfirming(true)}>
              Reset
            </Button>
          )
        }
      />
    </Modal>
  );
}
