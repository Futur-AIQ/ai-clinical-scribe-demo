"use client";

import { AddNoteModal } from "@/components/consultation/AddNoteModal";
import { CasePickerModal } from "@/components/consultation/CasePickerModal";
import { EndModal } from "@/components/consultation/EndModal";
import { GeneratingModal } from "@/components/consultation/GeneratingModal";
import { useUi } from "@/store/ui-store";
import { PresenterModal } from "./PresenterModal";
import { UpgradeModal } from "./UpgradeModal";

/** Modals that any part of the shell can open. */
export function GlobalModals() {
  const state = useUi((s) => s.modal);
  const modal = state?.name;
  const close = useUi((s) => s.closeModal);
  return (
    <>
      {modal === "picker" && <CasePickerModal onClose={close} />}
      {modal === "addNote" && <AddNoteModal onClose={close} />}
      {modal === "endConsult" && <EndModal onClose={close} />}
      {state?.name === "generating" && <GeneratingModal draft={state.draft} />}
      <UpgradeModal open={modal === "upgrade"} onClose={close} />
      {modal === "presenter" && <PresenterModal onClose={close} />}
    </>
  );
}
