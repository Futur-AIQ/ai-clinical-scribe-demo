"use client";

import clsx from "clsx";
import { Clock, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Avatar, Button, Modal, Pill, SearchInput, Segmented, toast } from "@/components/ui";
import { CASES } from "@/data/cases";
import type { CaseId, Patient } from "@/data/types";
import { type Speed, useDemo } from "@/store/demo-store";
import { caseTotal, useRecording } from "@/store/recording-store";

const CASE_IDS: CaseId[] = ["fever", "diabetes", "cardio"];
const CASE_MRNS = new Set(Object.values(CASES).map((c) => c.patientMrn));
const SPEEDS = [1, 2, 4].map((s) => ({ value: String(s), label: `${s}×` }));

interface Pick {
  caseId: CaseId;
  mrn: string;
}

/** "Start New Consultation": pick a scripted visit, or the general visit for another patient. */
export function CasePickerModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const speed = useDemo((s) => s.speed);
  const setSpeed = useDemo((s) => s.setSpeed);
  const patientByMrn = useDemo((s) => s.patientByMrn);
  const start = useRecording((s) => s.start);
  const [pick, setPick] = useState<Pick>({ caseId: "fever", mrn: CASES.fever.patientMrn });

  const onSpeed = (v: string) => {
    setSpeed(Number(v) as Speed);
    toast(`Playback speed ${v}×`, "info");
  };

  const onStart = () => {
    start(pick.caseId, pick.mrn);
    onClose();
    router.push("/consultation");
  };

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title="Start New Consultation"
      subtitle="Pick a sample visit. The conversation plays back as a live recording."
      footer={
        <>
          <Segmented items={SPEEDS} value={String(speed)} onChange={onSpeed} aria-label="Playback speed" />
          <span className="text-[12.5px] text-muted">Playback speed</span>
          <div className="flex-1" />
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Mic} onClick={onStart}>
            Start Recording
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
        {CASE_IDS.map((id) => {
          const p = patientByMrn(CASES[id].patientMrn);
          return p ? (
            <CaseCard
              key={id}
              id={id}
              patient={p}
              speed={speed}
              on={pick.caseId === id && pick.mrn === p.mrn}
              onSelect={() => setPick({ caseId: id, mrn: p.mrn })}
            />
          ) : null;
        })}
      </div>
      <OtherPatients selected={pick.mrn} onSelect={(mrn) => setPick({ caseId: "fever", mrn })} />
    </Modal>
  );
}

interface CaseCardProps {
  id: CaseId;
  patient: Patient;
  speed: Speed;
  on: boolean;
  onSelect: () => void;
}

function CaseCard({ id, patient, speed, on, onSelect }: CaseCardProps) {
  const c = CASES[id];
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onSelect}
      className={clsx(
        "flex flex-col items-start gap-1.5 rounded-[13px] border-[1.5px] p-3.5 text-left transition-colors duration-150",
        on ? "border-blue bg-[#f7f9ff] shadow-[0_0_0_3px_rgba(26,92,244,.1)]" : "border-line hover:border-[#c4d3fb]",
      )}
    >
      <Pill tone={c.tone}>{c.specialty}</Pill>
      <span className="mt-1.5 flex items-center gap-2.5">
        <Avatar name={patient.name} size={36} />
        <span>
          <b className="mt-1 block text-[13.5px] font-semibold">{patient.name}</b>
          <small className="text-[12px] text-muted">
            {patient.age} / {patient.sex}
          </small>
        </span>
      </span>
      <span className="text-[12.5px] leading-[1.5] text-ink-2">{c.reason}</span>
      <span className="mt-auto flex items-center gap-[5px] pt-1 text-[11.5px] text-muted">
        <Clock size={13} strokeWidth={1.8} aria-hidden />
        About {Math.round(caseTotal(id) / speed)} seconds at {speed}×
      </span>
    </button>
  );
}

function OtherPatients({ selected, onSelect }: { selected: string; onSelect: (mrn: string) => void }) {
  const patients = useDemo((s) => s.patients);
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.toLowerCase().trim();
    return patients
      .filter((p) => p.status !== "Archived" && !CASE_MRNS.has(p.mrn) && (!q || p.name.toLowerCase().includes(q) || p.mrn.includes(q)))
      .slice(0, q ? 8 : 4);
  }, [patients, query]);

  return (
    <div className="mt-[18px]">
      <label htmlFor="pick-search" className="text-[12.5px] font-medium text-ink-2">
        Or run the general visit with another patient
      </label>
      <SearchInput
        id="pick-search"
        className="mt-1.5"
        placeholder="Search by name or MRN"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-2 flex max-h-[200px] flex-col gap-0.5 overflow-auto">
        {list.length === 0 ? (
          <span className="p-2 text-[12.5px] text-faint">No patients found.</span>
        ) : (
          list.map((p) => (
            <button
              key={p.mrn}
              type="button"
              aria-pressed={selected === p.mrn}
              onClick={() => onSelect(p.mrn)}
              className={clsx(
                "flex items-center gap-2.5 rounded-[9px] p-2 text-left hover:bg-blue-50",
                selected === p.mrn && "bg-blue-50",
              )}
            >
              <Avatar name={p.name} size={30} />
              <span className="min-w-0">
                <b className="block text-[13px] font-medium">{p.name}</b>
                <small className="block text-[12px] text-muted">
                  {p.age} / {p.sex} · MRN-{p.mrn} · General visit script
                </small>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
