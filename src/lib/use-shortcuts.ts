import { useEffect, useRef } from "react";
import { finishConsultation, micAction, openAddNote } from "@/store/recording-store";
import { useUi } from "@/store/ui-store";

const EDITABLE = "input,textarea,select,[contenteditable]:not([contenteditable='false'])";
/** Space already activates these, so it is left to them. */
const ACTIVATABLE = "button,a,[role^='menuitem']";

/** Shortcuts keyed by `KeyboardEvent.code`, e.g. "Space" or "KeyF". */
type Shortcuts = Partial<Record<string, () => void>>;

/**
 * Page shortcuts: ignored while typing, while a modal or menu is open, with modifier keys,
 * and (for Space) on a focused button or link.
 */
export function useShortcuts(shortcuts: Shortcuts) {
  const ref = useRef(shortcuts);
  useEffect(() => {
    ref.current = shortcuts;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const fn = ref.current[e.code];
      if (!fn || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest(EDITABLE)) return;
      if (e.code === "Space" && target?.closest(ACTIVATABLE)) return;
      if (useUi.getState().modal || document.querySelector("[role='dialog'],[role='menu']")) return;
      e.preventDefault();
      fn();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
}

const RECORDING_KEYS: Shortcuts = { Space: micAction, KeyF: finishConsultation, KeyN: openAddNote };

/** Dashboard and Consultation: Space starts, pauses or resumes; F finishes; N adds a note. */
export function useRecordingKeys() {
  useShortcuts(RECORDING_KEYS);
}
