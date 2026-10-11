"use client";

import { FileCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import { fmtDuration } from "@/lib/format";
import { useDemo } from "@/store/demo-store";
import { finishConsultation, useRecording } from "@/store/recording-store";

/** "End this consultation?": discard, keep recording, or finish. */
export function EndModal({ onClose }: { onClose: () => void }) {
  const mrn = useRecording((s) => s.mrn);
  const discard = useRecording((s) => s.discard);
  const name = useDemo((s) => (mrn ? s.patientByMrn(mrn)?.name : undefined));
  const [elapsed] = useState(() => useRecording.getState().t);

  return (
    <Modal
      open
      onClose={onClose}
      title="End this consultation?"
      subtitle={`${name ?? "Patient"} · ${fmtDuration(elapsed)} recorded`}
      footer={
        <>
          <Button
            variant="danger-outline"
            icon={Trash2}
            onClick={() => {
              onClose();
              discard();
            }}
          >
            Discard
          </Button>
          <div className="flex-1" />
          <Button onClick={onClose}>Keep Recording</Button>
          <Button variant="primary" icon={FileCheck} onClick={finishConsultation}>
            Finish &amp; Generate Note
          </Button>
        </>
      }
    >
      <p className="leading-[1.6] text-muted">
        Generate the clinical note from what was captured, or discard this recording. A discarded recording cannot be
        recovered.
      </p>
    </Modal>
  );
}
