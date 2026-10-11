import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { DOCTOR, INTEGRATIONS, LANGUAGES, PRACTICES, TEAM, TEMPLATES } from "@/data/misc";
import { buildSeedNotes } from "@/data/notes";
import { buildPatients } from "@/data/patients";
import type { Integration, Note, Patient, Soap, TeamMember, Template } from "@/data/types";

export const STORAGE_KEY = "acs-demo-v1";

export type Speed = 1 | 2 | 4;
export type Language = (typeof LANGUAGES)[number];

export interface Settings {
  autoSpeaker: boolean;
  suggestCodes: boolean;
  detail: "Concise" | "Standard" | "Detailed";
  format: "SOAP" | "H&P" | "DAP";
  redactExports: boolean;
  autoSave: boolean;
  threshold: number;
  vocabulary: string;
  requireApproval: boolean;
  emailSummary: boolean;
}

export interface Practice {
  name: string;
  id: string;
}

export const DEFAULT_SETTINGS: Settings = {
  autoSpeaker: true,
  suggestCodes: true,
  detail: "Standard",
  format: "SOAP",
  redactExports: true,
  autoSave: true,
  threshold: 80,
  vocabulary: "Family Medicine",
  requireApproval: true,
  emailSummary: false,
};

/** What is saved in localStorage: only what the user can change. */
interface Persisted {
  notes: Note[];
  patientOverrides: Record<string, Partial<Patient>>;
  newPatients: Patient[];
  team: TeamMember[];
  templates: Template[];
  integrations: Integration[];
  settings: Settings;
  practice: Practice;
  language: Language;
  offline: boolean;
  speed: Speed;
  notificationsRead: boolean;
  /** ISO. Empty until init() sets it. */
  lastSync: string;
}

interface DemoState extends Persisted {
  ready: boolean;
  /** Built on the client from the seed, new patients and overrides. Newest visit first. */
  patients: Patient[];

  init: (now: Date) => Promise<void>;

  patientByMrn: (mrn: string) => Patient | undefined;
  noteById: (id: string) => Note | undefined;
  sortedNotes: () => Note[];
  notesForPatient: (mrn: string) => Note[];

  upsertNote: (note: Note) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  addAudit: (id: string, action: string) => void;
  /** Includes or removes a code and logs it. */
  setCodeIncluded: (id: string, index: number, on: boolean) => void;
  /** Adds a manual code (confidence 0) and logs it. */
  addCode: (id: string, code: string) => void;
  /** An In Progress note becomes Draft. Logs "Draft saved". */
  saveDraft: (id: string) => void;
  /** Completes and "syncs" a note to Epic (or saves an amendment), logs it and updates the last sync time. */
  approveNote: (id: string, encounterId: string, amend: boolean) => void;
  editSoap: (id: string, key: keyof Soap, text: string) => void;

  updatePatient: (mrn: string, patch: Partial<Patient>) => void;
  addPatient: (p: Patient) => void;
  archivePatients: (mrns: string[]) => void;
  restorePatient: (mrn: string) => void;

  invite: (member: TeamMember) => void;
  removeMember: (index: number) => void;
  addTemplate: (t: Template) => void;
  setDefaultTemplate: (id: string) => void;
  setConnected: (id: Integration["id"], on: boolean) => void;

  setLanguage: (language: Language) => void;
  toggleOffline: () => void;
  setSpeed: (speed: Speed) => void;
  setPractice: (practice: Practice) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  markNotificationsRead: () => void;
  touchSync: () => void;
  resetDemo: () => void;
}

// ---------- Storage that never throws (private windows, blocked storage) ----------

const memory = new Map<string, string>();
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return memory.get(k) ?? null;
    }
  },
  setItem: (k, v) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      memory.set(k, v);
    }
  },
  removeItem: (k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      memory.delete(k);
    }
  },
};

// ---------- Patients ----------

/** The 1,248 generated patients, built once per page load in init(). */
let basePatients: Patient[] = [];

function rebuildPatients(newPatients: Patient[], overrides: Record<string, Partial<Patient>>): Patient[] {
  return [...newPatients, ...basePatients]
    .map((p) => (overrides[p.mrn] ? { ...p, ...overrides[p.mrn] } : p))
    .sort((a, b) => +new Date(b.lastVisit) - +new Date(a.lastVisit));
}

