"use client";

import { useRef, useState } from "react";
import { Button, Modal, Textarea, toast } from "@/components/ui";
import { fmtTimeSec } from "@/lib/format";
import { useRecording } from "@/store/recording-store";

/** "Add a note": a clinician note stamped at the current recording time. */
export function AddNoteModal({ onClose }: { onClose: () => void }) {
  const addClinicianNote = useRecording((s) => s.addClinicianNote);
  // The time the note is added at, fixed when the modal opens.
  const [at] = useState(() => {
    const { startedAt, t } = useRecording.getState();
    return new Date(startedAt + t * 1000);
  });
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const save = () => {
    if (!text.trim()) {
      ref.current?.focus();
      return;
    }
    addClinicianNote(text);
    onClose();
    toast("Note added to the consultation");
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Add a note"
      subtitle={`Added to the transcript at ${fmtTimeSec(at)} and included in the final note`}
      footer={
        <>
          <div className="flex-1" />
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save}>
            Add Note
          </Button>
        </>
      }
    >
      <Textarea
        ref={ref}
        rows={4}
        aria-label="Note"
        placeholder="For example: Patient prefers tablets over syrup. Work note given for 2 days."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Modal>
  );
}
