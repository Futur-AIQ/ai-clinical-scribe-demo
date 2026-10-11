import { create } from "zustand";
import type { DraftInput } from "@/lib/generate-note";
import { NO_FILTERS, type PatientFilters, type PatientTab } from "@/lib/patient-list";

/** The modal that is open, with its props. Add a member per global modal. */
export type ModalState =
  | { name: "upgrade" }
  | { name: "presenter" }
  | { name: "picker" }
  | { name: "addNote" }
  | { name: "endConsult" }
  | { name: "generating"; draft: DraftInput };
export type ModalName = ModalState["name"];

export type ToastType = "ok" | "info" | "warn";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  leaving: boolean;
}

/** The Patients list view, kept while the user opens a record and comes back. */
export interface PatientListView {
  tab: PatientTab;
  query: string;
  page: number;
  filters: PatientFilters;
  /** Selected MRNs. */
  selected: string[];
}

interface UiState {
  /** Sidebar drawer below 900px. */
  drawerOpen: boolean;
  modal: ModalState | null;
  toasts: ToastItem[];
  patientList: PatientListView;
  setDrawer: (open: boolean) => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  setPatientList: (patch: Partial<PatientListView>) => void;
}

/** Transient UI state. Not persisted. */
export const useUi = create<UiState>((set) => ({
  drawerOpen: false,
  modal: null,
  toasts: [],
  patientList: { tab: "all", query: "", page: 1, filters: NO_FILTERS, selected: [] },
  setDrawer: (drawerOpen) => set({ drawerOpen }),
  openModal: (modal) => set({ modal, drawerOpen: false }),
  closeModal: () => set({ modal: null }),
  setPatientList: (patch) => set((s) => ({ patientList: { ...s.patientList, ...patch } })),
}));

const SHOW_MS = 3400;
const FADE_MS = 300;
let nextToastId = 1;

/** Show a toast. Works from anywhere, including outside React. */
export function toast(message: string, type: ToastType = "ok") {
  const id = nextToastId++;
  const setToasts = (fn: (t: ToastItem[]) => ToastItem[]) => useUi.setState((s) => ({ toasts: fn(s.toasts) }));
  setToasts((t) => [...t, { id, message, type, leaving: false }]);
  window.setTimeout(() => {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), FADE_MS);
  }, SHOW_MS);
}
