"use client";

import type { FormEvent } from "react";
import { Avatar, Button, Card, Field, Input, Select, toast } from "@/components/ui";
import { DOCTOR } from "@/data/misc";

const SPECIALTIES = ["Family Medicine", "Internal Medicine", "Pediatrics", "Cardiology"];

/** The doctor's details. As in the prototype, saving only confirms: the demo doctor stays Dr. Sarah Johnson. */
export function ProfileTab() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("Changes saved");
  };

  return (
    <Card className="px-5 py-[18px]">
      <div className="mb-[22px] flex items-center gap-4">
        <Avatar name={DOCTOR.name} size={64} variant="doctor" />
        <div>
          <b className="text-[16px] font-semibold">{DOCTOR.name}</b>
          <p className="text-[12.5px] text-muted">{DOCTOR.specialty} · Owner</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-4 gap-y-3.5 max-sm:grid-cols-1">
        <Field label="Full name" htmlFor="pf-name">
          <Input id="pf-name" defaultValue={DOCTOR.name} autoComplete="off" />
        </Field>
        <Field label="Specialty" htmlFor="pf-specialty">
          <Select id="pf-specialty" defaultValue={DOCTOR.specialty}>
            {SPECIALTIES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Email" htmlFor="pf-email">
          <Input id="pf-email" type="email" defaultValue={DOCTOR.email} autoComplete="off" />
        </Field>
        <Field label="Phone" htmlFor="pf-phone">
          <Input id="pf-phone" type="tel" defaultValue={DOCTOR.phone} autoComplete="off" />
        </Field>
        <Field label="NPI number" htmlFor="pf-npi">
          <Input id="pf-npi" defaultValue={DOCTOR.npi} inputMode="numeric" autoComplete="off" />
        </Field>
        <Field label="Signature line" htmlFor="pf-signature">
          <Input id="pf-signature" defaultValue={DOCTOR.shortName} autoComplete="off" />
        </Field>
        <div className="col-span-full flex justify-end">
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
