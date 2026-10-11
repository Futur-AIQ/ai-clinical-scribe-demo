"use client";

import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { Button, Field, Input, Modal, Select, toast } from "@/components/ui";
import type { Patient, Sex } from "@/data/types";
import { useDemo } from "@/store/demo-store";

interface NewPatientModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the new patient after it is saved. */
  onCreated: (p: Patient) => void;
}

const FORM_ID = "new-patient-form";

/** A random 8-digit MRN starting with 2 that no patient has yet. */
function newMrn(taken: (mrn: string) => boolean): string {
  let mrn: string;
  do mrn = String(20000000 + Math.floor(Math.random() * 10000000));
  while (taken(mrn));
  return mrn;
}

export function NewPatientModal({ open, onClose, onCreated }: NewPatientModalProps) {
  const addPatient = useDemo((s) => s.addPatient);
  const patientByMrn = useDemo((s) => s.patientByMrn);

  // Native validation runs before this fires.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const mrn = newMrn((m) => !!patientByMrn(m));
    const p: Patient = {
      name: `${text("first")} ${text("last")}`,
      age: Number(text("age")),
      sex: text("sex") as Sex,
      mrn,
      phone: text("phone") || "(555) 000-0000",
      visits: 0,
      status: "Active",
      lastVisit: new Date().toISOString(),
      lastDuration: "00:00",
      conditions: [],
      allergies: "No known drug allergies",
      insurance: text("insurance") || "Self-pay",
      isNew: true,
    };
    addPatient(p);
    onClose();
    onCreated(p);
    toast(`${p.name} added · MRN-${mrn}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Patient"
      subtitle="Creates the record here and in the connected EMR"
      footer={
        <>
          <Button className="ml-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" icon={Plus}>
            Create Patient
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="grid grid-cols-2 gap-x-4 gap-y-3.5 max-sm:grid-cols-1">
        <Field label="First name" htmlFor="np-first">
          <Input id="np-first" name="first" required autoComplete="off" />
        </Field>
        <Field label="Last name" htmlFor="np-last">
          <Input id="np-last" name="last" required autoComplete="off" />
        </Field>
        <Field label="Age" htmlFor="np-age">
          <Input id="np-age" name="age" type="number" min={0} max={120} required />
        </Field>
        <Field label="Sex" htmlFor="np-sex">
          <Select id="np-sex" name="sex" defaultValue="Female">
            <option>Female</option>
            <option>Male</option>
          </Select>
        </Field>
        <Field label="Phone" htmlFor="np-phone">
          <Input id="np-phone" name="phone" type="tel" placeholder="(555) 000-0000" autoComplete="off" />
        </Field>
        <Field label="Insurance" htmlFor="np-insurance">
          <Input id="np-insurance" name="insurance" placeholder="Aetna PPO" autoComplete="off" />
        </Field>
      </form>
    </Modal>
  );
}