/** Index by MRN, rebuilt only when the patients array changes. */
const patientIndex = { from: null as Patient[] | null, map: new Map<string, Patient>() };

// ---------- Notes ----------

/** Cached so these selectors return the same array until notes change (safe inside useDemo). */
const notesCache = { from: null as Note[] | null, sorted: [] as Note[], byMrn: new Map<string, Note[]>() };
function notesView(notes: Note[]) {
  if (notesCache.from !== notes) {
    notesCache.from = notes;
    notesCache.sorted = [...notes].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    notesCache.byMrn = new Map();
  }
  return notesCache;
}

const recordings = (n: Note) => n.audit.filter((a) => a.action === "Recording started").length;

/**
 * Persisted notes win, but seed notes take today's freshly computed date so the demo stays current.
 * A seed note recorded again in the demo (Emily's visit) keeps the date of that recording.
 */
function mergeSeedNotes(persisted: Note[], seed: Note[]): Note[] {
  const seedById = new Map(seed.map((n) => [n.id, n]));
  return persisted.map((n) => {
    const s = seedById.get(n.id);
    return s && recordings(n) <= recordings(s) ? { ...n, date: s.date } : n;
  });
}

const SOAP_LABEL: Record<keyof Soap, string> = { s: "Subjective", o: "Objective", a: "Assessment", p: "Plan" };

// ---------- Store ----------

/** What came back from localStorage, captured by merge() so init() can tell what is missing. */
let restored: Partial<Persisted> = {};
let initStarted = false;

