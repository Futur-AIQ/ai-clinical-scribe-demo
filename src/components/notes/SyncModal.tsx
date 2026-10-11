"use client";

import { Modal, StepList } from "@/components/ui";
import { useDemo } from "@/store/demo-store";
import { toast } from "@/store/ui-store";

const STEPS = ["Validating note and codes", "Matching the Epic encounter", "Uploading note and codes", "Confirming chart update"];

interface SyncModalProps {
  noteId: string;
  encounterId: string;
  /** Saving an amendment to a Completed note. */
  amend: boolean;
  onDone: () => void;
}

/** "Approving and syncing": locked while the four steps run, then completes the note. */
export function SyncModal({ noteId, encounterId, amend, onDone }: SyncModalProps) {
  const finish = () => {
    useDemo.getState().approveNote(noteId, encounterId, amend);
    onDone();
    toast(amend ? "Amendment saved and synced to Epic" : "Note approved and synced to Epic");
  };

  return (
    <Modal
      open
      locked
      onClose={() => {}}
      title={amend ? "Saving amendment" : "Approving and syncing"}
      subtitle={`Epic Systems · encounter ${encounterId}`}
    >
      <StepList steps={STEPS} stepMs={520} tailMs={300} onDone={finish} />
    </Modal>
  );
}

/** The note's encounter, or a new one from E-483000 to E-483899. */
export const encounterFor = (existing?: string) => existing ?? `E-${483000 + Math.floor(Math.random() * 900)}`;
