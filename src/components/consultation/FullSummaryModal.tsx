"use client";

import { Fragment, type ReactNode } from "react";
import { Button, Modal } from "@/components/ui";
import { codeDesc } from "@/data";
import type { ConsultSource } from "@/lib/consult";
import { useDemo } from "@/store/demo-store";

interface FullSummaryModalProps {
  open: boolean;
  onClose: () => void;
  source: ConsultSource;
}

const list = (items: ReactNode[]) =>
  items.length
    ? items.map((v, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {v}
        </Fragment>
      ))
    : null;

/** Every captured section of the AI summary, opened from "View Full Summary". */
export function FullSummaryModal({ open, onClose, source }: FullSummaryModalProps) {
  const patient = useDemo((s) => s.patientByMrn(source.mrn));
  const s = source.summary;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="AI Summary"
      subtitle={patient && `${patient.name} · ${patient.age} / ${patient.sex} · MRN-${patient.mrn}`}
      footer={
        <>
          <span className="text-[12.5px] text-faint">{source.live ? "Updates as the visit continues" : "From the last session"}</span>
          <div className="flex-1" />
          <Button onClick={onClose}>Close</Button>
        </>
      }
    >
      <Section title="Key Symptoms">{s.sym.join(", ")}</Section>
      <Section title="Probable Diagnosis">{s.dx.replace("\n", " ")}</Section>
      <Section title="Medications">{list(s.med)}</Section>
      <Section title="Treatment Plan">{s.plan.join(" ")}</Section>
      <Section title="Allergies">{s.all}</Section>
      <Section title="Vitals and Findings">{list(s.vit)}</Section>
      <Section title="Billing Codes">
        {list(
          source.codes.map((c) => (
            <>
              <span className="mr-1.5 inline-block rounded-[7px] bg-blue-50 px-2 py-0.5 text-[12.5px] font-semibold text-blue tabular-nums">
                {c}
              </span>
              {codeDesc(c)}
            </>
          )),
        )}
      </Section>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-line-2 py-4 last:border-b-0">
      <b className="mb-2 block text-[13.5px] font-semibold">{title}</b>
      <div className="text-[13.5px] leading-[1.65] text-ink-2">
        {children || <span className="text-faint italic">Not captured yet</span>}
      </div>
    </div>
  );
}