export const useDemo = create<DemoState>()(
  persist(
    (set, get) => {
      const mapNote = (id: string, fn: (n: Note) => Note) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? fn(n) : n)) }));
      const setOverrides = (fn: (o: Record<string, Partial<Patient>>) => Record<string, Partial<Patient>>) =>
        set((s) => {
          const patientOverrides = fn(s.patientOverrides);
          return { patientOverrides, patients: rebuildPatients(s.newPatients, patientOverrides) };
        });
      const stamp = (action: string) => ({ t: new Date().toISOString(), action });

      return {
        ready: false,
        patients: [],
        notes: [],
        patientOverrides: {},
        newPatients: [],
        team: [],
        templates: [],
        integrations: [],
        settings: DEFAULT_SETTINGS,
        practice: { name: PRACTICES[0].name, id: PRACTICES[0].id },
        language: "English (US)",
        offline: true,
        speed: 1,
        notificationsRead: false,
        lastSync: "",

        init: async (now) => {
          if (initStarted) return;
          initStarted = true;
          // Storage is read only here, after mount, so the server and first client render match.
          await useDemo.persist.rehydrate();
          basePatients = buildPatients(now);
          const seedNotes = buildSeedNotes(now);
          const s = get();
          set({
            notes: restored.notes ? mergeSeedNotes(restored.notes, seedNotes) : seedNotes,
            team: restored.team ?? TEAM,
            templates: restored.templates ?? TEMPLATES,
            integrations: restored.integrations ?? INTEGRATIONS,
            settings: { ...DEFAULT_SETTINGS, ...restored.settings },
            lastSync: restored.lastSync || new Date(now.getTime() - 11 * 60000).toISOString(),
            patients: rebuildPatients(s.newPatients, s.patientOverrides),
            ready: true,
          });
          window.resetDemo = get().resetDemo;
        },

        patientByMrn: (mrn) => {
          const { patients } = get();
          if (patientIndex.from !== patients) {
            patientIndex.from = patients;
            patientIndex.map = new Map(patients.map((p) => [p.mrn, p]));
          }
          return patientIndex.map.get(mrn);
        },
        noteById: (id) => get().notes.find((n) => n.id === id),
        sortedNotes: () => notesView(get().notes).sorted,
        notesForPatient: (mrn) => {
          const view = notesView(get().notes);
          let list = view.byMrn.get(mrn);
          if (!list) {
            list = view.sorted.filter((n) => n.mrn === mrn);
            view.byMrn.set(mrn, list);
          }
          return list;
        },

        upsertNote: (note) =>
          set((s) => ({
            notes: s.notes.some((n) => n.id === note.id) ? s.notes.map((n) => (n.id === note.id ? note : n)) : [note, ...s.notes],
          })),
        updateNote: (id, patch) => mapNote(id, (n) => ({ ...n, ...patch })),
        addAudit: (id, action) => mapNote(id, (n) => ({ ...n, audit: [...n.audit, stamp(action)] })),
        setCodeIncluded: (id, index, on) =>
          mapNote(id, (n) => {
            const code = n.codes[index];
            if (!code || code.included === on) return n;
            return {
              ...n,
              codes: n.codes.map((c, i) => (i === index ? { ...c, included: on } : c)),
              audit: [...n.audit, stamp(`${on ? "Included" : "Removed"} code ${code.code}`)],
            };
          }),
        addCode: (id, code) =>
          mapNote(id, (n) =>
            n.codes.some((c) => c.code === code)
              ? n
              : { ...n, codes: [...n.codes, { code, confidence: 0, included: true }], audit: [...n.audit, stamp(`Added code ${code}`)] },
          ),
        saveDraft: (id) =>
          mapNote(id, (n) => ({
            ...n,
            status: n.status === "In Progress" ? "Draft" : n.status,
            audit: [...n.audit, stamp("Draft saved")],
          })),
        approveNote: (id, encounterId, amend) => {
          mapNote(id, (n) => ({
            ...n,
            status: "Completed",
            synced: true,
            encounterId,
            audit: [
              ...n.audit,
              stamp(amend ? `Amendment approved by ${DOCTOR.name}` : `Approved by ${DOCTOR.name}`),
              stamp(`Synced to Epic (${encounterId})`),
            ],
          }));
          get().touchSync();
        },
        editSoap: (id, key, text) =>
          mapNote(id, (n) => {
            const edited = n.edited ?? [];
            const first = !edited.includes(key);
            return {
              ...n,
              soap: { ...n.soap, [key]: text },
              edited: first ? [...edited, key] : edited,
              audit: first ? [...n.audit, stamp(`Edited ${SOAP_LABEL[key]}`)] : n.audit,
            };
          }),

        updatePatient: (mrn, patch) => setOverrides((o) => ({ ...o, [mrn]: { ...o[mrn], ...patch } })),
        addPatient: (p) =>
          set((s) => {
            const newPatients = [p, ...s.newPatients];
            return { newPatients, patients: rebuildPatients(newPatients, s.patientOverrides) };
          }),
        archivePatients: (mrns) =>
          setOverrides((o) => {
            const next = { ...o };
            for (const mrn of mrns) next[mrn] = { ...next[mrn], status: "Archived" };
            return next;
          }),
        restorePatient: (mrn) => setOverrides((o) => ({ ...o, [mrn]: { ...o[mrn], status: "Active" } })),

        invite: (member) => set((s) => ({ team: [...s.team, member] })),
        removeMember: (index) => set((s) => ({ team: s.team.filter((_, i) => i !== index) })),
        addTemplate: (t) => set((s) => ({ templates: [...s.templates, t] })),
        setDefaultTemplate: (id) => set((s) => ({ templates: s.templates.map((t) => ({ ...t, isDefault: t.id === id })) })),
        setConnected: (id, on) =>
          set((s) => ({ integrations: s.integrations.map((i) => (i.id === id ? { ...i, connected: on } : i)) })),

        setLanguage: (language) => set({ language }),
        toggleOffline: () => set((s) => ({ offline: !s.offline })),
        setSpeed: (speed) => set({ speed }),
        setPractice: (practice) => set({ practice }),
        updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
        markNotificationsRead: () => set({ notificationsRead: true }),
        touchSync: () => set({ lastSync: new Date().toISOString() }),
        resetDemo: () => {
          safeStorage.removeItem(STORAGE_KEY);
          window.location.replace("/dashboard");
        },
      };
    },
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (s): Persisted => ({
        notes: s.notes,
        patientOverrides: s.patientOverrides,
        newPatients: s.newPatients,
        team: s.team,
        templates: s.templates,
        integrations: s.integrations,
        settings: s.settings,
        practice: s.practice,
        language: s.language,
        offline: s.offline,
        speed: s.speed,
        notificationsRead: s.notificationsRead,
        lastSync: s.lastSync,
      }),
      merge: (persisted, current) => {
        restored = (persisted ?? {}) as Partial<Persisted>;
        return { ...current, ...restored };
      },
    },
  ),
);

declare global {
  interface Window {
    /** Demo helper: clears saved demo data and reloads. */
    resetDemo?: () => void;
  }
}
