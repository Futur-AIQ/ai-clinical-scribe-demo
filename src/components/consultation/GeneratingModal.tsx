"use client";

import { useRouter } from "next/navigation";
import { Modal, StepList } from "@/components/ui";
import { commitDraft, type DraftInput, GENERATE_STEPS } from "@/lib/generate-note";
import { fmtDuration } from "@/lib/format";
import { useDemo } from "@/store/demo-store";
import { useRecording } from "@/store/recording-store";
import { toast, useUi } from "@/store/ui-store";

/** "Generating clinical note": locked while the four steps run, then opens the drafted note. */
export function GeneratingModal({ draft }: { draft: DraftInput }) {
  const router = useRouter();
  const name = useDemo((s) => s.patientByMrn(draft.mrn)?.name ?? "Patient");
  const format = useDemo((s) => s.settings.format);

  const finish = () => {
    const id = commitDraft(draft);
    useRecording.getState().reset();
    useUi.getState().closeModal();
    router.push(`/notes/${id}`);
    toast("Note drafted. Review it, then approve to sync.");
  };

  return (
    <Modal open locked onClose={() => {}} title="Generating clinical note" subtitle={`${name} · ${fmtDuration(draft.t)} recorded`}>
      <StepList steps={GENERATE_STEPS(format)} stepMs={650} tailMs={350} onDone={finish} />
    </Modal>
  );
}
